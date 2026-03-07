<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ProfessorController;
use App\Http\Controllers\TurmaController;
use App\Http\Controllers\SalaController;
use App\Http\Controllers\UnidadeCurricularController;
use App\Http\Controllers\EnsalamentoController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

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

Route::middleware(['auth', 'verified'])->group(function () {
    // Recursos Principais
    Route::resource('professores', ProfessorController::class)
        ->parameters(['professores' => 'professor']);

    Route::resource('turmas', TurmaController::class)
        ->parameters(['turmas' => 'turma']);

    Route::resource('unidades-curriculares', UnidadeCurricularController::class)
        ->parameters(['unidades-curriculares' => 'unidadeCurricular']);

    Route::resource('salas', SalaController::class)
        ->parameters(['salas' => 'sala']);

    // Perfil do Usuário
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // --- GESTÃO DE ENSALAMENTO ---

    // 1. Listagem de todas as grades
    Route::get('/ensalamento', [EnsalamentoController::class, 'index'])->name('ensalamento.index');

    // 2. Criação de nova grade (DEVE vir antes da rota {grade})
    Route::get('/ensalamento/create', [EnsalamentoController::class, 'create'])->name('ensalamento.create');
    Route::post('/ensalamento/grade', [EnsalamentoController::class, 'storeGrade'])->name('ensalamento.storeGrade');

    // 3. Edição e Visualização de uma grade específica
    Route::get('/ensalamento/{grade}', [EnsalamentoController::class, 'edit'])->name('ensalamento.edit');
    
    // 4. Exclusão de uma grade (Ajustado para bater com a função 'destroy' do Controller)
    Route::delete('/ensalamento/{grade}', [EnsalamentoController::class, 'destroy'])->name('ensalamento.destroy');

    // 5. Gestão dos Horários/Alocações (Dentro da grade)
    Route::post('/ensalamento/horario', [EnsalamentoController::class, 'storeHorario'])->name('ensalamento.storeHorario');
    
    Route::get('/ensalamento/{grade}/pdf', [EnsalamentoController::class, 'exportarPDF'])->name('ensalamento.pdf');
    Route::delete('/ensalamento/horario/{id}', [EnsalamentoController::class, 'destroyHorario'])->name('ensalamento.destroyHorario');
});

require __DIR__.'/auth.php';