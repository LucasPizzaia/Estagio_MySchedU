<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        if (!Schema::hasTable('unidades_curriculares')) {
            Schema::create('unidades_curriculares', function (Blueprint $table) {
                $table->id();
                $table->string('nome');
                $table->text('descricao')->nullable();
                $table->string('grupo')->nullable();
                $table->string('codigo')->unique();
                $table->integer('carga_horaria');
                $table->enum('metodo', ['teorica','teorico-pratica','pratica']);
                $table->enum('tipo', ['flex','core','digital']);
                $table->timestamps();
            });
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('unidades_curriculares');
    }
};
