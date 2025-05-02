<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        try{
        $info = $request->validate([
            'name' => ['required', 'max:255'],
            'email' => ['required', 'max:255', 'email','unique:users'],
            'password' => ['required', 'min:3']
        ]);
        
        $user = User::create($info);

        Auth::login($user, $remember = false);

       
        return redirect()->route('dashboard')->with('success', 'Account created successfully!');
    } catch (\Exception $e) {
        return redirect()->back()->withErrors('error', 'Registration failed: '.$e->getMessage());
    }
    }

    
    public function login(Request $request)
    {
        $credentials = $request->validate([
            'email' => ['required', 'max:255', 'email'],
            'password' => ['required']
        ]);
    
      if(Auth::attempt($credentials, $request->remember)){
        return redirect()->intended('dashbord')->with('success', 'Welcome back!');
      }  else{
        return back()->withErrors('error', 'Login failed. Please check your credentials.');
      }
            
    }
    public function logout(Request $request){
        try{
        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();
        
        return redirect('/login')->with('success', 'Logged out successfully!');
    } catch (\Exception $e) {
        return redirect()->back()->withErrors('error', 'Logout failed. Please try again.');
    }
    }
}
