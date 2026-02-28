import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useMemo, useState } from 'react';

export default function Index({ salas = [], flash }) {
  const [q, setQ] = useState('');
  const [order, setOrder] = useState('nome');

  const list = useMemo(() => {
    let data = [...salas];

    if (q) {
      const s = q.toLowerCase();
      data = data.filter(sala =>
        (sala.nome || '').toLowerCase().includes(s) ||
        (sala.local || '').toLowerCase().includes(s) ||
        String(sala.quantidade_lugares || '').includes(s)
      );
    }

    data.sort((a, b) => `${a[order] || ''}`.localeCompare(`${b[order] || ''}`));
    return data;
  }, [salas, q, order]);

  const del = (id) => {
    if (confirm('Deseja realmente excluir esta sala?')) {
      router.delete(`/salas/${id}`);
    }
  };

  return (
    <AuthenticatedLayout header={null} bgClass="bg-white">
      <Head title="Salas" />

      {/* HEADER PADRONIZADO */}
      <div className="max-w-6xl mx-auto mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between px-4 sm:px-0">
        <div>
          <h1 className="text-3xl font-bold text-amber-700 tracking-tight">Salas</h1>
          <p className="text-gray-500 mt-1 text-sm">Gerencie os espaços físicos, laboratórios e capacidades.</p>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          {/* BUSCA */}
          <div className="flex rounded-xl border border-amber-300 bg-white overflow-hidden shadow-sm">
            <span className="hidden sm:flex items-center px-3 text-sm text-gray-500 font-medium">Buscar</span>
            <input
              className="w-full px-3 py-2 text-gray-800 outline-none"
              placeholder="Nome, local ou capacidade..."
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
          </div>

          {/* ORDENAÇÃO */}
          <select
            className="rounded-xl border border-amber-300 bg-white px-3 py-2 text-gray-700 shadow-sm focus:ring-amber-500 outline-none"
            value={order}
            onChange={(e) => setOrder(e.target.value)}
          >
            <option value="nome">Ordenar: Nome</option>
            <option value="local">Ordenar: Local</option>
            <option value="quantidade_lugares">Ordenar: Capacidade</option>
          </select>

          <Link
            href="/salas/create"
            className="rounded-xl bg-amber-600 px-4 py-2 font-semibold text-white shadow-sm hover:bg-amber-700 transition text-center"
          >
            Nova Sala
          </Link>
        </div>
      </div>

      {/* FLASH MESSAGE */}
      {flash && (
        <div className="max-w-6xl mx-auto mb-4 rounded-xl border border-amber-300 bg-amber-50 px-4 py-2 text-amber-800 shadow-sm">
          {flash}
        </div>
      )}

      {/* CARD DA TABELA */}
      <div className="max-w-6xl mx-auto rounded-2xl border border-amber-200 bg-white shadow-lg overflow-hidden">
        <div className="overflow-auto" style={{ maxHeight: '65vh' }}>
          <table className="w-full text-left">
            <thead className="sticky top-0 bg-amber-50 border-b border-amber-200">
              <tr className="text-gray-700 font-bold text-sm uppercase tracking-wider">
                <th className="px-6 py-4 font-bold">Identificação da Sala</th>
                <th className="px-6 py-4 font-bold">Local / Bloco</th>
                <th className="px-6 py-4 text-center font-bold">Capacidade</th>
                <th className="px-6 py-4 text-right w-32 font-bold">Ações</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-amber-100">
              {list.map((sala, i) => (
                <tr key={sala.id} className="hover:bg-amber-50/50 transition-colors group">
                  {/* Nome + Avatar */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-xl bg-amber-600/10 text-amber-700 flex items-center justify-center font-bold border border-amber-200">
                        {(sala.nome?.[0] || 'S').toUpperCase()}
                      </div>
                      <div className="leading-tight">
                        <div className="font-bold text-gray-900">{sala.nome}</div>
                        <div className="text-[10px] text-gray-400 font-mono uppercase tracking-tighter">ID #{sala.id}</div>
                      </div>
                    </div>
                  </td>

                  {/* Local */}
                  <td className="px-6 py-4 text-sm font-medium text-gray-600">
                    <div className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                        {sala.local || 'Não definido'}
                    </div>
                  </td>

                  {/* Capacidade */}
                  <td className="px-6 py-4 text-center">
                    <span className="inline-flex items-center rounded-lg bg-gray-100 px-3 py-1 text-sm font-bold text-gray-700 border border-gray-200">
                      {sala.quantidade_lugares} <span className="ml-1 text-[10px] text-gray-400 uppercase font-normal text-xs">lugares</span>
                    </span>
                  </td>

                  {/* AÇÕES (ÍCONES) */}
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2 opacity-70 group-hover:opacity-100 transition-opacity">
                      
                      {/* Editar */}
                      <Link
                        href={`/salas/${sala.id}/edit`}
                        className="p-2 text-amber-600 hover:bg-amber-100 rounded-lg transition"
                        title="Editar Sala"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                      </Link>

                      {/* Excluir */}
                      <button
                        onClick={() => del(sala.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                        title="Excluir Sala"
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
                  <td colSpan="4" className="px-4 py-16 text-center text-gray-400 italic">
                    Nenhuma sala cadastrada no sistema.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Botão Flutuante */}
      <Link
        href="/salas/create"
        className="fixed bottom-8 right-8 inline-flex items-center justify-center rounded-full bg-amber-600 text-white h-14 w-14 shadow-2xl hover:bg-amber-700 transition-all hover:scale-110 active:scale-95"
      >
        <svg className="h-7 w-7" viewBox="0 0 24 24" fill="currentColor">
          <path d="M13 11h6a1 1 0 1 1 0 2h-6v6a1 1 0 1 1-2 0v-6H5a1 1 0 1 1 0-2h6V5a1 1 0 1 1 2 0v6z" />
        </svg>
      </Link>

    </AuthenticatedLayout>
  );
}