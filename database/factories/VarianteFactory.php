<?php

namespace Database\Factories;

use App\Models\Variante;
use Illuminate\Database\Eloquent\Factories\Factory;

class VarianteFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = Variante::class;
    private static $ordre = 1;
    private static $prod_id = 1;
    private static $prev_prod_id = 1;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        if (self::$prev_prod_id !== self::$prod_id++) {

        }
        $name = $this->faker->sentence(3, true);
        $amount = rand(1,50);

        return [
            'optionsString' => $name, 
            'cost' => $amount, 
            'price'=> $amount * 1.5, 
            'reducedPrice'=> $amount * 2, 
            'weight' => rand(1,3), 
            'weightMeasure' => 'gr', 
            'stock' => rand(0,50),
            'unlimitedStock' => rand(0,1),
            'sku' => '123456789', 
            'deleted' => 0,
            'options' => "['color' => 'red', 'size' => 'm']", 
            'image_path' => "image path", 
            // 'product_id' => self::$prod_id++, <--- est géré dans le seeder !!
        ];
    }
}
