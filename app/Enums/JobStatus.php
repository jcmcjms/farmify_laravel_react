<?php

namespace App\Enums;

enum JobStatus: string
{
    case OPEN = 'open';
    case CLOSED = 'closed';
    case FILLED = 'filled';
    case EXPIRED = 'expired';

    public function label(): string
    {
        return match ($this) {
            self::OPEN => 'Open',
            self::CLOSED => 'Closed',
            self::FILLED => 'Filled',
            self::EXPIRED => 'Expired',
        };
    }
}