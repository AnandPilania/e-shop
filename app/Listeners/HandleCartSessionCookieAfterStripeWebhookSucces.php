<?php

namespace App\Listeners;

use App\Models\Order;
use Illuminate\Support\Facades\Session;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Contracts\Queue\ShouldQueue;
use App\Events\EmptySessionCart_DestroyCookieCart;

class HandleCartSessionCookieAfterStripeWebhookSucces
{
    /**
     * Create the event listener.
     *
     * @return void
     */
    public function __construct()
    {
        //
    }

    /**
     * Handle the event.
     *
     * @param  EmptySessionCart_DestroyCookieCart  $event
     * @return void
     */
    public function handle(EmptySessionCart_DestroyCookieCart $event)
    {


        $event->order->user_id = 111;
        $event->order->total_amount = 111;
        $event->order->stripe_id = '111';
        $event->order->payment_operator = 'Stripe';
        $event->order->cart = 'cart';
        $event->order->save();


        setcookie("2c7a6r9t5f4u3c2k5", "", time() - 3600);

        Session::forget('cart');
    }
}
