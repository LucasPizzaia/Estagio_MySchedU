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
    if (confirm('Excluir professor?')) {
      router.delete(`/professores/${id}`);
    }
  };

  return (
    <AuthenticatedLayout header={null} bgClass="bg-white">
      <Head title="Professores" />

      {/* HEADER PADRONIZADO IGUAL UC + SALAS */}
      <div className="max-w-6xl mx-auto mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-amber-700 tracking-tight">Professores</h1>
          <p className="text-gray-500 mt-1 text-sm">Gerencie cadastro e informações dos professores</p>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center gap-3">

          {/* BUSCA */}
          <div className="flex rounded-xl border border-amber-300 bg-white overflow-hidden shadow-sm">
            <span className="hidden sm:flex items-center px-3 text-sm text-gray-500">Buscar</span>
            <input
              className="w-full px-3 py-2 text-gray-800 outline-none"
              placeholder="Matrícula, nome ou e-mail..."
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
          </div>

          {/* ORDENAR */}
          <select
            className="rounded-xl border border-amber-300 bg-white px-3 py-2 text-gray-700 shadow-sm focus:ring-amber-500"
            value={order}
            onChange={(e) => setOrder(e.target.value)}
          >
            <option value="matricula">Ordenar: Matrícula</option>
            <option value="nome">Ordenar: Nome</option>
            <option value="sobrenome">Ordenar: Sobrenome</option>
            <option value="email">Ordenar: E-mail</option>
          </select>

          {/* BOTÃO NOVO */}
          <Link
            href="/professores/create"
            className="rounded-xl bg-amber-600 px-4 py-2 font-semibold text-white shadow-sm hover:bg-amber-700 transition"
          >
            Novo Professor
          </Link>
        </div>
      </div>

      {/* FLASH */}
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
                <th className="px-4 py-3 w-40">Matrícula</th>
                <th className="px-4 py-3">Nome</th>
                <th className="px-4 py-3">Sobrenome</th>
                <th className="px-4 py-3">E-mail</th>
                <th className="px-4 py-3 text-right w-48">Ações</th>
              </tr>
            </thead>

            <tbody>
              {list.map((p, i) => (
                <tr key={p.id} className={i % 2 ? "bg-amber-50/40" : "bg-white"}>
                  {/* Matrícula Chip */}
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center rounded-full bg-amber-100 px-2 py-1 text-xs font-semibold text-amber-800">
                      {p.matricula}
                    </span>
                  </td>

                  {/* Nome + Avatar */}
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-full bg-amber-600/10 text-amber-700 flex items-center justify-center font-bold">
                        {(p.nome?.[0] || 'P').toUpperCase()}
                      </div>
                      <div className="leading-tight">
                        <div className="font-medium text-gray-900">{p.nome}</div>
                        <div className="text-xs text-gray-500">ID #{p.id}</div>
                      </div>
                    </div>
                  </td>

                  {/* Sobrenome */}
                  <td className="px-4 py-3">{p.sobrenome}</td>

                  {/* Email */}
                  <td className="px-4 py-3">
                    <a className="text-amber-600 hover:underline" href={`mailto:${p.email}`}>
                      {p.email}
                    </a>
                  </td>

                  {/* AÇÕES */}
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-2">

                      {/* Editar */}
                      <Link
                        href={`/professores/${p.id}/edit`}
                        className="rounded-full bg-amber-600 px-4 py-1.5 text-sm font-medium text-white shadow-sm hover:bg-amber-700 transition"
                      >
                        Editar
                      </Link>

                      {/* Excluir */}
                      <button
                        onClick={() => del(p.id)}
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
                  <td colSpan="5" className="px-4 py-12 text-center text-gray-500">
                    Nenhum professor encontrado.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Botão Flutuante */}
      <Link
        href="/professores/create"
        className="fixed bottom-6 right-6 inline-flex items-center justify-center rounded-full bg-amber-600 text-white h-14 w-14 shadow-xl hover:bg-amber-700 transition"
      >
        <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
          <path d="M13 11h6a1 1 0 1 1 0 2h-6v6a1 1 0 1 1-2 0v-6H5a1 1 0 1 1 0-2h6V5a1 1 0 1 1 2 0v6z" />
        </svg>
      </Link>

    </AuthenticatedLayout>
  );
}
