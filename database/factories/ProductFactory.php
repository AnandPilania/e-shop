<?php

namespace Database\Factories;

use App\Models\product;
use Illuminate\Database\Eloquent\Factories\Factory;

class ProductFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = product::class;
    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {

        $name = $this->faker->sentence(3, true);
        $type = ['type 1', 'type 2', 'type 3'];
        $random = rand(0, 2);
        return [
            'name' => $name,
            'description' => $this->faker->sentence(15, true),
            'type' => $type[$random],
        ];
    }
}
