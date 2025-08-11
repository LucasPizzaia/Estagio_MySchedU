<?php

namespace App\Http\Controllers;

use App\Models\Turma;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TurmaController extends Controller
{
    public function index()
    {
        $turmas = Turma::orderBy('sala')->get();
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
        $data = $request->validate([
            'sala'    => 'required|string|max:100',
            'lugares' => 'required|integer|min:1|max:65535',
            'campus'  => 'required|in:IPOLON,SEDE',
        ]);

        Turma::create($data);
        return redirect()->route('turmas.index')->with('success', 'Turma criada com sucesso.');
    }

    public function edit(Turma $turma)
    {
        return Inertia::render('Turmas/Edit', ['turma' => $turma]);
    }

    public function update(Request $request, Turma $turma)
    {
        $data = $request->validate([
            'sala'    => 'required|string|max:100',
            'lugares' => 'required|integer|min:1|max:65535',
            'campus'  => 'required|in:IPOLON,SEDE',
        ]);

        $turma->update($data);
        return redirect()->route('turmas.index')->with('success', 'Turma atualizada com sucesso.');
    }

    public function destroy(Turma $turma)
    {
        $turma->delete();
        return redirect()->route('turmas.index')->with('success', 'Turma excluída.');
    }
}
