<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\DashbordController;
use App\Http\Controllers\InvoiceController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Guest routes

    Route::get('/signup', fn() => Inertia::render('SignUp'))->name('signup');
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);
    Route::get('/', fn() => Inertia::render('SignIn'))->name('signin');



    Route::get('/dashbord', [DashbordController::class, 'index'])->name('dashbord');
    Route::get('/print/{id}', [InvoiceController::class, 'print'])->name('print');
    Route::resource('invoices', InvoiceController::class)->except('index');
    Route::post('/logout', [AuthController::class, 'logout'])->name('logout');

