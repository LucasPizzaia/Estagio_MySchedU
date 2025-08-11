import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Edit({ professor }) {
  const { data, setData, put, processing, errors } = useForm({
    matricula: professor.matricula || '',
    nome: professor.nome || '',
    sobrenome: professor.sobrenome || '',
    email: professor.email || '',
  });

  function submit(e) {
    e.preventDefault();
    put(`/professores/${professor.id}`);
  }

  return (
    <AuthenticatedLayout header={null} bgClass="bg-amber-600">
      <Head title="Editar Professor" />

      {/* Cabeçalho compacto */}
      <div className="mb-6 text-white">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-extrabold">Editar Professor</h2>
          <Link href="/professores" className="rounded-lg bg-white px-4 py-2 font-semibold text-amber-700 shadow-sm hover:shadow transition">
            Voltar
          </Link>
        </div>
      </div>

      {/* Card do formulário */}
      <form onSubmit={submit} className="max-w-3xl">
        <div className="rounded-2xl bg-white p-6 shadow-xl space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Matrícula</label>
            <input
              className="mt-1 w-full rounded-lg border px-3 py-2 outline-none focus:ring-2 focus:ring-amber-500"
              value={data.matricula}
              onChange={(e) => setData('matricula', e.target.value)}
            />
            {errors.matricula && <p className="mt-1 text-sm text-red-600">{errors.matricula}</p>}
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700">Nome</label>
              <input
                className="mt-1 w-full rounded-lg border px-3 py-2 outline-none focus:ring-2 focus:ring-amber-500"
                value={data.nome}
                onChange={(e) => setData('nome', e.target.value)}
              />
              {errors.nome && <p className="mt-1 text-sm text-red-600">{errors.nome}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Sobrenome</label>
              <input
                className="mt-1 w-full rounded-lg border px-3 py-2 outline-none focus:ring-2 focus:ring-amber-500"
                value={data.sobrenome}
                onChange={(e) => setData('sobrenome', e.target.value)}
              />
              {errors.sobrenome && <p className="mt-1 text-sm text-red-600">{errors.sobrenome}</p>}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">E-mail</label>
            <input
              type="email"
              className="mt-1 w-full rounded-lg border px-3 py-2 outline-none focus:ring-2 focus:ring-amber-500"
              value={data.email}
              onChange={(e) => setData('email', e.target.value)}
            />
            {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
          </div>

          <div className="flex gap-2">
            <Link href="/professores" className="rounded-lg border px-4 py-2 text-gray-700 hover:bg-gray-50">
              Cancelar
            </Link>
            <button
              type="submit"
              disabled={processing}
              className="inline-flex items-center gap-2 rounded-lg bg-amber-600 px-5 py-2.5 font-semibold text-white shadow-sm ring-1 ring-amber-500/40 hover:bg-amber-700 hover:shadow transition disabled:opacity-60"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor"><path d="M5 5h14v4H5zM5 11h14v2H5zM5 15h10v4H5z"/></svg>
              Atualizar
            </button>
          </div>
        </div>
      </form>
    </AuthenticatedLayout>
  );
}
