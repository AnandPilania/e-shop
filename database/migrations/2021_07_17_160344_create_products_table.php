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
            $table->string('ali_product_id')->nullable();
            $table->integer('global_stars')->nullable();
            $table->integer('ali_reviews')->nullable();
            $table->integer('ali_orders')->nullable();
            $table->mediumText('description')->nullable();
            $table->string('link');
            $table->string('type');
            $table->boolean('best_sell')->nullable();
            $table->integer('ordre');
            $table->unsignedBigInteger('taxe_id');
            $table->foreign('taxe_id')->references('id')->on('taxes');
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
