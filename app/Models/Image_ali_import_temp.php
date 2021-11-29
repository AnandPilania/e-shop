<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Image_ali_import_temp extends Model
{
    use HasFactory;

    public function product()
    {
        return $this->belongsTo(Product::class);
    } 
}
