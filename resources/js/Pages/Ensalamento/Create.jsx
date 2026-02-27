import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
        nome: '',
        periodo: '',
    });

    function submit(e) {
        e.preventDefault();
        post(route('ensalamento.storeGrade'));
    }

    return (
        <AuthenticatedLayout header={null} bgClass="bg-white">
            <Head title="Nova Grade de Ensalamento" />

            <div className="max-w-3xl mx-auto mb-8 flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-amber-700 tracking-tight">Criar Nova Grade</h1>
                    <p className="text-gray-500 mt-1 text-sm">Inicie um novo cenário de ensalamento.</p>
                </div>
                <Link href={route('ensalamento.index')} className="text-amber-700 font-semibold hover:underline">
                    Voltar
                </Link>
            </div>

            <form onSubmit={submit} className="max-w-3xl mx-auto">
                <div className="rounded-2xl border border-amber-200 bg-white p-8 shadow-lg space-y-6">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Nome da Grade *</label>
                        <input
                            className="w-full rounded-xl border border-amber-300 px-4 py-2.5 focus:ring-2 focus:ring-amber-500 outline-none"
                            placeholder="Ex: Semestre 2026.1 - Oficial"
                            value={data.nome}
                            onChange={e => setData('nome', e.target.value)}
                        />
                        {errors.nome && <p className="text-red-600 text-sm mt-1">{errors.nome}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Período / Ano</label>
                        <input
                            className="w-full rounded-xl border border-amber-300 px-4 py-2.5 focus:ring-2 focus:ring-amber-500 outline-none"
                            placeholder="Ex: 2026/1"
                            value={data.periodo}
                            onChange={e => setData('periodo', e.target.value)}
                        />
                        {errors.periodo && <p className="text-red-600 text-sm mt-1">{errors.periodo}</p>}
                    </div>

                    <div className="flex justify-end pt-4">
                        <button
                            disabled={processing}
                            className="rounded-lg bg-amber-600 px-6 py-2.5 text-white font-semibold shadow hover:bg-amber-700 transition"
                        >
                            Começar Ensalamento
                        </button>
                    </div>
                </div>
            </form>
        </AuthenticatedLayout>
    );
}