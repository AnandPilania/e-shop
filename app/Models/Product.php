<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'image',
        'category',
        'price',
        'description',
    ];

    public function collections()
    {
        return $this->belongsToMany(Collection::class);
    }

    public function orders()
    {
        return $this->belongsToMany(Order::class);
    }

    public function carts()
    {
        return $this->belongsToMany(Cart::class);
    }

    public function shippings()
    {
        return $this->belongsToMany(shipping::class);
    } 

    public function taxe()
    {
        return $this->belongsTo(Taxe::class);
    } 

    public function images_products()
    {
        return $this->hasMany(Images_product::class);
    } 

    public function product_sheet()
    {
        return $this->hasOne(Product_sheet::class);
    }

    public function product_details()
    {
        return $this->hasMany(Product_detail::class);
    }

    public function reviews()
    {
        return $this->hasMany(Review::class);
    }
}
