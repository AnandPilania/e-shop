<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product_detail extends Model
{
    use HasFactory;

    public function variante()
    {
        return $this->belongsTo(Variante::class);
    }

    public function type_detail_product()
    {
        return $this->belongsTo(Type_detail_product::class);
    }

}
