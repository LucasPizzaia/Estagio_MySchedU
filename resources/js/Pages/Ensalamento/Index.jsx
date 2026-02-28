import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useMemo, useState } from 'react';

export default function Index({ grades = [], flash }) {
    const [q, setQ] = useState('');

    const list = useMemo(() => {
        let data = [...grades];
        if (q) {
            const s = q.toLowerCase();
            data = data.filter(g =>
                (g.nome || '').toLowerCase().includes(s) ||
                (g.periodo || '').toLowerCase().includes(s)
            );
        }
        return data;
    }, [grades, q]);

    const del = (id) => {
        if (confirm('Deseja excluir este cenário de ensalamento? Todos os horários vinculados serão perdidos.')) {
            router.delete(route('ensalamento.destroy', id));
        }
    };

    return (
        <AuthenticatedLayout header={null} bgClass="bg-white">
            <Head title="Ensalamento" />

            {/* HEADER PADRONIZADO */}
            <div className="max-w-6xl mx-auto mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between px-4 sm:px-0">
                <div>
                    <h1 className="text-3xl font-bold text-amber-700 tracking-tight">Ensalamento</h1>
                    <p className="text-gray-500 mt-1 text-sm">Gerencie múltiplos cenários e grades horárias do semestre.</p>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                    {/* BUSCA */}
                    <div className="flex rounded-xl border border-amber-300 bg-white overflow-hidden shadow-sm">
                        <span className="hidden sm:flex items-center px-3 text-sm text-gray-500 font-medium">Buscar</span>
                        <input
                            className="w-full px-3 py-2 text-gray-800 outline-none"
                            placeholder="Nome ou período..."
                            value={q}
                            onChange={(e) => setQ(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {/* MENSAGEM FLASH */}
            {flash && (
                <div className="max-w-6xl mx-auto mb-4 rounded-xl border border-amber-300 bg-amber-50 px-4 py-2 text-amber-800 shadow-sm">
                    {flash}
                </div>
            )}

            {/* LISTA DE GRADES EM CARDS PADRONIZADOS */}
            <div className="max-w-6xl mx-auto grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-20 px-4 sm:px-0">
                {list.map((grade) => (
                    <div key={grade.id} className="group rounded-2xl border border-amber-200 bg-white p-6 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between border-b-4 hover:border-b-amber-600">
                        <div>
                            <div className="flex justify-between items-start mb-4">
                                <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${grade.status ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-gray-100 text-gray-600 border border-gray-200'}`}>
                                    {grade.status ? 'Ativa' : 'Inativa'}
                                </span>
                                <span className="text-gray-300 font-mono text-xs font-bold">#{grade.id}</span>
                            </div>
                            
                            <h3 className="text-xl font-bold text-gray-900 mb-1 group-hover:text-amber-700 transition-colors">{grade.nome}</h3>
                            <p className="text-gray-400 text-xs font-medium uppercase tracking-tighter mb-4">{grade.periodo || 'Período não definido'}</p>
                            
                            <div className="flex items-center gap-2 text-sm text-amber-800 bg-amber-50/50 border border-amber-100 p-3 rounded-xl mb-4">
                                <svg className="h-5 w-5 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                <span className="font-bold">{grade.ensalamentos_count || 0} <span className="font-normal opacity-70 tracking-tight text-xs uppercase">Aulas alocadas</span></span>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-50">
                            <Link
                                href={route('ensalamento.edit', grade.id)}
                                className="flex-1 text-center py-2.5 bg-amber-600 text-white rounded-xl font-bold text-sm shadow-sm hover:bg-amber-700 hover:shadow-amber-200 transition-all active:scale-95"
                            >
                                Acessar Grade
                            </Link>
                            
                            <button
                                onClick={() => del(grade.id)}
                                className="p-2.5 text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                                title="Excluir Grade"
                            >
                                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                            </button>
                        </div>
                    </div>
                ))}

                {list.length === 0 && (
                    <div className="col-span-full py-20 text-center bg-gray-50/50 rounded-3xl border-2 border-dashed border-gray-200">
                        <p className="text-gray-400 font-medium">Nenhum cenário de ensalamento encontrado.</p>
                        <p className="text-gray-300 text-sm">Clique no botão abaixo para começar.</p>
                    </div>
                )}
            </div>

            {/* BOTÃO FLUTUANTE (FIXO NO CANTO INFERIOR DIREITO) */}
            <Link
                href={route('ensalamento.create')}
                className="fixed bottom-10 right-10 flex items-center justify-center rounded-full bg-amber-600 text-white h-16 w-16 shadow-2xl hover:bg-amber-700 transition-all hover:scale-110 active:scale-95 z-[9999] group"
                title="Criar Nova Grade"
            >
                <svg className="h-8 w-8 transition-transform group-hover:rotate-90" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M13 11h6a1 1 0 1 1 0 2h-6v6a1 1 0 1 1-2 0v-6H5a1 1 0 1 1 0-2h6V5a1 1 0 1 1 2 0v6z" />
                </svg>
            </Link>
        </AuthenticatedLayout>
    );
}