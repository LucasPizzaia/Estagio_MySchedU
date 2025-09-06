<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Professor extends Model
{
    protected $fillable = ['matricula', 'nome', 'sobrenome', 'email'];

   public function disponibilidades() {
    return $this->hasMany(\App\Models\ProfessorDisponibilidade::class);
}
public function unidadesCurriculares() {
    return $this->belongsToMany(\App\Models\UnidadeCurricular::class, 'professor_unidade_curricular')
                ->withTimestamps();
}
}
