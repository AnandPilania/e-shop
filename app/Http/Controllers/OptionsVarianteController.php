<?php

namespace App\Http\Controllers;

use App\Models\Options_name;
use App\Models\Options_value;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;


class OptionsVarianteController extends Controller
{

    public function getOptionsNames()
    {
        $types = DB::table('options_names')
            ->select('name', 'id')
            ->orderBy('name', 'asc')
            ->get();

        return $types;
    }
    

    public function getOptionsNamesValuesList() {
        $optionsList = Options_name::with('options_value')->get();

        return $optionsList;
    }


    public function store(Request $request)
    {
        // dd($request);

        $this->validate($request, ['name' => 'required|string|max:255', 'values' => 'required|string']);

        $option_name = new Options_name;
        $option_name->name = $request->name;
        $option_name->save();

        $optionsValues = json_decode($request->values);
        if (count($optionsValues) > 0) {
            foreach ($optionsValues as $key => $value) {
                $option_value = new Options_value;
                $option_value->name = $value;
                $option_value->ordre = $key;
                $option_value->options_name_id = $option_name->id;
                $option_value->save();
            }
        }

        return 'ok';
    }


    public function update(Request $request, $id)
    {
        $this->validate($request, ['name' => 'required']);

        $Type_detail =  Options_name::find($id);
        $Type_detail->name = strtolower($request->name);

        $Type_detail->save();

        return 'ok';
    }


    public function destroy($id)
    {
        //
    }



    // renvoi tous les détails pour un type donné
    public function getOptionValues()
    {
        $optionsData = DB::table('options_values')
            ->select('options_names.name as optionName', 'options_values.name as name', 'options_values.id as idOptionValue', 'ordre', 'options_names_id')
            ->join('options_names', 'options_names.id', '=', 'options_names_id')
            ->groupBy('options_values.name')
            ->orderBy('options_names.name')
            ->get();

        $options = [];
        if (count($optionsData) > 0) {
            foreach ($optionsData as $data) {
                $options[$data->optionName][] = $data;
            }
            return $options;
        } else {
            return '';
        }
    }
}
