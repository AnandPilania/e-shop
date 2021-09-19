<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Category;
use Illuminate\Http\Request;

class ProductSheetController extends Controller
{
    // afiche la fiche produit
    public function productSheet($collection, $productLink)
    {
        // dd($productLink);
        $categories = Category::all();
        $product = Product::where('link', $productLink)->first();

        $details = $product->product_details->groupBy('type_detail_product_id');

        $tabDetails = [];
        foreach ($details as $subDetails) {
            foreach ($subDetails as $detail) {
                // echo $detail->type_detail_product->name . '   ' . $detail->libelle . '<br>';
                $tabDetails[$detail->libelle] = $detail->type_detail_product->name;
            }

            // $tabDetails[$detail->type_detail_product->name] = $detail->libelle;
        }
        // dd($tabDetails);
        return view('front-end.productSheet', ['product' => $product, 'categories' => $categories, 'tabDetails' => $tabDetails]);
    }
}
