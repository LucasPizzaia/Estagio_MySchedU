import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Edit({ turma }) {
  const { data, setData, put, processing, errors } = useForm({
    sala: turma.sala || '',
    lugares: turma.lugares || '',
    campus: turma.campus || 'IPOLON',
  });

  const submit = (e) => {
    e.preventDefault();
    put(`/turmas/${turma.id}`);
  };

  return (
    <AuthenticatedLayout header={null} bgClass="bg-amber-600">
      <Head title="Editar Turma" />

      <div className="mb-6 text-white flex items-center justify-between">
        <h2 className="text-3xl font-extrabold">Editar Turma</h2>
        <Link href="/turmas" className="rounded-lg bg-white px-4 py-2 font-semibold text-amber-700 shadow-sm hover:shadow transition">
          Voltar
        </Link>
      </div>

      <form onSubmit={submit} className="max-w-3xl">
        <div className="rounded-2xl bg-white p-6 shadow-xl space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Sala (nome/número)</label>
            <input
              className="mt-1 w-full rounded-lg border px-3 py-2 outline-none focus:ring-2 focus:ring-amber-500"
              value={data.sala}
              onChange={(e) => setData('sala', e.target.value)}
            />
            {errors.sala && <p className="mt-1 text-sm text-red-600">{errors.sala}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Lugares</label>
            <input
              type="number"
              min="1"
              className="mt-1 w-40 rounded-lg border px-3 py-2 outline-none focus:ring-2 focus:ring-amber-500"
              value={data.lugares}
              onChange={(e) => setData('lugares', e.target.value)}
            />
            {errors.lugares && <p className="mt-1 text-sm text-red-600">{errors.lugares}</p>}
          </div>

          <div>
            <span className="block text-sm font-medium text-gray-700 mb-1">Campus</span>
            <div className="flex gap-3">
              <label className="inline-flex items-center gap-2">
                <input
                  type="radio"
                  name="campus"
                  value="IPOLON"
                  checked={data.campus === 'IPOLON'}
                  onChange={(e) => setData('campus', e.target.value)}
                  className="h-4 w-4 text-amber-600 focus:ring-amber-500"
                />
                Campus Ipolon
              </label>
              <label className="inline-flex items-center gap-2">
                <input
                  type="radio"
                  name="campus"
                  value="SEDE"
                  checked={data.campus === 'SEDE'}
                  onChange={(e) => setData('campus', e.target.value)}
                  className="h-4 w-4 text-amber-600 focus:ring-amber-500"
                />
                Campus Sede
              </label>
            </div>
            {errors.campus && <p className="mt-1 text-sm text-red-600">{errors.campus}</p>}
          </div>

          <div className="flex gap-2">
            <Link href="/turmas" className="rounded-lg border px-4 py-2 text-gray-700 hover:bg-gray-50">Cancelar</Link>
            <button
              type="submit"
              disabled={processing}
              className="inline-flex items-center gap-2 rounded-lg bg-amber-600 px-5 py-2.5 font-semibold text-white shadow-sm ring-1 ring-amber-500/40 hover:bg-amber-700 hover:shadow transition disabled:opacity-60"
            >
              Atualizar
            </button>
          </div>
        </div>
      </form>
    </AuthenticatedLayout>
  );
}
