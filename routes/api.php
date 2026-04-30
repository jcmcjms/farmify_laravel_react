<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CartController;
use App\Http\Controllers\Api\DeliveryController;
use App\Http\Controllers\Api\FarmController;
use App\Http\Controllers\Api\FarmMemberController;
use App\Http\Controllers\Api\FarmPlotController;
use App\Http\Controllers\Api\JobApplicationController;
use App\Http\Controllers\Api\JobController;
use App\Http\Controllers\Api\NotificationController;
use App\Http\Controllers\Api\OrderController;
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
        Route::get('farms/{farm}', [FarmController::class, 'show']);
        Route::put('farms/{farm}', [FarmController::class, 'update']);
        Route::delete('farms/{farm}', [FarmController::class, 'destroy']);

        Route::post('farms/{farm}/members/invite', [FarmMemberController::class, 'inviteMember']);
        Route::get('farms/{farm}/members', [FarmMemberController::class, 'index']);
        Route::delete('farms/{farm}/members/{member}', [FarmMemberController::class, 'removeMember']);
        Route::put('farms/{farm}/members/{member}/role', [FarmMemberController::class, 'updateMemberRole']);

        Route::get('farms/{farm}/plots', [FarmPlotController::class, 'index']);
        Route::post('farms/{farm}/plots', [FarmPlotController::class, 'store']);
        Route::get('farms/{farm}/plots/{plot}', [FarmPlotController::class, 'show']);
        Route::put('farms/{farm}/plots/{plot}', [FarmPlotController::class, 'update']);
        Route::delete('farms/{farm}/plots/{plot}', [FarmPlotController::class, 'destroy']);

        Route::get('products', [ProductController::class, 'index']);
        Route::post('products', [ProductController::class, 'store']);
        Route::get('products/{product}', [ProductController::class, 'show']);
        Route::put('products/{product}', [ProductController::class, 'update']);
        Route::delete('products/{product}', [ProductController::class, 'destroy']);

        Route::get('orders', [OrderController::class, 'index']);
        Route::post('orders', [OrderController::class, 'store']);
        Route::get('orders/{order}', [OrderController::class, 'show']);
        Route::put('orders/{order}/status', [OrderController::class, 'updateStatus']);

        Route::get('deliveries', [DeliveryController::class, 'index']);
        Route::post('deliveries', [DeliveryController::class, 'store']);
        Route::get('deliveries/{delivery}', [DeliveryController::class, 'show']);
        Route::put('deliveries/{delivery}/status', [DeliveryController::class, 'updateStatus']);

        Route::get('cart', [CartController::class, 'index']);
        Route::post('cart', [CartController::class, 'store']);
        Route::put('cart/{item}', [CartController::class, 'update']);
        Route::delete('cart/{item}', [CartController::class, 'destroy']);
        Route::delete('cart', [CartController::class, 'clear']);
        Route::post('cart/checkout', [CartController::class, 'checkout']);

        Route::get('jobs', [JobController::class, 'index']);
        Route::post('jobs', [JobController::class, 'store']);
        Route::get('jobs/{job}', [JobController::class, 'show']);
        Route::put('jobs/{job}', [JobController::class, 'update']);
        Route::delete('jobs/{job}', [JobController::class, 'destroy']);

        Route::post('applications/apply', [JobApplicationController::class, 'apply']);
        Route::get('applications', [JobApplicationController::class, 'index']);
        Route::put('applications/{application}/status', [JobApplicationController::class, 'updateStatus']);

        Route::post('reviews', [ReviewController::class, 'store']);

        Route::get('notifications', [NotificationController::class, 'index']);
        Route::put('notifications/{notification}/read', [NotificationController::class, 'markRead']);
        Route::put('notifications/read-all', [NotificationController::class, 'markAllRead']);
        Route::delete('notifications/{notification}', [NotificationController::class, 'destroy']);
    });
});