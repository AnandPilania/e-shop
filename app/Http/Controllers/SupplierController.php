<?php

namespace App\Http\Controllers;

use App\Models\Supplier;
use Illuminate\Http\Request;

class SupplierController extends Controller
{
    public function index()
    {
        $suppliers = Supplier::orderBy('name')->get();
        return $suppliers;
    }

    public function store(Request $request)
    {
        // dd($request);

        $this->validate($request, [
            'nameSupplier' => 'required|string|max:255',
            'emailSupplier' => 'nullable|string|max:255',
            'phoneSupplier' => 'nullable|string|max:50',
            'webSiteSupplier' => 'nullable|string|max:500',
            'adressSupplier' => 'nullable|string|max:500',
            'citySupplier' => 'nullable|string|max:100',
            'countrySupplier' => 'nullable|string|max:100',
        ]);

        $supplier = new Supplier;
        $supplier->name = $request->nameSupplier;
        $supplier->email = $request->emailSupplier;
        $supplier->phone = $request->phoneSupplier;
        $supplier->web_site = $request->webSiteSupplier;
        $supplier->adress = $request->adressSupplier;
        $supplier->city = $request->citySupplier;
        $supplier->country = $request->countrySupplier;

        $supplier->save();

        return 'ok';
    }
}
