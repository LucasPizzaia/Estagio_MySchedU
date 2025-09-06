<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        if (!Schema::hasTable('professor_unidade_curricular')) {
            Schema::create('professor_unidade_curricular', function (Blueprint $table) {
                $table->id();
                $table->foreignId('professor_id')->constrained('professors')->cascadeOnDelete();
                $table->foreignId('unidade_curricular_id')->constrained('unidades_curriculares')->cascadeOnDelete();
                $table->unique(['professor_id','unidade_curricular_id']);
                $table->timestamps();
            });
        }
    }
    public function down(): void
    {
        Schema::dropIfExists('professor_unidade_curricular');
    }
};
