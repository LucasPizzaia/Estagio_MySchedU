<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
{
    Schema::create('ensalamentos', function (Blueprint $table) {
        $table->id();
        
        // Relacionamento com a Grade (Cenário)
        $table->foreignId('grade_id')->constrained('grades')->onDelete('cascade');

        // As 4 Entidades Principais
        $table->foreignId('professor_id')->constrained('professors');
        $table->foreignId('sala_id')->constrained('salas');
        $table->foreignId('turma_id')->constrained('turmas');
        $table->foreignId('unidade_curricular_id')->constrained('unidades_curriculares');

        // Tempo (Dia e Slot)
        $table->string('dia_semana'); // mon, tue, wed, thu, fri
        $table->string('horario_slot'); // s1, s2
        
        $table->timestamps();
    });
}
    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('ensalamentos');
    }
};
