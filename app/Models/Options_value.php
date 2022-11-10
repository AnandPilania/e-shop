<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Options_value extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
    ];

    protected $with = [
        'options_name',
    ];

    public function options_name()
    {
        return $this->belongsTo(Options_name::class);
    }

    public function variantes()
    {
        return $this->belongsToMany(Variante::class);
    }

}
