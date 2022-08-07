<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Shipping_modes_condition extends Model
{
    use HasFactory;

    public function shipping_mode()
    {
        return $this->belongsTo(Shipping_mode::class);
    }
}
