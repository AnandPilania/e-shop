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
    

    public function store(Request $request)
    {
        $this->validate($request, ['tva_rate' => 'required']);

        $taxes = new Taxe;
        $taxes->tva_rate = $request->tva_rate;

        $taxes->save();

        return redirect('/taxes/create')->with('status', 'Le taux de TVA ' . $taxes->tva_rate . ' a été ajoutée');
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
