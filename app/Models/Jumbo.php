<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Jumbo extends Model
{
    use HasFactory;

    protected $fillable = [
        'text',
        'button_text',
        'image',
    ];
}
