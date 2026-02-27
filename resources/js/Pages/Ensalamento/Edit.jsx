import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import { useState } from 'react';

const DAYS = [
    { key: 'mon', label: 'Segunda' },
    { key: 'tue', label: 'Terça' },
    { key: 'wed', label: 'Quarta' },
    { key: 'thu', label: 'Quinta' },
    { key: 'fri', label: 'Sexta' },
];

const SLOTS = [
    { key: 's1', label: '19:00 - 20:30' },
    { key: 's2', label: '20:45 - 22:10' },
];

export default function Edit({ grade, professores, salas, turmas, ucs }) {
    const [selectedSlot, setSelectedSlot] = useState(null);

    const { data, setData, post, processing, errors, reset } = useForm({
        grade_id: grade.id,
        professor_id: '',
        sala_id: '',
        turma_id: '',
        unidade_curricular_id: '',
        dia_semana: '',
        horario_slot: '',
    });

    // Função para abrir o formulário ao clicar num slot
    const openAlocacao = (day, slot) => {
        setData({
            ...data,
            dia_semana: day,
            horario_slot: slot
        });
        setSelectedSlot({ day, slot });
    };

    const submit = (e) => {
        e.preventDefault();
        post(route('ensalamento.storeHorario'), {
            onSuccess: () => {
                setSelectedSlot(null);
                reset('professor_id', 'sala_id', 'turma_id', 'unidade_curricular_id');
            }
        });
    };

    // Função auxiliar para encontrar o que já está alocado naquele slot
    const getAlocacao = (day, slot) => {
        return grade.ensalamentos.filter(e => e.dia_semana === day && e.horario_slot === slot);
    };

    return (
        <AuthenticatedLayout header={null} bgClass="bg-gray-50">
            <Head title={`Editando: ${grade.nome}`} />

            <div className="max-w-7xl mx-auto py-8 px-4">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-amber-700">{grade.nome}</h1>
                    <p className="text-gray-600">Monte a grade horária clicando nos horários abaixo.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* GRADE DE HORÁRIOS (TABELA) */}
                    <div className="lg:col-span-3 space-y-6">
                        <div className="bg-white rounded-2xl shadow-sm border border-amber-100 overflow-hidden">
                            <table className="w-full border-collapse">
                                <thead>
                                    <tr className="bg-amber-50 text-amber-800">
                                        <th className="p-4 border-b border-amber-100 text-left">Horário</th>
                                        {DAYS.map(d => (
                                            <th key={d.key} className="p-4 border-b border-amber-100 text-center">{d.label}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {SLOTS.map(s => (
                                        <tr key={s.key}>
                                            <td className="p-4 border-b border-gray-100 font-semibold text-gray-700 bg-gray-50/50">
                                                {s.label}
                                            </td>
                                            {DAYS.map(d => {
                                                const alocacoes = getAlocacao(d.key, s.key);
                                                return (
                                                    <td 
                                                        key={`${d.key}-${s.key}`} 
                                                        className="p-2 border-b border-gray-100 align-top h-32 cursor-pointer hover:bg-amber-50/30 transition"
                                                        onClick={() => openAlocacao(d.key, s.key)}
                                                    >
                                                        {alocacoes.map(aloc => (
                                                            <div key={aloc.id} className="mb-2 p-2 bg-amber-100 border border-amber-200 rounded-lg text-xs shadow-sm">
                                                                <div className="font-bold text-amber-900">{aloc.unidade_curricular.nome}</div>
                                                                <div className="text-amber-700">{aloc.professor.nome}</div>
                                                                <div className="text-gray-600 mt-1 font-mono">{aloc.sala.nome} | {aloc.turma.nome}</div>
                                                            </div>
                                                        ))}
                                                        {alocacoes.length === 0 && (
                                                            <div className="h-full flex items-center justify-center text-gray-300 italic text-xs">
                                                                Livre
                                                            </div>
                                                        )}
                                                    </td>
                                                );
                                            })}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* FORMULÁRIO DE ALOCAÇÃO (Lado Direito) */}
                    <div className="lg:col-span-1">
                        <div className={`bg-white p-6 rounded-2xl shadow-lg border-2 ${selectedSlot ? 'border-amber-500' : 'border-gray-200 opacity-50'}`}>
                            <h2 className="text-lg font-bold text-gray-800 mb-4">
                                {selectedSlot ? `Alocar: ${DAYS.find(d => d.key === selectedSlot.day).label}` : 'Selecione um slot'}
                            </h2>
                            
                            <form onSubmit={submit} className="space-y-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase">Professor</label>
                                    <select 
                                        className="w-full mt-1 rounded-lg border-gray-300 focus:ring-amber-500"
                                        value={data.professor_id}
                                        onChange={e => setData('professor_id', e.target.value)}
                                        disabled={!selectedSlot}
                                    >
                                        <option value="">Selecione...</option>
                                        {professores.map(p => <option key={p.id} value={p.id}>{p.nome}</option>)}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase">Unidade Curricular</label>
                                    <select 
                                        className="w-full mt-1 rounded-lg border-gray-300 focus:ring-amber-500"
                                        value={data.unidade_curricular_id}
                                        onChange={e => setData('unidade_curricular_id', e.target.value)}
                                        disabled={!selectedSlot}
                                    >
                                        <option value="">Selecione...</option>
                                        {ucs.map(u => <option key={u.id} value={u.id}>{u.nome}</option>)}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase">Turma</label>
                                    <select 
                                        className="w-full mt-1 rounded-lg border-gray-300 focus:ring-amber-500"
                                        value={data.turma_id}
                                        onChange={e => setData('turma_id', e.target.value)}
                                        disabled={!selectedSlot}
                                    >
                                        <option value="">Selecione...</option>
                                        {turmas.map(t => <option key={t.id} value={t.id}>{t.nome}</option>)}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase">Sala</label>
                                    <select 
                                        className="w-full mt-1 rounded-lg border-gray-300 focus:ring-amber-500"
                                        value={data.sala_id}
                                        onChange={e => setData('sala_id', e.target.value)}
                                        disabled={!selectedSlot}
                                    >
                                        <option value="">Selecione...</option>
                                        {salas.map(s => <option key={s.id} value={s.id}>{s.nome} ({s.local})</option>)}
                                    </select>
                                </div>

                                <button 
                                    type="submit"
                                    disabled={processing || !selectedSlot}
                                    className="w-full py-3 bg-amber-600 text-white rounded-xl font-bold hover:bg-amber-700 transition disabled:bg-gray-300"
                                >
                                    Confirmar Horário
                                </button>
                                
                                {Object.keys(errors).length > 0 && (
                                    <div className="p-3 bg-red-50 rounded-lg text-red-600 text-xs">
                                        {Object.values(errors)[0]}
                                    </div>
                                )}
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}