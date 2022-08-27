<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class OptionsNamesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('options_names')->insert([
            'name' => 'Couleur',
        ]);

        DB::table('options_names')->insert([
            'name' => 'Dimension',
        ]);

        DB::table('options_names')->insert([
            'name' => 'Poids',
        ]);

        DB::table('options_names')->insert([
            'name' => 'Surface',
        ]);
        DB::table('options_names')->insert([
            'name' => 'Taille',
        ]);

        DB::table('options_names')->insert([
            'name' => 'Matière',
        ]);
    }
}
