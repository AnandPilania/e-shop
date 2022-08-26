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
            $table->float('cost', 8, 2)->nullable()->default(0);
            $table->float('price', 8, 2);
            $table->float('reduced_price', 8, 2)->nullable();
            $table->float('weight', 8, 2)->nullable();
            $table->string('weightMeasure')->default('gr');
            $table->integer('stock')->nullable();
            $table->tinyInteger('unlimitedStock')->default(1);
            $table->integer('sku');
            $table->tinyInteger('deleted')->default(0);
            $table->string('link');
            $table->integer('ordre')->default(0);
            $table->text('options')->nullable();
            $table->string('image_path')->nullable()->default('');
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
