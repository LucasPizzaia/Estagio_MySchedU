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
            'professores' => Professor::all(),
            'salas' => Sala::all(),
            'turmas' => Turma::all(),
            'ucs' => UnidadeCurricular::all(),
        ]);
    }

    /**
     * ESTE É O MÉTODO QUE SALVA O HORÁRIO CLICADO NA GRADE
     */
    public function storeHorario(Request $request)
    {
        // 1. Validação básica de presença dos campos
        $request->validate([
            'grade_id' => 'required|exists:grades,id',
            'professor_id' => 'required|exists:professors,id',
            'sala_id' => 'required|exists:salas,id',
            'turma_id' => 'required|exists:turmas,id',
            'unidade_curricular_id' => 'required|exists:unidades_curriculares,id',
            'dia_semana' => 'required|string',
            'horario_slot' => 'required|string',
        ]);

        // 2. Validação de Conflitos (Regras de Negócio)

        // Verificação: Professor já está em outra aula nesse horário?
        $conflitoProf = Ensalamento::where('grade_id', $request->grade_id)
            ->where('dia_semana', $request->dia_semana)
            ->where('horario_slot', $request->horario_slot)
            ->where('professor_id', $request->professor_id)
            ->exists();

        if ($conflitoProf) {
            return back()->withErrors(['professor_id' => 'O professor já possui aula neste horário.']);
        }

        // Verificação: Sala já está ocupada?
        $conflitoSala = Ensalamento::where('grade_id', $request->grade_id)
            ->where('dia_semana', $request->dia_semana)
            ->where('horario_slot', $request->horario_slot)
            ->where('sala_id', $request->sala_id)
            ->exists();

        if ($conflitoSala) {
            return back()->withErrors(['sala_id' => 'Esta sala já está ocupada neste horário.']);
        }

        // Verificação: Turma já possui outra aula nesse horário?
        $conflitoTurma = Ensalamento::where('grade_id', $request->grade_id)
            ->where('dia_semana', $request->dia_semana)
            ->where('horario_slot', $request->horario_slot)
            ->where('turma_id', $request->turma_id)
            ->exists();

        if ($conflitoTurma) {
            return back()->withErrors(['turma_id' => 'Esta turma já possui aula neste horário.']);
        }

        // 3. Persistência no Banco
        Ensalamento::create($request->all());

        return back()->with('flash', 'Horário alocado com sucesso!');
    }

    public function destroy(Grade $grade)
    {
        $grade->delete();
        return redirect()->route('ensalamento.index')->with('flash', 'Grade excluída com sucesso!');
    }
}