<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ProfessorController;
use App\Http\Controllers\TurmaController; 
use App\Http\Controllers\UnidadeCurricularController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Rota inicial -> redireciona para Professores se logado
Route::get('/', function () {
    if (auth()->check()) {
        return redirect()->route('professores.index');
    }

    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

// Rotas protegidas (usuário precisa estar logado e verificado)
Route::middleware(['auth', 'verified'])->group(function () {
    // Professores
    Route::resource('professores', ProfessorController::class)
        ->parameters(['professores' => 'professor']);

    // Turmas
    Route::resource('turmas', TurmaController::class)
        ->parameters(['turmas' => 'turma']);

    // Unidades Curriculares
    Route::resource('unidades-curriculares', UnidadeCurricularController::class)
        ->parameters(['unidades-curriculares' => 'unidadeCurricular']);

    // Perfil
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

// Auth padrão (login, registro, etc.)
require __DIR__.'/auth.php';
