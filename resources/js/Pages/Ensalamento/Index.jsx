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

            {/* HEADER COM BUSCA E BOTÃO NOVO */}
            <div className="max-w-6xl mx-auto mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-amber-700 tracking-tight">Ensalamento</h1>
                    <p className="text-gray-500 mt-1 text-sm">Gerencie múltiplos cenários e grades horárias.</p>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                    <div className="flex rounded-xl border border-amber-300 bg-white overflow-hidden shadow-sm">
                        <span className="hidden sm:flex items-center px-3 text-sm text-gray-500">Buscar</span>
                        <input
                            className="w-full px-3 py-2 text-gray-800 outline-none"
                            placeholder="Nome ou período..."
                            value={q}
                            onChange={(e) => setQ(e.target.value)}
                        />
                    </div>

                    <Link
                        href={route('ensalamento.create')}
                        className="rounded-xl bg-amber-600 px-4 py-2 font-semibold text-white shadow-sm hover:bg-amber-700 transition text-center"
                    >
                        Criar Grade Horária
                    </Link>
                </div>
            </div>

            {/* MENSAGEM FLASH */}
            {flash && (
                <div className="max-w-6xl mx-auto mb-4 rounded-xl border border-amber-300 bg-amber-50 px-4 py-2 text-amber-800 shadow-sm">
                    {flash}
                </div>
            )}

            {/* LISTA DE GRADES EM CARDS */}
            <div className="max-w-6xl mx-auto grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {list.map((grade) => (
                    <div key={grade.id} className="rounded-2xl border border-amber-200 bg-white p-6 shadow-md hover:shadow-lg transition flex flex-col justify-between">
                        <div>
                            <div className="flex justify-between items-start mb-4">
                                <span className={`px-2 py-1 rounded-full text-xs font-bold ${grade.status ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                                    {grade.status ? 'Ativa' : 'Inativa'}
                                </span>
                                <span className="text-gray-400 text-xs">#{grade.id}</span>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-1">{grade.nome}</h3>
                            <p className="text-gray-500 text-sm mb-4">{grade.periodo || 'Período não definido'}</p>
                            
                            <div className="flex items-center gap-2 text-sm text-amber-800 bg-amber-50 p-2 rounded-lg mb-4">
                                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span>{grade.ensalamentos_count || 0} horários alocados</span>
                            </div>
                        </div>

                        <div className="flex gap-2 mt-4 border-t pt-4 border-amber-100">
                            <Link
                                href={route('ensalamento.edit', grade.id)}
                                className="flex-1 text-center py-2 bg-amber-600 text-white rounded-lg font-semibold hover:bg-amber-700 transition"
                            >
                                Acessar Grade
                            </Link>
                            <button
                                onClick={() => del(grade.id)}
                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                                title="Excluir"
                            >
                                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                            </button>
                        </div>
                    </div>
                ))}

                {list.length === 0 && (
                    <div className="col-span-full py-12 text-center text-gray-500 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
                        Nenhum cenário de ensalamento encontrado. Comece criando um novo!
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}