<?php

namespace App\Http\Resources;

use Illuminate\Http\JsonResponse;

class ApiResponse extends JsonResponse
{
    public function __construct(mixed $data = null, ?string $message = null, int $code = 200)
    {
        $body = [
            'data' => $data,
        ];

        if ($message) {
            $body['message'] = $message;
        }

        $body['meta'] = [
            'timestamp' => now()->toIso8601String(),
        ];

        parent::__construct($body, $code);
    }
}