import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm, usePage } from '@inertiajs/react';

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

export default function Create({ ucs = [] }) {
  const { errors } = usePage().props;

  const { data, setData, post, processing, reset } = useForm({
    matricula: '',
    nome: '',
    sobrenome: '',
    email: '',
    ucs: [],
    availability: { mon: [], tue: [], wed: [], thu: [], fri: [] }, // Inicializando com valores vazios
  });

  function submit(e) {
    e.preventDefault();
    post('/professores', {
      onSuccess: () => reset('matricula', 'nome', 'sobrenome', 'email', 'ucs', 'availability'),
    });
  }

  return (
    <AuthenticatedLayout header={null}>
      <Head title="Cadastrar Professor" />
      {/* Faixa laranja */}
      <div className="-mx-4 sm:-mx-6 lg:-mx-8 mb-6">
        <div className="bg-gradient-to-r from-amber-600 to-amber-500 text-white px-4 sm:px-6 lg:px-8 py-6 shadow">
          <div className="mx-auto max-w-7xl flex items-center justify-between">
            <h2 className="text-2xl font-bold">Cadastrar Professor</h2>
            <Link href="/professores" className="rounded-md bg-white/95 px-4 py-2 font-semibold text-amber-700 hover:bg-white">
              Voltar
            </Link>
          </div>
        </div>
      </div>

      {/* Card de formulário */}
      <form onSubmit={submit} className="max-w-5xl space-y-6">
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

            {/* UCs ministráveis */}
            <div className="sm:col-span-2">
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

            {/* Disponibilidade seg–sex × 2 horários */}
            <div className="sm:col-span-2">
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
          </div>

          <div className="mt-6 flex gap-2">
            <Link href="/professores" className="rounded-lg border px-4 py-2 text-gray-700 hover:bg-gray-50">
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
