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
            'name' => 'Sans catégorie',
        ]);

        DB::table('categories')->insert([
            'name' => 'Vêtements',
        ]);

        DB::table('categories')->insert([
            'name' => 'Chaussures',
        ]);

        DB::table('categories')->insert([
            'name' => 'Maroquinerie',
        ]);

        DB::table('categories')->insert([
            'name' => 'Accessoires',
        ]);
        DB::table('categories')->insert([
            'name' => 'Parfums',
        ]);

        DB::table('categories')->insert([
            'name' => 'Maquillage',
        ]);
    }
}
