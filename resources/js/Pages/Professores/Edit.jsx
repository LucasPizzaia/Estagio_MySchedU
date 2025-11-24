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
    <AuthenticatedLayout header={null} bgClass="bg-white">
      <Head title="Editar Professor" />

      {/* Cabeçalho Premium */}
      <div className="max-w-6xl mx-auto mb-10 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-amber-700 tracking-tight">
            Editar Professor
          </h1>
          <p className="text-gray-500 mt-1 text-sm">
            Atualize os dados deste professor.
          </p>
        </div>

        <Link
          href="/professores"
          className="rounded-lg border border-amber-600 px-4 py-2 font-semibold text-amber-700 hover:bg-amber-50 shadow-sm transition"
        >
          Voltar
        </Link>
      </div>

      {/* Card principal */}
      <form onSubmit={submit} className="max-w-6xl mx-auto space-y-8">
        <div className="rounded-2xl border border-amber-200 bg-white p-8 shadow-lg space-y-8">

          <div className="grid gap-6 sm:grid-cols-2">

            {/* Matrícula */}
            <div className="sm:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Matrícula <span className="text-amber-600">*</span>
              </label>
              <input
                className="w-full rounded-xl border border-amber-300 px-4 py-2.5 shadow-sm 
                focus:ring-2 focus:ring-amber-500 outline-none transition"
                value={data.matricula}
                onChange={(e) => setData('matricula', e.target.value)}
              />
              {errors.matricula && <p className="mt-1 text-sm text-red-600">{errors.matricula}</p>}
            </div>

            {/* Nome */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Nome <span className="text-amber-600">*</span>
              </label>
              <input
                className="w-full rounded-xl border border-amber-300 px-4 py-2.5 shadow-sm focus:ring-amber-500"
                value={data.nome}
                onChange={(e) => setData('nome', e.target.value)}
              />
              {errors.nome && <p className="mt-1 text-sm text-red-600">{errors.nome}</p>}
            </div>

            {/* Sobrenome */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Sobrenome <span className="text-amber-600">*</span>
              </label>
              <input
                className="w-full rounded-xl border border-amber-300 px-4 py-2.5 shadow-sm focus:ring-amber-500"
                value={data.sobrenome}
                onChange={(e) => setData('sobrenome', e.target.value)}
              />
              {errors.sobrenome && <p className="mt-1 text-sm text-red-600">{errors.sobrenome}</p>}
            </div>

            {/* Email */}
            <div className="sm:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                E-mail <span className="text-amber-600">*</span>
              </label>
              <input
                type="email"
                className="w-full rounded-xl border border-amber-300 px-4 py-2.5 shadow-sm focus:ring-amber-500"
                value={data.email}
                onChange={(e) => setData('email', e.target.value)}
              />
              {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
            </div>

            {/* UC's */}
            <div className="sm:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Unidades Curriculares
              </label>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {ucs.map((uc) => {
                  const checked = (data.ucs || []).includes(uc.id);

                  return (
                    <label
                      key={uc.id}
                      className="flex items-center gap-3 rounded-xl border border-amber-300 p-3 hover:bg-amber-50 transition"
                    >
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
                        <span className="mr-2 rounded-full bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-800">
                          {uc.codigo}
                        </span>
                        {uc.nome}
                      </span>
                    </label>
                  );
                })}
              </div>

              {errors.ucs && <p className="mt-1 text-sm text-red-600">{errors.ucs}</p>}
            </div>

            {/* Disponibilidade */}
            <div className="sm:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Disponibilidade (seg–sex)
              </label>

              <div className="rounded-xl border border-amber-300 overflow-hidden shadow-sm">
                <table className="w-full text-sm">
                  <thead className="bg-amber-50 text-amber-800">
                    <tr>
                      <th className="px-3 py-2 text-left">Dia</th>
                      {SLOTS.map((s) => (
                        <th key={s.key} className="px-3 py-2 text-left">
                          {s.label}
                        </th>
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
                              <label className="inline-flex items-center gap-2 text-gray-700">
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
                                Disponível
                              </label>
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {errors.availability && (
                <p className="mt-1 text-sm text-red-600">{errors.availability}</p>
              )}
            </div>
          </div>

          {/* AÇÕES */}
          <div className="flex justify-end gap-3 pt-2">
            <Link
              href="/professores"
              className="rounded-lg border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50 transition"
            >
              Cancelar
            </Link>

            <button
              type="submit"
              disabled={processing}
              className="rounded-lg bg-amber-600 px-6 py-2.5 text-white font-semibold shadow hover:bg-amber-700 transition disabled:opacity-50"
            >
              Atualizar
            </button>
          </div>

        </div>
      </form>
    </AuthenticatedLayout>
  );
}
