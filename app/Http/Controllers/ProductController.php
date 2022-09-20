<?php

namespace App\Http\Controllers;

use DateTime;
use DateTimeZone;
use App\Models\Body;
use App\Models\Product;
use App\Models\Variante;
use App\Models\Collection;
use Illuminate\Support\Str;
use App\Models\Options_name;
use Illuminate\Http\Request;
use App\Models\Options_value;
use App\Models\Product_sheet;
use App\Models\Images_product;
use App\Models\Temporary_storage;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\File;
use Intervention\Image\Facades\Image;
use App\Http\Requests\StoreProductRequest;
use App\Http\Controllers\Functions\CleanLink;
use App\Http\Controllers\Functions\StringTools;




class ProductController extends Controller
{
    public function index()
    {
        $products = Product::with('collections', 'images_products', 'variantes')->orderBy('id', 'asc')->get();
        $collections = Collection::all('name');
        return [$products, $collections];
    }

    public function getProduct(Request $request)
    {
        $product = Product::where('id', $request->productId)->with('collections', 'images_products', 'variantes')->first();
        $collections = Collection::all('name');
        return [$product, $collections];
    }

    public function store(StoreProductRequest $request)
    {
        // check si on edit ou crée un produit
        if ($request->id !== null) {
            // if product is edited
            $product = Product::find($request->id);
            $statusHasBeenChanged = $product->statusHasBeenChanged;
        } else {
            $product = new Product;
        }

        $product->name = $request->nameProduct;
        $product->isInAutoCollection = $request->isInAutoCollection;
        $product->ribbon = $request->ribbonProduct;
        // remplace dans les src de la description le chemin du dossier temporaryStorage par celui de la destionation finale des images et vidéos. !!! c'est handleTinyMceTemporaryElements qui se charge de déplacer les fichiers dans ces dossiers !!!
        $tmp_description = str_replace('temporaryStorage', 'images', $request->descriptionProduct);
        $product->description = preg_replace('/(<source src=").+(images)/', '<source src="' . url('') . '/videos', $tmp_description);
        $product->price = $request->productPrice;
        $product->reduced_price = $request->reducedProductPrice;
        $product->reduction = $request->promoApplied;
        $product->reductionType = $request->promoType;
        $product->cost = $request->productCost;
        $product->stock = $request->productStock;
        $product->unlimitedStock = $request->unlimitedStock;
        $product->weight = $request->productParcelWeight;
        $product->weightMeasure = $request->WeightMeasureUnit;
        $product->sku = $request->productSKU != '' ? $request->productSKU : Str::uuid();
        $product->onlyTheseCarriers = $request->transporter;
        $product->metaUrl = $request->metaUrlProduct;
        $product->metaTitle = $request->metaTitleProduct;
        $product->metaDescription = $request->metaDescriptionProduct;
        $cleanLink = new CleanLink;
        $product->link = $cleanLink->cleanLink($request->nameProduct);
        // Retourne un nouvel objet DateTime représentant la date et l'heure spécifiées par la string time, qui a été formaté dans le format donné.
        $date = DateTime::createFromFormat('d-m-Y H:i:s', $request->dateActivation);
        $product->dateActivation = $date->format('Y-m-d H:i:s');
        $product->status = 1;
        // $product->status = $date->format('Y-m-d H:i:s') <= date('Y-m-d H:i:s') ? 1 : 2;
        $product->type = 'no type';
        $product->taxe_id = json_decode($request->tva)->id;
        $product->supplier_id = json_decode($request->supplier) != "" && json_decode($request->supplier)->id;
        $product->save();


        // save in collection_product table <---
        foreach (json_decode($request->collections) as $collection) {
            $product->collections()->attach($collection->id);
        }

        // variantes table !!!
        $variantes = json_decode($request->variantes);
        if (count($variantes) == 0) {
            $emptyVariante = (object) [
                'cost' => '',
                'price' => '',
                'reducedPrice' => '',
                'parcelWeight' => '',
                'parcelWeightMeasureUnit' => '',
                'stock' => '',
                'unlimited' => '',
                'productCode' => '',
                'deleted' => '',
                'selectedImage' => '',
                'product_id' => '',
                'options' => '',
            ];
            array_push($variantes, $emptyVariante);
        }

        foreach ($variantes as $item) {
            $variante = new Variante;

            if ($item->cost != '') {
                $variante->cost = $item->cost;
            } elseif ($request->productCost != '') {
                $variante->cost = $request->productCost;
            } else {
                $variante->cost = null;
            }

            if ($item->price != '') {
                $variante->price = $item->price;
            } elseif ($request->productPrice != '') {
                $variante->price = $request->productPrice;
            } else {
                $variante->price = 0;
            }

            if ($item->reducedPrice != '') {
                $variante->reduced_price = $item->reducedPrice;
            } elseif ($request->reducedProductPrice != '') {
                $variante->reduced_price = $request->reducedProductPrice;
            } else {
                $variante->reduced_price = null;
            }

            if ($item->parcelWeight != '') {
                $variante->weight = $item->parcelWeight;
            } elseif ($request->productParcelWeight != '') {
                $variante->weight = $request->productParcelWeight;
            } else {
                $variante->weight = null;
            }

            if ($item->parcelWeightMeasureUnit != '') {
                $variante->weightMeasure = $item->parcelWeightMeasureUnit;
            } elseif ($request->WeightMeasureUnit != '') {
                $variante->weightMeasure = $request->WeightMeasureUnit;
            } else {
                $variante->weightMeasure = 'gr';
            }

            if ($item->stock != '') {
                $variante->stock = $item->stock;
            } else {
                $variante->stock = 0;
            }
            if ($item->unlimited != '') {
                $variante->unlimitedStock = $item->unlimited;
            } elseif ($request->unlimitedStock != '') {
                $variante->unlimitedStock = $request->unlimitedStock;
            } else {
                $variante->unlimitedStock = 1;
            }

            if ($item->productCode != '') {
                $variante->sku = $item->productCode;
            } elseif ($request->productCode != '') {
                $variante->sku = $request->productCode;
            } else {
                $variante->sku = Str::uuid();
            }

            if ($item->deleted != '') {
                $variante->deleted = $item->deleted;
            } else {
                $variante->deleted = false;
            }

            if (property_exists($item->selectedImage, 'value')) {
                $variante->image_path = $item->selectedImage->value;
            } else {
                $variante->image_path = null;
            }

            $variante->product_id = $product->id;

            $variante->save();

            // si la value de l'option existe alors on l'attache sinon on la crée d'abord puis on l'attache
            if ($item->options != '') {
                foreach ($item->options as $key => $value) {
                    $optionValue = Options_value::where('name', $value)
                        ->where('options_names_id', $key)->first();
                    if ($optionValue) {
                        $variante->options_values()->attach($optionValue->id);
                    } else {
                        $option_value = new Options_value;
                        $maxOrdre = Options_value::where('options_names_id', $key)->max('ordre');
                        $option_value->name = $value;
                        $option_value->ordre = $maxOrdre + 1;
                        $option_value->options_names_id = $key;
                        $option_value->save();
                        $variante->options_values()->attach($option_value->id);
                    }
                }
            }
        }

        // save images
        $images = array_merge(...json_decode($request->imageVariantes));
        foreach ($images as $image) {
            if (File::exists(public_path($image->value))) {
                // $imageName = str_replace('temporaryStorage/', '', $image->value);
                // File::move(public_path($image->value), public_path('images/' . $imageName));
                // File::delete(public_path($image->value));
                $imageName = $image->value;
                Temporary_storage::destroy($image->id);

                $image_product = new Images_product;
                $image_product->path = $imageName;
                $image_product->alt = $imageName;
                $image_product->ordre = $image->ordre;
                $image_product->product_id = $product->id;
                $image_product->save();
            }
        }

        return 'ok';
    }

    public function reOrderImagesProducts(Request $request)
    {

        $imagesProducts = json_decode($request->image);
        dd($imagesProducts);
        $ndx = 1;

        foreach ($imagesProducts as $values) {
            foreach ($values as $item) {
                $tmp_productImage = Images_product::where('id', $item->id)->first();

                $tmp_productImage->ordre = $ndx;
                $tmp_productImage->save();

                $ndx++;
            }
        }
    }

    // use Illuminate\Database\Eloquent\ModelNotFoundException;
    // public function show($id)
    // {
    //     try {
    //         return Book::findOrFail($id);
    //     } catch (ModelNotFoundException $e) {
    //         return response()->json([
    //             'error' => [
    //                 'message' => 'Book not found'
    //             ]
    //         ], 404);
    //     }
    // }

    public function getImagesProduct($path)
    {
        $images = Temporary_storage::where('value', $path)
            ->orderBy('ordre')
            ->get();

        return $images;
    }

    public function storeImages(Request $request)
    {
        if ($request->hasFile('value')) {
            $imagesArr = [];
            $videosArr = [];
            foreach ($request->value as $file) {
                // $file = $request->file('value');
                $mimeType = $file->getClientMimeType();
                $mimeType_videos_array = array('video/webm', 'video/ogg', 'video/avi', 'video/mp4', 'video/mpeg');
                $mimeType_images_array = array('image/gif', 'image/png', 'image/jpeg', 'image/webp');

                $tmp_storage = new Temporary_storage;
                $tools = new StringTools;
                $newName = $tools->nameGeneratorFromFile($file);

                if (in_array($mimeType, $mimeType_images_array)) {
                    $Path = public_path('images/');
                    $imgFile = Image::make($file);
                    $imgFile->save($Path . $newName, 80, 'jpg');

                    $tmp_storage->key = $request->key;
                    $tmp_storage->value = 'images/' . $newName;
                    $tmp_storage->ordre = Temporary_storage::where('key', $request->key)->max('ordre') + 1;
                    $tmp_storage->save();

                    array_push($imagesArr, $tmp_storage->value);
                } else if (in_array($mimeType, $mimeType_videos_array)) {
                    $path = 'images/';
                    $file->move($path, $newName);

                    $tmp_storage->key = $request->key;
                    $tmp_storage->value = $path . $newName;
                    $tmp_storage->save();

                    array_push($videosArr, $tmp_storage->value);
                } else {
                    return 'This file type is not allowed';
                }
            }
            if (count($imagesArr) > 0) {
                return $imagesArr;
            }
            if (count($videosArr) > 0) {
                return $videosArr;
            }
        }
    }


    // supprime une image à la fois
    public function deleteImagesProduct($id)
    {
        $images_product = Images_product::find($id);
        $images_products = Images_product::where('product_id', $images_product->product_id)->get();

        File::delete($images_product->path);
        Images_product::destroy($id);

        // réctifie si besoin les valeurs de ordre
        // pour garder la continuité et supprimer les trous
        // dans le champ ordre
        $images_products = Images_product::where('product_id', $images_product->product_id)
            ->orderBy('ordre', 'asc')
            ->get();

        $i = 1;
        foreach ($images_products  as $image_variante) {
            $image_variante->ordre = $i;
            $image_variante->save();
            $i++;
        }

        return back()->with('images_product', $images_products);
    }


    public function deleteProducts(Request $request)
    {
        $productId = $request->id;
        $product = Product::find($productId);

        // suppression les fichiers images dans public/images
        $images_products = Images_product::where('product_id', $productId)->get();
        foreach ($images_products as $image_variante) {
            if (File::exists(public_path($image_variante->path))) {
                File::delete(public_path($image_variante->path));
            }
        }
        Images_product::where('product_id', $productId)->delete();

        // supprimer toutes les options d'une variante appartenant à un produit donné
        foreach ($product->variantes as $variante) {
            $options_values =  $variante->options_values;
            foreach ($options_values as $options_value) {
                $variante->options_values()->detach($options_value->id);
            }
        }

        $collections = $product->collections;
        foreach ($collections as $collection) {
            $product->collections()->detach($collection->id);
        }

        Variante::where('product_id', $productId)->delete();

        $product->delete();

        return 'ok';
    }

    // change le status d'activation d'un produit
    public function handleProductStatus(Request $request)
    {
        $product = Product::find($request->id);
        $product->status = intval($request->status) == 1 ? 0 : 1;
        $product->save();

        $product = Product::where('id', $request->id)->with('collections', 'images_products', 'variantes')->first();

        return $product;
    }


    public function getAliExpressProduct(Request $request)
    {
        dd($request);
        // $url = $request->color;
        // $contents = file_get_contents($url);
        $colorTab = (json_decode($request->color));
        dd($colorTab, json_decode($request->size));
        $body = new Body;
        $body->data = $request->body;
        $body->save();

        // importer image et sauvegarder
        // $url = "http://www.google.co.in/intl/en_com/images/srpr/logo1w.png";
        // $contents = file_get_contents($url);
        // $name = substr($url, strrpos($url, '/') + 1);
        // Storage::put($name, $contents);

        // return redirect()->route('collections.index');
    }


    public function selectCollections($productId)
    {
        $collections = Collection::all();
        $product = Product::find($productId);
        $productCollections = $product->collections;
        $prodCol = [];
        foreach ($productCollections as $col) {
            array_push($prodCol, $col->name);
        }
        return ['collections' => $collections, 'product' => $product, 'productCollections' => $prodCol];
    }

    public function fetchImage(Request $request)
    {
        $img = file_get_contents($request->url);
        dd($img);
        return $img;
    }
}
