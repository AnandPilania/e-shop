<?php

namespace App\Http\Controllers;

use App\Models\Cart;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Session;



class CartController extends Controller
{

    public $cart = [];

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

        // $testArray = ['id' => 1, 'val' => 1];
        // if(array_key_exists('id', $testArray)){
        //     dd($testArray['id']);
        // }

   
        // dd(json_decode($request->cart, true));
        // dd(json_decode($request->cart, true));
        // $request->session()->regenerate();
        // $request->session()->forget('cart');
        $oldCart = [];
        $cartArray = [];
        // convert json to array
        $dataCart = json_decode($request->cart, true);
        
        if ($validated) {
            if (Auth::check()) {
                if ($request->session()->exists('cart')) {
                    $oldCart = Session::get('cart');
                    $dataCart['user_id'] = Auth::user()->id;
                    $dataCart['guest_id'] = null;
              
                    // $cartArray[] = $oldCart;

                    array_push($cartArray, $dataCart);
                    array_push($cartArray, $oldCart);
                    Session::put('cart', $cartArray);
                    
                    dd(Session::get('cart'));
               } else {
                   
                    // $this->cart = Session::get('cart');
                    
                    // $dataCart['user_id'] = Auth::user()->id;
                    // $dataCart['guest_id'] = null;
                    // $this->cart['cart'] = $dataCart;
                    // Session::put('cart', $this->cart);
                    // $request->session()->put('cart', $this->cart);
                    // dd('else  ',  Session::get('cart'));
                }
                // $cart = new Cart();
                // $cart->user_id = Auth::user()->id;
                // $cart->guest_id = null;
                // $cart->cart = $request->cart;
                // $cart->save();

                // $cart->products()->attach($dataCart['product_id_cart']);
                // Session::put('cart', $cart);
                // // dd(Session::get('cart'));

            } else {
                dd('no');
                $cart = new Cart();
                $cart->user_id = null;
                $cart->guest_id = uniqid('guest_id', true);
                $cart->cart = $request->cart;
                $cart->save();

                $cart->products()->attach($dataCart['product_id_cart']);
                Session::put('cart', $cart);
            }
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
    public function destroy($id)
    {
        //
    }
}
