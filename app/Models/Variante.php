<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Variante extends Model
{
    use HasFactory;

    public function delivery_company()
    {
        return $this->belongsTo(Delivery_company::class);
    }

    public function images_products()
    {
        return $this->hasMany(Images_product::class);
    } 

    public function product()
    {
        return $this->belongsTo(Product::class);
    } 

    public function supplier() 
    {
        return $this->belongsTo(Supplier::class);
    }

    public function taxe()
    {
        return $this->belongsTo(Taxe::class);
    } 

}
