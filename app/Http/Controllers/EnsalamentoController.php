<?php

namespace App\Http\Controllers;

use App\Models\Grade;
use App\Models\Ensalamento;
use App\Models\Professor;
use App\Models\Sala;
use App\Models\Turma;
use App\Models\UnidadeCurricular;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Barryvdh\DomPDF\Facade\Pdf;

class EnsalamentoController extends Controller
{
    public function index()
    {
        return Inertia::render('Ensalamento/Index', [
            'grades' => Grade::withCount('ensalamentos')->get(),
            'flash'  => session('flash'),
        ]);
    }

    public function create()
    {
        return Inertia::render('Ensalamento/Create');
    }

    public function storeGrade(Request $request)
    {
        $request->validate([
            'nome'    => 'required|string|max:255',
            'periodo' => 'nullable|string|max:50',
        ]);

        $grade = Grade::create([
            'nome'    => $request->nome,
            'periodo' => $request->periodo,
            'status'  => true,
        ]);

        return redirect()->route('ensalamento.edit', $grade->id)
            ->with('flash', 'Grade criada com sucesso!');
    }

    public function edit(Grade $grade)
    {
        return Inertia::render('Ensalamento/Edit', [
            'grade' => $grade->load([
                'ensalamentos.professor',
                'ensalamentos.sala',
                'ensalamentos.turma',
                'ensalamentos.unidadeCurricular',
            ]),
            'professores' => Professor::with(['unidadesCurriculares'])->get(),
            'salas'       => Sala::all(),
            'turmas'      => Turma::all(),
            'ucs'         => UnidadeCurricular::all(),
            'flash'       => session('flash'),
            'avisos'      => session('avisos', []),
        ]);
    }

    public function storeHorario(Request $request)
    {
        // Validação "dura" — só bloqueia o que é tecnicamente obrigatório.
        $request->validate([
            'grade_id'              => 'required|exists:grades,id',
            'professor_id'          => 'required|exists:professors,id',
            'turma_id'              => 'required|exists:turmas,id',
            'unidade_curricular_id' => 'required|exists:unidades_curriculares,id',
            'dia_semana'            => 'required|string',
            'horario_slot'          => 'required|string',
            'is_digital'            => 'boolean',
            'sala_id'               => $request->is_digital ? 'nullable' : 'required|exists:salas,id',
        ]);

        $professor = Professor::findOrFail($request->professor_id);
        $uc        = UnidadeCurricular::findOrFail($request->unidade_curricular_id);
        $turma     = Turma::findOrFail($request->turma_id);
        $isDigital = (bool) $request->is_digital;

        $avisos = [];

        // ---------- 1. COMPETÊNCIA ----------
        $podeLecionar = $professor->unidadesCurriculares()
            ->where('unidade_curricular_id', $uc->id)
            ->exists();

        if (!$podeLecionar) {
            $avisos[] = "O PROFESSOR NÃO ESTÁ HABILITADO PARA ESTA UNIDADE CURRICULAR.";
        }

        // ---------- 2. DISPONIBILIDADE DO PROFESSOR ----------
        $availability = $professor->availability ?? [];
        if (!is_array($availability)) {
            $availability = json_decode($availability, true) ?: [];
        }

        $diaReq  = strtolower(trim($request->dia_semana));
        $slotReq = strtolower(trim($request->horario_slot));
        $ignorarDisponibilidade = ($diaReq === 'digital' || $slotReq === 'digital');

        if (!$ignorarDisponibilidade) {
            $disponivel = collect($availability)->contains(fn ($item) =>
                strtolower(trim($item['weekday'] ?? '')) === $diaReq &&
                strtolower(trim($item['slot']    ?? '')) === $slotReq
            );

            if (!$disponivel) {
                $avisos[] = "O PROFESSOR NÃO TEM DISPONIBILIDADE CADASTRADA PARA ESTE HORÁRIO.";
            }
        }

             // ---------- 3. COERÊNCIA UC ↔ MODALIDADE (BLOQUEIA) ----------
             // Esta é a única regra que impede o salvamento. As demais são avisos.
             if ($uc->tipo === 'digital' && !$isDigital) {
             return back()->withErrors(['unidade_curricular_id' =>
             "ESTA UC É DIGITAL — DEVE SER ALOCADA APENAS EM 'ATIVIDADES DIGITAIS'."
            ]);
        }
            if ($uc->tipo !== 'digital' && $isDigital) {
            return back()->withErrors(['unidade_curricular_id' =>
            "ESTA UC NÃO É DIGITAL — DEVE SER ALOCADA NA GRADE PRESENCIAL, NÃO EM ATIVIDADE DIGITAL."
             ]);
        }

        // ---------- 4. CONFLITO: PROFESSOR NO MESMO HORÁRIO ----------
        if (!$ignorarDisponibilidade) {
            $conflitoProf = Ensalamento::where('grade_id', $request->grade_id)
                ->where('dia_semana', $request->dia_semana)
                ->where('horario_slot', $request->horario_slot)
                ->where('professor_id', $professor->id)
                ->where('turma_id', '!=', $turma->id)
                ->exists();

            if ($conflitoProf) {
                $avisos[] = "ESTE PROFESSOR JÁ ESTÁ ALOCADO EM OUTRA TURMA NESTE HORÁRIO.";
            }
        }

        // ---------- 5. TURMA JÁ OCUPADA NESSE SLOT COM OUTRA UC ----------
        if (!$ignorarDisponibilidade) {
            $conflitoTurma = Ensalamento::where('grade_id', $request->grade_id)
                ->where('dia_semana', $request->dia_semana)
                ->where('horario_slot', $request->horario_slot)
                ->where('turma_id', $turma->id)
                ->where('unidade_curricular_id', '!=', $uc->id)
                ->exists();

            if ($conflitoTurma) {
                $avisos[] = "ESTA TURMA JÁ POSSUI OUTRA UC NESTE HORÁRIO (SERÁ SOBRESCRITA).";
            }
        }

        // ---------- 6. UC DUPLICADA NA MESMA TURMA/GRADE ----------
        $ucDuplicada = Ensalamento::where('grade_id', $request->grade_id)
            ->where('turma_id', $turma->id)
            ->where('unidade_curricular_id', $uc->id)
            ->where(function ($q) use ($request) {
                $q->where('dia_semana', '!=', $request->dia_semana)
                  ->orWhere('horario_slot', '!=', $request->horario_slot);
            })
            ->exists();

        if ($ucDuplicada) {
            $avisos[] = "ESTA UC JÁ ESTÁ ALOCADA PARA ESTA TURMA EM OUTRO HORÁRIO DESTA GRADE.";
        }

        // ---------- 7. CONFLITO DE SALA / CAPACIDADE ----------
        if (!$isDigital) {
            $sala = Sala::findOrFail($request->sala_id);

            $conflitoSala = Ensalamento::where('grade_id', $request->grade_id)
                ->where('dia_semana', $request->dia_semana)
                ->where('horario_slot', $request->horario_slot)
                ->where('sala_id', $sala->id)
                ->where('turma_id', '!=', $turma->id)
                ->exists();

            if ($conflitoSala) {
                $avisos[] = "ESTA SALA JÁ ESTÁ OCUPADA POR OUTRA TURMA NESTE HORÁRIO.";
            }

            if ((int) $turma->quantidade_alunos > (int) $sala->quantidade_lugares) {
                $avisos[] = "A SALA {$sala->nome} TEM {$sala->quantidade_lugares} LUGARES E A TURMA POSSUI {$turma->quantidade_alunos} ALUNOS.";
            }
        }

        // ---------- 8. SALVAMENTO (acontece sempre) ----------
        $data = $request->all();
        if ($isDigital) {
            $data['sala_id'] = null;
        }

        Ensalamento::updateOrCreate(
            [
                'grade_id'     => $request->grade_id,
                'turma_id'     => $request->turma_id,
                'dia_semana'   => $request->dia_semana,
                'horario_slot' => $request->horario_slot,
            ],
            $data
        );

        return back()->with([
            'flash'  => empty($avisos)
                ? 'ALOCAÇÃO REALIZADA COM SUCESSO!'
                : 'ALOCAÇÃO SALVA — VERIFIQUE OS AVISOS.',
            'avisos' => $avisos,
        ]);
    }

    public function exportarPDF(Grade $grade)
    {
        $grade->load([
            'ensalamentos.professor',
            'ensalamentos.sala',
            'ensalamentos.turma',
            'ensalamentos.unidadeCurricular',
        ]);

        $turmasIds = $grade->ensalamentos->pluck('turma_id')->unique();
        $turmas = Turma::whereIn('id', $turmasIds)->get();

        $dias = [
            'mon' => 'Segunda', 'tue' => 'Terça', 'wed' => 'Quarta',
            'thu' => 'Quinta',  'fri' => 'Sexta', 'sat' => 'Sábado',
        ];
        $slots = [
            's1' => '19:00 - 20:30',
            's2' => '20:45 - 22:10',
        ];

        $pdf = Pdf::loadView('pdf.grade', compact('grade', 'dias', 'slots', 'turmas'))
            ->setPaper('a4', 'landscape');

        return $pdf->stream("Grade_{$grade->nome}.pdf");
    }

    public function destroy(Grade $grade)
    {
        $grade->delete();

        return redirect()->route('ensalamento.index')
            ->with('flash', 'Grade excluída com sucesso!');
    }

    public function destroyHorario($id)
    {
        Ensalamento::findOrFail($id)->delete();

        return back()->with('flash', 'Alocação removida!');
    }
}