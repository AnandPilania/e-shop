<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ShippingsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
            DB::table('shippings')->insert([
                'zone_name' => 'Free',
                'destinations' => '[{"id":2,"name":"Afghanistan","code_1":"AF","code_2":"AFG","code_3":4},{"id":3,"name":"Afrique du Sud","code_1":"ZA","code_2":"ZAF","code_3":710},{"id":4,"name":"Albanie","code_1":"AL","code_2":"ALB","code_3":8},{"id":5,"name":"Algérie","code_1":"DZ","code_2":"DZA","code_3":12}]',
            ]);

            DB::table('shipping_modes')->insert([
                'mode_name' => 'Free',
                'criteria' => 'simple',
                'conditions' => '[{"id":0,"min_value":0,"max_value":"","modeTarif":""}]',
                'price_without_condition' => 0,
                'shipping_id' => 1,
            ]);

    }
}
