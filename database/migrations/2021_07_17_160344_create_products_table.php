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
            $table->string('name', 255);
            $table->integer('isInAutoCollection')->default(1);
            $table->string('ribbon', 255)->nullable();
            $table->mediumText('description')->nullable();
            $table->text('imagesPath')->nullable();
            $table->text('onlyTheseCarriers')->nullable();
            $table->string('metaUrl', 255)->nullable();
            $table->string('metaTitle', 255)->nullable();
            $table->mediumText('metaDescription')->nullable();
            $table->string('type')->nullable(); 
            $table->unsignedBigInteger('supplier_id')->nullable()->default(1);
            $table->foreign('supplier_id')->references('id')->on('suppliers');     
            $table->unsignedBigInteger('taxe_id')->nullable()->default(1);
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
