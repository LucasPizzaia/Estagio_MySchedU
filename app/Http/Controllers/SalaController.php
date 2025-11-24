<?php

namespace App\Http\Controllers;

use App\Models\Sala;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SalaController extends Controller
{
    public function index()
    {
        return Inertia::render('Salas/Index', [
            'salas' => Sala::all(),
        ]);
    }

    public function create()
    {
        return Inertia::render('Salas/Create');
    }

    public function store(Request $request)
    {
        $request->validate([
            'nome' => 'required|string|max:255',
            'local' => 'required|in:Clube,Ipolon',
            'quantidade_lugares' => 'required|integer|min:1',
        ]);

        Sala::create($request->all());

        return redirect()->route('salas.index');
    }

    public function edit(Sala $sala)
    {
        return Inertia::render('Salas/Edit', [
            'sala' => $sala,
        ]);
    }

    public function update(Request $request, Sala $sala)
    {
        $request->validate([
            'nome' => 'required|string|max:255',
            'local' => 'required|in:Clube,Ipolon',
            'quantidade_lugares' => 'required|integer|min:1',
        ]);

        $sala->update($request->all());

        return redirect()->route('salas.index');
    }

    public function destroy(Sala $sala)
    {
        $sala->delete();

        return redirect()->route('salas.index');
    }
}
