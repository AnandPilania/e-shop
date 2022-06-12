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
            $table->float('price', 8, 2)->default(0);
            $table->float('prev_price', 8, 2)->default(0);
            $table->double('weight', 8, 2)->nullable()->default(0);
            $table->integer('stock')->nullable()->default(0);
            $table->float('shipping_cost', 8, 2)->nullable()->default(0);
            $table->string('currency_cost_shipping')->nullable()->default(0);
            $table->tinyInteger('active')->default('0');
            $table->string('link');
            $table->integer('ordre')->default(0);
            $table->text('options')->nullable()->default('');
            $table->text('image_path')->nullable()->default('');
            $table->unsignedBigInteger('product_id');
            $table->foreign('product_id')->references('id')->on('products');
            $table->unsignedBigInteger('supplier_id')->nullable()->default(null);
            $table->foreign('supplier_id')->references('id')->on('suppliers');
            $table->unsignedBigInteger('delivery_company_id')->nullable()->default(null);
            $table->foreign('delivery_company_id')->references('id')->on('delivery_companies');
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
