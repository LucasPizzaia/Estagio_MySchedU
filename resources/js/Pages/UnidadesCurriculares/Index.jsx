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
        (u.grupo || '').toLowerCase().includes(s) ||
        (u.metodo || '').toLowerCase().includes(s) || // Busca por curso
        String(u.carga_horaria || '').includes(s)
      );
    }

    data.sort((a, b) => `${a[order] || ''}`.localeCompare(`${b[order] || ''}`));
    return data;
  }, [unidades, q, order]);

  const del = (id) => {
    if (confirm('Excluir esta unidade curricular?')) {
      router.delete(`/unidades-curriculares/${id}`);
    }
  };

  return (
    <AuthenticatedLayout header={null} bgClass="bg-white">
      <Head title="Unidades Curriculares" />

      {/* HEADER ELEGANTE */}
      <div className="max-w-6xl mx-auto mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-amber-700 tracking-tight">
            Unidades Curriculares
          </h1>
          <p className="text-gray-500 mt-1 text-sm">
            Gerencie as UCs e sua abrangência entre os cursos de TI.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          {/* BUSCA */}
          <div className="flex rounded-xl border border-amber-300 bg-white overflow-hidden shadow-sm">
            <span className="hidden sm:flex items-center px-3 text-sm text-gray-500">
              Buscar
            </span>
            <input
              className="w-full px-3 py-2 text-gray-800 outline-none"
              placeholder="Código, nome, curso..."
              value={q}
              onChange={e => setQ(e.target.value)}
            />
          </div>

          {/* ORDENAR */}
          <select
            className="rounded-xl border border-amber-300 bg-white px-3 py-2 text-gray-700 shadow-sm focus:ring-amber-500"
            value={order}
            onChange={e => setOrder(e.target.value)}
          >
            <option value="codigo">Ordenar: Código</option>
            <option value="nome">Ordenar: Nome</option>
            <option value="metodo">Ordenar: Curso</option>
          </select>

          <Link
            href="/unidades-curriculares/create"
            className="rounded-xl bg-amber-600 px-4 py-2 font-semibold text-white shadow-sm hover:bg-amber-700 transition"
          >
            Nova UC
          </Link>
        </div>
      </div>

      {flash && (
        <div className="max-w-6xl mx-auto mb-4 rounded-xl border border-amber-300 bg-amber-50 px-4 py-2 text-amber-800 shadow-sm">
          {flash}
        </div>
      )}

      {/* CARD PRINCIPAL */}
      <div className="max-w-6xl mx-auto rounded-2xl border border-amber-200 bg-white shadow-lg overflow-hidden">
        <div className="overflow-auto" style={{ maxHeight: '65vh' }}>
          <table className="w-full text-left">
            <thead className="sticky top-0 bg-amber-50 border-b border-amber-200">
              <tr className="text-gray-700 font-bold text-sm uppercase tracking-wider">
                <th className="px-4 py-4 w-40">Código</th>
                <th className="px-4 py-4">Unidade Curricular</th>
                <th className="px-4 py-4 text-center">Carga</th>
                <th className="px-4 py-4">Abrangência / Curso</th>
                <th className="px-4 py-4 text-center">Tipo</th>
                <th className="px-4 py-4 text-right w-48">Ações</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-amber-100">
              {list.map((u, i) => (
                <tr
                  key={u.id}
                  className="hover:bg-amber-50/50 transition-colors"
                >
                  <td className="px-4 py-4">
                    <span className="inline-flex items-center rounded-lg bg-amber-100 px-2.5 py-1 text-xs font-bold text-amber-800 border border-amber-200">
                      {u.codigo}
                    </span>
                  </td>

                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-xl bg-amber-600/10 text-amber-700 flex items-center justify-center font-bold border border-amber-200">
                        {(u.nome?.[0] || 'U').toUpperCase()}
                      </div>
                      <div>
                        <div className="font-bold text-gray-900 leading-tight">{u.nome}</div>
                        <div className="text-[10px] text-gray-400 font-mono mt-0.5 uppercase tracking-tighter">Grupo: {u.grupo || 'Geral'}</div>
                      </div>
                    </div>
                  </td>

                  <td className="px-4 py-4 text-center font-medium text-gray-600 italic">
                    {u.carga_horaria}h
                  </td>

                  <td className="px-4 py-4">
                    <span className={`px-3 py-1 rounded-full text-[11px] font-bold ${
                      u.metodo === 'Ambas' 
                        ? 'bg-purple-100 text-purple-700 border border-purple-200' 
                        : 'bg-blue-100 text-blue-700 border border-blue-200'
                    }`}>
                      {u.metodo}
                    </span>
                  </td>

                  <td className="px-4 py-4 text-center">
                    <span className="text-xs font-semibold text-gray-500 uppercase px-2 py-1 bg-gray-100 rounded-md">
                      {u.tipo}
                    </span>
                  </td>

                  <td className="px-4 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <Link
                        href={`/unidades-curriculares/${u.id}/edit`}
                        className="p-2 text-amber-600 hover:bg-amber-100 rounded-lg transition"
                        title="Editar"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/></svg>
                      </Link>

                      <button
                        onClick={() => del(u.id)}
                        className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition"
                        title="Excluir"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}