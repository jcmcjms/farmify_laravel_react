<?php

namespace App\Enums;

enum JobType: string
{
    case DAILY = 'daily';
    case SEASONAL = 'seasonal';
    case PERMANENT = 'permanent';

    public function label(): string
    {
        return match ($this) {
            self::DAILY => 'Daily',
            self::SEASONAL => 'Seasonal',
            self::PERMANENT => 'Permanent',
        };
    }
}