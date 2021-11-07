<?php

namespace App\Http\Controllers;

use App\Models\Cart;
use App\Models\User;
use App\Models\Order;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
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
        $orders = Order::all();
        return view('order.list', ['orders' => $orders]);
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
        $order = Order::find($id);
        $cart = json_decode($order->cart);
        
        foreach ($cart as $item) {
            $item->product = Product::where('id', $item->product_id_cart)->first();
        }

        return view('order.orderCartDetail', ['order' => $order, 'cart' => $cart]);
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        $order = Order::find($id);
        $countries = DB::table('countries')
            ->select('name_fr')
            ->orderBy('name_fr', 'asc')
            ->get();

        return view('order.edit', ['order' => $order, 'countries' => $countries]);
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

        $order = Order::find($id);
        $order->user_id = $request->user_id;
        $order->total_amount = $request->amount;
        $order->stripe_id = $request->payment_id;
        $order->cart = $request->cart;
        $order->payment_operator = $request->payementOperator;
        $order->save();

        return redirect()->route('orders.index');
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        Order::find($id)->delete();

        return back();
    }
}
