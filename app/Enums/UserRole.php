<?php

namespace App\Enums;

enum UserRole: string
{
    case ADMIN = 'admin';
    case FARMER = 'farmer';
    case LABORER = 'laborer';
    case CONSUMER = 'consumer';
    case RIDER = 'rider';

    public function label(): string
    {
        return match ($this) {
            self::ADMIN => 'Administrator',
            self::FARMER => 'Farmer',
            self::LABORER => 'Laborer',
            self::CONSUMER => 'Consumer',
            self::RIDER => 'Rider',
        };
    }
}