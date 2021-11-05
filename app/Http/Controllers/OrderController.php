<?php

namespace App\Http\Controllers;

use App\Models\Cart;
use App\Models\User;
use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cookie;
use Illuminate\Support\Facades\Session;


class OrderController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        return view('commande.list');
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        //
    }

    public function storeAfterStripePayment(Request $request)
    {
        try {
        // si le payment a réussi
        if ($request->type === 'payment_intent.succeeded') {
            // on récupère l'user qui a le customer id = stripe_id
            $user = User::where('stripe_id', $request->data['object']['customer'])->first();

            if ($user) {
                $cart = Cart::where('user_id', $user->id)->first();

                $order = new Order;
                $order->user_id = $user->id;
                $order->total_amount = $request->data['object']['amount'] / 100;
                $order->stripe_id = $request->data['object']['id'];
                $order->payment_operator = 'Stripe';
                $order->cart = $cart->cart;
                $order->save();

                $cart->delete();

                setcookie("2c7a6r9t5f4u3c2k5", "", time()-3600);
                
                Session::forget('cart');
 
                // setcookie("2c7a6r9t5f4u3c2k5", "", time()-3600);

                
            }
        }
        } catch (\Exception $e) {

            return $e->getMessage();
        }

        return 'ok';        
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
