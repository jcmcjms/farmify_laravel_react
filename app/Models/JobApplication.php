<?php

namespace App\Models;

use App\Enums\ApplicationStatus;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class JobApplication extends Model
{
    use HasFactory, HasUuids, SoftDeletes;

    protected $fillable = [
        'job_id', 'laborer_id', 'cover_letter', 'status',
    ];

    protected function casts(): array
    {
        return [
            'status' => ApplicationStatus::class,
        ];
    }

    public function job(): BelongsTo
    {
        return $this->belongsTo(Job::class);
    }

    public function laborer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'laborer_id');
    }

    public function scopePending($q)
    {
        return $q->where('status', 'pending');
    }

    public function scopeAccepted($q)
    {
        return $q->where('status', 'accepted');
    }
}