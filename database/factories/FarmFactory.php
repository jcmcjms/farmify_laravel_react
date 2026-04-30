<?php

namespace Database\Factories;

use App\Models\Farm;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class FarmFactory extends Factory
{
    protected $model = Farm::class;

    public function definition(): array
    {
        return [
            'name' => fake()->company() . ' Farm',
            'description' => fake()->paragraph(),
            'address' => fake()->address(),
            'latitude' => fake()->latitude(5, 15),
            'longitude' => fake()->longitude(120, 125),
            'size_value' => fake()->randomFloat(2, 1, 100),
            'size_unit' => 'hectares',
            'status' => 'approved',
        ];
    }

    public function pending(): static
    {
        return $this->state(fn (array $attributes) => ['status' => 'pending']);
    }

    public function approved(): static
    {
        return $this->state(fn (array $attributes) => ['status' => 'approved']);
    }

    public function forOwner(User $owner): static
    {
        return $this->state(fn (array $attributes) => ['owner_id' => $owner->id]);
    }
}