<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Category;
use App\Models\Collection;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Session;

class ProductSheetController extends Controller
{
    // afiche la fiche produit
    public function productSheet($collection, $productLink)
    {
        // Session::forget('cart');
        // dd($productLink);
        $categories = Category::all();
        $product = Product::where('link', $productLink)->first();
        $reviews = $product->reviews;
       
        $collectionId1 = Collection::all('id')->random(1);
        $promo1 = Collection::find($collectionId1);
        $collectionId2 = Collection::all('id')->random(1);
        $promo2 = Collection::find($collectionId2);

        $promos = array(
            'promo1' => $promo1[0]->products->random(1)[0], 
            'promo2' => $promo2[0]->products->random(1)[0]
        );

        return view('front-end.productSheet', ['product' => $product, 'categories' => $categories, 'promos' => $promos, 'reviews' => $reviews]);
    }


}
