<?php

namespace App\Http\Controllers;

use App\Models\Country;
use App\Models\Shipping;
use Illuminate\Http\Request;
use App\Models\Shipping_mode;


class ShippingController extends Controller
{
    public function index()
    {
        $shipping = Shipping::with('shipping_modes')->orderBy('zone_name')->get();

        foreach ($shipping as $item) {
            $item->destinations = json_decode($item->destinations);

            foreach ($item->shipping_modes as $shipping_mode) {
                $shipping_mode->conditions = json_decode($shipping_mode->conditions);
            }
        }

        $countries = Country::all();

        return [$shipping, $countries];
    }


    // save delivery zone name with their destinations
    public function saveShipping(Request $request)
    {
        $this->validate($request, [
            'zone_name' => 'required|string|max:255',
            'destinations' => 'required',
        ]);

        $shipping = new Shipping;
        $shipping->zone_name = $request->zone_name;
        $shipping->destinations = $request->destinations;
        $shipping->save();

        return 'ok';
    }


    public function saveShipping_mode(Request $request)
    {
        $shipping_mode = new Shipping_mode;
        $shipping_mode->mode_name = $request->mode_name;
        $shipping_mode->criteria = $request->criteria;
        $shipping_mode->conditions = $request->conditions;
        $shipping_mode->price_without_condition = $request->priceWithoutCondition;
        $shipping_mode->shipping_id = $request->IdDeliveryZones;
        $shipping_mode->save();

        return "ok";
    }
}
