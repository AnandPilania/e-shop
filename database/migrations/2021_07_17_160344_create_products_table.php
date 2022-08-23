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
            $table->string('ribbon', 255)->nullable()->default('');
            $table->mediumText('description')->nullable()->default('');
            $table->string('type')->nullable()->default(''); 
            $table->unsignedBigInteger('taxe_id')->nullable()->default(1);
            $table->foreign('taxe_id')->references('id')->on('taxes');           $table->timestamps();
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
