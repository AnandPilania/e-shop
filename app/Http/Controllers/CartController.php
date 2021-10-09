<?php

namespace App\Http\Controllers;

use App\Models\Cart;
use App\Models\Product;
use App\Models\Category;
use App\Models\Type_detail_product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cookie;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Session;



class CartController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $carts = Cart::all();
        return view('cart.list')->with('carts', $carts);
    }

    public function index_panier(Request $request)
    {
        $product_in_cart = [];
        $categories = Category::all();

        // Session::forget('cart');

        // récupère tous les produits présents dans la session cart et renvoi la vue panier si session cart existe 
        if (Session::exists('cart')) {

            $cart = Session::get('cart');

            foreach ($cart as $products) { 
                // fusion du product "model" et du cart "session" dans product_in_cart pour faciliter l'accès aux data dabs cart.blade
                $product = Product::find($products['product_id_cart']);

                array_push($products, $product);

                $product_in_cart[] = $products;                
            }

            return view('front-end.cart', ['categories' => $categories, 'cart' => $product_in_cart]);

        } else {

            // sinon renvoi la vue sans cart
            return view('front-end.cart', ['categories' => $categories]);
        }
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        return view('cart.form');
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        // dd($request);
        $validated = $request->validate([
            'cart' => 'required',
        ]);

        // convert json to array
        $dataCart = json_decode($request->cart, true);

        if ($validated) {
            // session
            $temp_array = [];
            // si Session::get('cart') exist 
            Session::get('cart') && $temp_array = Session::get('cart');
            // sinon on push un array vide pour l'initialisation
            array_push($temp_array, $dataCart);
            Session::put('cart', $temp_array);

            // database
            // if Auth::check, modify record, else create record
            if (Auth::check()) {
                if (Cart::where('user_id', Auth::user()->id)->exists()) {
                    $cart = Cart::where('user_id', Auth::user()->id)->first();
                    $cart->user_id = Auth::user()->id;
                    $cart->cart = json_encode(Session::get('cart'));
                    $cart->save();
                    $cart->products()->attach($dataCart['product_id_cart']);
                } else {
                    $cart = new Cart();
                    $cart->user_id = Auth::user()->id;
                    $cart->cart = json_encode(Session::get('cart'));
                    $cart->save();
                    $cart->products()->attach($dataCart['product_id_cart']);
                }
            }

            // cookie
            // save in cookies
            $cookie_name = "2c7a6r9t5f4u3c2k5";
            $cookie_value = json_encode(Session::get('cart'));
            $cookie = cookie($cookie_name, $cookie_value, 525600);
            return response('my cart')->cookie($cookie);
        }
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function viderPanier()
    {
        Session::forget('cart');
        Cart::where('user_id', Auth::id())->delete();
    }


    public function destroy($id)
    {
        $all_product_in_cart = Session::get('cart');
        // supprime l'élément situé à $id
        array_splice($all_product_in_cart, $id, 1);
        Session::put('cart', $all_product_in_cart);

        // database
        // if Auth::check, modify record, else create record
        if (Auth::check()) {
            if (Cart::where('user_id', Auth::user()->id)->exists()) {
                $cart = Cart::where('user_id', Auth::user()->id)->first();
                $cart->user_id = Auth::user()->id;
                $cart->cart = json_encode(Session::get('cart'));
                $cart->save();
            }
        }

        // cookie
        // save in cookies
        $cookie_name = "2c7a6r9t5f4u3c2k5";
        $cookie_value = json_encode(Session::get('cart'));
        $cookie = cookie($cookie_name, $cookie_value, 525600);
        return response('my cart')->cookie($cookie);;
    }
}
