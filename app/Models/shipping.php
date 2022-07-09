<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Shipping extends Model
{
    use HasFactory;

    public function order_details()
    {
        return $this->hasMany(Order_detail::class);
    }     
    
    public function shipping_prices_lists()
    {
        return $this->hasMany(Shipping_prices_list::class);
    } 
}
