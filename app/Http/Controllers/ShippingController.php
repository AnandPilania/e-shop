<?php

namespace App\Http\Controllers;

use App\Models\Country;
use App\Models\Shipping;
use Illuminate\Http\Request;


class ShippingController extends Controller
{
    public function index()
    {
        $shipping = Shipping::orderBy('name')->get();
        $countries = Country::orderBy('name')->get();

        return [$shipping, $countries];
    }


    public function store(Request $request)
    {
        $this->validate($request, [
            'name' => 'required|string|max:255',
            'email' => 'nullable|string|max:255',
            'phone' => 'nullable|string|max:50',
            'website' => 'nullable|string|max:500',
            'adress' => 'nullable|string|max:500',
            'city' => 'nullable|string|max:100',
            'country' => 'nullable|string|max:100',
            'info' => 'nullable|string|max:500',
        ]);

        $shipping = new Shipping;
        $shipping->name = $request->name;
        $shipping->email = $request->email;
        $shipping->phone = $request->phone;
        $shipping->website = $request->website;
        $shipping->adress = $request->adress;
        $shipping->city = $request->city;
        $shipping->country = $request->country;
        $shipping->info = $request->info;

        $shipping->save();

        return 'ok';
    }
}
