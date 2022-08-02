<?php

namespace App\Http\Controllers;

use App\Models\Country;
use App\Models\Shipping;
use Illuminate\Http\Request;


class ShippingController extends Controller
{
    public function index()
    {
        $shipping = Shipping::orderBy('zoneName')->get();
        foreach ($shipping as $item) {
            $item->destinations = json_decode($item->destinations);
        }
        $countries = Country::all();

        return [$shipping, $countries];
    }


    public function saveShipping(Request $request)
    {

        // dd(json_decode($request->zonesData));

        $this->validate($request, [
            'zoneName' => 'required|string|max:255',
            'destinations' => 'required',
            'hasDeliveryMode' => 'required',
            // 'max_weight' => 'nullable|float|max:10',
            // 'min_price' => 'nullable|float|max:10',
            // 'max_price' => 'nullable|float|max:10',
            // 'destination' => 'nullable|string|max:100',
            // 'shipping_price' => 'required|float|max:10',
        ]);


        $shipping = new Shipping;
        $shipping->zoneName = $request->zoneName;
        $shipping->destinations = $request->destinations;
        $shipping->hasDeliveryMode = $request->hasDeliveryMode;
        // $shipping->max_weight = $request->max_weight;
        // $shipping->min_price = $request->min_price;
        // $shipping->max_price = $request->max_price;
        // $shipping->destination = $request->destination;
        // $shipping->shipping_price = $request->shipping_price;

        $shipping->save();

        return 'ok';
    }
}
