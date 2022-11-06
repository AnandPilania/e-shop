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

    public function options_name()
    {
        return $this->belongsTo(Options_name::class);
    }

}
