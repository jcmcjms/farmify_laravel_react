<?php

namespace App\Models;

use App\Enums\JobStatus;
use App\Enums\JobType;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Job extends Model
{
    use HasFactory, HasUuids, SoftDeletes;

    protected $fillable = [
        'poster_id', 'farm_id', 'title', 'description', 'job_type',
        'pay_rate', 'pay_unit', 'status', 'workers_needed', 'expires_at',
    ];

    protected function casts(): array
    {
        return [
            'pay_rate' => 'decimal:2',
            'job_type' => JobType::class,
            'status' => JobStatus::class,
            'expires_at' => 'datetime',
            'workers_needed' => 'integer',
        ];
    }

    public function poster(): BelongsTo
    {
        return $this->belongsTo(User::class, 'poster_id');
    }

    public function farm(): BelongsTo
    {
        return $this->belongsTo(Farm::class);
    }

    public function applications(): HasMany
    {
        return $this->hasMany(JobApplication::class);
    }

    public function scopeOpen($q)
    {
        return $q->where('status', 'open');
    }

    public function scopeAvailable($q)
    {
        return $q->where('status', 'open')
            ->where('expires_at', '>', now())
            ->orWhereNull('expires_at');
    }
}