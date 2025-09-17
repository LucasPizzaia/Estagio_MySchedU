import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm, usePage, router } from '@inertiajs/react';

const DAYS = [
  { key: 'mon', label: 'Seg' },
  { key: 'tue', label: 'Ter' },
  { key: 'wed', label: 'Qua' },
  { key: 'thu', label: 'Qui' },
  { key: 'fri', label: 'Sex' },
];

const SLOTS = [
  { key: 's1', label: '19:00–20:30' },
  { key: 's2', label: '20:45–22:10' },
];

export default function Edit({ professor, ucs = [], ucs_ids = [], disp = {} }) {
  const { errors } = usePage().props;

  const safeUcsIds = Array.isArray(ucs_ids) ? ucs_ids : [];
  const safeDisp = {
    mon: Array.isArray(disp?.mon) ? disp.mon : [],
    tue: Array.isArray(disp?.tue) ? disp.tue : [],
    wed: Array.isArray(disp?.wed) ? disp.wed : [],
    thu: Array.isArray(disp?.thu) ? disp.thu : [],
    fri: Array.isArray(disp?.fri) ? disp.fri : [],
  };

  const { data, setData, processing } = useForm({
    matricula: professor?.matricula ?? '',
    nome: professor?.nome ?? '',
    sobrenome: professor?.sobrenome ?? '',
    email: professor?.email ?? '',
    ucs: safeUcsIds,
    availability: safeDisp,
  });

  function submit(e) {
    e.preventDefault();
    router.put(`/professores/${professor.id}`, data, { preserveScroll: true });
  }

  return (
    <AuthenticatedLayout header={null} bgClass="bg-amber-600">
      <Head title="Editar Professor" />

      <div className="-mx-4 sm:-mx-6 lg:-mx-8 mb-6">
        <div className="bg-gradient-to-r from-amber-600 to-amber-500 text-white px-4 sm:px-6 lg:px-8 py-6 shadow">
          <div className="mx-auto max-w-7xl flex items-center justify-between">
            <h2 className="text-3xl font-extrabold">Editar Professor</h2>
            <Link href="/professores" className="rounded-lg bg-white px-4 py-2 font-semibold text-amber-700 shadow-sm hover:shadow transition">
              Voltar
            </Link>
          </div>
        </div>
      </div>

      {/* Centralização do card */}
      <div className="flex justify-center items-center min-h-screen">
        <form onSubmit={submit} className="max-w-5xl w-full">
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

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">Unidades Curriculares que pode ministrar</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {ucs.map((uc) => {
                  const checked = (data.ucs || []).includes(uc.id);
                  return (
                    <label key={uc.id} className="flex items-center gap-3 rounded-lg border px-3 py-2">
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={(e) => {
                          const set = new Set(data.ucs || []);
                          e.target.checked ? set.add(uc.id) : set.delete(uc.id);
                          setData('ucs', Array.from(set));
                        }}
                      />
                      <span className="text-gray-800">
                        <span className="mr-2 rounded-full bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-800">{uc.codigo}</span>
                        {uc.nome}
                      </span>
                    </label>
                  );
                })}
              </div>
              {errors.ucs && <p className="mt-1 text-sm text-red-600">{errors.ucs}</p>}
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">Disponibilidade (seg–sex)</label>
              <div className="overflow-hidden rounded-lg border">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-3 py-2 text-left">Dia</th>
                      {SLOTS.map((s) => (
                        <th key={s.key} className="px-3 py-2 text-left">{s.label}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {DAYS.map((d) => (
                      <tr key={d.key} className="border-t">
                        <td className="px-3 py-2 font-medium">{d.label}</td>
                        {SLOTS.map((s) => {
                          const checked = (data.availability?.[d.key] || []).includes(s.key);
                          return (
                            <td key={s.key} className="px-3 py-2">
                              <label className="inline-flex items-center gap-2">
                                <input
                                  type="checkbox"
                                  checked={checked}
                                  onChange={(e) => {
                                    const arr = new Set(data.availability?.[d.key] || []);
                                    e.target.checked ? arr.add(s.key) : arr.delete(s.key);
                                    setData('availability', {
                                      ...data.availability,
                                      [d.key]: Array.from(arr),
                                    });
                                  }}
                                />
                                <span className="text-gray-700">Disponível</span>
                              </label>
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="mt-1 text-xs text-gray-500">S1: 19:00–20:30 • S2: 20:45–22:10</p>
              {errors.availability && <p className="mt-1 text-sm text-red-600">{errors.availability}</p>}
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
                Atualizar
              </button>
            </div>
          </div>
        </form>
      </div>
    </AuthenticatedLayout>
  );
}
