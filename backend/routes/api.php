<?php

use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\PersonnelController;
use Illuminate\Support\Facades\Route;

Route::prefix('auth')->group(function () {
    Route::post('/login', [AuthController::class, 'login']);
});

Route::middleware('auth:sanctum')->group(function () {
    Route::prefix('auth')->group(function () {
        Route::post('/logout', [AuthController::class, 'logout']);
        Route::get('/me', [AuthController::class, 'me']);
    });

    Route::apiResource('personnel', PersonnelController::class);

    Route::prefix('dashboard')->group(function () {
        Route::get('/metrics', [DashboardController::class, 'metrics']);
        Route::get('/charts', [DashboardController::class, 'charts']);
    });
});
