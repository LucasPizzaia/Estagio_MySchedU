<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        if (!Schema::hasTable('professor_disponibilidades')) {
            Schema::create('professor_disponibilidades', function (Blueprint $table) {
                $table->id();
                $table->foreignId('professor_id')->constrained('professors')->cascadeOnDelete();
                $table->enum('weekday', ['mon','tue','wed','thu','fri']);
                $table->enum('slot', ['s1','s2']); // s1=19:00–20:30, s2=20:45–22:10
                $table->unique(['professor_id','weekday','slot']);
                $table->timestamps();
            });
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('professor_disponibilidades');
    }
};
