<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Category;
use App\Models\Collection;
use Illuminate\Http\Request;

class ProductSheetController extends Controller
{
    // afiche la fiche produit
    public function productSheet($collection, $productLink)
    {
        // dd($productLink);
        $categories = Category::all();
        $product = Product::where('link', $productLink)->first();
        $reviews = $product->reviews;
        // dd($reviews);
        $details = $product->product_details->groupBy('type_detail_product_id');

        $tabDetails = [];
        foreach ($details as $subDetails) {
            foreach ($subDetails as $detail) {
                // echo $detail->type_detail_product->name . '   ' . $detail->libelle . '<br>';
                $tabDetails[$detail->libelle] = $detail->type_detail_product->name;
            }
        }
        
        $collectionId1 = Collection::all('id')->random(1);
        $promo1 = Collection::find($collectionId1);
        $collectionId2 = Collection::all('id')->random(1);
        $promo2 = Collection::find($collectionId2);

        // $promo1[0]->products->random(1)[0];
        // $promo2[0]->products->random(1)[0];
        $promos = array(
            'promo1' => $promo1[0]->products->random(1)[0], 
            'promo2' => $promo2[0]->products->random(1)[0]
        );

        return view('front-end.productSheet', ['product' => $product, 'categories' => $categories, 'tabDetails' => $tabDetails, 'promos' => $promos, 'reviews' => $reviews]);
    }


}
