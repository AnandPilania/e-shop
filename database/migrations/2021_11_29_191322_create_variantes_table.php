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
            $table->float('cost', 8, 2)->default(null);
            $table->float('price', 8, 2)->default(null);
            $table->float('price_before_discount', 8, 2)->nullable()->default(null);
            $table->double('weight', 8, 2)->nullable()->default(null);
            $table->integer('stock')->default(null);
            $table->float('shipping_cost', 8, 2)->nullable()->default(null);
            $table->string('currency_cost_shipping')->nullable()->default(null);
            $table->tinyInteger('active')->default('0');
            $table->string('link');
            $table->integer('ordre')->default(null);
            $table->text('characteristic')->nullable()->default(null);
            $table->unsignedBigInteger('product_id')->default(null);
            $table->foreign('product_id')->references('id')->on('products');
            $table->unsignedBigInteger('supplier_id')->nullable()->default(null);
            $table->foreign('supplier_id')->references('id')->on('suppliers');
            $table->unsignedBigInteger('delivery_company_id')->nullable()->default(null);
            $table->foreign('delivery_company_id')->references('id')->on('delivery_companies');
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
        Schema::dropIfExists('variantes');
    }
}
