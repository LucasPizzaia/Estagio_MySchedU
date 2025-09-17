<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('professors', function (Blueprint $table) {
            // Adiciona o campo 'availability' do tipo JSON
            $table->json('availability')->nullable();
        });
    }

    public function down(): void
    {
        Schema::table('professors', function (Blueprint $table) {
            // Remove o campo 'availability' caso a migration seja revertida
            $table->dropColumn('availability');
        });
    }
};

