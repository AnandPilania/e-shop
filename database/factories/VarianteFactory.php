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

        $link = str_replace(' ', '-', $name);
        $search = array('À', 'Á', 'Â', 'Ã', 'Ä', 'Å', 'Ç', 'È', 'É', 'Ê', 'Ë', 'Ì', 'Í', 'Î', 'Ï', 'Ò', 'Ó', 'Ô', 'Õ', 'Ö', 'Ù', 'Ú', 'Û', 'Ü', 'Ý', 'à', 'á', 'â', 'ã', 'ä', 'å', 'ç', 'è', 'é', 'ê', 'ë', 'ì', 'í', 'î', 'ï', 'ð', 'ò', 'ó', 'ô', 'õ', 'ö', 'ù', 'ú', 'û', 'ü', 'ý', 'ÿ');
        $replace = array('A', 'A', 'A', 'A', 'A', 'A', 'C', 'E', 'E', 'E', 'E', 'I', 'I', 'I', 'I', 'O', 'O', 'O', 'O', 'O', 'U', 'U', 'U', 'U', 'Y', 'a', 'a', 'a', 'a', 'a', 'a', 'c', 'e', 'e', 'e', 'e', 'i', 'i', 'i', 'i', 'o', 'o', 'o', 'o', 'o', 'o', 'u', 'u', 'u', 'u', 'y', 'y');
        $cleanLink = str_replace($search, $replace, $link);
        $link = strtolower($cleanLink);
        $amount = rand(1,50);

        return [
            'cost' => $amount, 
            'price'=> $amount * 1.5, 
            'reduced_price'=> $amount * 2, 
            'weight' => rand(1,3), 
            'stock' => rand(0,50),
            'shipping_cost' => rand(1,30), 
            'currency_cost_shipping' => rand(1,3),
            'active' => 1, 
            'link' => $link, 
            'ordre' => self::$ordre++, 
            'options' => "['color' => 'red', 'size' => 'm']", 
            'image_path' => "image path", 
            // 'product_id' => self::$prod_id++, <--- est géré dans le seeder !!
            'supplier_id' => rand(1,5),
            'delivery_company_id' => 1,
        ];
    }
}
