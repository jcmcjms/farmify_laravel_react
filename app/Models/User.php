<?php

namespace App\Models;

use App\Enums\UserRole;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use Illuminate\Database\Eloquent\Relations\MorphToMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable, SoftDeletes;

    protected $fillable = [
        'name', 'email', 'password', 'role', 'phone', 'address',
        'avatar', 'rating', 'review_count', 'is_verified', 'latitude', 'longitude',
    ];

    protected $hidden = ['password', 'remember_token'];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'role' => UserRole::class,
            'is_verified' => 'boolean',
            'rating' => 'decimal:2',
            'latitude' => 'decimal:8',
            'longitude' => 'decimal:8',
        ];
    }

    public function farms(): HasMany
    {
        return $this->hasMany(Farm::class, 'owner_id');
    }

    public function farmMemberships(): HasMany
    {
        return $this->hasMany(FarmMember::class);
    }

    public function farmsAsMember(): MorphToMany
    {
        return $this->morphedByMany(Farm::class, 'memberable', 'farm_members');
    }

    public function products(): HasMany
    {
        return $this->hasMany(Product::class, 'farmer_id');
    }

    public function postedJobs(): HasMany
    {
        return $this->hasMany(Job::class, 'poster_id');
    }

    public function applications(): HasMany
    {
        return $this->hasMany(JobApplication::class, 'laborer_id');
    }

    public function reviews(): HasMany
    {
        return $this->hasMany(ProductReview::class, 'reviewer_id');
    }

    public function receivedReviews(): HasMany
    {
        return $this->hasMany(ProductReview::class, 'farmer_id');
    }

    public function notifications(): HasMany
    {
        return $this->hasMany(Notification::class);
    }

    public function cartItems(): HasMany
    {
        return $this->hasMany(CartItem::class);
    }

    public function orders(): HasMany
    {
        return $this->hasMany(Order::class);
    }

    public function isAdmin(): bool
    {
        return $this->role === UserRole::ADMIN;
    }

    public function isFarmer(): bool
    {
        return $this->role === UserRole::FARMER;
    }

    public function isLaborer(): bool
    {
        return $this->role === UserRole::LABORER;
    }

    public function isConsumer(): bool
    {
        return $this->role === UserRole::CONSUMER;
    }

    public function isRider(): bool
    {
        return $this->role === UserRole::RIDER;
    }
}