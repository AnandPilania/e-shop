<?php

namespace App\Http\Middleware;

use Closure;
use App\Models\Cart;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cookie;
use Illuminate\Support\Facades\Session;

class CartCookie
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle(Request $request, Closure $next)
    {
        if (Session::exists('cart') == false) {
            if ($request->hasCookie('2c7a6r9t5f4u3c2k5')) {
                Session::put('cart', Cookie::get('2c7a6r9t5f4u3c2k5'));
            } else {
                if (Auth::check() && Cart::where('user_id', Auth::user()->id)->exists()) {
                    Session::put('cart', Cart::where('user_id', Auth::id())->first('cart'));
                }
            }
        }

        return $next($request);
    }
}
