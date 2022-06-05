<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;
use App\Models\Product_detail;
use Illuminate\Support\Facades\DB;
use App\Models\Type_detail_product;

class ProductDetailController extends Controller
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
    public function detailCompletion(Request $request)
    {
        // récupère le détail qui correspond au $request->type_detail_name ex: couleur, poids,...
        $libelle_product_details = Type_detail_product::where('name', $request->type_detail_name)->first();

        if ($libelle_product_details->product_details) {
            $details = DB::table('product_details')
                ->select('libelle')
                ->where('type_detail_product_id', $libelle_product_details->id)->distinct()
                ->get();
            return $details;
        } else {
            return '';
        }
    }


    // renvoi tous les détails pour un type donné
    public function getOptionValues(Request $request)
    {
        // récupère le détail qui correspond au $request->type_detail_name ex: couleur, poids,...
        $option_name = Type_detail_product::where('name', $request->option_name)->first();

        if (isset($option_name) && $option_name->product_details) {
            $optionsValue = DB::table('product_details')
                ->select('*')
                ->where('type_detail_product_id', $option_name->id)
                ->distinct()
                ->get();
            return $optionsValue;
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
            $temp_Array['libelle'] = $detail->libelle;
            $temp_Array['ordre'] = $detail->ordre;

            $detailName = Type_detail_product::find($detail->type_detail_product_id);
            $temp_Array['type'] = $detailName['name'];

            array_push($objDetails, $temp_Array);
        }

        return ['objDetails' => $objDetails];
    }
}
