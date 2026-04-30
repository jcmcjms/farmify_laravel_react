<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class FarmMember extends Model
{
    use HasFactory, HasUuids;

protected $fillable = [
        'farm_', 'user_', 'role', 'status', 'status',
    ];

    protected function casts(): array
    {
        return [
            'role' => FarmMemberRole::class,
        ];
    }

    public function farm(): BelongsTo
    {
        return $this->belongsTo(Farm::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}