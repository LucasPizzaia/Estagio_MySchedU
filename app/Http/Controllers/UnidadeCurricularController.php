<?php

namespace App\Http\Controllers;

use App\Models\Ensalamento;
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
            'metodo'        => [
                'required',
                'in:Ciências da Computação,Engenharia de Software,Sistemas de Informação,Ambas',
            ],
            'tipo'          => ['required', 'in:flex,core,digital'],
        ];
    }

    public function index()
    {
        $ucs = UnidadeCurricular::query()
            ->select('id', 'codigo', 'nome', 'grupo', 'carga_horaria', 'metodo', 'tipo')
            ->orderByDesc('id')
            ->get();

        return Inertia::render('UnidadesCurriculares/Index', [
            'unidades' => $ucs,
            'flash'    => [
                'success' => session('success'),
                'error'   => session('error'),
            ],
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
        // Bloqueio: UC em uso em ensalamentos não pode ser excluída.
        $emUso = Ensalamento::where('unidade_curricular_id', $unidadeCurricular->id)->count();

        if ($emUso > 0) {
            return back()->with(
                'error',
                "Não é possível excluir a UC \"{$unidadeCurricular->nome}\": ela está alocada em {$emUso} ensalamento(s). Remova as alocações antes."
            );
        }

        // Desvincula dos professores (pivot) antes de excluir
        if (method_exists($unidadeCurricular, 'professores')) {
            $unidadeCurricular->professores()->detach();
        }

        $unidadeCurricular->delete();

        return back()->with('success', 'Unidade Curricular excluída com sucesso!');
    }
}