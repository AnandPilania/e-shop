<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateAdressUsers extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('address_users', function (Blueprint $table) {
            $table->id();
            $table->string('country');
            $table->string('address');
            $table->string('addressComment')->nullable();
            $table->string('cp');
            $table->string('city');
            $table->string('civilite')->nullable();
            $table->string('phone')->nullable();

            $table->string('first_nameBill')->nullable();
            $table->string('last_nameBill')->nullable();
            $table->string('countryBill')->nullable();
            $table->string('addressBill')->nullable();
            $table->string('addressCommentBill')->nullable();
            $table->string('cpBill')->nullable();
            $table->string('cityBill')->nullable();
            
            $table->unsignedBigInteger('user_id');
            $table->foreign('user_id')->references('id')->on('users');
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
        Schema::dropIfExists('address_users');
    }
}
