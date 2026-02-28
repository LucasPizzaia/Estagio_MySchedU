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
    if (confirm('Deseja realmente excluir esta turma?')) {
      router.delete(`/turmas/${id}`);
    }
  };

  return (
    <AuthenticatedLayout header={null} bgClass="bg-white">
      <Head title="Turmas" />

      {/* HEADER PADRONIZADO */}
      <div className="max-w-6xl mx-auto mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between px-4 sm:px-0">
        <div>
          <h1 className="text-3xl font-bold text-amber-700 tracking-tight">Turmas</h1>
          <p className="text-gray-500 mt-1 text-sm">Gerencie o agrupamento de alunos e períodos de ingresso.</p>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          {/* BUSCA */}
          <div className="flex rounded-xl border border-amber-300 bg-white overflow-hidden shadow-sm">
            <span className="hidden sm:flex items-center px-3 text-sm text-gray-500 font-medium">Buscar</span>
            <input
              className="w-full px-3 py-2 text-gray-800 outline-none"
              placeholder="Nome da turma ou data..."
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* FLASH MESSAGE */}
      {flash && (
        <div className="max-w-6xl mx-auto mb-4 rounded-xl border border-amber-300 bg-amber-50 px-4 py-2 text-amber-800 shadow-sm">
          {flash}
        </div>
      )}

      {/* CARD DA TABELA */}
      <div className="max-w-6xl mx-auto rounded-2xl border border-amber-200 bg-white shadow-lg overflow-hidden mb-20">
        <div className="overflow-auto" style={{ maxHeight: '65vh' }}>
          <table className="w-full text-left">
            <thead className="sticky top-0 bg-amber-50 border-b border-amber-200">
              <tr className="text-gray-700 font-bold text-sm uppercase tracking-wider">
                <th className="px-6 py-4">Identificação da Turma</th>
                <th className="px-6 py-4 text-center">Qtd. Alunos</th>
                <th className="px-6 py-4 text-center">Data de Entrada</th>
                <th className="px-6 py-4 text-right w-32">Ações</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-amber-100">
              {list.map((t, i) => (
                <tr key={t.id} className="hover:bg-amber-50/50 transition-colors group">
                  {/* Nome + Avatar */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-xl bg-amber-600/10 text-amber-700 flex items-center justify-center font-bold border border-amber-200 uppercase">
                        {(t.nome?.[0] || 'T')}
                      </div>
                      <div className="leading-tight">
                        <div className="font-bold text-gray-900">{t.nome}</div>
                        <div className="text-[10px] text-gray-400 font-mono uppercase tracking-tighter">ID #{t.id}</div>
                      </div>
                    </div>
                  </td>

                  {/* Quantidade */}
                  <td className="px-6 py-4 text-center">
                    <span className="inline-flex items-center rounded-lg bg-gray-100 px-3 py-1 text-sm font-bold text-gray-700 border border-gray-200">
                      {t.quantidade_alunos}
                    </span>
                  </td>

                  {/* Data Entrada */}
                  <td className="px-6 py-4 text-center text-sm font-medium text-gray-600 italic">
                    {new Date(t.data_entrada).toLocaleDateString('pt-BR')}
                  </td>

                  {/* AÇÕES (ÍCONES) */}
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2 opacity-70 group-hover:opacity-100 transition-opacity">
                      
                      {/* Editar */}
                      <Link
                        href={`/turmas/${t.id}/edit`}
                        className="p-2 text-amber-600 hover:bg-amber-100 rounded-lg transition"
                        title="Editar Turma"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                      </Link>

                      {/* Excluir */}
                      <button
                        onClick={() => del(t.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                        title="Excluir Turma"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>

                    </div>
                  </td>
                </tr>
              ))}

              {!list.length && (
                <tr>
                  <td colSpan="4" className="px-4 py-16 text-center text-gray-400 italic font-medium">
                    Nenhuma turma cadastrada no sistema.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* BOTÃO FLUTUANTE CORRIGIDO: FIXO NO CANTO DA TELA */}
      <Link
        href="/turmas/create"
        className="fixed bottom-10 right-10 flex items-center justify-center rounded-full bg-amber-600 text-white h-16 w-16 shadow-2xl hover:bg-amber-700 transition-all hover:scale-110 active:scale-95 z-[9999] group"
        title="Nova Turma"
      >
        <svg className="h-8 w-8 transition-transform group-hover:rotate-90" viewBox="0 0 24 24" fill="currentColor">
          <path d="M13 11h6a1 1 0 1 1 0 2h-6v6a1 1 0 1 1-2 0v-6H5a1 1 0 1 1 0-2h6V5a1 1 0 1 1 2 0v6z" />
        </svg>
      </Link>

    </AuthenticatedLayout>
  );
}