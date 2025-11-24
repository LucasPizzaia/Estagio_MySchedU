import React from "react";
import { useForm, Link } from "@inertiajs/react";

export default function Create() {
    const { data, setData, post, errors } = useForm({
        nome: "",
        local: "Clube",
        quantidade_lugares: "",
    });

    function handleSubmit(e) {
        e.preventDefault();
        post(route("salas.store"));
    }

    return (
        <div className="p-6 max-w-xl mx-auto">
            <h1 className="text-xl font-bold mb-4">Cadastrar Sala</h1>

            <form onSubmit={handleSubmit} className="space-y-4">

                <div>
                    <label className="block font-semibold">Nome</label>
                    <input
                        type="text"
                        className="border p-2 w-full"
                        value={data.nome}
                        onChange={(e) => setData("nome", e.target.value)}
                    />
                    {errors.nome && <p className="text-red-600">{errors.nome}</p>}
                </div>

                <div>
                    <label className="block font-semibold">Local</label>
                    <select
                        className="border p-2 w-full"
                        value={data.local}
                        onChange={(e) => setData("local", e.target.value)}
                    >
                        <option value="Clube">Clube</option>
                        <option value="Ipolon">Ipolon</option>
                    </select>
                    {errors.local && <p className="text-red-600">{errors.local}</p>}
                </div>

                <div>
                    <label className="block font-semibold">Quantidade de Lugares</label>
                    <input
                        type="number"
                        className="border p-2 w-full"
                        value={data.quantidade_lugares}
                        onChange={(e) =>
                            setData("quantidade_lugares", e.target.value)
                        }
                    />
                    {errors.quantidade_lugares && (
                        <p className="text-red-600">{errors.quantidade_lugares}</p>
                    )}
                </div>

                <div className="flex justify-between mt-6">
                    <Link
                        href={route("salas.index")}
                        className="px-4 py-2 bg-gray-500 text-white rounded"
                    >
                        Voltar
                    </Link>

                    <button
                        type="submit"
                        className="px-4 py-2 bg-blue-600 text-white rounded"
                    >
                        Salvar
                    </button>
                </div>
            </form>
        </div>
    );
}
