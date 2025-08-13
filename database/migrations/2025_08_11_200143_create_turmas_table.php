<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('turmas', function (Blueprint $table) {
            $table->id();
            $table->string('nome');                        // Nome da turma
            $table->date('data_entrada');                  // Data de entrada da turma
            $table->integer('quantidade_alunos')->default(0); // Quantidade de alunos
            $table->timestamps();                          // Timestamps de criação e atualização
        });
    }

    public function down(): void {
        Schema::dropIfExists('turmas');
    }
};
