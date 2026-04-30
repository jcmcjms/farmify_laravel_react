<?php

namespace Database\Factories;

use App\Enums\UserRole;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class UserFactory extends Factory
{
    protected $model = User::class;

    public function definition(): array
    {
        return [
            'uuid' => Str::uuid()->toString(),
            'name' => fake()->name(),
            'email' => fake()->unique()->safeEmail(),
            'email_verified_at' => now(),
            'password' => Hash::make('password'),
            'role' => UserRole::CONSUMER,
            'phone' => fake()->phoneNumber(),
            'address' => fake()->address(),
            'avatar' => null,
            'rating' => 0,
            'review_count' => 0,
            'is_verified' => false,
            'latitude' => fake()->latitude(5, 15),
            'longitude' => fake()->longitude(120, 125),
            'remember_token' => Str::random(10),
        ];
    }

    public function admin(): static
    {
        return $this->state(fn (array $attributes) => ['role' => UserRole::ADMIN]);
    }

    public function farmer(): static
    {
        return $this->state(fn (array $attributes) => ['role' => UserRole::FARMER]);
    }

    public function laborer(): static
    {
        return $this->state(fn (array $attributes) => ['role' => UserRole::LABORER]);
    }

    public function consumer(): static
    {
        return $this->state(fn (array $attributes) => ['role' => UserRole::CONSUMER]);
    }

    public function rider(): static
    {
        return $this->state(fn (array $attributes) => ['role' => UserRole::RIDER]);
    }

    public function verified(): static
    {
        return $this->state(fn (array $attributes) => ['is_verified' => true]);
    }
}