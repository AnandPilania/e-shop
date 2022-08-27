<?php

namespace App\Http\Controllers;

use App\Models\Options_name;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;


class OptionsNameController extends Controller
{
    /**
     * data for axios in product.form
     */
    public function listtype()
    {
        $types = DB::table('options_names')
            ->select('name', 'id')
            ->orderBy('name', 'asc')
            ->get();

        return $types;
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

        $Type_detail = new Options_name;
        $Type_detail->name = strtolower($request->name);      
        $Type_detail->save();

        return 'ok';
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

        $Type_detail =  Options_name::find($id);
        $Type_detail->name = strtolower($request->name);

        $Type_detail->save();

        return 'ok';
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
