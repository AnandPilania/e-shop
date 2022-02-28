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
            'image' => 'images/1631127753.jpg
            ',
            'alt' => 'mon alt',
            'link' => 'robes',
            'category_id' => 1,
            'description' => 'description',
            'automatise' => '1',
            'notIncludePrevProduct' => '1',
            'allConditionsNeeded' => '1',
            'dateActivation' => '2021/02/30 12',
        ]);

        DB::table('collections')->insert([
            'name' => 'Bottes',
            'image' => 'images/1631127767.jpg
            ',
            'alt' => 'mon alt',
            'link' => 'bottes',
            'category_id' => 2,
            'description' => 'description',
            'automatise' => '1',
            'notIncludePrevProduct' => '1',
            'allConditionsNeeded' => '1',
            'dateActivation' => '2021/06/30 12',
        ]);

        DB::table('collections')->insert([
            'name' => 'Sacs',
            'image' => 'images/1631127779.jpg
            ',
            'alt' => 'mon alt',
            'link' => 'sacs',
            'category_id' => 3,
            'description' => 'description',
            'automatise' => '1',
            'notIncludePrevProduct' => '1',
            'allConditionsNeeded' => '1',
            'dateActivation' => '2021/10/30 12',
        ]);

        DB::table('collections')->insert([
            'name' => 'Chapeaux',
            'image' => 'images/1631127923.jpg
            ',
            'alt' => 'mon alt',
            'link' => 'chapeaux',
            'category_id' => 4,
            'description' => 'description',
            'automatise' => '1',
            'notIncludePrevProduct' => '1',
            'allConditionsNeeded' => '1',
            'dateActivation' => '2022/01/30 12',
        ]);
        DB::table('collections')->insert([
            'name' => 'Parfums',
            'image' => 'images/1631127798.jpg
            ',
            'alt' => 'mon alt',
            'link' => 'parfums',
            'category_id' => 5,
            'description' => 'description',
            'automatise' => '1',
            'notIncludePrevProduct' => '1',
            'allConditionsNeeded' => '1',
            'dateActivation' => '2022/06/30 12',
        ]);

        DB::table('collections')->insert([
            'name' => 'Rouge à lèvres',
            'image' => 'images/1631127827.jpg
            ',
            'alt' => 'mon alt',
            'link' => 'rouge-a-levres',
            'category_id' => 6,
            'description' => 'description',
            'automatise' => '1',
            'notIncludePrevProduct' => '1',
            'allConditionsNeeded' => '1',
            'dateActivation' => '2022/08/30 12',
        ]);
    }
}
