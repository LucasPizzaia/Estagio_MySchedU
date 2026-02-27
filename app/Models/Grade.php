<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Grade extends Model
{
protected $fillable = ['nome', 'periodo', 'status'];

public function ensalamentos() {
    return $this->hasMany(Ensalamento::class);
}}
