<?php

namespace Database\Factories;

use App\Enums\ProductStatus;
use App\Models\Farm;
use App\Models\Product;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class ProductFactory extends Factory
{
    protected $model = Product::class;

    private static array $categories = ['Vegetables', 'Fruits', 'Grains', 'Livestock', 'Dairy', 'Herbs', 'Flowers', 'Organic'];

    public function definition(): array
    {
        return [
            'name' => fake()->words(3, true),
            'description' => fake()->paragraph(),
            'category' => fake()->randomElement(self::$categories),
            'price' => fake()->randomFloat(2, 10, 1000),
            'price_unit' => 'kg',
            'stock_quantity' => fake()->randomFloat(2, 10, 500),
            'stock_unit' => 'kg',
            'status' => ProductStatus::ACTIVE,
            'images' => [],
        ];
    }

    public function active(): static
    {
        return $this->state(fn (array $attributes) => ['status' => ProductStatus::ACTIVE]);
    }

    public function outOfStock(): static
    {
        return $this->state(fn (array $attributes) => ['status' => ProductStatus::OUT_OF_STOCK, 'stock_quantity' => 0]);
    }

    public function forFarmer(User $farmer): static
    {
        return $this->state(fn (array $attributes) => ['farmer_id' => $farmer->id]);
    }

    public function forFarm(Farm $farm): static
    {
        return $this->state(fn (array $attributes) => ['farm_id' => $farm->id]);
    }
}