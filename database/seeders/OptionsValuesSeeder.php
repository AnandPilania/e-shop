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

        // taille
        DB::table('options_values')->insert([
            'name' => 'S',
            'ordre' => 1,
            'options_names_id' => 5,
        ]);
        DB::table('options_values')->insert([
            'name' => 'M',
            'ordre' => 2,
            'options_names_id' => 5,
        ]);
        DB::table('options_values')->insert([
            'name' => 'L',
            'ordre' => 3,
            'options_names_id' => 5,
        ]);
        DB::table('options_values')->insert([
            'name' => 'XL',
            'ordre' => 4,
            'options_names_id' => 5,
        ]);
        DB::table('options_values')->insert([
            'name' => 'XXL',
            'ordre' => 5,
            'options_names_id' => 5,
        ]);

        // couleur
        DB::table('options_values')->insert([
            'name' => 'Rouge',
            'ordre' => 1,
            'options_names_id' => 1,
        ]);
        DB::table('options_values')->insert([
            'name' => 'Vert',
            'ordre' => 2,
            'options_names_id' => 1,
        ]);
        DB::table('options_values')->insert([
            'name' => 'Bleu',
            'ordre' => 3,
            'options_names_id' => 1,
        ]);
        DB::table('options_values')->insert([
            'name' => 'Jaune',
            'ordre' => 4,
            'options_names_id' => 1,
        ]);
        DB::table('options_values')->insert([
            'name' => 'Mauve',
            'ordre' => 5,
            'options_names_id' => 1,
        ]);
        // poids
        DB::table('options_values')->insert([
            'name' => '1kg',
            'ordre' => 1,
            'options_names_id' => 3,
        ]);
        DB::table('options_values')->insert([
            'name' => '2kg',
            'ordre' => 2,
            'options_names_id' => 3,
        ]);
        DB::table('options_values')->insert([
            'name' => '3kg',
            'ordre' => 3,
            'options_names_id' => 3,
        ]);
        DB::table('options_values')->insert([
            'name' => '5kg',
            'ordre' => 4,
            'options_names_id' => 3,
        ]);
        DB::table('options_values')->insert([
            'name' => '10kg',
            'ordre' => 5,
            'options_names_id' => 3,
        ]);

        //dimession
        DB::table('options_values')->insert([
            'name' => '50 x 50',
            'ordre' => 1,
            'options_names_id' => 2,
        ]);
        DB::table('options_values')->insert([
            'name' => '100 x 100',
            'ordre' => 2,
            'options_names_id' => 2,
        ]);
        DB::table('options_values')->insert([
            'name' => '150 x 150',
            'ordre' => 3,
            'options_names_id' => 2,
        ]);
        DB::table('options_values')->insert([
            'name' => '2000 x 2000',
            'ordre' => 4,
            'options_names_id' => 2,
        ]);
        DB::table('options_values')->insert([
            'name' => '250 x 250',
            'ordre' => 5,
            'options_names_id' => 2,
        ]);

        // matière
        DB::table('options_values')->insert([
            'name' => 'Cotton',
            'ordre' => 1,
            'options_names_id' => 6,
        ]);
        DB::table('options_values')->insert([
            'name' => 'Laine',
            'ordre' => 2,
            'options_names_id' => 6,
        ]);
        DB::table('options_values')->insert([
            'name' => 'Lin',
            'ordre' => 3,
            'options_names_id' => 6,
        ]);
        DB::table('options_values')->insert([
            'name' => 'Soie',
            'ordre' => 4,
            'options_names_id' => 6,
        ]);
        DB::table('options_values')->insert([
            'name' => 'Synthétique',
            'ordre' => 5,
            'options_names_id' => 6,
        ]);

        // surface
        DB::table('options_values')->insert([
            'name' => '1 m²',
            'ordre' => 1,
            'options_names_id' => 4,
        ]);
        DB::table('options_values')->insert([
            'name' => '2 m²',
            'ordre' => 2,
            'options_names_id' => 4,
        ]);
        DB::table('options_values')->insert([
            'name' => '5 m²',
            'ordre' => 3,
            'options_names_id' => 4,
        ]);
        DB::table('options_values')->insert([
            'name' => '10 m²',
            'ordre' => 4,
            'options_names_id' => 4,
        ]);
        DB::table('options_values')->insert([
            'name' => '20 m²',
            'ordre' => 5,
            'options_names_id' => 4,
        ]);



        // for ($i = 1; $i < 31; $i++) {
        //     // product_sheets
        //     DB::table('product_sheets')->insert([
        //         'text' => 'Texte de la fiche technique',
        //         'product_id' => $i,
        //     ]);

        //     // image_product
        //     $ii = $i + 2;
        //     DB::table('images_products')->insert([
        //         'path' => 'images/croppée - Copie (' . $ii . ').jpg',
        //         'alt' => 'mon alt',
        //         'ordre' => 1,
        //         'product_id' => $i,
        //     ]);
        //     DB::table('images_products')->insert([
        //         'path' => 'images/croppée2 - Copie (' . $ii . ').jpg',
        //         'alt' => 'mon alt',
        //         'ordre' => 2,
        //         'product_id' => $i,
        //     ]);

        //     // collection_product
        //     // DB::table('collection_product')->insert([
        //     //     'collection_id' => rand(1,6),
        //     //     'product_id' => $i,
        //     // ]);
        // }
    }
}
