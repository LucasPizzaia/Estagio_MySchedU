<?php

namespace App\Http\Controllers;

use App\Models\Sala;
use App\Models\Ensalamento;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SalaController extends Controller
{
    public function index()
    {
        return Inertia::render('Salas/Index', [
            'salas' => Sala::all(),
            'flash' => [
                'success' => session('success'),
                'error'   => session('error'),
            ],
        ]);
    }

    public function create()
    {
        return Inertia::render('Salas/Create');
    }

    public function store(Request $request)
    {
        $request->validate([
            'nome' => 'required|string|max:255',
            'local' => 'required|in:Clube,Ipolon',
            'quantidade_lugares' => 'required|integer|min:1',
        ]);

        Sala::create($request->all());

        return redirect()->route('salas.index')
            ->with('success', 'Sala cadastrada com sucesso!');
    }

    public function edit(Sala $sala)
    {
        return Inertia::render('Salas/Edit', [
            'sala' => $sala,
        ]);
    }

    public function update(Request $request, Sala $sala)
    {
        $request->validate([
            'nome' => 'required|string|max:255',
            'local' => 'required|in:Clube,Ipolon',
            'quantidade_lugares' => 'required|integer|min:1',
        ]);

        $sala->update($request->all());

        return redirect()->route('salas.index')
            ->with('success', 'Sala atualizada com sucesso!');
    }

    public function destroy(Sala $sala)
    {
        // Caminho 1: bloqueia a exclusão se a sala estiver em uso em algum ensalamento
        $emUso = Ensalamento::where('sala_id', $sala->id)->count();

        if ($emUso > 0) {
            return back()->with(
                'error',
                "Não é possível excluir a sala \"{$sala->nome}\": ela está alocada em {$emUso} ensalamento(s). Remova as alocações antes de excluir."
            );
        }

        $sala->delete();

        return redirect()->route('salas.index')
            ->with('success', 'Sala excluída com sucesso!');
    }
}