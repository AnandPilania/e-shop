<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Shipping_mode extends Model
{
    use HasFactory;

    public function shipping()
    {
        return $this->belongsTo(Shipping::class);
    }

    public function shipping_modes_conditions()
    {
        return $this->hasMany(Shipping_modes_condition::class);
    }
}
