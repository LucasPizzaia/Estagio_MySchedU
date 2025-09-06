import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useMemo, useState } from 'react';

export default function Index({ unidades = [], flash }) {
  const [q, setQ] = useState('');
  const [order, setOrder] = useState('codigo'); // codigo | nome | grupo

  const list = useMemo(() => {
    let data = [...unidades];

    if (q) {
      const s = q.toLowerCase();
      data = data.filter(u =>
        (u.codigo || '').toLowerCase().includes(s) ||
        (u.nome || '').toLowerCase().includes(s) ||
        (u.grupo || '').toLowerCase().includes(s) ||
        String(u.carga_horaria || '').toLowerCase().includes(s) ||
        (u.metodo || '').toLowerCase().includes(s) ||
        (u.tipo || '').toLowerCase().includes(s)
      );
    }

    data.sort((a,b) => `${a[order]||''}`.localeCompare(`${b[order]||''}`));
    return data;
  }, [unidades, q, order]);

  const del = (id) => {
    if (confirm('Excluir unidade curricular?')) {
      router.delete(`/unidades-curriculares/${id}`);
    }
  };

  return (
    <AuthenticatedLayout header={null} bgClass="bg-amber-600">
      <Head title="Unidades Curriculares" />

      {/* Barra superior (transparente) — igual Professores */}
      <div className="mb-6 text-white">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-3xl font-extrabold leading-tight">Unidades Curriculares</h1>
            <p className="mt-1 text-white/90">Gerencie cadastro e dados de unidades curriculares</p>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <div className="flex overflow-hidden rounded-lg bg-white">
              <span className="hidden sm:inline-flex items-center px-3 text-sm text-gray-500">Buscar</span>
              <input
                className="w-full px-3 py-2 text-gray-800 outline-none"
                placeholder="Código, nome ou grupo..."
                value={q}
                onChange={e=>setQ(e.target.value)}
              />
            </div>

            <select
              className="rounded-lg bg-white text-gray-800 px-3 py-2"
              value={order}
              onChange={e=>setOrder(e.target.value)}
            >
              <option value="codigo">Ordenar: Código</option>
              <option value="nome">Ordenar: Nome</option>
              <option value="grupo">Ordenar: Grupo</option>
            </select>

            <Link
              href="/unidades-curriculares/create"
              className="inline-flex items-center justify-center rounded-lg bg-white px-4 py-2 font-semibold text-amber-700 shadow-sm hover:shadow transition"
            >
              <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24" fill="currentColor">
                <path d="M13 11h6a1 1 0 1 1 0 2h-6v6a1 1 0 1 1-2 0v-6H5a1 1 0 1 1 0-2h6V5a1 1 0 1 1 2 0v6z"/>
              </svg>
              Nova UC
            </Link>
          </div>
        </div>
      </div>

      {flash && (
        <div className="mb-4 rounded-lg border border-white/30 bg-white/10 px-4 py-2 text-white">
          {flash}
        </div>
      )}

      {/* Card branco com a lista — igual Professores */}
      <div className="rounded-2xl bg-white shadow-xl overflow-hidden">
        <div className="overflow-auto" style={{ maxHeight: '65vh' }}>
          <table className="w-full text-left">
            <thead className="sticky top-0 bg-amber-50">
              <tr className="text-gray-700">
                <th className="px-4 py-3 w-40">Código</th>
                <th className="px-4 py-3">Nome</th>
                <th className="px-4 py-3">Grupo</th>
                <th className="px-4 py-3 text-center">Carga Horária</th>
                <th className="px-4 py-3 text-center">Método</th>
                <th className="px-4 py-3 text-center">Tipo</th>
                <th className="px-4 py-3 text-right w-48">Ações</th>
              </tr>
            </thead>
            <tbody>
              {list.map((u, i) => (
                <tr key={u.id} className={i % 2 ? 'bg-amber-50/40' : 'bg-white'}>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center rounded-full bg-amber-100 px-2 py-1 text-xs font-semibold text-amber-800">
                      {u.codigo}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-full bg-amber-600/10 text-amber-700 flex items-center justify-center font-bold">
                        {(u.nome?.[0] || 'U').toUpperCase()}
                      </div>
                      <div className="leading-tight">
                        <div className="font-medium text-gray-900">{u.nome}</div>
                        <div className="text-xs text-gray-500">ID #{u.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">{u.grupo || '-'}</td>
                  <td className="px-4 py-3 text-center">{u.carga_horaria}h</td>
                  <td className="px-4 py-3 text-center">{u.metodo}</td>
                  <td className="px-4 py-3 text-center">{u.tipo}</td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      href={`/unidades-curriculares/${u.id}/edit`}
                      className="inline-flex items-center gap-1.5 rounded-full bg-amber-600 px-4 py-1.5 text-sm font-medium text-white shadow-sm ring-1 ring-amber-500/40 hover:bg-amber-700 hover:shadow transition"
                    >
                      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a1.003 1.003 0 0 0 0-1.42l-2.34-2.34a1.003 1.003 0 0 0-1.42 0l-1.83 1.83 3.75 3.75 1.84-1.82z"/>
                      </svg>
                      Editar
                    </Link>
                    <button
                      onClick={() => del(u.id)}
                      className="ml-2 inline-flex items-center gap-1.5 rounded-full bg-red-600 px-4 py-1.5 text-sm font-medium text-white shadow-sm ring-1 ring-red-500/40 hover:bg-red-700 hover:shadow transition"
                    >
                      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M6 7h12l-1 14H7L6 7zm3-3h6l1 3H8l1-3z"/>
                      </svg>
                      Excluir
                    </button>
                  </td>
                </tr>
              ))}

              {!list.length && (
                <tr>
                  <td colSpan="7" className="px-4 py-12 text-center text-gray-500">
                    Nenhuma UC encontrada.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Botão flutuante */}
      <Link
        href="/unidades-curriculares/create"
        className="fixed bottom-6 right-6 inline-flex items-center justify-center rounded-full bg-white text-amber-700 h-14 w-14 shadow-lg ring-1 ring-white/40 hover:shadow-xl transition"
        aria-label="Nova UC"
      >
        <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor"><path d="M13 11h6a1 1 0 1 1 0 2h-6v6a1 1 0 1 1-2 0v-6H5a1 1 0 1 1 0-2h6V5a1 1 0 1 1 2 0v6z"/></svg>
      </Link>
    </AuthenticatedLayout>
  );
}
