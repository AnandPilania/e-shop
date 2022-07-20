<?php

namespace App\Http\Controllers;

use App\Models\Taxe;
use Illuminate\Http\Request;

class TaxeController extends Controller
{

    public function getTaxes()
    {
        $taxes = Taxe::all();
        return $taxes;
    }
    

    public function addTaxes(Request $request)
    {
        $this->validate($request, ['taxeName' => 'required|string|max:255', 'taxeValue' => 'required']);

        $taxes = new Taxe;
        $taxes->name = $request->taxeName;
        $taxes->tva_rate = $request->taxeValue;

        $taxes->save();

        return 'ok';
    }


    public function update(Request $request, $id)
    {
        $this->validate($request, ['tva_rate' => 'required']);

        $taxe =  Taxe::find($id);
        $taxe->tva_rate = $request->tva_rate;

        $taxe->save();

        return redirect('/taxes')->with('status', 'La modification a été éffectuée'); 
    }


    public function deleteTaxes(Request $request)
    {
        $taxe = Taxe::find($request->id);
        $taxe->delete();
        return 'ok';
    }
}
