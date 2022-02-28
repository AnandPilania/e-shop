<?php

namespace Database\Seeders;

use App\Models\Variante;
use Illuminate\Database\Seeder;

class VarianteSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        Variante::factory()
        ->times(30)
        ->create();
    }
}
