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
        (t.nome || '').toLowerCase().includes(s) ||  // Pesquisa pelo nome da turma
        String(t.quantidade_alunos).includes(s) ||  // Pesquisa pela quantidade de alunos
        (t.data_entrada || '').toLowerCase().includes(s) // Pesquisa pela data de entrada
      );
    }
    return data;
  }, [turmas, q]);

  const del = (id) => {
    if (confirm('Excluir turma?')) router.delete(`/turmas/${id}`);
  };

  return (
    <AuthenticatedLayout header={null} bgClass="bg-amber-600">
      <Head title="Turmas" />

      {/* Top bar */}
      <div className="mb-6 text-white">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-3xl font-extrabold leading-tight">Turmas</h1>
            <p className="text-white/90 mt-1">Gerencie turmas e quantidade de alunos</p>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <div className="flex rounded-lg overflow-hidden bg-white">
              <span className="hidden sm:inline-flex items-center px-3 text-sm text-gray-500">Buscar</span>
              <input
                className="w-full px-3 py-2 text-gray-800 outline-none"
                placeholder="Nome ou quantidade de alunos..."
                value={q}
                onChange={e => setQ(e.target.value)}
              />
            </div>

            <Link
              href="/turmas/create"
              className="inline-flex items-center justify-center rounded-lg bg-white px-4 py-2 font-semibold text-amber-700 shadow-sm hover:shadow transition"
            >
              <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24" fill="currentColor"><path d="M13 11h6a1 1 0 1 1 0 2h-6v6a1 1 0 1 1-2 0v-6H5a1 1 0 1 1 0-2h6V5a1 1 0 1 1 2 0v6z" /></svg>
              Nova Turma
            </Link>
          </div>
        </div>
      </div>

      {flash && (
        <div className="mb-4 rounded-lg border border-white/30 bg-white/10 px-4 py-2 text-white">
          {flash}
        </div>
      )}

      {/* Tabela */}
      <div className="rounded-2xl bg-white shadow-xl overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-amber-50">
            <tr className="text-gray-700">
              <th className="px-4 py-3">Nome da Turma</th>
              <th className="px-4 py-3 w-40">Quantidade de Alunos</th>
              <th className="px-4 py-3 w-48">Data de Entrada</th> {/* Adicionando a Data de Entrada */}
              <th className="px-4 py-3 text-right w-48">Ações</th>
            </tr>
          </thead>
          <tbody>
            {list.map((t, i) => (
              <tr key={t.id} className={i % 2 ? 'bg-amber-50/40' : 'bg-white'}>
                <td className="px-4 py-3 font-medium text-gray-900">{t.nome}</td>  {/* Exibindo o nome da turma */}
                <td className="px-4 py-3">{t.quantidade_alunos}</td> {/* Exibindo a quantidade de alunos */}
                <td className="px-4 py-3">{new Date(t.data_entrada).toLocaleDateString()}</td> {/* Exibindo a data de entrada */}
                <td className="px-4 py-3 text-right">
                  <Link
                    href={`/turmas/${t.id}/edit`}
                    className="inline-flex items-center gap-1.5 rounded-full bg-amber-600 px-4 py-1.5 text-sm font-medium text-white shadow-sm ring-1 ring-amber-500/40 hover:bg-amber-700 hover:shadow transition"
                  >
                    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a1.003 1.003 0 0 0 0-1.42l-2.34-2.34a1.003 1.003 0 0 0-1.42 0l-1.83 1.83 3.75 3.75 1.84-1.82z" /></svg>
                    Editar
                  </Link>
                  <button
                    onClick={() => del(t.id)}
                    className="ml-2 inline-flex items-center gap-1.5 rounded-full bg-red-600 px-4 py-1.5 text-sm font-medium text-white shadow-sm ring-1 ring-red-500/40 hover:bg-red-700 hover:shadow transition"
                  >
                    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor"><path d="M6 7h12l-1 14H7L6 7zm3-3h6l1 3H8l1-3z" /></svg>
                    Excluir
                  </button>
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
    </AuthenticatedLayout>
  );
}
