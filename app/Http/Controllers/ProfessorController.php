<?php

namespace App\Http\Controllers;

use App\Models\Professor;
use App\Models\UnidadeCurricular;
use App\Models\Ensalamento;
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
            'flash'       => [
                'success' => session('success'),
                'error'   => session('error'),
            ],
        ]);
    }

    public function create()
    {
        return Inertia::render('Professores/Create', [
            'ucs' => UnidadeCurricular::select('id', 'codigo', 'nome')
                ->orderBy('codigo')->get(),
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'matricula'      => 'required|string|max:50|unique:professors,matricula',
            'nome'           => 'required|string|max:255',
            'sobrenome'      => 'required|string|max:255',
            'email'          => 'required|email|max:255|unique:professors,email',
            'ucs'            => ['array'],
            'ucs.*'          => ['integer', 'exists:unidades_curriculares,id'],
            'availability'   => ['array'],
            'availability.*' => ['array'], // cada dia é um array de slots
        ]);

        $prof = Professor::create(Arr::except($data, ['ucs', 'availability']));
        $prof->unidadesCurriculares()->sync($data['ucs'] ?? []);

        $prof->availability = $this->normalizarAvailability($data['availability'] ?? []);
        $prof->save();

        return redirect()->route('professores.index')
            ->with('success', 'Professor criado com sucesso.');
    }

    public function edit(Professor $professor)
    {
        // Com o cast 'array', $professor->availability já é array.
        $availability = is_array($professor->availability) ? $professor->availability : [];

        // Transforma [{weekday:'mon', slot:'s1'}, ...] em { mon:['s1'], tue:[], ... }
        // para o formato que o Edit.jsx espera.
        $disp = [];
        foreach ($availability as $item) {
            $d = strtolower(trim($item['weekday'] ?? ''));
            $s = strtolower(trim($item['slot'] ?? ''));
            if ($d === '' || $s === '') continue;
            $disp[$d] = $disp[$d] ?? [];
            if (!in_array($s, $disp[$d], true)) {
                $disp[$d][] = $s;
            }
        }

        return Inertia::render('Professores/Edit', [
            'professor' => $professor,
            'ucs'       => UnidadeCurricular::select('id', 'codigo', 'nome')
                ->orderBy('codigo')->get(),
            'ucs_ids'   => $professor->unidadesCurriculares()->pluck('unidade_curricular_id'),
            'disp'      => $disp,
        ]);
    }

    public function show(Professor $professor)
    {
        $availability = is_array($professor->availability) ? $professor->availability : [];

        return Inertia::render('Professores/Show', [
            'professor'    => $professor,
            'ucs'          => $professor->unidadesCurriculares,
            'availability' => $availability,
        ]);
    }

    public function update(Request $request, Professor $professor)
    {
        $data = $request->validate([
            'matricula'      => 'required|string|max:50|unique:professors,matricula,' . $professor->id,
            'nome'           => 'required|string|max:255',
            'sobrenome'      => 'required|string|max:255',
            'email'          => 'required|email|max:255|unique:professors,email,' . $professor->id,
            'ucs'            => ['array'],
            'ucs.*'          => ['integer', 'exists:unidades_curriculares,id'],
            'availability'   => ['array'],
            'availability.*' => ['array'],
        ]);

        $professor->update(Arr::except($data, ['ucs', 'availability']));
        $professor->unidadesCurriculares()->sync($data['ucs'] ?? []);

        $professor->availability = $this->normalizarAvailability($data['availability'] ?? []);
        $professor->save();

        return redirect()->route('professores.index')
            ->with('success', 'Professor atualizado com sucesso.');
    }

    public function destroy(Professor $professor)
    {
        // Caminho 1: bloqueia a exclusão se o professor estiver em uso em algum ensalamento
        $emUso = Ensalamento::where('professor_id', $professor->id)->count();

        if ($emUso > 0) {
            return back()->with(
                'error',
                "Não é possível excluir o professor \"{$professor->nome} {$professor->sobrenome}\": ele está alocado em {$emUso} ensalamento(s). Remova as alocações antes de excluir."
            );
        }

        // Remove vínculos de competência (UCs) da pivot antes do delete,
        // para não estourar FK em professor_unidade_curricular.
        $professor->unidadesCurriculares()->detach();

        $professor->delete();

        return redirect()->route('professores.index')
            ->with('success', 'Professor excluído com sucesso!');
    }

    /**
     * Converte { mon: ['s1','s2'], tue: [], ... }
     * em       [ {weekday:'mon', slot:'s1'}, {weekday:'mon', slot:'s2'}, ... ]
     */
    private function normalizarAvailability(array $input): array
    {
        $out = [];
        foreach ($input as $weekday => $slots) {
            foreach ((array) $slots as $slot) {
                $out[] = [
                    'weekday' => strtolower(trim((string) $weekday)),
                    'slot'    => strtolower(trim((string) $slot)),
                ];
            }
        }
        return $out;
    }
}