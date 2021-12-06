<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateVariantsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('variants', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('product_id');
            $table->foreign('product_id')->references('id')->on('products');
            $table->integer('varianteId');
            $table->float('cost', 8, 2);
            $table->float('price', 8, 2);
            $table->integer('stock');
            $table->string('image_path');
            $table->string('thumbnail');
            $table->tinyInteger('used')->default(0);
            $table->float('shipping_cost', 8, 2);
            $table->string('currency_cost_shipping');
            $table->string('delivery_company');
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
        Schema::dropIfExists('variants');
    }
}
