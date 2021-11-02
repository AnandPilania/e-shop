<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Order_detail extends Model
{
    use HasFactory;

    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    public function shipping()
    {
        return $this->belongsTo(shipping::class);
    }

    public function order()
    {
        return $this->belongsTo(Order::class);
    }

    public function characteristic_order_details()
    {
        return $this->hasMany(Characteristic_order_detail::class);
    }
}
