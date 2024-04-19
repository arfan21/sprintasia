<?php

use App\Http\Controllers\TaskController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;

Route::controller(UserController::class)->group(function () {
    Route::post('users/register', 'register');
    Route::post('users/login', 'login');
});

Route::middleware('auth:api')->group(function () {
    Route::controller(TaskController::class)->group(function () {
        Route::post('tasks', 'store');
        Route::get('tasks', 'index');
        Route::get('tasks/{id}', 'show');
        Route::put('tasks/{id}', 'update');
        Route::delete('tasks/{id}', 'destroy');
    });
});
