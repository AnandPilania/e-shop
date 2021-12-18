<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateAliProductInfosTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('ali_product_infos', function (Blueprint $table) {
            $table->id();
            $table->string('ali_url_product')->nullable();
            $table->string('ali_product_id')->nullable();
            $table->integer('all_stars')->nullable();
            $table->integer('reviews')->nullable();
            $table->integer('nb_orders')->nullable();
            $table->unsignedBigInteger('product_id');
            $table->foreign('product_id')->references('id')->on('products');
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
        Schema::dropIfExists('ali_product_infos');
    }
}
