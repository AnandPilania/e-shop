<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Images_product extends Model
{
    use HasFactory;

    public function variante()
    {
        return $this->belongsTo(Variante::class);
    }
}
