<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProfessorDisponibilidade extends Model
{
    protected $table = 'professor_disponibilidades';
    protected $fillable = ['professor_id','weekday','slot'];

    public function professor()
    {
        return $this->belongsTo(Professor::class);
    }
}
