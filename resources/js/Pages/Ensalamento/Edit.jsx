import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, router, Link } from '@inertiajs/react';
import { useMemo, useState } from 'react';

const DAYS = [
    { key: 'mon', label: 'Segunda' },
    { key: 'tue', label: 'Terça' },
    { key: 'wed', label: 'Quarta' },
    { key: 'thu', label: 'Quinta' },
    { key: 'fri', label: 'Sexta' },
    { key: 'sat', label: 'Sábado' },
];

const SLOTS = [
    { key: 's1', label: '19:00 - 20:30' },
    { key: 's2', label: '20:45 - 22:10' },
];

export default function Edit({ grade, professores, salas, turmas, ucs }) {
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [isDigital, setIsDigital] = useState(false);
    const [filtroTurma, setFiltroTurma] = useState(turmas[0]?.id || '');

    const { data, setData, post, processing, errors, reset } = useForm({
        grade_id: grade.id,
        professor_id: '',
        sala_id: '',
        turma_id: filtroTurma,
        unidade_curricular_id: '',
        dia_semana: '',
        horario_slot: '',
        is_digital: false,
    });

    const formatarCurso = (valor) => {
        const mapa = {
            'pratica': 'Ciências da Computação',
            'teorica': 'Engenharia de Software',
            'teorico-pratica': 'Sistemas de Informação',
            'Ambas': 'Ambas'
        };
        return mapa[valor] || valor;
    };

    const ensalamentosFiltrados = useMemo(() => {
        return (grade.ensalamentos || []).filter(e => String(e.turma_id) === String(filtroTurma));
    }, [grade.ensalamentos, filtroTurma]);

    const alocacoesDigitais = useMemo(() => {
        return ensalamentosFiltrados.filter(e => e.is_digital || e.unidade_curricular?.tipo === 'digital');
    }, [ensalamentosFiltrados]);

    const openAlocacao = (day, slot, digital = false) => {
        setIsDigital(digital);
        setData({
            ...data,
            turma_id: filtroTurma,
            dia_semana: digital ? 'digital' : day,
            horario_slot: digital ? 'digital' : slot,
            is_digital: digital,
            unidade_curricular_id: '',
            professor_id: '',
            sala_id: '',
        });
        setSelectedSlot(digital ? { day: 'digital', label: 'Atividade Digital' } : { day, slot });
    };

    const submit = (e) => {
        e.preventDefault();
        post(route('ensalamento.storeHorario'), {
            onSuccess: () => {
                setSelectedSlot(null);
                reset('professor_id', 'sala_id', 'unidade_curricular_id');
            }
        });
    };

    const del = (id) => {
        if(confirm('Remover esta alocação?')) {
            router.delete(route('ensalamento.destroyHorario', id));
        }
    };

    const getAlocacao = (day, slot) => {
        return ensalamentosFiltrados.filter(e => e.dia_semana === day && e.horario_slot === slot && !e.is_digital);
    };

    return (
        <AuthenticatedLayout header={null} bgClass="bg-gray-50">
            <Head title={`Editando: ${grade.nome}`} />

            <div className="max-w-[1700px] mx-auto py-6 px-6">
                
                {/* TOPO: SELETOR DE TURMA (Mais equilibrado) */}
                <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-[1.5rem] shadow-sm border border-amber-100">
                    <div className="flex-1">
                        <label className="text-[9px] font-black text-amber-400 uppercase tracking-widest mb-0.5 block">Turma Selecionada:</label>
                        <div className="relative inline-block">
                            <select 
                                value={filtroTurma}
                                onChange={(e) => {
                                    setFiltroTurma(e.target.value);
                                    setData('turma_id', e.target.value);
                                }}
                                className="bg-transparent border-none text-2xl font-black text-gray-800 focus:ring-0 p-0 pr-8 cursor-pointer hover:text-amber-600 transition-colors appearance-none"
                            >
                                {turmas.map(t => (
                                    <option key={t.id} value={t.id}>{t.nome}</option>
                                ))}
                            </select>
                            <div className="absolute inset-y-0 right-0 flex items-center pointer-events-none text-amber-500">
                                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path d="M19 9l-7 7-7-7" /></svg>
                            </div>
                        </div>
                    </div>
                    
                    <Link href={route('ensalamento.index')} className="px-5 py-2.5 bg-amber-50 text-amber-700 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-amber-100 transition border border-amber-200">
                        Voltar
                    </Link>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    
                    {/* COLUNA DA GRADE (Ocupa 9/12 do espaço) */}
                    <div className="lg:col-span-9 space-y-6">
                        <div className="bg-white rounded-[2rem] shadow-xl border border-amber-50 overflow-hidden">
                            <div className="overflow-auto" style={{ maxHeight: '62vh' }}>
                                <table className="w-full border-separate border-spacing-0">
                                    <thead className="sticky top-0 z-20 bg-[#fffdf5]">
                                        <tr>
                                            <th className="p-4 border-b border-amber-50 text-left text-[10px] font-black uppercase tracking-widest text-amber-800/40 w-32">Horário</th>
                                            {DAYS.map(d => (
                                                <th key={d.key} className="p-4 border-b border-amber-50 text-center text-[11px] font-black uppercase tracking-widest text-amber-800">{d.label}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-amber-50">
                                        {SLOTS.map(s => (
                                            <tr key={s.key}>
                                                <td className="p-4 font-black text-gray-400 bg-gray-50/20 text-[10px] border-r border-amber-50 text-center uppercase tracking-tighter leading-tight">{s.label}</td>
                                                {DAYS.map(d => {
                                                    const alocacoes = getAlocacao(d.key, s.key);
                                                    return (
                                                        <td 
                                                            key={`${d.key}-${s.key}`} 
                                                            className={`p-2 h-44 min-w-[180px] align-top cursor-pointer transition-all ${selectedSlot?.day === d.key && selectedSlot?.slot === s.key ? 'bg-amber-50 ring-2 ring-inset ring-amber-400/30' : 'hover:bg-amber-50/40'}`}
                                                            onClick={() => openAlocacao(d.key, s.key)}
                                                        >
                                                            {alocacoes.map(aloc => (
                                                                <div key={aloc.id} className="relative p-3.5 bg-white border border-amber-100 rounded-xl shadow-sm mb-2 group/card hover:shadow-md transition-all">
                                                                    <button onClick={(e) => {e.stopPropagation(); del(aloc.id)}} className="absolute -top-1.5 -right-1.5 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover/card:opacity-100 transition shadow-lg z-10">
                                                                        <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" /></svg>
                                                                    </button>
                                                                    <div className="text-[8px] font-black text-amber-500 uppercase mb-1 tracking-widest truncate">{formatarCurso(aloc.unidade_curricular?.metodo)}</div>
                                                                    <div className="font-black text-gray-900 text-[11px] leading-tight mb-2 line-clamp-2">{aloc.unidade_curricular?.nome}</div>
                                                                    <div className="flex flex-col gap-1">
                                                                        <div className="text-[10px] font-bold text-gray-500 truncate italic">{aloc.professor?.nome}</div>
                                                                        <div className="text-[9px] text-gray-400 font-black uppercase tracking-widest bg-gray-50 px-1.5 py-0.5 rounded self-start">Sala {aloc.sala?.nome}</div>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </td>
                                                    );
                                                })}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* DIGITAIS MAIS COMPACTAS ABAIXO */}
                        <div className="space-y-4">
                            <h2 className="text-xl font-black text-gray-800 uppercase tracking-tighter border-l-4 border-purple-500 pl-4">Atividades Digitais</h2>
                            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                                {alocacoesDigitais.map(aloc => (
                                    <div key={aloc.id} className="p-3 bg-white border border-purple-50 rounded-2xl shadow-sm relative border-b-4 border-b-purple-500 group">
                                        <button onClick={() => del(aloc.id)} className="absolute top-2 right-2 text-gray-200 hover:text-red-500 transition"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg></button>
                                        <div className="font-bold text-gray-800 text-[10px] leading-tight mb-1 line-clamp-1">{aloc.unidade_curricular?.nome}</div>
                                        <div className="text-[9px] font-bold text-gray-400 truncate">{aloc.professor?.nome}</div>
                                    </div>
                                ))}
                                <button onClick={() => openAlocacao('digital', 'digital', true)} className="p-4 border-2 border-dashed border-purple-100 rounded-2xl flex flex-col items-center justify-center hover:bg-purple-50 transition-all group min-h-[80px]">
                                    <span className="text-[9px] font-black text-purple-400 uppercase tracking-widest">+ Alocar Digital</span>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* COLUNA DO MENU (Ocupa 3/12 do espaço - Fixa e maior) */}
                    <div className="lg:col-span-3">
                        <div className={`sticky top-6 bg-white p-7 rounded-[2rem] shadow-2xl border-t-[10px] ${isDigital ? 'border-purple-500 shadow-purple-200/50' : 'border-amber-500 shadow-amber-200/50'} transition-all`}>
                            <header className="mb-8 text-center">
                                <h2 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">Alocação de Horário</h2>
                                <div className="text-xl font-black text-gray-800 uppercase tracking-tighter py-2 border-b-2 border-gray-50">
                                    {selectedSlot ? (isDigital ? 'Atividade Digital' : DAYS.find(d => d.key === selectedSlot.day)?.label) : 'Selecione um slot'}
                                </div>
                            </header>

                            <form onSubmit={submit} className="space-y-6">
                                <div className="relative group">
                                    <label className="absolute -top-2.5 left-4 bg-white px-2 text-[9px] font-black text-amber-600 uppercase tracking-widest z-10">Unidade Curricular</label>
                                    <select className="w-full rounded-2xl border-2 border-gray-50 bg-gray-50 focus:border-amber-500 focus:ring-0 text-[11px] font-bold p-4 transition-all outline-none" value={data.unidade_curricular_id} onChange={e => setData('unidade_curricular_id', e.target.value)} disabled={!selectedSlot}>
                                        <option value="">Selecione...</option>
                                        {ucs.map(u => <option key={u.id} value={u.id}>{u.nome}</option>)}
                                    </select>
                                </div>

                                <div className="relative group">
                                    <label className="absolute -top-2.5 left-4 bg-white px-2 text-[9px] font-black text-amber-600 uppercase tracking-widest z-10">Professor</label>
                                    <select className="w-full rounded-2xl border-2 border-gray-50 bg-gray-50 focus:border-amber-500 focus:ring-0 text-[11px] font-bold p-4 transition-all outline-none" value={data.professor_id} onChange={e => setData('professor_id', e.target.value)} disabled={!selectedSlot}>
                                        <option value="">Selecione...</option>
                                        {professores.map(p => <option key={p.id} value={p.id}>{p.nome}</option>)}
                                    </select>
                                </div>

                                {!isDigital && (
                                    <div className="relative group">
                                        <label className="absolute -top-2.5 left-4 bg-white px-2 text-[9px] font-black text-amber-600 uppercase tracking-widest z-10">Ambiente / Sala</label>
                                        <select className="w-full rounded-2xl border-2 border-gray-100 bg-gray-50 focus:border-amber-500 focus:ring-0 text-[11px] font-bold p-4 transition-all outline-none" value={data.sala_id} onChange={e => setData('sala_id', e.target.value)} disabled={!selectedSlot}>
                                            <option value="">Selecione...</option>
                                            {salas.map(s => <option key={s.id} value={s.id}>{s.nome}</option>)}
                                        </select>
                                    </div>
                                )}

                                <button type="submit" disabled={processing || !selectedSlot} className={`w-full py-5 mt-4 rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] shadow-xl transition-all active:scale-95 ${isDigital ? 'bg-purple-600 hover:bg-purple-700 shadow-purple-200/50' : 'bg-amber-600 hover:bg-amber-700 shadow-amber-200/50'} text-white disabled:bg-gray-100 disabled:text-gray-300 disabled:shadow-none`}>
                                    {processing ? '...' : 'Confirmar Alocação'}
                                </button>
                                
                                {Object.keys(errors).length > 0 && (
                                    <div className="mt-4 p-4 bg-red-50 rounded-2xl text-red-500 text-[9px] font-black uppercase leading-tight border-2 border-red-100 text-center italic">
                                        Verifique os campos obrigatórios
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