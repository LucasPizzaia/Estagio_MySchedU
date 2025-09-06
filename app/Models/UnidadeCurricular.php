<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class UnidadeCurricular extends Model
{
    protected $table = 'unidades_curriculares';

    protected $fillable = [
        'nome', 'descricao', 'grupo', 'codigo',
        'carga_horaria', 'metodo', 'tipo',
    ];

    public function professores(): BelongsToMany
    {
        return $this->belongsToMany(Professor::class, 'professor_unidade_curricular')
                    ->withTimestamps();
    }
}
