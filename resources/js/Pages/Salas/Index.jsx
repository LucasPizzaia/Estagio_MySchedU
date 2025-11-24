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
    if (confirm('Tem certeza que deseja excluir esta sala?')) {
      router.delete(`/salas/${id}`);
    }
  };

  return (
    <AuthenticatedLayout header={null} bgClass="bg-white">
      <Head title="Salas" />

      {/* HEADER IGUAL UC */}
      <div className="max-w-6xl mx-auto mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-amber-700 tracking-tight">Salas</h1>
          <p className="text-gray-500 mt-1 text-sm">Gerencie as salas disponíveis e sua capacidade.</p>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center gap-3">

          {/* Busca */}
          <div className="flex rounded-xl border border-amber-300 bg-white overflow-hidden shadow-sm">
            <span className="hidden sm:flex items-center px-3 text-sm text-gray-500">
              Buscar
            </span>
            <input
              className="w-full px-3 py-2 text-gray-800 outline-none"
              placeholder="Nome, local ou capacidade..."
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
          </div>

          {/* Ordenação */}
          <select
            className="rounded-xl border border-amber-300 bg-white px-3 py-2 text-gray-700 shadow-sm focus:ring-amber-500"
            value={order}
            onChange={(e) => setOrder(e.target.value)}
          >
            <option value="nome">Ordenar: Nome</option>
            <option value="local">Ordenar: Local</option>
            <option value="quantidade_lugares">Ordenar: Capacidade</option>
          </select>

          {/* Botão nova sala */}
          <Link
            href="/salas/create"
            className="rounded-xl bg-amber-600 px-4 py-2 font-semibold text-white shadow-sm hover:bg-amber-700 transition"
          >
            Nova Sala
          </Link>
        </div>
      </div>

      {/* Flash message */}
      {flash && (
        <div className="max-w-6xl mx-auto mb-4 rounded-xl border border-amber-300 bg-amber-50 px-4 py-2 text-amber-800 shadow-sm">
          {flash}
        </div>
      )}

      {/* CARD PRINCIPAL IGUAL UC */}
      <div className="max-w-6xl mx-auto rounded-2xl border border-amber-200 bg-white shadow-lg overflow-hidden">
        <div className="overflow-auto" style={{ maxHeight: '65vh' }}>
          <table className="w-full text-left">
            <thead className="sticky top-0 bg-amber-50 border-b border-amber-200">
              <tr className="text-gray-700">
                <th className="px-4 py-3">Nome</th>
                <th className="px-4 py-3">Local</th>
                <th className="px-4 py-3 text-center">Capacidade</th>
                <th className="px-4 py-3 text-right w-48">Ações</th>
              </tr>
            </thead>

            <tbody>
              {list.map((sala, i) => (
                <tr key={sala.id} className={i % 2 === 0 ? "bg-white" : "bg-amber-50/40"}>
                  <td className="px-4 py-3 font-medium text-gray-900">{sala.nome}</td>
                  <td className="px-4 py-3">{sala.local}</td>
                  <td className="px-4 py-3 text-center">{sala.quantidade_lugares}</td>

                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-2">
                      {/* Editar */}
                      <Link
                        href={`/salas/${sala.id}/edit`}
                        className="rounded-full bg-amber-600 px-4 py-1.5 text-sm font-medium text-white shadow-sm hover:bg-amber-700 transition"
                      >
                        Editar
                      </Link>

                      {/* Excluir */}
                      <button
                        onClick={() => del(sala.id)}
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
                    Nenhuma sala encontrada.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Botão flutuante (igual UC) */}
      <Link
        href="/salas/create"
        className="fixed bottom-6 right-6 inline-flex items-center justify-center rounded-full bg-amber-600 text-white h-14 w-14 shadow-xl hover:bg-amber-700 transition"
        aria-label="Nova Sala"
      >
        <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
          <path d="M13 11h6a1 1 0 1 1 0 2h-6v6a1 1 0 1 1-2 0v-6H5a1 1 0 1 1 0-2h6V5a1 1 0 1 1 2 0v6z" />
        </svg>
      </Link>

    </AuthenticatedLayout>
  );
}
