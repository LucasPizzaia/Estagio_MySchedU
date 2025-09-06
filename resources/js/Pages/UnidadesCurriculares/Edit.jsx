import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm, usePage } from '@inertiajs/react';

const METODOS = [
  { value: 'teorica', label: 'Teórica' },
  { value: 'teorico-pratica', label: 'Teórico-prática' },
  { value: 'pratica', label: 'Prática' },
];

const TIPOS = [
  { value: 'flex', label: 'Flex' },
  { value: 'core', label: 'Core' },
  { value: 'digital', label: 'Digital' },
];

export default function Edit({ uc }) {
  const { errors } = usePage().props;
  const { data, setData, put, processing } = useForm({
    codigo: uc.codigo ?? '',
    nome: uc.nome ?? '',
    grupo: uc.grupo ?? '',
    carga_horaria: uc.carga_horaria ?? '',
    metodo: uc.metodo ?? 'teorica',
    tipo: uc.tipo ?? 'core',
    descricao: uc.descricao ?? '',
  });

  function submit(e) {
    e.preventDefault();
    put(`/unidades-curriculares/${uc.id}`);
  }

  return (
    <AuthenticatedLayout header={null} bgClass="bg-amber-600">
      <Head title={`Editar UC #${uc.id}`} />

      {/* Header laranja (igual Professores) */}
      <div className="mb-6 text-white">
        <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-3xl font-extrabold leading-tight">Editar Unidade Curricular</h1>
            <p className="mt-1 text-white/90">Atualize os dados da unidade curricular</p>
          </div>
          <div className="flex gap-2">
            <Link
              href="/unidades-curriculares"
              className="inline-flex items-center justify-center rounded-lg bg-white px-4 py-2 font-semibold text-amber-700 shadow-sm transition hover:shadow"
            >
              Voltar
            </Link>
          </div>
        </div>
      </div>

      {/* Card branco com o formulário */}
      <div className="overflow-hidden rounded-2xl bg-white shadow-xl">
        <form onSubmit={submit} className="grid grid-cols-1 gap-4 p-6 md:grid-cols-2">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700">Nome *</label>
            <input
              className="mt-1 w-full rounded-lg border px-3 py-2"
              value={data.nome}
              onChange={(e) => setData('nome', e.target.value)}
            />
            {errors.nome && <p className="mt-1 text-sm text-red-600">{errors.nome}</p>}
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700">Descrição</label>
            <textarea
              rows={4}
              className="mt-1 w-full rounded-lg border px-3 py-2"
              value={data.descricao}
              onChange={(e) => setData('descricao', e.target.value)}
            />
            {errors.descricao && <p className="mt-1 text-sm text-red-600">{errors.descricao}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Grupo</label>
            <input
              className="mt-1 w-full rounded-lg border px-3 py-2"
              value={data.grupo}
              onChange={(e) => setData('grupo', e.target.value)}
            />
            {errors.grupo && <p className="mt-1 text-sm text-red-600">{errors.grupo}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Código *</label>
            <input
              className="mt-1 w-full rounded-lg border px-3 py-2"
              value={data.codigo}
              onChange={(e) => setData('codigo', e.target.value)}
            />
            {errors.codigo && <p className="mt-1 text-sm text-red-600">{errors.codigo}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Carga Horária (h) *</label>
            <input
              type="number" min="1"
              className="mt-1 w-full rounded-lg border px-3 py-2"
              value={data.carga_horaria}
              onChange={(e) => setData('carga_horaria', e.target.value)}
            />
            {errors.carga_horaria && <p className="mt-1 text-sm text-red-600">{errors.carga_horaria}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Método *</label>
            <select
              className="mt-1 w-full rounded-lg border px-3 py-2"
              value={data.metodo}
              onChange={(e) => setData('metodo', e.target.value)}
            >
              {METODOS.map((m) => (
                <option key={m.value} value={m.value}>{m.label}</option>
              ))}
            </select>
            {errors.metodo && <p className="mt-1 text-sm text-red-600">{errors.metodo}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Tipo *</label>
            <select
              className="mt-1 w-full rounded-lg border px-3 py-2"
              value={data.tipo}
              onChange={(e) => setData('tipo', e.target.value)}
            >
              {TIPOS.map((t) => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </select>
            {errors.tipo && <p className="mt-1 text-sm text-red-600">{errors.tipo}</p>}
          </div>

          <div className="md:col-span-2 flex justify-end gap-2 pt-2">
            <Link
              href="/unidades-curriculares"
              className="inline-flex items-center rounded-full bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200"
            >
              Cancelar
            </Link>
            <button
              type="submit"
              disabled={processing}
              className="inline-flex items-center rounded-full bg-amber-600 px-6 py-2 text-sm font-semibold text-white shadow-sm ring-1 ring-amber-500/40 hover:bg-amber-700 disabled:opacity-60"
            >
              {processing ? 'Salvando...' : 'Salvar alterações'}
            </button>
          </div>
        </form>
      </div>
    </AuthenticatedLayout>
  );
}
