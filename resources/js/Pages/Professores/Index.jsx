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
    <AuthenticatedLayout header={<h2 className="text-xl font-semibold text-gray-800">Professores</h2>}>
      <Head title="Professores" />

      {flash && <div className="mb-4 rounded border border-green-200 bg-green-50 px-4 py-2 text-green-700">{flash}</div>}

      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-2">
          <input
            className="rounded border px-3 py-2"
            placeholder="Buscar por matrícula, nome, e-mail..."
            value={q}
            onChange={e=>setQ(e.target.value)}
          />
          <select className="rounded border px-3 py-2" value={order} onChange={e=>setOrder(e.target.value)}>
            <option value="matricula">Matrícula</option>
            <option value="nome">Nome</option>
            <option value="sobrenome">Sobrenome</option>
            <option value="email">E-mail</option>
          </select>
        </div>

        <Link href="/professores/create" className="rounded bg-amber-600 px-4 py-2 text-white hover:bg-amber-700">
          + Novo Professor
        </Link>
      </div>

      <div className="overflow-hidden rounded border">
        <table className="w-full table-auto">
          <thead className="bg-gray-50">
            <tr className="text-left">
              <th className="px-4 py-3">Matrícula</th>
              <th className="px-4 py-3">Nome</th>
              <th className="px-4 py-3">Sobrenome</th>
              <th className="px-4 py-3">E-mail</th>
              <th className="px-4 py-3 text-right">Ações</th>
            </tr>
          </thead>
          <tbody>
            {list.map(p => (
              <tr key={p.id} className="border-t">
                <td className="px-4 py-3 font-medium">{p.matricula}</td>
                <td className="px-4 py-3">{p.nome}</td>
                <td className="px-4 py-3">{p.sobrenome}</td>
                <td className="px-4 py-3">
                  <a className="text-amber-700 hover:underline" href={`mailto:${p.email}`}>{p.email}</a>
                </td>
                <td className="px-4 py-3 text-right">
                  <Link href={`/professores/${p.id}/edit`} className="rounded border px-3 py-1 hover:bg-gray-50">
                    Editar
                  </Link>
                  <button onClick={() => del(p.id)} className="ml-2 rounded border px-3 py-1 hover:bg-red-50">
                    Excluir
                  </button>
                </td>
              </tr>
            ))}
            {!list.length && (
              <tr><td className="px-4 py-8 text-center text-gray-500" colSpan="5">Nenhum professor encontrado.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </AuthenticatedLayout>
  );
}
