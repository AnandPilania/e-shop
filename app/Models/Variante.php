<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Variante extends Model
{
    use HasFactory;

    public function product()
    {
        return $this->belongsTo(Product::class);
    } 

    public function options_values()
    {
        return $this->belongsToMany(Options_value::class);
    }

}
