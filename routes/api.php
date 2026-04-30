<?php

use App\Http\Controllers\Api\ApplicationController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\FarmController;
use App\Http\Controllers\Api\JobApplicationController;
use App\Http\Controllers\Api\JobController;
use App\Http\Controllers\Api\NotificationController;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\ReviewController;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')->group(function () {
    Route::post('auth/register', [AuthController::class, 'register']);
    Route::post('auth/login', [AuthController::class, 'login']);

    Route::middleware('auth:sanctum')->group(function () {
        Route::post('auth/logout', [AuthController::class, 'logout']);
        Route::get('auth/me', [AuthController::class, 'me']);
        Route::put('auth/profile', [AuthController::class, 'updateProfile']);

        Route::get('farms', [FarmController::class, 'index']);
        Route::post('farms', [FarmController::class, 'store']);
        Route::get('farms/{id}', [FarmController::class, 'show']);
        Route::put('farms/{id}', [FarmController::class, 'update']);
        Route::delete('farms/{id}', [FarmController::class, 'destroy']);

        Route::get('products', [ProductController::class, 'index']);
        Route::post('products', [ProductController::class, 'store']);
        Route::get('products/{id}', [ProductController::class, 'show']);
        Route::put('products/{id}', [ProductController::class, 'update']);
        Route::delete('products/{id}', [ProductController::class, 'destroy']);

        Route::get('jobs', [JobController::class, 'index']);
        Route::post('jobs', [JobController::class, 'store']);
        Route::get('jobs/{id}', [JobController::class, 'show']);
        Route::put('jobs/{id}', [JobController::class, 'update']);
        Route::delete('jobs/{id}', [JobController::class, 'destroy']);

        Route::post('applications/apply', [JobApplicationController::class, 'apply']);
        Route::get('applications', [JobApplicationController::class, 'index']);
        Route::put('applications/{id}/status', [JobApplicationController::class, 'updateStatus']);

        Route::post('reviews', [ReviewController::class, 'store']);

        Route::get('notifications', [NotificationController::class, 'index']);
        Route::put('notifications/{id}/read', [NotificationController::class, 'markRead']);
        Route::put('notifications/read-all', [NotificationController::class, 'markAllRead']);
        Route::delete('notifications/{id}', [NotificationController::class, 'destroy']);
    });
});