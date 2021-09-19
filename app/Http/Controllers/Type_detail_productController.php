<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Models\Type_detail_product;

class Type_detail_productController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $type_details = Type_detail_product::all();
        return view('type_detail_product.list')->with('type_details', $type_details);
    }

    // data for axios in product.form
    public function listtype()
    {
        $types = DB::table('type_detail_products')
            ->select('name', 'id')
            ->orderBy('name', 'asc')
            ->get();

        return $types;
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        return view('type_detail_product.form');
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
   
        $this->validate($request, ['name' => 'required']);

        $Type_detail = new Type_detail_product;
        $Type_detail->name = strtolower($request->name);


       
        $Type_detail->save();

        return redirect('/type_detail_products/create')->with('status', 'Le type ' . $Type_detail->name . ' a été ajouté');
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
        $type_detail =  Type_detail_product::find($id);
        return view('type_detail_product.edit', ['type_detail' => $type_detail]);
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
        $this->validate($request, ['name' => 'required']);

        $Type_detail =  Type_detail_product::find($id);
        $Type_detail->name = strtolower($request->name);

        $Type_detail->save();

        return redirect('/type_detail_products')->with('status', 'La modification a été éffectuée');
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        //
    }
}
