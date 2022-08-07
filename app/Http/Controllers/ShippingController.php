<?php

namespace App\Http\Controllers;

use App\Models\Country;
use App\Models\Shipping;
use App\Models\Shipping_mode;
use Illuminate\Http\Request;


class ShippingController extends Controller
{
    public function index()
    {
        // $shipping = Shipping::orderBy('zone_name')->with('shipping_mode')->with('shipping_modes_contion');
        $shipping = Shipping::orderBy('zone_name')->get();
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
            'zone_name' => 'required|string|max:255',
            'destinations' => 'required',
            'hasDeliveryMode' => 'required',
            // 'max_weight' => 'nullable|float|max:10',
            // 'min_price' => 'nullable|float|max:10',
            // 'max_price' => 'nullable|float|max:10',
            // 'destination' => 'nullable|string|max:100',
            // 'shipping_price' => 'required|float|max:10',
        ]);


        $shipping = new Shipping;
        $shipping->zone_name = $request->zone_name;
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

    public function saveShipping_mode(Request $request) 
    {
        dd($request);
        $shipping_mode = new Shipping_mode;
        $shipping_mode->criteria = $request->mode_name;
        $shipping_mode->criteria = $request->criteria;
    }
}
