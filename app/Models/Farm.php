<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasManyThrough;
use Illuminate\Database\Eloquent\SoftDeletes;

class Farm extends Model
{
    use HasFactory, HasUuids, SoftDeletes;

    protected $fillable = [
        'owner_id', 'name', 'description', 'address', 'latitude', 'longitude',
        'size_value', 'size_unit', 'status',
    ];

    protected function casts(): array
    {
        return [
            'latitude' => 'decimal:8',
            'longitude' => 'decimal:8',
            'size_value' => 'decimal:2',
        ];
    }

    public function owner(): BelongsTo
    {
        return $this->belongsTo(User::class, 'owner_id');
    }

    public function members(): HasMany
    {
        return $this->hasMany(FarmMember::class);
    }

    public function users(): HasManyThrough
    {
        return $this->hasManyThrough(User::class, FarmMember::class, 'farm_id', 'user_id', 'id', 'id');
    }

    public function plots(): HasMany
    {
        return $this->hasMany(FarmPlot::class);
    }

    public function products(): HasMany
    {
        return $this->hasMany(Product::class);
    }

    public function jobs(): HasMany
    {
        return $this->hasMany(Job::class);
    }

    public function scopeApproved($q)
    {
        return $q->where('status', 'approved');
    }

    public function scopePending($q)
    {
        return $q->where('status', 'pending');
    }
}