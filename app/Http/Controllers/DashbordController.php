<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class DashbordController extends Controller
{
    public function index(){

        $invoices = Auth::user()->invoices()->with('customer','items')->get();

        return Inertia::render('HomePage' , ['invoices' => $invoices]);
    }
}
