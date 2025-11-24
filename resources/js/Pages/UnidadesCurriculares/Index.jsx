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
        String(u.carga_horaria || '').includes(s)
      );
    }

    data.sort((a, b) => `${a[order] || ''}`.localeCompare(`${b[order] || ''}`));
    return data;
  }, [unidades, q, order]);

  const del = (id) => {
    if (confirm('Excluir unidade curricular?')) {
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
            Gerencie as unidades curriculares cadastradas.
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
              placeholder="Código, nome ou grupo..."
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
            <option value="grupo">Ordenar: Grupo</option>
          </select>

          {/* BOTÃO NOVA UC */}
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
                <tr
                  key={u.id}
                  className={i % 2 === 0 ? "bg-white" : "bg-amber-50/40"}
                >
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
                      <div>
                        <div className="font-medium text-gray-900">{u.nome}</div>
                        <div className="text-xs text-gray-500">ID #{u.id}</div>
                      </div>
                    </div>
                  </td>

                  <td className="px-4 py-3">{u.grupo || '-'}</td>
                  <td className="px-4 py-3 text-center">{u.carga_horaria}h</td>
                  <td className="px-4 py-3 text-center capitalize">{u.metodo}</td>
                  <td className="px-4 py-3 text-center capitalize">{u.tipo}</td>

                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-2">
                      <Link
                        href={`/unidades-curriculares/${u.id}/edit`}
                        className="rounded-full bg-amber-600 px-4 py-1.5 text-sm font-medium text-white shadow-sm hover:bg-amber-700 transition"
                      >
                        Editar
                      </Link>

                      <button
                        onClick={() => del(u.id)}
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
                  <td
                    colSpan="7"
                    className="px-4 py-12 text-center text-gray-500"
                  >
                    Nenhuma unidade curricular encontrada.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* BOTÃO FLUTUANTE */}
      <Link
        href="/unidades-curriculares/create"
        className="fixed bottom-6 right-6 inline-flex items-center justify-center rounded-full bg-amber-600 text-white h-14 w-14 shadow-xl hover:bg-amber-700 transition"
        aria-label="Nova UC"
      >
        <svg
          className="h-6 w-6"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M13 11h6a1 1 0 1 1 0 2h-6v6a1 1 0 1 1-2 0v-6H5a1 1 0 1 1 0-2h6V5a1 1 0 1 1 2 0v6z" />
        </svg>
      </Link>
    </AuthenticatedLayout>
  );
}
