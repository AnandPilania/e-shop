<?php

namespace Database\Seeders;

use App\Models\Product;
use App\Models\Variante;
use Illuminate\Database\Seeder;
use Illuminate\Database\Eloquent\Factories\Sequence;

class VarianteSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    
    //fn ($sequence) => ajoute un id de Product aléatoirement pour peupler product_id
    public function run()
    {
        Variante::factory()
        ->times(100)
        ->state(new Sequence(
            fn ($sequence) => ['product_id' => Product::all('id')->random()],
        ))
        ->create();
    }
}
