<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Customer extends Model
{
    use HasFactory;

    public function orders()
    {
        return $this->hasMany(Order::class);
    }

    public function adress_client()
    {
        return $this->hasOne(Adress_customer::class);
    }

    public function cart()
    {
        return $this->hasOne(Cart::class);
    }
}
