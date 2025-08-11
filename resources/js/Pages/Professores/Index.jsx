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
    data.sort((a,b) => `${a[order]||''}`.localeCompare(`${b[order]||''}`));
    return data;
  }, [professores, q, order]);

  const del = (id) => {
    if (confirm('Excluir professor?')) {
      router.delete(`/professores/${id}`);
    }
  };

  return (
    <AuthenticatedLayout header={null} bgClass="bg-amber-600">
      <Head title="Professores" />

      {/* Barra superior (transparente) */}
      <div className="mb-6 text-white">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-3xl font-extrabold leading-tight">Professores</h1>
            <p className="text-white/90 mt-1">Gerencie cadastro e dados de professores</p>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <div className="flex rounded-lg overflow-hidden bg-white">
              <span className="hidden sm:inline-flex items-center px-3 text-sm text-gray-500">Buscar</span>
              <input
                className="w-full px-3 py-2 text-gray-800 outline-none"
                placeholder="Matrícula, nome ou e-mail..."
                value={q}
                onChange={e=>setQ(e.target.value)}
              />
            </div>
            <select
              className="rounded-lg bg-white text-gray-800 px-3 py-2"
              value={order}
              onChange={e=>setOrder(e.target.value)}
            >
              <option value="matricula">Ordenar: Matrícula</option>
              <option value="nome">Ordenar: Nome</option>
              <option value="sobrenome">Ordenar: Sobrenome</option>
              <option value="email">Ordenar: E-mail</option>
            </select>

            <Link
              href="/professores/create"
              className="inline-flex items-center justify-center rounded-lg bg-white px-4 py-2 font-semibold text-amber-700 shadow-sm hover:shadow transition"
            >
              <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24" fill="currentColor"><path d="M13 11h6a1 1 0 1 1 0 2h-6v6a1 1 0 1 1-2 0v-6H5a1 1 0 1 1 0-2h6V5a1 1 0 1 1 2 0v6z"/></svg>
              Novo Professor
            </Link>
          </div>
        </div>
      </div>

      {flash && (
        <div className="mb-4 rounded-lg border border-white/30 bg-white/10 px-4 py-2 text-white">
          {flash}
        </div>
      )}

      {/* Card branco com a lista */}
      <div className="rounded-2xl bg-white shadow-xl overflow-hidden">
        <div className="overflow-auto" style={{ maxHeight: '65vh' }}>
          <table className="w-full text-left">
            <thead className="sticky top-0 bg-amber-50">
              <tr className="text-gray-700">
                <th className="px-4 py-3 w-40">Matrícula</th>
                <th className="px-4 py-3">Professor</th>
                <th className="px-4 py-3">Sobrenome</th>
                <th className="px-4 py-3">E-mail</th>
                <th className="px-4 py-3 text-right w-48">Ações</th>
              </tr>
            </thead>
            <tbody>
              {list.map((p, i) => (
                <tr key={p.id} className={i % 2 ? 'bg-amber-50/40' : 'bg-white'}>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center rounded-full bg-amber-100 px-2 py-1 text-xs font-semibold text-amber-800">
                      {p.matricula}
                    </span>
                  </td>
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
                  <td className="px-4 py-3">{p.sobrenome}</td>
                  <td className="px-4 py-3">
                    <a className="text-amber-700 hover:underline" href={`mailto:${p.email}`}>{p.email}</a>
                  </td>
                  <td className="px-4 py-3 text-right">
                    {/* Botões modernos */}
                    <Link
                      href={`/professores/${p.id}/edit`}
                      className="inline-flex items-center gap-1.5 rounded-full bg-amber-600 px-4 py-1.5 text-sm font-medium text-white shadow-sm ring-1 ring-amber-500/40 hover:bg-amber-700 hover:shadow transition"
                    >
                      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a1.003 1.003 0 0 0 0-1.42l-2.34-2.34a1.003 1.003 0 0 0-1.42 0l-1.83 1.83 3.75 3.75 1.84-1.82z"/></svg>
                      Editar
                    </Link>
                    <button
                      onClick={() => del(p.id)}
                      className="ml-2 inline-flex items-center gap-1.5 rounded-full bg-red-600 px-4 py-1.5 text-sm font-medium text-white shadow-sm ring-1 ring-red-500/40 hover:bg-red-700 hover:shadow transition"
                    >
                      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor"><path d="M6 7h12l-1 14H7L6 7zm3-3h6l1 3H8l1-3z"/></svg>
                      Excluir
                    </button>
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

      {/* Botão flutuante */}
      <Link
        href="/professores/create"
        className="fixed bottom-6 right-6 inline-flex items-center justify-center rounded-full bg-white text-amber-700 h-14 w-14 shadow-lg ring-1 ring-white/40 hover:shadow-xl transition"
        aria-label="Novo Professor"
      >
        <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor"><path d="M13 11h6a1 1 0 1 1 0 2h-6v6a1 1 0 1 1-2 0v-6H5a1 1 0 1 1 0-2h6V5a1 1 0 1 1 2 0v6z"/></svg>
      </Link>
    </AuthenticatedLayout>
  );
}
