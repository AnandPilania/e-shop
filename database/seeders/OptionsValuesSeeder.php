<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class OptionsValuesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        for ($i = 1; $i < 31; $i++) {
            // options_values
            // taille
            DB::table('options_values')->insert([
                'name' => 'S',
                'ordre' => 1,
                'variante_id' => $i,
                'options_names_id' => 5,
            ]);
            DB::table('options_values')->insert([
                'name' => 'M',
                'ordre' => 2,
                'variante_id' => $i,
                'options_names_id' => 5,
            ]);
            DB::table('options_values')->insert([
                'name' => 'L',
                'ordre' => 3,
                'variante_id' => $i,
                'options_names_id' => 5,
            ]);
            DB::table('options_values')->insert([
                'name' => 'XL',
                'ordre' => 4,
                'variante_id' => $i,
                'options_names_id' => 5,
            ]);
            DB::table('options_values')->insert([
                'name' => 'XXL',
                'ordre' => 5,
                'variante_id' => $i,
                'options_names_id' => 5,
            ]);

            // couleur
            DB::table('options_values')->insert([
                'name' => 'Rouge',
                'ordre' => 1,
                'variante_id' => $i,
                'options_names_id' => 1,
            ]);
            DB::table('options_values')->insert([
                'name' => 'Vert',
                'ordre' => 2,
                'variante_id' => $i,
                'options_names_id' => 1,
            ]);
            DB::table('options_values')->insert([
                'name' => 'Bleu',
                'ordre' => 3,
                'variante_id' => $i,
                'options_names_id' => 1,
            ]);

            // product_sheets
            DB::table('product_sheets')->insert([
                'text' => 'Texte de la fiche technique',
                'product_id' => $i,
            ]);

            // image_product
            $ii = $i + 2;
            DB::table('images_products')->insert([
                'path' => 'images/croppée - Copie (' . $ii . ').jpg',
                'alt' => 'mon alt',
                'title' => 'mon title',
                'ordre' => 1,
                'product_id' => $i,
            ]);
            DB::table('images_products')->insert([
                'path' => 'images/croppée2 - Copie (' . $ii . ').jpg',
                'alt' => 'mon alt',
                'title' => 'mon title',
                'ordre' => 2,
                'product_id' => $i,
            ]);

            // collection_product
            // DB::table('collection_product')->insert([
            //     'collection_id' => rand(1,6),
            //     'product_id' => $i,
            // ]);
        }
    }
}
