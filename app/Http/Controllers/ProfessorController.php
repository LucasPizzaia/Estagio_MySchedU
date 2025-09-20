<?php

namespace App\Http\Controllers;

use App\Models\Professor;
use App\Models\UnidadeCurricular;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;
use Inertia\Inertia;

class ProfessorController extends Controller
{
    public function index()
    {
        $professores = Professor::orderBy('matricula')->get();

        return Inertia::render('Professores/Index', [
            'professores' => $professores,
            'flash' => session('success')
        ]);
    }

    public function create()
    {
        return Inertia::render('Professores/Create', [
            'ucs' => UnidadeCurricular::select('id', 'codigo', 'nome')->orderBy('codigo')->get(),
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'matricula' => 'required|string|max:50|unique:professors,matricula',
            'nome' => 'required|string|max:255',
            'sobrenome' => 'required|string|max:255',
            'email' => 'required|email|max:255|unique:professors,email',
            'ucs' => ['array'],
            'ucs.*' => ['integer', 'exists:unidades_curriculares,id'],
            'availability' => ['array'],
        ]);

        $prof = Professor::create(Arr::except($data, ['ucs', 'availability']));

        $prof->unidadesCurriculares()->sync($data['ucs'] ?? []);

        $prof->availability = json_encode($data['availability']); 
        $prof->save();

        return redirect()->route('professores.index')->with('success', 'Professor criado com sucesso.');
    }

    public function edit(Professor $professor)
    {
        $availability = json_decode($professor->availability, true); 

        return Inertia::render('Professores/Edit', [
            'professor' => $professor,
            'ucs' => UnidadeCurricular::select('id', 'codigo', 'nome')->orderBy('codigo')->get(),
            'ucs_ids' => $professor->unidadesCurriculares()->pluck('unidade_curricular_id'),
            'disp' => $availability,  
        ]);
    }

    public function show(Professor $professor)
{
    $availability = json_decode($professor->availability, true);

    return Inertia::render('Professores/Show', [
        'professor' => $professor,
        'ucs' => $professor->unidadesCurriculares,  
        'availability' => $availability,
    ]);
}


    public function update(Request $request, Professor $professor)
    {
        $data = $request->validate([
            'matricula' => 'required|string|max:50|unique:professors,matricula,' . $professor->id,
            'nome' => 'required|string|max:255',
            'sobrenome' => 'required|string|max:255',
            'email' => 'required|email|max:255|unique:professors,email,' . $professor->id,
            'ucs' => ['array'],
            'ucs.*' => ['integer', 'exists:unidades_curriculares,id'],
            'availability' => ['array'],
        ]);

        $professor->update(Arr::except($data, ['ucs', 'availability']));

        $professor->unidadesCurriculares()->sync($data['ucs'] ?? []);

        
        $professor->availability = json_encode($data['availability']);
        $professor->save();

        return redirect()->route('professores.index')->with('success', 'Professor atualizado com sucesso.');
    }

    public function destroy(Professor $professor)
    {
        $professor->delete();
        return redirect()->route('professores.index')->with('success', 'Professor excluído com sucesso.');
    }
}
