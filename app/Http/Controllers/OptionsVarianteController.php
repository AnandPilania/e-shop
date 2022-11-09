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

    public function getOneOptionWithHerValues($id)
    {
        $option = Options_name::where('id', $id)->with('options_values')->first();

        return $option;
    }


    public function getOptionsNamesValuesList()
    {
        $optionsList = Options_name::with('options_values')->get();

        return $optionsList;
    }


    public function store(Request $request)
    {
        $this->validate($request, ['name' => 'required|string|max:255', 'values' => 'required|string']);
        $id = $request->idOptionName;

        if ($id === "null") {
            // if new option
            $option_name = new Options_name;
        } else {
            // if update option
            $option_name = Options_name::find($id);
            $optionsValue = Options_value::where('options_name_id', $id)->first();
            if ($optionsValue) Options_value::where('options_name_id', $id)->delete();
        }
        // save optionName
        $option_name->name = $request->name;
        $option_name->save();
        // save optionsValues
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

        return $this->getOptionsNames();
    }



    public function deleteOptionNameAndHerOptionsValues($id)
    {
        // delete optionName and optionsValues
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
                if (is_object($optionArr)) {
                    $optionArr = (array) $optionArr;
                }
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
                $product->optionsObj = json_encode($optionArr);
                $product->save();
            }
        }

        // sort by string.length 'DESC' for preg_replace work fine
        usort($option_values_list, function ($a, $b) {
            return strlen($a) < strlen($b);
        });

        // rewrite the optionsString for each variantes who has a options_value deleted
        $variantes = Variante::all();
        if ($variantes->first()) {
            foreach ($variantes as $variante) {
                foreach ($option_values_list as $str) {

                    $search = '/(' . preg_quote($str) . '\s-\s)/';
                    $variante->optionsString = preg_replace($search, '', $variante->optionsString);

                    $search = '/(\s-\s' . preg_quote($str) . ')/';
                    $variante->optionsString = preg_replace($search, '', $variante->optionsString);

                    $variante->save();
                }
            }
        }

        $optionsList = Options_name::with('options_values')->get();
        $types = DB::table('options_names')
        ->select('name', 'id')
        ->orderBy('name', 'asc')
        ->get();

        return [$optionsList, $types];
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
