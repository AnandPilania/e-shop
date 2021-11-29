<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Variant extends Model
{
    use HasFactory;

    public function product()
    {
        return $this->belongsTo(Product::class);
    } 

    public function product_details()
    {
        return $this->hasMany(Product_detail::class);
    }
}
