import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useMemo, useState } from 'react';

export default function Index({ turmas = [], flash }) {
  const [q, setQ] = useState('');

  const list = useMemo(() => {
    let data = [...turmas];
    if (q) {
      const s = q.toLowerCase();
      data = data.filter(t =>
        (t.nome || '').toLowerCase().includes(s) ||
        String(t.quantidade_alunos).includes(s) ||
        (t.data_entrada || '').toLowerCase().includes(s)
      );
    }
    return data;
  }, [turmas, q]);

  const del = (id) => {
    if (confirm('Excluir turma?')) {
      router.delete(`/turmas/${id}`);
    }
  };

  return (
    <AuthenticatedLayout header={null} bgClass="bg-white">
      <Head title="Turmas" />

      {/* HEADER */}
      <div className="max-w-6xl mx-auto mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-amber-700 tracking-tight">Turmas</h1>
          <p className="text-gray-500 mt-1 text-sm">Gerencie as turmas cadastradas</p>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          {/* Busca */}
          <div className="flex rounded-xl border border-amber-300 bg-white overflow-hidden shadow-sm">
            <span className="hidden sm:flex items-center px-3 text-sm text-gray-500">Buscar</span>
            <input
              className="w-full px-3 py-2 text-gray-800 outline-none"
              placeholder="Nome, alunos ou data..."
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
          </div>

          {/* Nova Turma */}
          <Link
            href="/turmas/create"
            className="rounded-xl bg-amber-600 px-4 py-2 font-semibold text-white shadow-sm hover:bg-amber-700 transition"
          >
            Nova Turma
          </Link>
        </div>
      </div>

      {/* FLASH */}
      {flash && (
        <div className="max-w-6xl mx-auto mb-4 rounded-xl border border-amber-300 bg-amber-50 px-4 py-2 text-amber-800 shadow-sm">
          {flash}
        </div>
      )}

      {/* TABELA */}
      <div className="max-w-6xl mx-auto rounded-2xl border border-amber-200 bg-white shadow-lg overflow-hidden">
        <div className="overflow-auto" style={{ maxHeight: '65vh' }}>
          <table className="w-full text-left">
            <thead className="sticky top-0 bg-amber-50 border-b border-amber-200">
              <tr>
                <th className="px-4 py-3">Nome</th>
                <th className="px-4 py-3 text-center">Alunos</th>
                <th className="px-4 py-3 text-center">Entrada</th>
                <th className="px-4 py-3 text-right w-56">Ações</th>
              </tr>
            </thead>

            <tbody>
              {list.map((t, i) => (
                <tr key={t.id} className={i % 2 ? "bg-amber-50/40" : "bg-white"}>
                  <td className="px-4 py-3 font-medium text-gray-900">{t.nome}</td>
                  <td className="px-4 py-3 text-center">{t.quantidade_alunos}</td>
                  <td className="px-4 py-3 text-center">
                    {new Date(t.data_entrada).toLocaleDateString('pt-BR')}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-2">

                      {/* Editar */}
                      <Link
                        href={`/turmas/${t.id}/edit`}
                        className="rounded-full bg-amber-600 px-4 py-1.5 text-sm font-medium text-white shadow-sm hover:bg-amber-700 transition"
                      >
                        Editar
                      </Link>

                      {/* Excluir */}
                      <button
                        onClick={() => del(t.id)}
                        className="rounded-full bg-red-600 px-4 py-1.5 text-sm font-medium text-white shadow-sm hover:bg-red-700 transition"
                      >
                        Excluir
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {!list.length && (
                <tr>
                  <td colSpan="4" className="px-4 py-12 text-center text-gray-500">
                    Nenhuma turma encontrada.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Botão flutuante */}
      <Link
        href="/turmas/create"
        className="fixed bottom-6 right-6 inline-flex items-center justify-center rounded-full bg-amber-600 text-white h-14 w-14 shadow-xl hover:bg-amber-700 transition"
      >
        <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
          <path d="M13 11h6a1 1 0 1 1 0 2h-6v6a1 1 0 1 1-2 0v-6H5a1 1 0 1 1 0-2h6V5a1 1 0 1 1 2 0v6z" />
        </svg>
      </Link>

    </AuthenticatedLayout>
  );
}
