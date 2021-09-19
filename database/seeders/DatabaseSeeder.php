<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Database\Seeders\TaxesSeeder;
use Database\Seeders\CategoriesSeeder;
use Database\Seeders\CollectionsSeeder;
use Database\Seeders\Type_Detail_ProductSeeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run()
    {
        // \App\Models\User::factory(10)->create();
        $this->call(Type_Detail_ProductSeeder::class);
        $this->call(CategoriesSeeder::class);
        $this->call(CollectionsSeeder::class);
        $this->call(TaxesSeeder::class);
        $this->call(ProductsSeeder::class);
        $this->call(ProductDetailsSeeder::class);
    }
}
