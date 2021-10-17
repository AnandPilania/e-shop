<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Session;

class PaymentController extends Controller
{
    public function index(Request $request)
    {
        $product_in_cart = [];

        $countries = DB::table('countries')
        ->select('name_fr')
        ->orderBy('name_fr', 'asc')
        ->get();


        // Session::forget('cart');

        // récupère tous les produits présents dans la session cart et renvoi la vue payment si session cart existe 
        if (Session::exists('cart')) {

            $cart = Session::get('cart');

            foreach ($cart as $products) {
                // fusion du product "model" et du cart "session" dans product_in_cart pour faciliter l'accès aux data dabs cart.blade
                $product = Product::find($products['product_id_cart']);

                array_push($products, $product);

                $product_in_cart[] = $products;
            }

            return view('front-end.payment', ['cart' => $product_in_cart, 'cart_session' => $cart, 'countries' => $countries]);
        } else {

            // sinon renvoi la vue avec cart vide
            $cart = [];
            return view('front-end.payment', ['cart_session' => $cart, 'countries' => $countries]);
        }
    }
}
