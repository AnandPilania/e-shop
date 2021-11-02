<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

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

    public function storeAfterStripePayment($request)
    {
        // dd('ok ok ok ok ok');


        if ($request->type === 'payment_intent.created') {
            // if (Auth::check()) {
            // $user = User::find(Auth::id());
            $order = new Order;
            $order->user_id = 1;
            $order->total_amount = $request->data['object']['amount'];
            $order->stripe_payment_method = $request->data['object']['payment_method'];
            // $order->paid = $request->data['object']['charges']['paid'];
            // $order->stripe_id = $request->data['object']['charges']['id'];
            $order->save();
            // }
        } else {
            $order = new Order;
            $order->user_id = 11;
            $order->total_amount = 11;
            $order->stripe_payment_method = '11';
            $order->paid = 'true';
            $order->stripe_id = 11;
            $order->save();
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
