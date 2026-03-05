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
    Schema::table('ensalamentos', function (Blueprint $table) {
        $table->boolean('is_digital')->default(false)->after('horario_slot');
        // Aproveite para garantir que a sala possa ser nula se não fez no phpMyAdmin
        $table->foreignId('sala_id')->nullable()->change();
    });
}

public function down()
{
    Schema::table('ensalamentos', function (Blueprint $table) {
        $table->dropColumn('is_digital');
    });
}
};
