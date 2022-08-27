<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Options_value extends Model
{
    use HasFactory;

    public function variante()
    {
        return $this->belongsTo(Variante::class);
    }

    public function options_name()
    {
        return $this->belongsTo(Options_name::class);
    }

}
