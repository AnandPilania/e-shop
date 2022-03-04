<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ProductDetailsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        for ($i = 1; $i < 31; $i++) {
            // product_details
            // taille
            DB::table('product_details')->insert([
                'libelle' => 'S',
                'ordre' => 1,
                'product_id' => $i,
                'type_detail_product_id' => 5,
            ]);
            DB::table('product_details')->insert([
                'libelle' => 'M',
                'ordre' => 2,
                'product_id' => $i,
                'type_detail_product_id' => 5,
            ]);
            DB::table('product_details')->insert([
                'libelle' => 'L',
                'ordre' => 3,
                'product_id' => $i,
                'type_detail_product_id' => 5,
            ]);
            DB::table('product_details')->insert([
                'libelle' => 'XL',
                'ordre' => 4,
                'product_id' => $i,
                'type_detail_product_id' => 5,
            ]);
            DB::table('product_details')->insert([
                'libelle' => 'XXL',
                'ordre' => 5,
                'product_id' => $i,
                'type_detail_product_id' => 5,
            ]);

            // couleur
            DB::table('product_details')->insert([
                'libelle' => 'Rouge',
                'ordre' => 1,
                'product_id' => $i,
                'type_detail_product_id' => 1,
            ]);
            DB::table('product_details')->insert([
                'libelle' => 'Vert',
                'ordre' => 2,
                'product_id' => $i,
                'type_detail_product_id' => 1,
            ]);
            DB::table('product_details')->insert([
                'libelle' => 'Bleu',
                'ordre' => 3,
                'product_id' => $i,
                'type_detail_product_id' => 1,
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
                'ordre' => 1,
                'product_id' => $i,
            ]);
            DB::table('images_products')->insert([
                'path' => 'images/croppée2 - Copie (' . $ii . ').jpg',
                'alt' => 'mon alt',
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
