import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Edit({ turma }) {
  const { data, setData, put, processing, errors } = useForm({
    nome: turma.nome || '',
    data_entrada: turma.data_entrada || '',
    quantidade_alunos: turma.quantidade_alunos || '',
  });

  function submit(e) {
    e.preventDefault();
    put(`/turmas/${turma.id}`);
  }

  return (
    <AuthenticatedLayout header={null} bgClass="bg-white">
      <Head title="Editar Turma" />

      {/* Header padrão */}
      <div className="max-w-5xl mx-auto mb-10 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-amber-700 tracking-tight">Editar Turma</h1>
          <p className="text-gray-600 mt-1 text-sm">
            Atualize as informações desta turma.
          </p>
        </div>

        <Link
          href="/turmas"
          className="rounded-xl bg-white border border-amber-600 px-4 py-2 font-semibold text-amber-700 shadow-sm hover:bg-amber-50 transition"
        >
          Voltar
        </Link>
      </div>

      {/* Card */}
      <form onSubmit={submit} className="max-w-5xl mx-auto">
        <div className="rounded-2xl border border-amber-200 bg-white p-8 shadow-lg space-y-6">

          {/* Nome */}
          <div>
            <label className="block text-sm font-semibold text-gray-700">Nome da Turma</label>
            <input
              className="mt-1 w-full rounded-xl border border-amber-300 bg-white px-4 py-3 shadow-sm focus:ring-2 focus:ring-amber-500 outline-none"
              value={data.nome}
              onChange={(e) => setData('nome', e.target.value)}
            />
            {errors.nome && <p className="text-sm text-red-600">{errors.nome}</p>}
          </div>

          {/* Data Entrada */}
          <div>
            <label className="block text-sm font-semibold text-gray-700">Data de Entrada</label>
            <input
              type="date"
              className="mt-1 w-full rounded-xl border border-amber-300 bg-white px-4 py-3 shadow-sm focus:ring-2 focus:ring-amber-500 outline-none"
              value={data.data_entrada}
              onChange={(e) => setData('data_entrada', e.target.value)}
            />
            {errors.data_entrada && (
              <p className="text-sm text-red-600">{errors.data_entrada}</p>
            )}
          </div>

          {/* Quantidade */}
          <div>
            <label className="block text-sm font-semibold text-gray-700">Quantidade de Alunos</label>
            <input
              type="number"
              min="0"
              className="mt-1 w-40 rounded-xl border border-amber-300 bg-white px-4 py-3 shadow-sm focus:ring-2 focus:ring-amber-500 outline-none"
              value={data.quantidade_alunos}
              onChange={(e) => setData('quantidade_alunos', e.target.value)}
            />
            {errors.quantidade_alunos && (
              <p className="text-sm text-red-600">{errors.quantidade_alunos}</p>
            )}
          </div>

          {/* Botões */}
          <div className="flex justify-end gap-3 pt-4">
            <Link
              href="/turmas"
              className="rounded-lg border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50 transition"
            >
              Cancelar
            </Link>

            <button
              type="submit"
              disabled={processing}
              className="rounded-lg bg-amber-600 px-6 py-2.5 font-semibold text-white shadow hover:bg-amber-700 transition disabled:opacity-50"
            >
              Atualizar
            </button>
          </div>

        </div>
      </form>
    </AuthenticatedLayout>
  );
}
