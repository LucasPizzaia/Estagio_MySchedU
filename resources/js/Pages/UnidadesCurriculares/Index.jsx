import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useMemo, useState } from 'react';

export default function Index({ unidades = [], flash }) {
  const [q, setQ] = useState('');
  const [order, setOrder] = useState('codigo');

  const list = useMemo(() => {
    let data = [...unidades];

    if (q) {
      const s = q.toLowerCase();
      data = data.filter(u =>
        (u.codigo || '').toLowerCase().includes(s) ||
        (u.nome || '').toLowerCase().includes(s) ||
        (u.metodo || '').toLowerCase().includes(s) || 
        String(u.carga_horaria || '').includes(s)
      );
    }

    data.sort((a, b) => `${a[order] || ''}`.localeCompare(`${b[order] || ''}`));
    return data;
  }, [unidades, q, order]);

  const del = (id) => {
    if (confirm('Deseja realmente excluir esta unidade curricular?')) {
      router.delete(`/unidades-curriculares/${id}`);
    }
  };

  return (
    <AuthenticatedLayout header={null} bgClass="bg-white">
      <Head title="Unidades Curriculares" />

      {/* HEADER PADRONIZADO */}
      <div className="max-w-6xl mx-auto mb-10 flex flex-col gap-6 md:flex-row md:items-center md:justify-between px-4 sm:px-0">
        <div>
          <h1 className="text-3xl font-bold text-amber-700 tracking-tight">Unidades Curriculares</h1>
          <p className="text-gray-500 mt-1 text-sm">Gerencie as UCs e sua abrangência entre os cursos de TI.</p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
          {/* BUSCA COM ÍCONE */}
          <div className="relative w-full sm:w-80 group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-amber-400 group-focus-within:text-amber-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              className="block w-full pl-11 pr-4 py-3 bg-white border border-amber-100 rounded-2xl text-sm placeholder-gray-400 shadow-sm focus:ring-2 focus:ring-amber-500 transition-all outline-none"
              placeholder="Buscar por código, nome ou curso..."
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
          </div>

          {/* ORDENAÇÃO */}
          <div className="relative w-full sm:w-48">
            <select
              className="appearance-none block w-full pl-4 pr-10 py-3 bg-white border border-amber-100 rounded-2xl text-sm font-bold text-gray-700 shadow-sm focus:ring-2 focus:ring-amber-500 transition-all outline-none cursor-pointer"
              value={order}
              onChange={(e) => setOrder(e.target.value)}
            >
              <option value="codigo">Ordenar: Código</option>
              <option value="nome">Ordenar: Nome</option>
              <option value="metodo">Ordenar: Curso</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none text-amber-500">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* CARD DA TABELA */}
      <div className="max-w-6xl mx-auto rounded-3xl border border-amber-100 bg-white shadow-xl overflow-hidden mb-20">
        <div className="overflow-auto" style={{ maxHeight: '65vh' }}>
          <table className="w-full text-left border-collapse">
            {/* CORREÇÃO DA SOBREPOSIÇÃO: background sólido e z-index */}
            <thead className="sticky top-0 z-10 bg-[#fffbeb] border-b border-amber-100">
              <tr className="text-gray-700 font-black text-[10px] uppercase tracking-widest">
                <th className="px-6 py-5">Código</th>
                <th className="px-6 py-5">Unidade Curricular</th>
                <th className="px-6 py-5 text-center">Carga</th>
                <th className="px-6 py-5">Abrangência / Curso</th>
                <th className="px-6 py-5 text-center">Tipo</th>
                <th className="px-6 py-5 text-right w-32">Ações</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-amber-50">
              {list.map((u) => (
                <tr key={u.id} className="hover:bg-amber-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center rounded-lg bg-amber-100 px-2.5 py-1 text-xs font-bold text-amber-800 border border-amber-200">
                      {u.codigo}
                    </span>
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-xl bg-amber-600/10 text-amber-700 flex items-center justify-center font-bold border border-amber-200 uppercase">
                        {(u.nome?.[0] || 'U')}
                      </div>
                      <div>
                        <div className="font-bold text-gray-900 leading-tight">{u.nome}</div>
                        <div className="text-[10px] text-gray-400 font-mono mt-0.5 uppercase tracking-tighter">Grupo: {u.grupo || 'Geral'}</div>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-4 text-center font-medium text-gray-600 italic">
                    {u.carga_horaria}h
                  </td>

                  {/* AJUSTE DO CONTEÚDO DA ABRANGÊNCIA */}
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                      u.metodo === 'Ambas' 
                        ? 'bg-purple-50 text-purple-700 border-purple-100' 
                        : 'bg-blue-50 text-blue-700 border-blue-100'
                    }`}>
                      {u.metodo || 'Não definido'}
                    </span>
                  </td>

                  <td className="px-6 py-4 text-center">
                    <span className="text-[10px] font-black text-gray-500 uppercase px-2 py-1 bg-gray-50 rounded-md tracking-widest border border-gray-100">
                      {u.tipo}
                    </span>
                  </td>

                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2 opacity-70 group-hover:opacity-100 transition-opacity">
                      <Link
                        href={`/unidades-curriculares/${u.id}/edit`}
                        className="p-2 text-amber-600 hover:bg-amber-100 rounded-lg transition"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                      </Link>
                      <button
                        onClick={() => del(u.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
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

      <Link
        href="/unidades-curriculares/create"
        className="fixed bottom-10 right-10 flex items-center justify-center rounded-full bg-amber-600 text-white h-16 w-16 shadow-2xl hover:bg-amber-700 transition-all hover:scale-110 active:scale-95 z-[9999] group border-4 border-white"
      >
        <svg className="h-8 w-8 transition-transform group-hover:rotate-90" viewBox="0 0 24 24" fill="currentColor">
          <path d="M13 11h6a1 1 0 1 1 0 2h-6v6a1 1 0 1 1-2 0v-6H5a1 1 0 1 1 0-2h6V5a1 1 0 1 1 2 0v6z" />
        </svg>
      </Link>
    </AuthenticatedLayout>
  );
}