<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Type_detail_product extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
    ];

    public function product_details()
    {
        return $this->hasMany(Product_detail::class);
    }
}
