<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateVariantesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('variantes', function (Blueprint $table) {
            $table->id();
            $table->string('optionsString', 255);
            $table->float('cost', 8, 2)->nullable();
            $table->float('price', 8, 2);
            $table->float('reducedPrice', 8, 2)->nullable();
            $table->float('weight', 8, 2)->nullable();
            $table->string('weightMeasure');
            $table->integer('stock')->nullable();
            $table->tinyInteger('unlimitedStock');
            $table->string('sku', 100);
            $table->tinyInteger('deleted');
            $table->text('options')->nullable();
            $table->string('image_path', 500)->nullable();
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
        Schema::dropIfExists('variantes');
    }
}
