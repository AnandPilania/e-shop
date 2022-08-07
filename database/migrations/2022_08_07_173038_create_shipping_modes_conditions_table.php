<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateShippingModesConditionsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('shipping_modes_conditions', function (Blueprint $table) {
            $table->id();
            $table->string('name', 255);
            $table->float('min_value', 8, 2);
            $table->float('max_value', 8, 2);
            $table->float('modeTarif', 8, 2);
            $table->unsignedBigInteger('shipping_mode_id');
            $table->foreign('shipping_mode_id')->references('id')->on('shipping_modes');
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
        Schema::dropIfExists('shipping_modes_conditions');
    }
}
