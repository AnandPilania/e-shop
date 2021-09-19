<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class Type_Detail_ProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('type_detail_products')->insert([
            'name' => 'Couleur',
        ]);

        DB::table('type_detail_products')->insert([
            'name' => 'Dimension',
        ]);

        DB::table('type_detail_products')->insert([
            'name' => 'Poids',
        ]);

        DB::table('type_detail_products')->insert([
            'name' => 'Surface',
        ]);
        DB::table('type_detail_products')->insert([
            'name' => 'Taille',
        ]);

        DB::table('type_detail_products')->insert([
            'name' => 'Matière',
        ]);
    }
}
