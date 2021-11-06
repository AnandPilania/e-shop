<?php

namespace App\Http\Controllers;

use App\Models\Cart;
use App\Models\User;
use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cookie;
use Illuminate\Support\Facades\Session;
use App\Events\EmptySessionCart_DestroyCookieCart;


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
                    // on indique dans cart que le paiement est ok
                    $cart = Cart::where('user_id', $user->id)->first();

                    // on crée la commande
                    $order = new Order;
                    $order->user_id = $user->id;
                    $order->total_amount = $request->data['object']['amount'] / 100;
                    $order->stripe_id = $request->data['object']['id'];
                    $order->payment_operator = 'Stripe';
                    $order->cart = $cart->cart;
                    $order->save();

                    // si le paiement est ok alors on peut supprimer le cart dans la db 
                    $cart->delete();
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
