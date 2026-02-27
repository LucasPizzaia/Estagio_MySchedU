<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Ensalamento extends Model
{
protected $fillable = [
    'grade_id', 'professor_id', 'sala_id', 'turma_id', 
    'unidade_curricular_id', 'dia_semana', 'horario_slot'
];

// Relacionamentos para facilitar a busca de nomes no Frontend
public function professor() { return $this->belongsTo(Professor::class); }
public function sala() { return $this->belongsTo(Sala::class); }
public function turma() { return $this->belongsTo(Turma::class); }
public function unidadeCurricular() { return $this->belongsTo(UnidadeCurricular::class); }}
