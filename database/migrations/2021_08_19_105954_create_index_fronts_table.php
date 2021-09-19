<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateIndexFrontsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('index_fronts', function (Blueprint $table) {
            $table->id();
            $table->Text('HeadText')->nullable();
            // gallery 3 images de tête
            $table->string('image0')->nullable();
            $table->string('altImage0')->nullable();
            $table->string('texteImage0')->nullable();
            $table->string('LienImage0')->nullable();
            $table->string('image1')->nullable();
            $table->string('altImage1')->nullable();
            $table->string('texteImage1')->nullable();
            $table->string('LienImage1')->nullable();
            $table->string('image2')->nullable();
            $table->string('altImage2')->nullable();
            $table->string('texteImage2')->nullable();
            $table->string('LienImage2')->nullable();
            
            // block collection 1 

            // image header 
            $table->string('imgColl1')->nullable();
            $table->string('altImgColl1')->nullable();
            $table->Text('headerColl1')->nullable();

            // images et textes produits collection 1
            $table->string('imageProdColl1_0')->nullable();
            $table->string('altimgProdColl1_0')->nullable();
            $table->string('txtColl1_0')->nullable();
            $table->float('priceColl1_0')->nullable();
            $table->string('imageProdColl1_1')->nullable();
            $table->string('altimgProdColl1_1')->nullable();
            $table->string('txtColl1_1')->nullable();
            $table->float('priceColl1_1')->nullable();
            $table->string('imageProdColl1_2')->nullable();
            $table->string('altimgProdColl1_2')->nullable();
            $table->string('txtColl1_2')->nullable();
            $table->float('priceColl1_2')->nullable();
            $table->string('imageProdColl1_3')->nullable();
            $table->string('altimgProdColl1_3')->nullable();
            $table->string('txtColl1_3')->nullable();
            $table->float('priceColl1_3')->nullable();
            $table->string('imageProdColl1_4')->nullable();
            $table->string('altimgProdColl1_4')->nullable();
            $table->string('txtColl1_4')->nullable();
            $table->float('priceColl1_4')->nullable();

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
        Schema::dropIfExists('index_fronts');
    }
}
