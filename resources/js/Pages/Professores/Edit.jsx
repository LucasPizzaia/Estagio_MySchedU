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
    <AuthenticatedLayout header={<h2 className="text-xl font-semibold text-gray-800">Editar Professor</h2>}>
      <Head title="Editar Professor" />

      <form onSubmit={submit} className="max-w-2xl space-y-4">
        <div>
          <label className="block text-sm font-medium">Matrícula</label>
          <input className="mt-1 w-full rounded border px-3 py-2"
                 value={data.matricula} onChange={e=>setData('matricula', e.target.value)} />
          {errors.matricula && <p className="text-sm text-red-600">{errors.matricula}</p>}
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium">Nome</label>
            <input className="mt-1 w-full rounded border px-3 py-2"
                   value={data.nome} onChange={e=>setData('nome', e.target.value)} />
            {errors.nome && <p className="text-sm text-red-600">{errors.nome}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium">Sobrenome</label>
            <input className="mt-1 w-full rounded border px-3 py-2"
                   value={data.sobrenome} onChange={e=>setData('sobrenome', e.target.value)} />
            {errors.sobrenome && <p className="text-sm text-red-600">{errors.sobrenome}</p>}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium">E-mail</label>
          <input type="email" className="mt-1 w-full rounded border px-3 py-2"
                 value={data.email} onChange={e=>setData('email', e.target.value)} />
          {errors.email && <p className="text-sm text-red-600">{errors.email}</p>}
        </div>

        <div className="flex gap-2">
          <Link href="/professores" className="rounded border px-4 py-2">Cancelar</Link>
          <button disabled={processing} className="rounded bg-amber-600 px-4 py-2 text-white hover:bg-amber-700 disabled:opacity-50">
            Atualizar
          </button>
        </div>
      </form>
    </AuthenticatedLayout>
  );
}
