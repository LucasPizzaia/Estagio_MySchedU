<?php

namespace App\Http\Controllers;

use App\Models\UnidadeCurricular;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class UnidadeCurricularController extends Controller
{
    /** Regras reutilizáveis (com ignore opcional) */
    private function rules(?int $ignoreId = null): array
    {
        return [
            'nome'          => ['required', 'string', 'max:255'],
            'descricao'     => ['nullable', 'string'],
            'grupo'         => ['nullable', 'string', 'max:100'],
            'codigo'        => [
                'required', 'string', 'max:50',
                $ignoreId
                    ? Rule::unique('unidades_curriculares', 'codigo')->ignore($ignoreId)
                    : Rule::unique('unidades_curriculares', 'codigo'),
            ],
            'carga_horaria' => ['required', 'integer', 'min:1', 'max:2000'],
            'metodo'        => ['required', 'in:teorica,teorico-pratica,pratica'],
            'tipo'          => ['required', 'in:flex,core,digital'],
        ];
    }

    /**
     * Listagem no mesmo padrão de Professores:
     * - retorna array simples (sem paginação)
     * - busca/ordenação ficam no cliente (Index.jsx)
     */
    public function index()
    {
        $ucs = UnidadeCurricular::query()
            ->select('id', 'codigo', 'nome', 'grupo', 'carga_horaria', 'metodo', 'tipo')
            ->orderByDesc('id')
            ->get();

        return Inertia::render('UnidadesCurriculares/Index', [
            'unidades' => $ucs,                 // <- exatamente como a view de UC espera
            'flash'    => session('success'),   // <- mesmo padrão da tela de Professores
        ]);
    }

    public function create()
    {
        return Inertia::render('UnidadesCurriculares/Create');
    }

    public function store(Request $request)
    {
        $data = $request->validate($this->rules());
        UnidadeCurricular::create($data);

        return redirect()
            ->route('unidades-curriculares.index')
            ->with('success', 'Unidade Curricular criada com sucesso!');
    }

    public function edit(UnidadeCurricular $unidadeCurricular)
    {
        return Inertia::render('UnidadesCurriculares/Edit', [
            'uc' => $unidadeCurricular,
        ]);
    }

    public function update(Request $request, UnidadeCurricular $unidadeCurricular)
    {
        $data = $request->validate($this->rules($unidadeCurricular->id));
        $unidadeCurricular->update($data);

        return redirect()
            ->route('unidades-curriculares.index')
            ->with('success', 'Unidade Curricular atualizada com sucesso!');
    }

    public function destroy(UnidadeCurricular $unidadeCurricular)
    {
        $unidadeCurricular->delete();

        return back()->with('success', 'Unidade Curricular excluída com sucesso!');
    }
}
