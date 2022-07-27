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
        $countries = Country::all();

        return [$shipping, $countries];
    }


    public function store(Request $request)
    {
        $this->validate($request, [
            'name' => 'required|string|max:255',
            'criteria' => 'required',
            'min_weight' => 'nullable|float|max:10',
            'max_weight' => 'nullable|float|max:10',
            'min_price' => 'nullable|float|max:10',
            'max_price' => 'nullable|float|max:10',
            'destination' => 'nullable|string|max:100',
            'shipping_price' => 'required|float|max:10',
        ]);

        $shipping = new Shipping;
        $shipping->name = $request->name;
        $shipping->criteria = $request->criteria;
        $shipping->min_weight = $request->min_weight;
        $shipping->max_weight = $request->max_weight;
        $shipping->min_price = $request->min_price;
        $shipping->max_price = $request->max_price;
        $shipping->destination = $request->destination;
        $shipping->shipping_price = $request->shipping_price;

        $shipping->save();

        return 'ok';
    }
}
