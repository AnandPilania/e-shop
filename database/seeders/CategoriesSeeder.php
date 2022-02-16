<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CategoriesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('categories')->insert([
            'name' => 'Vêtements',
            'color' => '#9013FE',
        ]);

        DB::table('categories')->insert([
            'name' => 'Chaussures',
            'color' => '#4A90E2',
        ]);

        DB::table('categories')->insert([
            'name' => 'Maroquinerie',
            'color' => '#50E3C2',
        ]);

        DB::table('categories')->insert([
            'name' => 'Accessoires',
            'color' => '#B8E986',
        ]);
        DB::table('categories')->insert([
            'name' => 'Parfums',
            'color' => '#000000',
        ]);

        DB::table('categories')->insert([
            'name' => 'Maquillage',
            'color' => '#4AEA4A',
        ]);
    }
}
