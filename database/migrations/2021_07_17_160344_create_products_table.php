<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateProductsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('ali_url_product')->nullable();
            $table->string('global_stars')->nullable();
            $table->string('reviews')->nullable();
            $table->string('orders')->nullable();
            $table->float('price', 8, 2);
            $table->mediumText('description')->nullable();
            $table->string('link');
            $table->boolean('best_sell')->nullable();
            $table->integer('ordre');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('products');
    }
}
