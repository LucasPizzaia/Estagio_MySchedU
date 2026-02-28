import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useMemo, useState } from 'react';

export default function Index({ professores = [], flash }) {
  const [q, setQ] = useState('');
  const [order, setOrder] = useState('matricula');

  const list = useMemo(() => {
    let data = [...professores];

    if (q) {
      const s = q.toLowerCase();
      data = data.filter(p =>
        (p.matricula || '').toLowerCase().includes(s) ||
        (p.nome || '').toLowerCase().includes(s) ||
        (p.sobrenome || '').toLowerCase().includes(s) ||
        (p.email || '').toLowerCase().includes(s)
      );
    }

    data.sort((a, b) => `${a[order] || ''}`.localeCompare(`${b[order] || ''}`));
    return data;
  }, [professores, q, order]);

  const del = (id) => {
    if (confirm('Deseja realmente excluir este professor?')) {
      router.delete(`/professores/${id}`);
    }
  };

  return (
    <AuthenticatedLayout header={null} bgClass="bg-white">
      <Head title="Professores" />

      {/* HEADER PADRONIZADO */}
      <div className="max-w-6xl mx-auto mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between px-4 sm:px-0">
        <div>
          <h1 className="text-3xl font-bold text-amber-700 tracking-tight">Professores</h1>
          <p className="text-gray-500 mt-1 text-sm">Gerencie o corpo docente e suas informações de contato.</p>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          {/* BUSCA */}
          <div className="flex rounded-xl border border-amber-300 bg-white overflow-hidden shadow-sm">
            <span className="hidden sm:flex items-center px-3 text-sm text-gray-500 font-medium">Buscar</span>
            <input
              className="w-full px-3 py-2 text-gray-800 outline-none"
              placeholder="Nome, matrícula ou e-mail..."
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
          </div>

          {/* ORDENAR */}
          <select
            className="rounded-xl border border-amber-300 bg-white px-3 py-2 text-gray-700 shadow-sm focus:ring-amber-500 outline-none"
            value={order}
            onChange={(e) => setOrder(e.target.value)}
          >
            <option value="matricula">Ordenar: Matrícula</option>
            <option value="nome">Ordenar: Nome</option>
            <option value="email">Ordenar: E-mail</option>
          </select>
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
                <th className="px-6 py-4 w-40">Matrícula</th>
                <th className="px-6 py-4">Professor</th>
                <th className="px-6 py-4">E-mail</th>
                <th className="px-6 py-4 text-right w-32">Ações</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-amber-100">
              {list.map((p, i) => (
                <tr key={p.id} className="hover:bg-amber-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center rounded-lg bg-amber-100 px-2.5 py-1 text-xs font-bold text-amber-800 border border-amber-200">
                      {p.matricula}
                    </span>
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-xl bg-amber-600/10 text-amber-700 flex items-center justify-center font-bold border border-amber-200 uppercase">
                        {(p.nome?.[0] || 'P')}
                      </div>
                      <div className="leading-tight">
                        <div className="font-bold text-gray-900">{p.nome} {p.sobrenome}</div>
                        <div className="text-[10px] text-gray-400 font-mono uppercase tracking-tighter">ID #{p.id}</div>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-4 text-sm font-medium">
                    <a className="text-amber-600 hover:text-amber-700 transition decoration-amber-300 underline-offset-4 hover:underline" href={`mailto:${p.email}`}>
                      {p.email}
                    </a>
                  </td>

                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2 opacity-70 group-hover:opacity-100 transition-opacity">
                      <Link
                        href={`/professores/${p.id}/edit`}
                        className="p-2 text-amber-600 hover:bg-amber-100 rounded-lg transition"
                        title="Editar Professor"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                      </Link>

                      <button
                        onClick={() => del(p.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                        title="Excluir Professor"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* BOTÃO FLUTUANTE CORRIGIDO: FIXO NO CANTO DA TELA */}
      <Link
        href="/professores/create"
        className="fixed bottom-10 right-10 flex items-center justify-center rounded-full bg-amber-600 text-white h-16 w-16 shadow-2xl hover:bg-amber-700 transition-all hover:scale-110 active:scale-95 z-[9999] group"
        title="Novo Professor"
      >
        <svg className="h-8 w-8 transition-transform group-hover:rotate-90" viewBox="0 0 24 24" fill="currentColor">
          <path d="M13 11h6a1 1 0 1 1 0 2h-6v6a1 1 0 1 1-2 0v-6H5a1 1 0 1 1 0-2h6V5a1 1 0 1 1 2 0v6z" />
        </svg>
      </Link>

    </AuthenticatedLayout>
  );
}