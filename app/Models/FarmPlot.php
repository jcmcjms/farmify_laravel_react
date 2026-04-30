<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class FarmPlot extends Model
{
    use HasFactory, HasUuids, SoftDeletes;

    protected $fillable = [
        'farm_id', 'name', 'crop_type', 'area_value', 'area_unit',
        'status', 'planted_at', 'harvest_expected',
    ];

    protected function casts(): array
    {
        return [
            'area_value' => 'decimal:2',
            'planted_at' => 'date',
            'harvest_expected' => 'date',
        ];
    }

    public function farm(): BelongsTo
    {
        return $this->belongsTo(Farm::class);
    }
}