<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Options_name extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
    ];

    public function options_values()
    {
        return $this->hasMany(Options_value::class);
    }
}
