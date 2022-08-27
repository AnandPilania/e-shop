<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateOptionsNamesTable extends Migration
{
    /**
     * Run the migrations.
     * 
     *Contient le nom des options des variantes ex. Couleurs, Taille, ..
     .
     * @return void
     * 
     */
    public function up()
    {
        Schema::create('options_names', function (Blueprint $table) {
            $table->id();
            $table->string('name');
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
        Schema::dropIfExists('options_names');
    }
}
