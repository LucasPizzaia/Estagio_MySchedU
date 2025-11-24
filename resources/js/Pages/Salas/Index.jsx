import React from "react";
import { Link, usePage, router } from "@inertiajs/react";

export default function Index() {
    const { salas } = usePage().props;

    const handleDelete = (id) => {
        if (confirm("Deseja realmente excluir esta sala?")) {
            router.delete(route("salas.destroy", id));
        }
    };

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-xl font-bold">Salas</h1>
                <Link
                    href={route("salas.create")}
                    className="px-4 py-2 bg-blue-600 text-white rounded"
                >
                    Nova Sala
                </Link>
            </div>

            <table className="w-full border-collapse">
                <thead>
                    <tr className="bg-gray-200 text-left">
                        <th className="p-2 border">Nome</th>
                        <th className="p-2 border">Local</th>
                        <th className="p-2 border">Lugares</th>
                        <th className="p-2 border">Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {salas.map((sala) => (
                        <tr key={sala.id} className="hover:bg-gray-100">
                            <td className="p-2 border">{sala.nome}</td>
                            <td className="p-2 border">{sala.local}</td>
                            <td className="p-2 border">{sala.quantidade_lugares}</td>
                            <td className="p-2 border space-x-2">
                                <Link
                                    href={route("salas.edit", sala.id)}
                                    className="px-3 py-1 bg-yellow-500 text-white rounded"
                                >
                                    Editar
                                </Link>

                                <button
                                    onClick={() => handleDelete(sala.id)}
                                    className="px-3 py-1 bg-red-600 text-white rounded"
                                >
                                    Excluir
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
