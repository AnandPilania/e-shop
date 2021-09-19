<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class ClientController extends Controller
{
    public function home(){
        return view('client.home');
    }

    public function shop(){
        return view('client.shop');
    }

    public function panier(){
        return view('client.cart');
    }

    public function client_login(){
        return view('client.login');
    }

    public function signup(){
        return view('client.signup');
    }

    public function paiement(){
        return view('client.checkout');
    }
}
