<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Turma extends Model
{
    protected $fillable = ['nome', 'data_entrada', 'quantidade_alunos'];
}

