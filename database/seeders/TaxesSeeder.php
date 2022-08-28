<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class TaxesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('taxes')->insert([
            'name' => 'Tva Belgique',
            'tva_rate' => 21,
        ]);

        DB::table('taxes')->insert([
            'name' => 'Tva France',
            'tva_rate' => 20,
        ]);

        DB::table('taxes')->insert([
            'name' => 'Tva taux réduit',
            'tva_rate' => 6,
        ]);
    }
}
