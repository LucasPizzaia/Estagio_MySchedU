<?php

namespace App\Http\Controllers;

use App\Models\Turma;
use App\Models\Ensalamento;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TurmaController extends Controller
{
    public function index()
    {
        $turmas = Turma::orderBy('nome')->get();

        return Inertia::render('Turmas/Index', [
            'turmas' => $turmas,
            'flash'  => [
                'success' => session('success'),
                'error'   => session('error'),
            ],
        ]);
    }

    public function create()
    {
        return Inertia::render('Turmas/Create');
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'nome'              => 'required|string|max:255',
            'data_entrada'      => 'required|date',
            'quantidade_alunos' => 'required|integer|min:0',
        ]);

        Turma::create($data);

        return redirect()->route('turmas.index')
            ->with('success', 'Turma criada com sucesso.');
    }

    public function edit(Turma $turma)
    {
        return Inertia::render('Turmas/Edit', ['turma' => $turma]);
    }

    public function update(Request $request, Turma $turma)
    {
        $data = $request->validate([
            'nome'              => 'required|string|max:255',
            'data_entrada'      => 'required|date',
            'quantidade_alunos' => 'required|integer|min:0',
        ]);

        $turma->update($data);

        return redirect()->route('turmas.index')
            ->with('success', 'Turma atualizada com sucesso.');
    }

    public function destroy(Turma $turma)
    {
        // Caminho 1: bloqueia a exclusão se a turma estiver em uso em algum ensalamento
        $emUso = Ensalamento::where('turma_id', $turma->id)->count();

        if ($emUso > 0) {
            return back()->with(
                'error',
                "Não é possível excluir a turma \"{$turma->nome}\": ela está alocada em {$emUso} ensalamento(s). Remova as alocações antes de excluir."
            );
        }

        $turma->delete();

        return redirect()->route('turmas.index')
            ->with('success', 'Turma excluída com sucesso!');
    }
}