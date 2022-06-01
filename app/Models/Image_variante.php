<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Image_variante extends Model
{
    use HasFactory;

    public function variante()
    {
        return $this->belongsTo(Variante::class);
    }
}
