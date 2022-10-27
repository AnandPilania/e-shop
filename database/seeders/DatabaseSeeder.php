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
        $this->call(ShippingsSeeder::class);
        $this->call(OptionsNamesSeeder::class);
        $this->call(CategoriesSeeder::class);
        $this->call(CollectionsSeeder::class);
        $this->call(TaxesSeeder::class);
        $this->call(SuppliersSeeder::class);
        $this->call(ProductsSeeder::class);
        $this->call(OptionsValuesSeeder::class);
        $this->call(VarianteSeeder::class);
        $this->call(ConfigsSeeder::class);
    }
}
