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
    
    // ESTADO PARA FILTRAR A TURMA NO TOPO
    const [filtroTurma, setFiltroTurma] = useState(turmas[0]?.id || '');

    const { data, setData, post, processing, errors, reset } = useForm({
        grade_id: grade.id,
        professor_id: '',
        sala_id: '',
        turma_id: filtroTurma, // Inicia com a turma do filtro
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

    // ALOCAÇÕES FILTRADAS PELA TURMA SELECIONADA NO TOPO
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
            turma_id: filtroTurma, // Garante que salva na turma que está sendo visualizada
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

            <div className="max-w-[1600px] mx-auto py-8 px-4">
                {/* TOPO: TURMA COMO TÍTULO / FILTRO PESQUISÁVEL */}
                <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-6 rounded-[2.5rem] shadow-sm border border-amber-100">
                    <div className="flex-1">
                        <label className="text-[10px] font-black text-amber-500 uppercase tracking-[0.2em] mb-2 block">Visualizando Grade da Turma:</label>
                        <div className="relative max-w-xl">
                            <select 
                                value={filtroTurma}
                                onChange={(e) => {
                                    setFiltroTurma(e.target.value);
                                    setData('turma_id', e.target.value);
                                }}
                                className="w-full bg-transparent border-none text-3xl md:text-4xl font-black text-gray-800 focus:ring-0 p-0 cursor-pointer hover:text-amber-600 transition-colors appearance-none"
                            >
                                {turmas.map(t => (
                                    <option key={t.id} value={t.id} className="text-lg font-bold">
                                        {t.nome}
                                    </option>
                                ))}
                            </select>
                            <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none text-gray-400">
                                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7" /></svg>
                            </div>
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                        <div className="text-right hidden sm:block">
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{grade.nome}</p>
                            <p className="text-xs font-bold text-gray-600">ID do Cenário: #{grade.id}</p>
                        </div>
                        <Link href={route('ensalamento.index')} className="px-6 py-3 bg-amber-50 text-amber-700 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-amber-100 transition shadow-sm border border-amber-200">
                            Voltar
                        </Link>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                    <div className="lg:col-span-4 space-y-12">
                        {/* TABELA PRINCIPAL */}
                        <div className="bg-white rounded-[2.5rem] shadow-xl border border-amber-50 overflow-hidden">
                            <div className="overflow-auto" style={{ maxHeight: '65vh' }}>
                                <table className="w-full border-separate border-spacing-0">
                                    <thead className="sticky top-0 z-20">
                                        <tr>
                                            <th className="p-6 bg-[#fffdf5] border-b border-amber-50 text-left text-[10px] font-black uppercase tracking-[0.2em] text-amber-800/50">Horário</th>
                                            {DAYS.map(d => (
                                                <th key={d.key} className="p-6 bg-[#fffdf5] border-b border-amber-50 text-center text-[10px] font-black uppercase tracking-[0.2em] text-amber-800">{d.label}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-amber-50">
                                        {SLOTS.map(s => (
                                            <tr key={s.key}>
                                                <td className="p-6 font-black text-gray-400 bg-gray-50/30 text-[11px] w-36 border-r border-amber-50 leading-tight tracking-tighter uppercase">{s.label}</td>
                                                {DAYS.map(d => {
                                                    const alocacoes = getAlocacao(d.key, s.key);
                                                    return (
                                                        <td 
                                                            key={`${d.key}-${s.key}`} 
                                                            className={`p-3 h-48 min-w-[200px] align-top cursor-pointer transition-all ${selectedSlot?.day === d.key && selectedSlot?.slot === s.key ? 'bg-amber-50 ring-4 ring-inset ring-amber-400/20' : 'hover:bg-amber-50/40'}`}
                                                            onClick={() => openAlocacao(d.key, s.key)}
                                                        >
                                                            {alocacoes.map(aloc => (
                                                                <div key={aloc.id} className="relative p-4 bg-white border border-amber-100 rounded-[1.5rem] shadow-sm mb-3 group/card hover:shadow-md transition-all">
                                                                    <button onClick={(e) => {e.stopPropagation(); del(aloc.id)}} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1.5 opacity-0 group-hover/card:opacity-100 transition shadow-lg z-10">
                                                                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" /></svg>
                                                                    </button>
                                                                    <div className="text-[9px] font-black text-amber-500 uppercase mb-2 tracking-widest">{formatarCurso(aloc.unidade_curricular?.metodo)}</div>
                                                                    <div className="font-black text-gray-900 text-xs leading-snug mb-2">{aloc.unidade_curricular?.nome}</div>
                                                                    <div className="flex flex-col gap-1">
                                                                        <div className="flex items-center gap-1.5 text-[10px] font-bold text-gray-500">
                                                                            <div className="w-1.5 h-1.5 rounded-full bg-amber-400"></div>
                                                                            {aloc.professor?.nome}
                                                                        </div>
                                                                        <div className="text-[10px] text-gray-400 font-bold uppercase mt-1 tracking-tighter">Sala {aloc.sala?.nome}</div>
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

                        {/* DIGITAIS */}
                        <div className="space-y-6 pb-20">
                            <div className="flex items-center gap-4 border-l-8 border-purple-500 pl-6">
                                <div>
                                    <h2 className="text-2xl font-black text-gray-800 uppercase tracking-tighter">Atividades Digitais</h2>
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Alocações EAD para esta turma</p>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                                {alocacoesDigitais.map(aloc => (
                                    <div key={aloc.id} className="p-6 bg-white border border-purple-50 rounded-[2rem] shadow-lg relative border-b-8 border-b-purple-500 transition-all hover:-translate-y-2">
                                        <button onClick={() => del(aloc.id)} className="absolute top-4 right-4 text-gray-300 hover:text-red-500 transition">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                        </button>
                                        <div className="text-[9px] font-black text-purple-600 uppercase mb-3 tracking-[0.2em]">Conteúdo Digital</div>
                                        <div className="font-black text-gray-900 text-sm mb-2 leading-tight">{aloc.unidade_curricular?.nome}</div>
                                        <div className="text-xs font-bold text-gray-400">{aloc.professor?.nome}</div>
                                    </div>
                                ))}
                                <button onClick={() => openAlocacao('digital', 'digital', true)} className="p-8 border-4 border-dashed border-purple-100 rounded-[2rem] flex flex-col items-center justify-center hover:bg-purple-50 hover:border-purple-300 transition-all group min-h-[180px]">
                                    <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center text-purple-500 group-hover:bg-purple-500 group-hover:text-white transition-all mb-4">
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
                                    </div>
                                    <span className="text-[10px] font-black text-purple-400 uppercase tracking-widest">Alocar Digital</span>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* MENU LATERAL ULTRA COMPACTO */}
                    <div className="lg:col-span-1">
                        <div className={`sticky top-8 bg-white p-6 rounded-[2.5rem] shadow-2xl border-t-[12px] ${isDigital ? 'border-purple-500 shadow-purple-200/50' : 'border-amber-500 shadow-amber-200/50'} transition-all`}>
                            <header className="mb-8">
                                <h2 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">
                                    {selectedSlot ? 'Alocando para:' : 'Configuração'}
                                </h2>
                                <div className="flex items-center justify-between gap-2">
                                    <p className="text-xl font-black text-gray-800 uppercase tracking-tighter">
                                        {selectedSlot ? (isDigital ? 'Digital' : DAYS.find(d => d.key === selectedSlot.day)?.label) : 'Escolha um slot'}
                                    </p>
                                    {selectedSlot && (
                                        <button onClick={() => setSelectedSlot(null)} className="p-2 bg-gray-50 text-gray-400 rounded-full hover:bg-red-50 hover:text-red-500 transition">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" /></svg>
                                        </button>
                                    )}
                                </div>
                            </header>

                            <form onSubmit={submit} className="space-y-6">
                                <div className="relative group">
                                    <label className="absolute -top-2 left-4 bg-white px-2 text-[9px] font-black text-gray-400 uppercase tracking-widest z-10">Unidade Curricular</label>
                                    <select className="w-full rounded-2xl border-gray-100 bg-gray-50 focus:ring-amber-500 text-[11px] font-bold p-4 transition-all outline-none border-2 focus:border-amber-200" value={data.unidade_curricular_id} onChange={e => setData('unidade_curricular_id', e.target.value)} disabled={!selectedSlot}>
                                        <option value="">SELECIONAR UC...</option>
                                        {ucs.map(u => <option key={u.id} value={u.id}>{u.nome}</option>)}
                                    </select>
                                </div>

                                <div className="relative group">
                                    <label className="absolute -top-2 left-4 bg-white px-2 text-[9px] font-black text-gray-400 uppercase tracking-widest z-10">Professor Responsável</label>
                                    <select className="w-full rounded-2xl border-gray-100 bg-gray-50 focus:ring-amber-500 text-[11px] font-bold p-4 transition-all outline-none border-2 focus:border-amber-200" value={data.professor_id} onChange={e => setData('professor_id', e.target.value)} disabled={!selectedSlot}>
                                        <option value="">SELECIONAR PROFESSOR...</option>
                                        {professores.map(p => <option key={p.id} value={p.id}>{p.nome}</option>)}
                                    </select>
                                </div>

                                {!isDigital && (
                                    <div className="relative group">
                                        <label className="absolute -top-2 left-4 bg-white px-2 text-[9px] font-black text-gray-400 uppercase tracking-widest z-10">Ambiente / Sala</label>
                                        <select className="w-full rounded-2xl border-gray-100 bg-gray-50 focus:ring-amber-500 text-[11px] font-bold p-4 transition-all outline-none border-2 focus:border-amber-200" value={data.sala_id} onChange={e => setData('sala_id', e.target.value)} disabled={!selectedSlot}>
                                            <option value="">SELECIONAR SALA...</option>
                                            {salas.map(s => <option key={s.id} value={s.id}>{s.nome}</option>)}
                                        </select>
                                    </div>
                                )}

                                <button type="submit" disabled={processing || !selectedSlot} className={`w-full py-5 mt-6 rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] shadow-xl transition-all active:scale-95 ${isDigital ? 'bg-purple-600 hover:bg-purple-700 shadow-purple-200/50' : 'bg-amber-600 hover:bg-amber-700 shadow-amber-200/50'} text-white disabled:bg-gray-100 disabled:text-gray-300 disabled:shadow-none`}>
                                    {processing ? 'PROCESSANDO...' : 'CONFIRMAR ALOCAÇÃO'}
                                </button>
                                
                                {Object.keys(errors).length > 0 && (
                                    <div className="mt-4 p-4 bg-red-50 rounded-2xl text-red-500 text-[10px] font-black uppercase leading-tight border-2 border-red-100">
                                        ⚠️ {Object.values(errors)[0]}
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