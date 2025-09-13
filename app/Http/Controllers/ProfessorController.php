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
            // UCs para multi-seleção
            'ucs' => UnidadeCurricular::select('id','codigo','nome')->orderBy('codigo')->get(),
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'matricula' => 'required|string|max:50|unique:professors,matricula',
            'nome'      => 'required|string|max:255',
            'sobrenome' => 'required|string|max:255',
            'email'     => 'required|email|max:255|unique:professors,email',

            
            'ucs'                 => ['array'],
            'ucs.*'               => ['integer','exists:unidades_curriculares,id'],
            'availability'        => ['array'],
            'availability.*'      => ['array'],
            'availability.*.*'    => ['in:s1,s2'],
        ]);

        $prof = Professor::create(Arr::except($data, ['ucs','availability']));

        // sync UCs
        $prof->unidadesCurriculares()->sync($data['ucs'] ?? []);

        // sync disponibilidade
        $this->syncDisponibilidade($prof, $data['availability'] ?? []);

        return redirect()->route('professores.index')->with('success', 'Professor criado com sucesso.');
    }

    public function edit(Professor $professor)
    {
        // Disponibilidade agrupada por dia -> array de slots
        $disp = $professor->disponibilidades()
            ->get(['weekday','slot'])
            ->mapToGroups(fn($d) => [$d->weekday => [$d->slot]])
            ->map(fn($v) => $v->all());

        return Inertia::render('Professores/Edit', [
            'professor' => $professor,
            'ucs'       => UnidadeCurricular::select('id','codigo','nome')->orderBy('codigo')->get(),
            'ucs_ids'   => $professor->unidadesCurriculares()->pluck('unidade_curricular_id'),
            'disp'      => $disp, // ex.: { mon:['s1'], tue:['s1','s2'], ... }
        ]);
    }

    public function update(Request $request, Professor $professor)
    {
        $data = $request->validate([
            'matricula' => 'required|string|max:50|unique:professors,matricula,' . $professor->id,
            'nome'      => 'required|string|max:255',
            'sobrenome' => 'required|string|max:255',
            'email'     => 'required|email|max:255|unique:professors,email,' . $professor->id,

            'ucs'                 => ['array'],
            'ucs.*'               => ['integer','exists:unidades_curriculares,id'],
            'availability'        => ['array'],
            'availability.*'      => ['array'],
            'availability.*.*'    => ['in:s1,s2'],
        ]);

        $professor->update(Arr::except($data, ['ucs','availability']));

        $professor->unidadesCurriculares()->sync($data['ucs'] ?? []);
        $this->syncDisponibilidade($professor, $data['availability'] ?? []);

        return redirect()->route('professores.index')->with('success', 'Professor atualizado com sucesso.');
    }

    public function destroy(Professor $professor)
    {
        $professor->delete();
        return redirect()->route('professores.index')->with('success', 'Professor excluído com sucesso.');
    }

    /** recria disponibilidade conforme checkboxes do form */
    private function syncDisponibilidade(Professor $professor, array $availability): void
    {
        $professor->disponibilidades()->delete();
        $rows = [];
        foreach (['mon','tue','wed','thu','fri'] as $day) {
            foreach (($availability[$day] ?? []) as $slot) {
                $rows[] = ['weekday' => $day, 'slot' => $slot];
            }
        }
        if ($rows) {
            $professor->disponibilidades()->createMany($rows);
        }
    }
}
