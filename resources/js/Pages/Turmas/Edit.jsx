import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Edit({ turma }) {
  const { data, setData, put, processing, errors } = useForm({
    nome: turma.nome || '',
    data_entrada: turma.data_entrada || '',
    quantidade_alunos: turma.quantidade_alunos || '',
  });

  const submit = (e) => {
    e.preventDefault();
    put(`/turmas/${turma.id}`);
  };

  return (
    <AuthenticatedLayout header={null} bgClass="bg-amber-600">
      <Head title="Editar Turma" />

      <div className="mb-6 text-white flex items-center justify-between">
        <h2 className="text-3xl font-extrabold">Editar Turma</h2>
        <Link href="/turmas" className="rounded-lg bg-white px-4 py-2 font-semibold text-amber-700 shadow-sm hover:shadow transition">
          Voltar
        </Link>
      </div>

      <form onSubmit={submit} className="max-w-3xl">
        <div className="rounded-2xl bg-white p-6 shadow-xl space-y-6">
          {/* Campo Nome da Turma */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Nome da Turma</label>
            <input
              className="mt-1 w-full rounded-lg border px-3 py-2 outline-none focus:ring-2 focus:ring-amber-500"
              value={data.nome}
              onChange={(e) => setData('nome', e.target.value)}
              placeholder="Ex.: Turma A"
            />
            {errors.nome && <p className="mt-1 text-sm text-red-600">{errors.nome}</p>}
          </div>

          {/* Campo Data de Entrada */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Data de Entrada</label>
            <input
              type="date"
              className="mt-1 w-full rounded-lg border px-3 py-2 outline-none focus:ring-2 focus:ring-amber-500"
              value={data.data_entrada}
              onChange={(e) => setData('data_entrada', e.target.value)}
            />
            {errors.data_entrada && <p className="mt-1 text-sm text-red-600">{errors.data_entrada}</p>}
          </div>

          {/* Campo Quantidade de Alunos */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Quantidade de Alunos</label>
            <input
              type="number"
              min="0"
              className="mt-1 w-40 rounded-lg border px-3 py-2 outline-none focus:ring-2 focus:ring-amber-500"
              value={data.quantidade_alunos}
              onChange={(e) => setData('quantidade_alunos', e.target.value)}
              placeholder="Ex.: 40"
            />
            {errors.quantidade_alunos && <p className="mt-1 text-sm text-red-600">{errors.quantidade_alunos}</p>}
          </div>

          <div className="flex gap-2">
            <Link href="/turmas" className="rounded-lg border px-4 py-2 text-gray-700 hover:bg-gray-50">Cancelar</Link>
            <button
              type="submit"
              disabled={processing}
              className="inline-flex items-center gap-2 rounded-lg bg-amber-600 px-5 py-2.5 font-semibold text-white shadow-sm ring-1 ring-amber-500/40 hover:bg-amber-700 hover:shadow transition disabled:opacity-60"
            >
              Atualizar
            </button>
          </div>
        </div>
      </form>
    </AuthenticatedLayout>
  );
}
