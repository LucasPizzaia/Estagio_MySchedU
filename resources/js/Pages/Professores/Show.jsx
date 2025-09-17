import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

export default function Show({ professor, ucs = [] }) {
  // Garantindo que as disponibilidades sejam exibidas corretamente
  const availability = professor?.availability ? JSON.parse(professor.availability) : {};

  // Nomes dos dias da semana
  const DAYS = [
    { key: 'mon', label: 'Segunda-feira' },
    { key: 'tue', label: 'Terça-feira' },
    { key: 'wed', label: 'Quarta-feira' },
    { key: 'thu', label: 'Quinta-feira' },
    { key: 'fri', label: 'Sexta-feira' },
  ];

  // Definindo os horários
  const SLOTS = [
    { key: 's1', label: '19:00–20:30' },
    { key: 's2', label: '20:45–22:10' },
  ];

  // Função para verificar se o checkbox de disponibilidade está marcado
  const isChecked = (day, slot) => {
    return availability[day]?.includes(slot);
  };

  // Verificando se o professor tem a unidade curricular associada
  const isUcChecked = (ucId) => {
    return professor?.unidadesCurriculares?.some((uc) => uc.id === ucId);
  };

  return (
    <AuthenticatedLayout header={null} bgClass="bg-amber-600">
      <Head title="Visualizar Professor" />

      {/* Faixa laranja */}
      <div className="-mx-4 sm:-mx-6 lg:-mx-8 mb-6">
        <div className="bg-gradient-to-r from-amber-600 to-amber-500 text-white px-4 sm:px-6 lg:px-8 py-6 shadow">
          <div className="mx-auto max-w-7xl flex items-center justify-between">
                     <h2 className="text-3xl font-extrabold">Vizualizar Professor  </h2>
            <Link href="/professores" className="rounded-md bg-white/95 px-4 py-2 font-semibold text-amber-700 hover:bg-white">
              Voltar
            </Link>
          </div>
        </div>
      </div>

      {/* Card de informações */}
      <div className="max-w-5xl space-y-6 mx-auto">
        <div className="rounded-xl border bg-white p-6 shadow-sm">
          {/* Informações do Professor */}
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700">Matrícula</label>
              <input
                className="mt-1 w-full rounded-lg border px-3 py-2 outline-none focus:ring-2 focus:ring-amber-500 bg-gray-100"
                value={professor?.matricula || ''}
                readOnly
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Nome</label>
              <input
                className="mt-1 w-full rounded-lg border px-3 py-2 outline-none focus:ring-2 focus:ring-amber-500 bg-gray-100"
                value={professor?.nome || ''}
                readOnly
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Sobrenome</label>
              <input
                className="mt-1 w-full rounded-lg border px-3 py-2 outline-none focus:ring-2 focus:ring-amber-500 bg-gray-100"
                value={professor?.sobrenome || ''}
                readOnly
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700">E-mail</label>
              <input
                type="email"
                className="mt-1 w-full rounded-lg border px-3 py-2 outline-none focus:ring-2 focus:ring-amber-500 bg-gray-100"
                value={professor?.email || ''}
                readOnly
              />
            </div>
          </div>

          {/* Unidades Curriculares ministráveis */}
          <div className="sm:col-span-2 mt-5">
            <label className="mb-2 block text-sm font-medium text-gray-700">Unidades Curriculares que pode ministrar</label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {ucs?.map((uc) => {
                // Verificando se o professor tem a UC associada
                const checked = isUcChecked(uc.id);
                return (
                  <label key={uc.id} className="flex items-center gap-3 rounded-lg border px-3 py-2">
                   
                    <span className="text-gray-800">
                      <span className="mr-2 rounded-full bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-800">{uc.codigo}</span>
                      {uc.nome}
                    </span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Disponibilidade seg–sex × 2 horários */}
          <div className="sm:col-span-2 mt-5">
            <label className="mb-2 block text-sm font-medium text-gray-700">Disponibilidade (Segunda a Sexta)</label>
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
                        const checked = isChecked(d.key, s.key);
                        return (
                          <td key={s.key} className="px-3 py-2">
                            <label className="inline-flex items-center gap-2">
                              <input
                                type="checkbox"
                                checked={checked} // Checkbox marcado se o professor estiver disponível nesse horário
                                disabled  // Desabilita a interação do usuário
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
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
