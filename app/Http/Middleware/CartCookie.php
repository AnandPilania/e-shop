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

                $temp_array = [];
                // conversion object to array for each elements in cookie
                foreach(json_decode(Cookie::get('2c7a6r9t5f4u3c2k5', true)) as $product) {
                    array_push($temp_array, (array) $product);
                }
                Session::put('cart', $temp_array);
            } else {
                
                if (Auth::check()) {
                    if (Cart::where('user_id', Auth::id())->first()) {

                        $temp_dbCart = [];
                        // converti en array le Cart de la db et ensuite chaque objet dans le array est aussi converti en array
                        foreach (json_decode(Cart::where('user_id', Auth::id())->first('cart'), true) as $dbCart) {
                            $temp_dbCart = json_decode($dbCart, true);
                        }
                        Session::put('cart', $temp_dbCart);
                    }
                }
            }
        }

        return $next($request);
    }
}
