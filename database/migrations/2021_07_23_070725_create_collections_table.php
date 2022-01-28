<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateCollectionsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('collections', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->longText('description')->nullable();
            $table->tinyInteger('automatise'); // si la collection s'applique selon des conditions
            $table->tinyInteger('notIncludePrevProduct');
            $table->tinyInteger('allConditionsNeeded');
            $table->longText('objConditions')->nullable();
            $table->dateTime('dateActivation');
            $table->string('alt')->nullable();
            $table->string('imageName')->nullable(); // si on veut changer le nom de l'image pour améliorer le seo
            $table->string('image'); // image path
            $table->string('key'); // identifie les images dans temporaryStorage
            $table->mediumText('link'); // lien de la collection -> meta_url ou name
            $table->mediumText('meta_title')->nullable();
            $table->longText('meta_description')->nullable();
            $table->unsignedBigInteger('category_id')->nullable();
            $table->foreign('category_id')->references('id')->on('categories');
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
        Schema::dropIfExists('collections');
    }
}
