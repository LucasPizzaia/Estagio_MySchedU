<?php

namespace App\Http\Controllers;

use App\Models\Professor;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProfessorController extends Controller
{
    public function index()
    {
        // Se quiser paginação: Professor::orderBy('matricula')->paginate(10)
        $professores = Professor::orderBy('matricula')->get();

        return Inertia::render('Professores/Index', [
            'professores' => $professores,
            'flash' => session('success')
        ]);
    }

    public function create()
    {
        return Inertia::render('Professores/Create');
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'matricula' => 'required|string|max:50|unique:professors,matricula',
            'nome'      => 'required|string|max:255',
            'sobrenome' => 'required|string|max:255',
            'email'     => 'required|email|max:255|unique:professors,email',
        ]);

        Professor::create($data);

        return redirect()->route('professores.index')->with('success', 'Professor criado com sucesso.');
    }

    public function edit(Professor $professor)
    {
        return Inertia::render('Professores/Edit', [
            'professor' => $professor
        ]);
    }

    public function update(Request $request, Professor $professor)
    {
        $data = $request->validate([
            'matricula' => 'required|string|max:50|unique:professors,matricula,' . $professor->id,
            'nome'      => 'required|string|max:255',
            'sobrenome' => 'required|string|max:255',
            'email'     => 'required|email|max:255|unique:professors,email,' . $professor->id,
        ]);

        $professor->update($data);

        return redirect()->route('professores.index')->with('success', 'Professor atualizado com sucesso.');
    }

    public function destroy(Professor $professor)
    {
        $professor->delete();
        return redirect()->route('professores.index')->with('success', 'Professor excluído com sucesso.');
    }
}