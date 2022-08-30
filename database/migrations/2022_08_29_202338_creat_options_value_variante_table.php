<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreatOptionsValueVarianteTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('options_value_variante', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('variante_id');
            $table->foreign('variante_id')->references('id')->on('variantes');
            $table->unsignedBigInteger('options_value_id');
            $table->foreign('options_value_id')->references('id')->on('options_values');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('options_value_variante');
    }
}
