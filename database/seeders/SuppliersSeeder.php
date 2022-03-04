<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class SuppliersSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {

        for ($i = 1; $i < 6; $i++) {
            DB::table('suppliers')->insert([
                'name' => 'supplier ' . $i,
                'email' => 'supplier@mail',
                'phone' => '32 2 111 22 33',
                'adress' => 'av du supplier',
                'city' => 'Pekin',
                'country' => 'China',
                'web_site' => 'www.suppliers.com',
            ]);
        }
    }
}
