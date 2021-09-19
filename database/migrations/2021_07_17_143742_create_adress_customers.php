<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateAdressCustomers extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('adress_customers', function (Blueprint $table) {
            $table->id();
            $table->string('adress');
            $table->string('postal_code');
            $table->string('country');
            $table->string('ship_adress');
            $table->string('ship_postal_code');
            $table->string('ship_country');
            $table->string('phone1')->nullable();
            $table->string('phone2')->nullable();
            $table->unsignedBigInteger('customer_id');
            $table->foreign('customer_id')->references('id')->on('customers');
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
        Schema::dropIfExists('adress_customers');
    }
}
