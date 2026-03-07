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
        
        setSelectedSlot(digital ? { day: 'digital', slot: 'digital', label: 'Atividade Digital' } : { day, slot });
    };

    const submit = (e) => {
        e.preventDefault();
        post(route('ensalamento.storeHorario'), {
            onSuccess: () => {
                setSelectedSlot(null);
                reset('professor_id', 'sala_id', 'unidade_curricular_id');
            },
            preserveScroll: true
        });
    };

    const del = (id) => {
        if(confirm('Remover esta alocação?')) {
            router.delete(route('ensalamento.destroyHorario', id), {
                preserveScroll: true
            });
        }
    };

    const getAlocacao = (day, slot) => {
        return ensalamentosFiltrados.filter(e => e.dia_semana === day && e.horario_slot === slot && !e.is_digital);
    };

    return (
        <AuthenticatedLayout header={null} bgClass="bg-gray-50">
            <Head title={`Editando: ${grade.nome}`} />

            <div className="max-w-[1700px] mx-auto py-8 px-6">
                
                {/* CABEÇALHO: TURMA (CORRIGIDO: REMOÇÃO DE SETA DUPLA) */}
                <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-6 rounded-[2rem] shadow-sm border border-amber-100">
                    <div className="flex-1">
                        <label className="text-[10px] font-black text-amber-500 uppercase tracking-widest mb-1 block">Visualizando Turma:</label>
                        <div className="relative inline-flex items-center">
                            <select 
                                value={filtroTurma}
                                onChange={(e) => {
                                    setFiltroTurma(e.target.value);
                                    setData('turma_id', e.target.value);
                                }}
                                /* appearance-none remove a seta padrão do navegador */
                                className="appearance-none bg-transparent border-none text-2xl font-black text-gray-800 focus:ring-0 p-0 pr-10 cursor-pointer hover:text-amber-600 transition-colors z-10"
                            >
                                {turmas.map(t => (
                                    <option key={t.id} value={t.id} className="text-lg font-bold">{t.nome}</option>
                                ))}
                            </select>
                            {/* Ícone customizado laranja posicionado atrás do select transparente */}
                            <div className="absolute inset-y-0 right-0 flex items-center pointer-events-none text-amber-500 z-0">
                                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                                </svg>
                            </div>
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                        <a 
                            href={route('ensalamento.pdf', grade.id)} 
                            target="_blank" 
                            className="bg-red-600 text-white px-5 py-2.5 rounded-xl font-bold text-[10px] uppercase tracking-widest hover:bg-red-700 transition flex items-center gap-2 shadow-lg shadow-red-100"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
                            Baixar PDF
                        </a>

                        <Link href={route('ensalamento.index')} className="px-5 py-2.5 bg-amber-50 text-amber-700 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-amber-100 transition border border-amber-200">
                            Voltar
                        </Link>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    <div className="lg:col-span-9 space-y-10">
                        <div className="bg-white rounded-[2.5rem] shadow-xl border border-amber-50 overflow-hidden">
                            <div className="overflow-auto" style={{ maxHeight: '65vh' }}>
                                <table className="w-full border-separate border-spacing-0">
                                    <thead className="sticky top-0 z-20 bg-[#fffdf5]">
                                        <tr>
                                            <th className="p-5 border-b border-amber-50 text-left text-[11px] font-black uppercase tracking-widest text-amber-800/40 w-36">Horário</th>
                                            {DAYS.map(d => (
                                                <th key={d.key} className="p-5 border-b border-amber-50 text-center text-[12px] font-black uppercase tracking-widest text-amber-800">{d.label}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-amber-50">
                                        {SLOTS.map(s => (
                                            <tr key={s.key}>
                                                <td className="p-5 font-black text-gray-400 bg-gray-50/30 text-xs border-r border-amber-50 uppercase tracking-tighter">{s.label}</td>
                                                {DAYS.map(d => {
                                                    const alocs = getAlocacao(d.key, s.key);
                                                    return (
                                                        <td 
                                                            key={`${d.key}-${s.key}`} 
                                                            className={`p-2 h-52 min-w-[200px] align-top cursor-pointer transition-all ${selectedSlot?.day === d.key && selectedSlot?.slot === s.key ? 'bg-amber-50 ring-4 ring-inset ring-amber-400/30' : 'hover:bg-amber-50/40'}`}
                                                            onClick={() => openAlocacao(d.key, s.key)}
                                                        >
                                                            {alocs.map(aloc => (
                                                                <div key={aloc.id} className="relative p-4 bg-white border border-amber-100 rounded-[1.5rem] shadow-sm mb-2 group/card hover:shadow-md transition-all">
                                                                    <button 
                                                                        onClick={(e) => {e.stopPropagation(); del(aloc.id)}} 
                                                                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover/card:opacity-100 transition shadow-lg z-10"
                                                                    >
                                                                        <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" /></svg>
                                                                    </button>
                                                                    <div className="text-[8px] font-black text-amber-500 uppercase mb-1 tracking-widest">{formatarCurso(aloc.unidade_curricular?.metodo)}</div>
                                                                    <div className="font-black text-gray-900 text-xs leading-snug mb-2 line-clamp-2">{aloc.unidade_curricular?.nome}</div>
                                                                    <div className="flex flex-col gap-1">
                                                                        <div className="text-[10px] font-bold text-gray-600 truncate">{aloc.professor?.nome}</div>
                                                                        <div className="text-[10px] text-gray-400 font-black uppercase tracking-widest bg-gray-50 px-1.5 py-0.5 rounded self-start">Sala {aloc.sala?.nome}</div>
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

                        <div className="space-y-6 pb-10">
                            <h2 className="text-2xl font-black text-gray-800 uppercase tracking-tighter border-l-8 border-purple-500 pl-6">Atividades Digitais</h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                                {alocacoesDigitais.map(aloc => (
                                    <div key={aloc.id} className="p-6 bg-white border border-purple-50 rounded-[2rem] shadow-lg relative border-b-8 border-b-purple-500 hover:-translate-y-1 transition-all group">
                                        <button onClick={() => del(aloc.id)} className="absolute top-4 right-4 text-gray-300 hover:text-red-500 transition">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                        </button>
                                        <div className="text-[10px] font-black text-purple-600 uppercase mb-3 tracking-widest">Digital / Online</div>
                                        <div className="font-black text-gray-900 text-[13px] mb-2 leading-tight">{aloc.unidade_curricular?.nome}</div>
                                        <div className="text-xs font-bold text-gray-400">{aloc.professor?.nome}</div>
                                    </div>
                                ))}
                                <button 
                                    onClick={() => openAlocacao('digital', 'digital', true)} 
                                    className="p-8 border-4 border-dashed border-purple-100 rounded-[2.5rem] flex flex-col items-center justify-center hover:bg-purple-50 transition-all group min-h-[140px]"
                                >
                                    <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center text-purple-500 group-hover:bg-purple-500 group-hover:text-white transition-all mb-2">
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
                                    </div>
                                    <span className="text-[10px] font-black text-purple-400 uppercase tracking-widest">+ Adicionar Digital</span>
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-3">
                        <div className={`sticky top-8 bg-white p-8 rounded-[2.5rem] shadow-2xl border-t-[12px] ${isDigital ? 'border-purple-500 shadow-purple-200' : 'border-amber-500 shadow-amber-200'} transition-all`}>
                            <header className="mb-10 text-center">
                                <h2 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.3em] mb-2">Configuração</h2>
                                <div className={`text-xl font-black uppercase tracking-tighter py-2 border-b-2 ${isDigital ? 'text-purple-600 border-purple-50' : 'text-gray-800 border-gray-50'}`}>
                                    {selectedSlot ? (isDigital ? 'Nova Digital' : DAYS.find(d => d.key === selectedSlot.day)?.label) : 'Slot Livre'}
                                </div>
                            </header>

                            <form onSubmit={submit} className="space-y-8">
                                <div className="relative">
                                    <label className={`absolute -top-3 left-5 bg-white px-2 text-[10px] font-black uppercase tracking-widest z-10 ${isDigital ? 'text-purple-500' : 'text-amber-600'}`}>Unidade Curricular</label>
                                    <select className="w-full rounded-2xl border-2 border-gray-100 bg-gray-50 focus:border-amber-500 focus:ring-0 text-xs font-bold p-5 appearance-none" value={data.unidade_curricular_id} onChange={e => setData('unidade_curricular_id', e.target.value)} disabled={!selectedSlot}>
                                        <option value="">Selecione a UC...</option>
                                        {ucs.map(u => <option key={u.id} value={u.id}>{u.nome}</option>)}
                                    </select>
                                </div>

                                <div className="relative">
                                    <label className={`absolute -top-3 left-5 bg-white px-2 text-[10px] font-black uppercase tracking-widest z-10 ${isDigital ? 'text-purple-500' : 'text-amber-600'}`}>Professor</label>
                                    <select className="w-full rounded-2xl border-2 border-gray-100 bg-gray-50 focus:border-amber-500 focus:ring-0 text-xs font-bold p-5 appearance-none" value={data.professor_id} onChange={e => setData('professor_id', e.target.value)} disabled={!selectedSlot}>
                                        <option value="">Selecione o Professor...</option>
                                        {professores.map(p => <option key={p.id} value={p.id}>{p.nome}</option>)}
                                    </select>
                                </div>

                                {!isDigital && (
                                    <div className="relative">
                                        <label className="absolute -top-3 left-5 bg-white px-2 text-[10px] font-black text-amber-600 uppercase tracking-widest z-10">Sala</label>
                                        <select className="w-full rounded-2xl border-2 border-gray-100 bg-gray-50 focus:border-amber-500 focus:ring-0 text-xs font-bold p-5 appearance-none" value={data.sala_id} onChange={e => setData('sala_id', e.target.value)} disabled={!selectedSlot}>
                                            <option value="">Selecione a Sala...</option>
                                            {salas.map(s => <option key={s.id} value={s.id}>{s.nome}</option>)}
                                        </select>
                                    </div>
                                )}

                                <button 
                                    type="submit" 
                                    disabled={processing || !selectedSlot} 
                                    className={`w-full py-6 rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] shadow-xl transition-all active:scale-95 ${isDigital ? 'bg-purple-600 hover:bg-purple-700 shadow-purple-200' : 'bg-amber-600 hover:bg-amber-700 shadow-amber-200'} text-white disabled:bg-gray-100`}
                                >
                                    {processing ? 'SALVANDO...' : 'CONFIRMAR ALOCAÇÃO'}
                                </button>
                                
                                {Object.keys(errors).length > 0 && (
                                    <div className="p-4 bg-red-50 rounded-2xl text-red-500 text-[10px] font-black uppercase text-center border-2 border-red-100">
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