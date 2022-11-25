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
        if (Country::all()->count()) {
            $countries = Country::all();
        } else {
            $countries = [];
        }

        if (Shipping::with('shipping_modes')->count()) {
            $shipping = Shipping::with('shipping_modes')->orderBy('zone_name')->get();

            foreach ($shipping as $item) {
                $item->destinations = json_decode($item->destinations);

                foreach ($item->shipping_modes as $shipping_mode) {
                    $shipping_mode->conditions = json_decode($shipping_mode->conditions);
                }
            }
        } else {
            $shipping = [];
        }

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

    // edit delivery zone name with their destinations
    public function editShipping(Request $request)
    {
        $this->validate($request, [
            'zone_name' => 'required|string|max:255',
            'destinations' => 'required',
        ]);

        $shipping = Shipping::find($request->IdDeliveryZones);
        if ($shipping != null) {
            $shipping->zone_name = $request->zone_name;
            $shipping->destinations = $request->destinations;
            $shipping->save();

            return 'ok';
        }
        return 'not ok';
    }

    // delete delivery zone  with their destinations
    public function deleteShipping(Request $request)
    {
        $shipping_mode = Shipping_mode::where('shipping_id', $request->IdDeliveryZones)->get();

        if ($shipping_mode != null) {
            foreach ($shipping_mode as $mode) {
                Shipping_mode::where('id', $mode->id)->delete();
            }
        }

        $shipping = Shipping::find($request->IdDeliveryZones);
        $shipping != null && $shipping->delete();

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


    public function updateShipping_mode(Request $request)
    {
        $shipping_mode = Shipping_mode::find($request->idMode);
        $shipping_mode->mode_name = $request->mode_name;
        $shipping_mode->criteria = $request->criteria;
        $shipping_mode->conditions = $request->conditions;
        $shipping_mode->price_without_condition = $request->priceWithoutCondition;
        $shipping_mode->shipping_id = $request->IdDeliveryZones;
        $shipping_mode->save();

        return "ok";
    }

    public function deleteShipping_mode(Request $request)
    {
        $shipping_mode = Shipping_mode::find($request->id);
        $shipping_mode != null && $shipping_mode->delete();

        return "ok";
    }
}
