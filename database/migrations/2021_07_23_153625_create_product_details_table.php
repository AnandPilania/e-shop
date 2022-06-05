<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateProductDetailsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('product_details', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('img_path')->nullable();
            $table->integer('ordre');
            $table->unsignedBigInteger('variante_id');
            $table->foreign('variante_id')->references('id')->on('variantes');
            $table->unsignedBigInteger('type_detail_product_id');
            $table->foreign('type_detail_product_id')->references('id')->on('type_detail_products');
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
        Schema::dropIfExists('product_details');
    }
}
