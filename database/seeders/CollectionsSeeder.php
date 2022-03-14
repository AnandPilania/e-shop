<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CollectionsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('collections')->insert([
            'name' => 'Robes',
            'image' => '',
            'alt' => 'mon alt',
            'link' => 'robes',
            'category_id' => 1,
            'description' => 'description',
            'automatise' => '1',
            'notIncludePrevProduct' => '1',
            'allConditionsNeeded' => '1',
            'dateActivation' => '2021-02-25 12:00:00',
            'created_at' => '2021-02-25 12:00:00',
        ]);

        DB::table('collections')->insert([
            'name' => 'Bottes',
            'image' => '',
            'alt' => 'mon alt',
            'link' => 'bottes',
            'category_id' => 2,
            'description' => 'description',
            'automatise' => '1',
            'notIncludePrevProduct' => '1',
            'allConditionsNeeded' => '1',
            'dateActivation' => '2021-03-30 12:00:00',
            'created_at' => '2021-03-30 12:00:00',
        ]);

        DB::table('collections')->insert([
            'name' => 'Sacs',
            'image' => '',
            'alt' => 'mon alt',
            'link' => 'sacs',
            'category_id' => 3,
            'description' => 'description',
            'automatise' => '1',
            'notIncludePrevProduct' => '1',
            'allConditionsNeeded' => '1',
            'dateActivation' => '2021-04-30 12:00:00',
            'created_at' => '2021-04-30 12:00:00',
        ]);

        DB::table('collections')->insert([
            'name' => 'Chapeaux',
            'image' => '',
            'alt' => 'mon alt',
            'link' => 'chapeaux',
            'category_id' => 4,
            'description' => 'description',
            'automatise' => '1',
            'notIncludePrevProduct' => '1',
            'allConditionsNeeded' => '1',
            'dateActivation' => '2022-01-30 12:00:00',
            'created_at' => '2022-01-30 12:00:00',
        ]);
        DB::table('collections')->insert([
            'name' => 'Parfums',
            'image' => '',
            'alt' => 'mon alt',
            'link' => 'parfums',
            'category_id' => 5,
            'description' => 'description',
            'automatise' => '1',
            'notIncludePrevProduct' => '1',
            'allConditionsNeeded' => '1',
            'dateActivation' => '2022-03-30 12:00:00',
            'created_at' => '2022-01-30 12:00:00',
        ]);

        DB::table('collections')->insert([
            'name' => 'Rouge à lèvres',
            'image' => '',
            'alt' => 'mon alt',
            'link' => 'rouge-a-levres',
            'category_id' => 6,
            'description' => 'description',
            'automatise' => '1',
            'notIncludePrevProduct' => '1',
            'allConditionsNeeded' => '1',
            'dateActivation' => '2022-10-30 12:00:00',
            'created_at' => '2022-01-30 12:00:00',
        ]);
    }
}
