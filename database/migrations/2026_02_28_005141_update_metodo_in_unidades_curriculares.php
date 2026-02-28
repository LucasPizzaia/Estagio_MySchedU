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
    Schema::table('unidades_curriculares', function (Blueprint $table) {
        // Alteramos para string para permitir os novos nomes de cursos
        $table->string('metodo')->change(); 
    });
}
    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('unidades_curriculares', function (Blueprint $table) {
            //
        });
    }
};
