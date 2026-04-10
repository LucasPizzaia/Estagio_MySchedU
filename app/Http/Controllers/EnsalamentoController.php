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
            'flash' => session('flash')
        ]);
    }

    public function create()
    {
        return Inertia::render('Ensalamento/Create');
    }

    public function storeGrade(Request $request)
    {
        $request->validate([
            'nome' => 'required|string|max:255',
            'periodo' => 'nullable|string|max:50',
        ]);

        $grade = Grade::create([
            'nome' => $request->nome,
            'periodo' => $request->periodo,
            'status' => true,
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
                'ensalamentos.unidadeCurricular'
            ]),
            'professores' => Professor::with(['unidadesCurriculares', 'disponibilidades'])->get(),
            'salas' => Sala::all(),
            'turmas' => Turma::all(),
            'ucs' => UnidadeCurricular::all(),
        ]);
    }

    public function storeHorario(Request $request)
    {
        $request->validate([
            'grade_id' => 'required|exists:grades,id',
            'professor_id' => 'required|exists:professors,id',
            'turma_id' => 'required|exists:turmas,id',
            'unidade_curricular_id' => 'required|exists:unidades_curriculares,id',
            'dia_semana' => 'required|string',
            'horario_slot' => 'required|string',
            'is_digital' => 'boolean',
            'sala_id' => $request->is_digital ? 'nullable' : 'required|exists:salas,id',
        ]);

        $professor = Professor::findOrFail($request->professor_id);
        $uc = UnidadeCurricular::findOrFail($request->unidade_curricular_id);

        // --- 1. VALIDAÇÃO DE COMPETÊNCIA ---
        $podeLecionar = $professor->unidadesCurriculares()
            ->where('unidade_curricular_id', $request->unidade_curricular_id)
            ->exists();

        if (!$podeLecionar) {
            return back()->withErrors(['professor_id' => "O PROFESSOR {$professor->nome} NÃO ESTÁ HABILITADO PARA A UC {$uc->nome}."]);
        }

        // --- 2. VALIDAÇÕES PARA AULAS PRESENCIAIS (Conflitos e Disponibilidade) ---
        if (!$request->is_digital) {
            
            // DISPONIBILIDADE DO PROFESSOR (Banco usa weekday e slot)
            $disponivel = $professor->disponibilidades()
                ->where('weekday', $request->dia_semana)
                ->where('slot', $request->horario_slot)
                ->exists();

            if (!$disponivel) {
                return back()->withErrors(['professor_id' => "O PROFESSOR NÃO TEM DISPONIBILIDADE CADASTRADA PARA ESTE HORÁRIO."]);
            }

            // PROFESSOR JÁ ESTÁ EM OUTRA TURMA NO MESMO HORÁRIO?
            $conflitoProf = Ensalamento::where('grade_id', $request->grade_id)
                ->where('dia_semana', $request->dia_semana)
                ->where('horario_slot', $request->horario_slot)
                ->where('professor_id', $request->professor_id)
                ->where('turma_id', '!=', $request->turma_id)
                ->exists();

            if ($conflitoProf) {
                return back()->withErrors(['professor_id' => "ESTE PROFESSOR JÁ ESTÁ ALOCADO EM OUTRA TURMA NESTE MESMO HORÁRIO."]);
            }

            // MATÉRIA JÁ ESTÁ SENDO DADA EM OUTRA TURMA NO MESMO HORÁRIO?
            $conflitoUC = Ensalamento::where('grade_id', $request->grade_id)
                ->where('dia_semana', $request->dia_semana)
                ->where('horario_slot', $request->horario_slot)
                ->where('unidade_curricular_id', $request->unidade_curricular_id)
                ->where('turma_id', '!=', $request->turma_id)
                ->exists();

            if ($conflitoUC) {
                return back()->withErrors(['unidade_curricular_id' => "ESTA UC JÁ ESTÁ SENDO MINISTRADA EM OUTRA TURMA NESTE HORÁRIO."]);
            }

            // SALA JÁ ESTÁ OCUPADA?
            $conflitoSala = Ensalamento::where('grade_id', $request->grade_id)
                ->where('dia_semana', $request->dia_semana)
                ->where('horario_slot', $request->horario_slot)
                ->where('sala_id', $request->sala_id)
                ->where('turma_id', '!=', $request->turma_id)
                ->exists();

            if ($conflitoSala) {
                return back()->withErrors(['sala_id' => "ESTA SALA JÁ ESTÁ OCUPADA POR OUTRA TURMA NESTE HORÁRIO."]);
            }
        }

        // --- 3. SALVAMENTO ---
        $data = $request->all();
        if ($request->is_digital) { $data['sala_id'] = null; }

        Ensalamento::updateOrCreate(
            [
                'grade_id' => $request->grade_id,
                'turma_id' => $request->turma_id,
                'dia_semana' => $request->dia_semana,
                'horario_slot' => $request->horario_slot,
            ],
            $data
        );

        return back()->with('flash', 'ALOCAÇÃO REALIZADA COM SUCESSO!');
    }

    public function exportarPDF(Grade $grade)
    {
        $grade->load([
            'ensalamentos.professor', 
            'ensalamentos.sala', 
            'ensalamentos.turma', 
            'ensalamentos.unidadeCurricular'
        ]);

        $turmasIds = $grade->ensalamentos->pluck('turma_id')->unique();
        $turmas = Turma::whereIn('id', $turmasIds)->get();

        $dias = [
            'mon' => 'Segunda', 'tue' => 'Terça', 'wed' => 'Quarta', 
            'thu' => 'Quinta', 'fri' => 'Sexta', 'sat' => 'Sábado'
        ];
        
        $slots = [
            's1' => '19:00 - 20:30', 
            's2' => '20:45 - 22:10'
        ];

        $pdf = Pdf::loadView('pdf.grade', compact('grade', 'dias', 'slots', 'turmas'))
                  ->setPaper('a4', 'landscape'); 

        return $pdf->stream("Grade_{$grade->nome}.pdf");
    }

    public function destroy(Grade $grade)
    {
        $grade->delete();
        return redirect()->route('ensalamento.index')->with('flash', 'Grade excluída com sucesso!');
    }

    public function destroyHorario($id)
    {
        Ensalamento::findOrFail($id)->delete();
        return back()->with('flash', 'Alocação removida!');
    }
}