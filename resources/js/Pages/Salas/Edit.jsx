import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm, usePage, router } from '@inertiajs/react';

export default function Edit({ sala }) {
  const { errors } = usePage().props;

  const { data, setData, processing } = useForm({
    nome: sala.nome ?? '',
    local: sala.local ?? 'Clube',
    quantidade_lugares: sala.quantidade_lugares ?? '',
  });

  function submit(e) {
    e.preventDefault();
    router.put(`/salas/${sala.id}`, data);
  }

  return (
    <AuthenticatedLayout header={null} bgClass="bg-white">
      <Head title="Editar Sala" />

      {/* Cabeçalho elegante */}
      <div className="max-w-3xl mx-auto mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-amber-700 tracking-tight">
            Editar Sala
          </h1>
          <p className="text-gray-500 mt-1 text-sm">
            Atualize as informações da sala cadastrada.
          </p>
        </div>

        <Link
          href="/salas"
          className="rounded-lg border border-amber-600 px-4 py-2 font-medium text-amber-700 hover:bg-amber-50 transition shadow-sm"
        >
          Voltar
        </Link>
      </div>

      {/* Card principal */}
      <form onSubmit={submit} className="max-w-3xl mx-auto">
        <div className="rounded-2xl border border-amber-200 bg-white p-6 shadow-md space-y-8">

          {/* Nome */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Nome da Sala <span className="text-amber-600">*</span>
            </label>
            <input
              className="w-full rounded-xl border border-amber-300 bg-white px-4 py-2.5 
              focus:ring-2 focus:ring-amber-500 focus:border-amber-600 outline-none transition"
              value={data.nome}
              onChange={(e) => setData('nome', e.target.value)}
            />
            {errors.nome && (
              <p className="mt-1 text-sm text-red-600">{errors.nome}</p>
            )}
          </div>

          {/* Local */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Local <span className="text-amber-600">*</span>
            </label>
            <select
              className="w-full rounded-xl border border-amber-300 bg-white px-4 py-2.5 
              focus:ring-2 focus:ring-amber-500 focus:border-amber-600 outline-none transition"
              value={data.local}
              onChange={(e) => setData('local', e.target.value)}
            >
              <option value="Clube">Campus Clube</option>
              <option value="Ipolon">Campus Ipolon</option>
            </select>
            {errors.local && (
              <p className="mt-1 text-sm text-red-600">{errors.local}</p>
            )}
          </div>

          {/* Capacidade */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Capacidade de Lugares <span className="text-amber-600">*</span>
            </label>
            <input
              type="number"
              className="w-full rounded-xl border border-amber-300 bg-white px-4 py-2.5 
              focus:ring-2 focus:ring-amber-500 focus:border-amber-600 outline-none transition"
              value={data.quantidade_lugares}
              onChange={(e) => setData('quantidade_lugares', e.target.value)}
            />
            {errors.quantidade_lugares && (
              <p className="mt-1 text-sm text-red-600">{errors.quantidade_lugares}</p>
            )}
          </div>

          {/* Botões */}
          <div className="flex justify-end gap-3 pt-4">
            <Link
              href="/salas"
              className="rounded-lg border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50 transition"
            >
              Cancelar
            </Link>

            <button
              type="submit"
              disabled={processing}
              className="rounded-lg bg-amber-600 px-6 py-2.5 text-white font-semibold shadow hover:bg-amber-700 transition disabled:opacity-50"
            >
              Atualizar
            </button>
          </div>

        </div>
      </form>
    </AuthenticatedLayout>
  );
}
