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
    <AuthenticatedLayout header={null} bgClass="bg-white">
      <Head title="Editar Unidade Curricular" />

      {/* HEADER PREMIUM */}
      <div className="max-w-6xl mx-auto mb-10 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-amber-700 tracking-tight">
            Editar Unidade Curricular
          </h1>
          <p className="text-gray-500 mt-1 text-sm">
            Atualize as informações desta UC.
          </p>
        </div>

        <Link
          href="/unidades-curriculares"
          className="rounded-lg border border-amber-600 px-4 py-2 font-semibold text-amber-700 hover:bg-amber-50 shadow-sm transition"
        >
          Voltar
        </Link>
      </div>

      {/* CARD DO FORMULÁRIO */}
      <form
        onSubmit={submit}
        className="max-w-6xl mx-auto rounded-2xl border border-amber-200 bg-white p-8 shadow-lg space-y-8"
      >

        {/* GRID DE CAMPOS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Nome */}
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Nome <span className="text-amber-600">*</span>
            </label>
            <input
              className="w-full rounded-xl border border-amber-300 bg-white px-4 py-2.5 
              shadow-sm focus:ring-2 focus:ring-amber-500 outline-none transition"
              value={data.nome}
              onChange={(e) => setData('nome', e.target.value)}
            />
            {errors.nome && (
              <p className="text-red-600 text-sm mt-1">{errors.nome}</p>
            )}
          </div>

          {/* Descrição */}
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Descrição
            </label>
            <textarea
              rows="4"
              className="w-full rounded-xl border border-amber-300 px-4 py-2.5 
              shadow-sm focus:ring-amber-500 outline-none transition"
              value={data.descricao}
              onChange={(e) => setData('descricao', e.target.value)}
            />
            {errors.descricao && (
              <p className="text-red-600 text-sm mt-1">{errors.descricao}</p>
            )}
          </div>

          {/* Grupo */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Grupo
            </label>
            <input
              className="w-full rounded-xl border border-amber-300 px-4 py-2.5 shadow-sm focus:ring-amber-500"
              value={data.grupo}
              onChange={(e) => setData('grupo', e.target.value)}
            />
            {errors.grupo && (
              <p className="text-red-600 text-sm mt-1">{errors.grupo}</p>
            )}
          </div>

          {/* Código */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Código <span className="text-amber-600">*</span>
            </label>
            <input
              className="w-full rounded-xl border border-amber-300 px-4 py-2.5 shadow-sm 
              focus:ring-amber-500"
              value={data.codigo}
              onChange={(e) => setData('codigo', e.target.value)}
            />
            {errors.codigo && (
              <p className="text-red-600 text-sm mt-1">{errors.codigo}</p>
            )}
          </div>

          {/* Carga horária */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Carga Horária (h) <span className="text-amber-600">*</span>
            </label>
            <input
              type="number"
              min="1"
              className="w-full rounded-xl border border-amber-300 px-4 py-2.5 shadow-sm 
              focus:ring-amber-500"
              value={data.carga_horaria}
              onChange={(e) => setData('carga_horaria', e.target.value)}
            />
            {errors.carga_horaria && (
              <p className="text-red-600 text-sm mt-1">{errors.carga_horaria}</p>
            )}
          </div>

          {/* Método */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Método <span className="text-amber-600">*</span>
            </label>
            <select
              className="w-full rounded-xl border border-amber-300 px-4 py-2.5 shadow-sm focus:ring-amber-500"
              value={data.metodo}
              onChange={(e) => setData('metodo', e.target.value)}
            >
              {METODOS.map((m) => (
                <option key={m.value} value={m.value}>
                  {m.label}
                </option>
              ))}
            </select>
            {errors.metodo && (
              <p className="text-red-600 text-sm mt-1">{errors.metodo}</p>
            )}
          </div>

          {/* Tipo */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Tipo <span className="text-amber-600">*</span>
            </label>
            <select
              className="w-full rounded-xl border border-amber-300 px-4 py-2.5 shadow-sm 
              focus:ring-amber-500"
              value={data.tipo}
              onChange={(e) => setData('tipo', e.target.value)}
            >
              {TIPOS.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
            {errors.tipo && (
              <p className="text-red-600 text-sm mt-1">{errors.tipo}</p>
            )}
          </div>
        </div>

        {/* Botões */}
        <div className="flex justify-end gap-3 pt-4">
          <Link
            href="/unidades-curriculares"
            className="rounded-lg border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50 transition"
          >
            Cancelar
          </Link>

          <button
            type="submit"
            disabled={processing}
            className="rounded-lg bg-amber-600 px-6 py-2.5 text-white font-semibold shadow hover:bg-amber-700 transition disabled:opacity-50"
          >
            {processing ? 'Salvando...' : 'Salvar Alterações'}
          </button>
        </div>

      </form>
    </AuthenticatedLayout>
  );
}
