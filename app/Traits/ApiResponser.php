<?php

namespace App\Traits;

use App\Http\Resources\ApiResponse;
use Illuminate\Http\JsonResponse;

trait ApiResponser
{
    protected function success(mixed $data = null, string $message = null, int $code = 200): JsonResponse
    {
        return new ApiResponse($data, $message, $code);
    }

    protected function created(mixed $data = null, string $message = 'Created successfully'): JsonResponse
    {
        return new ApiResponse($data, $message, 201);
    }

    protected function updated(mixed $data = null, string $message = 'Updated successfully'): JsonResponse
    {
        return new ApiResponse($data, $message, 200);
    }

    protected function deleted(mixed $data = null, string $message = 'Deleted successfully'): JsonResponse
    {
        return new ApiResponse($data, $message, 200);
    }

    protected function error(string $message, int $code = 400): JsonResponse
    {
        return new ApiResponse(null, $message, $code);
    }

    protected function notFound(string $message = 'Resource not found'): JsonResponse
    {
        return new ApiResponse(null, $message, 404);
    }

    protected function unauthorized(string $message = 'Unauthorized'): JsonResponse
    {
        return new ApiResponse(null, $message, 401);
    }

    protected function forbidden(string $message = 'Forbidden'): JsonResponse
    {
        return new ApiResponse(null, $message, 403);
    }

    protected function validationError(array $errors): JsonResponse
    {
        return new ApiResponse($errors, 'Validation failed', 422);
    }
}