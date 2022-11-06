<?php

namespace App\Http\Controllers;

use App\Models\Options_name;
use App\Models\Options_value;
use App\Models\Product;
use App\Models\Variante;
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


    public function getOptionsNamesValuesList()
    {
        $optionsList = Options_name::with('options_values')->get();

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


    public function deleteOptionVariante($id)
    {
        $optionsValue = Options_value::where('options_name_id', $id)->first();
        if ($optionsValue) Options_value::where('options_name_id', $id)->delete();
        $optionName = Options_name::where('id', $id)->first();
        if ($optionName) $optionName->delete();

        $option_values_list = [];

        // remove the deleted option from optionObj of all products
        $products = Product::all();
        if ($products->first()) {
            foreach ($products as $product) {
                $optionArr = json_decode($product->optionsObj);
                if (is_array($optionArr)) {
                    foreach ($optionArr as $key => $option) {
                        if ($option->idValues_Names == $id) {
                            foreach ($option->values as $value) {
                                array_push($option_values_list, $value);
                            }
                            unset($optionArr[$key]);
                        }
                    }
                }
                $product->optionsObj = $optionArr;
                $product->save();
            }
        }

        $variantes = Variante::all();
        if ($variantes->first()) {
            foreach ($variantes as $variante) {
                foreach ($option_values_list as $optionValue) {

                    $optionValue = str_replace('"', '', $optionValue);
                    
                    $pos = strpos($variante->optionsString, $optionValue . ' - ');
                    if ($pos === false) {
                        $pos = strpos($variante->optionsString, ' - ' . $optionValue);
                    }
                    if ($pos !== false) {
                        $variante->optionsString = substr_replace($variante->optionsString, '', $pos, 0);
                        $variante->save();
                    }
                }
            }
        }
    }

    public function deleteOptionValue()
    {
    }



    // renvoi tous les détails pour un type donné
    public function getOptionValues()
    {
        $optionsData = DB::table('options_values')
            ->select('options_names.name as optionName', 'options_values.name as name', 'options_values.id as idOptionValue', 'ordre', 'options_name_id')
            ->join('options_names', 'options_names.id', '=', 'options_name_id')
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
