<?php

namespace App\Http\Controllers;

use App\Models\Options_name;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;


class OptionsValueController extends Controller
{
    public function details(Request $request)
    {
        dd($request);

        // foreach($request->obj as $detail) {
        //     echo $detail . '<br>';
        // }

        // $this->validate($request, ['name' => 'required', 'price' => 'required', 'collection' => 'required', 'image' => 'required|image|mimes:jpg,png,jpeg,gif,svg|max:2048', 'description' => 'required', 'taxe' => 'required']);

        // $collections = new Collection;

        // $product_detail =  new Product_detail();
        // $product_detail->libelle = $request->libelle;
        // $product_detail->product_id = 5;
        // $product_detail->save();

        // $type_product_detail =  new Type_detail_product();
        // $type_product_detail->name = $request->name;
        // $type_product_detail->product_detail_id = 5;
        // $type_product_detail->save();


        // return back()
        //     ->with('success', 'Image has successfully uploaded.');
    }



    // renvoi tous les détails pour un type donné

    // A SUPPRIMER ? !!!!!!!!!!!!
    // public function detailCompletion(Request $request)
    // {
    //     // récupère le détail qui correspond au $request->type_detail_name ex: couleur, poids,...
    //     $libelle_product_details = Options_name::where('name', $request->type_detail_name)->first();

    //     if ($libelle_product_details->product_details) {
    //         $details = DB::table('options_names')
    //             ->select('name')
    //             ->where('options_names_id', $libelle_product_details->id)->distinct()
    //             ->get();
    //         return $details;
    //     } else {
    //         return '';
    //     }
    // }


    // renvoi tous les détails pour un type donné
    public function getOptionValues(Request $request)
    {
        $optionsData = DB::table('options_values')
            ->select('options_names.name as optionName', 'options_values.name as name', 'ordre', 'variante_id', 'options_names_id')
            ->join('options_names', 'options_names.id', '=', 'options_names_id')
            ->groupBy('options_values.name')
            ->orderBy('options_names.name')
            ->get();


        $options = [];
        if (count($optionsData) > 0) {
                foreach($optionsData as $data) {
                    $options[$data->optionName][] = $data;
                }
            return $options;
        } else {
            return '';
        }
    }


    public function getProductDetails($productId)
    {
        $product = Product::find($productId);

        $details = $product->product_details;
        $temp_Array = [];
        $objDetails = [];
        $detailName = [];

        foreach ($details as $detail) {
            $temp_Array['name'] = $detail->libelle;
            $temp_Array['ordre'] = $detail->ordre;

            $detailName = Options_name::find($detail->type_detail_product_id);
            $temp_Array['type'] = $detailName['name'];

            array_push($objDetails, $temp_Array);
        }

        return ['objDetails' => $objDetails];
    }
}
