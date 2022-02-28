<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Delivery_company extends Model
{
    use HasFactory;

    public function variantes()
    {
        return $this->hasMany(Variante::class);
    } 
}
