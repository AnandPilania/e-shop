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
            $table->unsignedBigInteger('product_id')->nullable()->default(null);
            $table->foreign('product_id')->references('id')->on('products');
            $table->unsignedBigInteger('variante_id')->nullable()->default(null);
            $table->foreign('variante_id')->references('id')->on('variantes');
            $table->float('cost', 8, 2)->nullable()->default(null);
            $table->float('price', 8, 2)->nullable()->default(null);
            $table->double('weight', 8, 2)->nullable()->default(null);
            $table->integer('stock')->nullable()->default(null);
            $table->float('shipping_cost', 8, 2)->nullable()->default(null);
            $table->string('currency_cost_shipping')->nullable()->default(null);
            $table->tinyInteger('active')->default('0');
            $table->string('delivery_company')->nullable()->default(null);
            $table->string('link');
            $table->string('type')->nullable()->default(null);
            $table->string('tag')->nullable()->default(null);
            $table->integer('ordre')->nullable()->default(null);
            $table->json('characteristic')->nullable()->default(null);
            $table->unsignedBigInteger('taxe_id')->nullable()->default(null);
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
        Schema::dropIfExists('variants');
    }
}
