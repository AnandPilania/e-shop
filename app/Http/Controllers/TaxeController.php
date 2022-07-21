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
        $taxes->tva_rate = round($request->taxeValue, 2);

        $taxes->save();

        return 'ok';
    }


    public function updateTaxes(Request $request)
    {
        $this->validate($request, ['taxeName' => 'required|string|max:255', 'taxeValue' => 'required', 'id' => 'required']);

        $taxe =  Taxe::find($request->id);
        $taxe->name = $request->taxeName;
        $taxe->tva_rate = round($request->taxeValue, 2);

        $taxe->save();

        return 'ok'; 
    }   
    
    
    // modifie la tva par défaut
    public function updateTvaRate(Request $request)
    {
        $this->validate($request, ['id' => 'required']);

        $taxe = Taxe::where('is_default', 1)->first();

        if ($taxe != null) {
            $taxe->is_default = 0;
            $taxe->save();
        }

        $taxe =  Taxe::find($request->id);
        $taxe->is_default = 1;
        $taxe->save();

        return 'ok'; 
    }


    public function deleteTaxes(Request $request)
    {
        $taxe = Taxe::find($request->id);
        $taxe->delete();
        return 'ok';
    }
}
