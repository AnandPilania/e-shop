<?php

namespace App\Providers;

use Illuminate\Support\Facades\Event;
use Illuminate\Auth\Events\Registered;
use App\Events\EmptySessionCart_DestroyCookieCart;
use Illuminate\Auth\Listeners\SendEmailVerificationNotification;
use App\Listeners\HandleCartSessionCookieAfterStripeWebhookSucces;
use Illuminate\Foundation\Support\Providers\EventServiceProvider as ServiceProvider;

class EventServiceProvider extends ServiceProvider
{
    /**
     * The event listener mappings for the application.
     *
     * @var array
     */
    protected $listen = [
        Registered::class => [
            SendEmailVerificationNotification::class,
        ],
        EmptySessionCart_DestroyCookieCart::class => [
            HandleCartSessionCookieAfterStripeWebhookSucces::class,
        ]
    ];

    /**
     * Register any events for your application.
     *
     * @return void
     */
    public function boot()
    {
        //
    }
}
