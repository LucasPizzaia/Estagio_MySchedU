import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Create() {
  const { data, setData, post, processing, errors, reset } = useForm({
    matricula: '',
    nome: '',
    sobrenome: '',
    email: '',
  });

  function submit(e) {
    e.preventDefault();
    post('/professores', {
      onSuccess: () => reset('matricula','nome','sobrenome','email'),
    });
  }

  return (
    <AuthenticatedLayout header={null}>
      <Head title="Cadastrar Professor" />

      {/* Faixa laranja */}
      <div className="-mx-4 sm:-mx-6 lg:-mx-8 mb-6">
        <div className="bg-gradient-to-r from-amber-600 to-amber-500 text-white px-4 sm:px-6 lg:px-8 py-6 shadow">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <h2 className="text-2xl font-bold">Cadastrar Professor</h2>
            <Link href="/professores" className="rounded-md bg-white/95 px-4 py-2 font-semibold text-amber-700 hover:bg-white">
              Voltar
            </Link>
          </div>
        </div>
      </div>

      {/* Card de formulário */}
      <form onSubmit={submit} className="max-w-3xl space-y-6">
        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700">Matrícula</label>
              <input
                className="mt-1 w-full rounded border px-3 py-2 outline-none focus:ring-2 focus:ring-amber-500"
                value={data.matricula}
                onChange={(e) => setData('matricula', e.target.value)}
                placeholder="EX: P2025-001"
              />
              {errors.matricula && <p className="mt-1 text-sm text-red-600">{errors.matricula}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Nome</label>
              <input
                className="mt-1 w-full rounded border px-3 py-2 outline-none focus:ring-2 focus:ring-amber-500"
                value={data.nome}
                onChange={(e) => setData('nome', e.target.value)}
                placeholder="Nome"
              />
              {errors.nome && <p className="mt-1 text-sm text-red-600">{errors.nome}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Sobrenome</label>
              <input
                className="mt-1 w-full rounded border px-3 py-2 outline-none focus:ring-2 focus:ring-amber-500"
                value={data.sobrenome}
                onChange={(e) => setData('sobrenome', e.target.value)}
                placeholder="Sobrenome"
              />
              {errors.sobrenome && <p className="mt-1 text-sm text-red-600">{errors.sobrenome}</p>}
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700">E-mail</label>
              <input
                type="email"
                className="mt-1 w-full rounded border px-3 py-2 outline-none focus:ring-2 focus:ring-amber-500"
                value={data.email}
                onChange={(e) => setData('email', e.target.value)}
                placeholder="exemplo@instituicao.edu"
              />
              {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
            </div>
          </div>

          <div className="mt-6 flex gap-2">
            <Link href="/professores" className="rounded border px-4 py-2 text-gray-700 hover:bg-gray-50">
              Cancelar
            </Link>
            <button
              type="submit"
              disabled={processing}
              className="rounded bg-amber-600 px-5 py-2 font-medium text-white hover:bg-amber-700 disabled:opacity-50"
            >
              Salvar
            </button>
          </div>
        </div>
      </form>
    </AuthenticatedLayout>
  );
}
