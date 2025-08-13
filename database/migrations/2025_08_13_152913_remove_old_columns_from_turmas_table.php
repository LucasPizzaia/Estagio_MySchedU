<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
{
    Schema::table('turmas', function (Blueprint $table) {
        // Remover os campos antigos
        $table->dropColumn(['disciplina_id', 'sala_id', 'horario_id']);
        
        // Adicionar os novos campos
        $table->date('data_entrada')->nullable();
        $table->integer('quantidade_alunos')->default(0);
    });
}

public function down()
{
    Schema::table('turmas', function (Blueprint $table) {
        // Reverter as mudanças (se necessário)
        $table->integer('disciplina_id')->nullable();
        $table->integer('sala_id')->nullable();
        $table->integer('horario_id')->nullable();
        
        $table->dropColumn(['data_entrada', 'quantidade_alunos']);
    });
}
};
