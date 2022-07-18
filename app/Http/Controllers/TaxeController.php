<?php

namespace App\Http\Controllers;

use App\Models\Taxe;
use Illuminate\Http\Request;

class TaxeController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $taxes = Taxe::get();
        return view('taxe.list')->with('taxes', $taxes);
    }

    public function getTaxes()
    {
        $taxes = Taxe::all();
        return $taxes;
    }
    
    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        return view('taxe.form');
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $this->validate($request, ['tva_rate' => 'required']);

        $taxes = new Taxe;
        $taxes->tva_rate = $request->tva_rate;

        $taxes->save();

        return redirect('/taxes/create')->with('status', 'Le taux de TVA ' . $taxes->tva_rate . ' a été ajoutée');
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        $taxe = Taxe::find($id);

        return view('taxe.edit')->with('taxe', $taxe);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        $this->validate($request, ['tva_rate' => 'required']);

        $taxe =  Taxe::find($id);
        $taxe->tva_rate = $request->tva_rate;

        $taxe->save();

        return redirect('/taxes')->with('status', 'La modification a été éffectuée'); 
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $taxe =  Taxe::find($id);
        $taxe->delete();
        return back();
    }
}
