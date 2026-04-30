<?php
namespace App\Enums;
enum FarmMemberRole: string
{
    case OWNER = 'owner';
    case MANAGER = 'manager';
    case LABORER = 'laborer';
    case VISITOR = 'visitor';
}