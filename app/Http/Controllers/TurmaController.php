<?php

namespace App\Http\Controllers;

use App\Models\Turma;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TurmaController extends Controller
{
    public function index()
    {
        // Alterado para ordenar pela 'nome' da turma, mas pode continuar com 'data_entrada' ou outro critério
        $turmas = Turma::orderBy('nome')->get();  
        return Inertia::render('Turmas/Index', [
            'turmas' => $turmas,
            'flash'  => session('success'),
        ]);
    }

    public function create()
    {
        return Inertia::render('Turmas/Create');
    }

    public function store(Request $request)
    {
        // Validação dos campos novos
        $data = $request->validate([
            'nome'           => 'required|string|max:255',
            'data_entrada'   => 'required|date',
            'quantidade_alunos' => 'required|integer|min:0',
        ]);

        // Criação da turma com os novos campos
        Turma::create($data);

        return redirect()->route('turmas.index')->with('success', 'Turma criada com sucesso.');
    }

    public function edit(Turma $turma)
    {
        return Inertia::render('Turmas/Edit', ['turma' => $turma]);
    }

    public function update(Request $request, Turma $turma)
    {
        // Validação dos campos novos
        $data = $request->validate([
            'nome'           => 'required|string|max:255',
            'data_entrada'   => 'required|date',
            'quantidade_alunos' => 'required|integer|min:0',
        ]);

        // Atualização dos dados da turma
        $turma->update($data);

        return redirect()->route('turmas.index')->with('success', 'Turma atualizada com sucesso.');
    }

    public function destroy(Turma $turma)
    {
        // Exclusão da turma
        $turma->delete();

        return redirect()->route('turmas.index')->with('success', 'Turma excluída.');
    }
}
