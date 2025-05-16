<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\DashbordController;
use App\Http\Controllers\InvoiceController;
use App\Http\Controllers\LogoController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Guest routes
Route::middleware(['guest'])->group(function () {
    Route::get('/signup', fn() => Inertia::render('SignUp'))->name('signup');
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);
    Route::get('/login', fn() => Inertia::render('SignIn'))->name('login');
    Route::get('/', fn() => Inertia::render('SignIn'))->name('signin');
    Route::get('/ForgotPassword', fn() => Inertia::render('ForgotPassword'))->name('password.request');
    Route::post('/ForgotPassword', [AuthController::class, 'ForgotPassword'])->name('password.email');
    Route::post('/logo/upload', [LogoController::class, 'upload'])->name('logo.upload');
    Route::delete('/logo/delete', [LogoController::class, 'delete'])->name('logo.delete');
});

    Route::middleware(['auth'])->group(function () {
    Route::get('/dashbord', [DashbordController::class, 'index'])->name('dashboard');
    Route::get('/print/{id}', [InvoiceController::class, 'print'])->name('print');
    Route::resource('invoices', InvoiceController::class)->except('index');
    Route::post('/logout', [AuthController::class, 'logout'])->name('logout');

    });