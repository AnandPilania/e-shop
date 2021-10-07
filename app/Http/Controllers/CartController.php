<?php

namespace App\Http\Controllers;

use App\Models\Cart;
use App\Models\Product;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cookie;
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
                $product_in_cart[] = Product::find($products['product_id_cart']);
                $product = Product::find($products['product_id_cart']);

                $details = [];
                $temp_detail = [];
                $lastName = '';
                $i = 1;
                $len = count($product->product_details);

                // build associative array with details
                foreach ($product->product_details as $key => $detail) {
                    // initialise $lastName
                    if ($key == 0) {
                        $lastName = $detail->type_detail_product->name;
                    }

                    if ($lastName == $detail->type_detail_product->name) {

                        array_push($temp_detail, $detail->libelle);
                    } else {

                        $details[$lastName] = $temp_detail;
                        $temp_detail = [];
                        $lastName = $detail->type_detail_product->name;

                        array_push($temp_detail, $detail->libelle);
                    }

                    if ($len == $i) {

                        $details[$lastName] = $temp_detail;
                    }

                    $i++;
                }
            }



            return view('front-end.cart', ['categories' => $categories, 'cart' => $product_in_cart, 'product' => $product, 'details' => $details]);
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
        $validated = $request->validate([
            'cart' => 'required',
        ]);

        // convert json to array
        $dataCart = json_decode($request->cart, true);

        // Session::forget('cart');
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
