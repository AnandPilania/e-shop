<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateOptionsValuesTable extends Migration
{
    /**
     * Run the migrations.
     * 
     * Contient les values des options des variantes ex. s, m, l ou Rouge, Vert, ...
     *
     * @return void
     */
    public function up()
    {
        Schema::create('options_values', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->integer('ordre');
            $table->unsignedBigInteger('options_name_id');
            $table->foreign('options_name_id')->references('id')->on('options_names');
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
        Schema::dropIfExists('options_values');
    }
}
