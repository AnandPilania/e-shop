<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Shipping_prices_list extends Model
{
    use HasFactory;

    public function shipping()
    {
        return $this->belongsTo(Shipping::class);
    }
}
