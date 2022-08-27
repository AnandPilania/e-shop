<?php

namespace App\Http\Controllers;

use App\Models\Body;
use App\Models\Product;
use App\Models\Collection;
use Illuminate\Http\Request;
use App\Models\Product_sheet;
use App\Models\Images_product;
use App\Models\Options_value;
use Illuminate\Support\Facades\DB;
use App\Models\Options_name;
use Illuminate\Support\Facades\File;
use Intervention\Image\Facades\Image;
use App\Http\Controllers\Functions\CleanLink;



class ProductController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $products = DB::table('products')
            ->select('products.id as id', 'images_products.path as image_path', 'products.name as name', 'collections.name as collection', 'categories.name as category', 'products.created_at as created_at')
            ->join('images_products', function ($join) {
                $join->on('products.id', '=', 'images_products.product_id')
                    ->where('images_products.ordre', 1);
            })
            ->join('collection_product', 'products.id', '=', 'collection_product.product_id')
            ->join('collections', 'collections.id', '=', 'collection_product.collection_id')
            ->join('categories', 'categories.id', '=', 'collections.category_id')
            ->orderBy('products.id', 'asc')
            ->get();

        return $products;

        // blade
        // $products = Product::paginate(5);
        // return view('product.list')->with('products', $products);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        $collections = Collection::all();
        return view('product.form', ['collections' => $collections]);
    }


    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        dd(json_decode($request->imageVariantes));

        // $this->validate($request, ['name' => 'required', 'price' => 'required', 'collection' => 'required', 'image' => 'required', 'description' => 'required']);


        $product =  new Product;
        $product->name = $request->name;
        $product->ribbon = $request->ribbon;
        // remplace dans les src de la description le chemin du dossier temporaryStorage par celui de la destionation finale des images et vidéos. !!! c'est handleTinyMceTemporaryElements qui se charge de déplacer les fichiers dans ces dossiers !!!
        $tmp_description = str_replace('temporaryStorage', 'images', $request->description);
        $product->description = preg_replace('/(<source src=").+(images)/', '<source src="' . url('') . '/videos', $tmp_description);
        $product->type = 'none';
        $product->taxe_id = 1; // '!!! à définir !!!'

        $product->save();
        dd($product);
        $collections = explode(",", $request->collection);

        // collection_product <---
        foreach ($collections as $collection) {
            $collection_id = Collection::where('name', $collection)->first('id');
            $product->collections()->attach($collection_id);
        }


        // variantes table !!!
        $product->cost = $request->cost;
        $product->price = $request->price;
        $product->price_before_discount = $request->price_before_discount;
        $product->weight = $request->weight;
        $product->stock = $request->stock;
        $product->shipping_cost = $request->shipping_cost;
        $product->currency_cost_shipping = $request->currency_cost_shipping;
        $product->active = 1;
        $cleanLink = new CleanLink;
        $product->link = $cleanLink->cleanLink($request->name);
        $product->ordre = Product::all()->max('ordre') + 1;
        $product->characteristic = $request->characteristic;
        $product->product_id = $request->product_id;
        $product->supplier_id = $request->supplier_id;
        $product->delivery_company_id = $request->delivery_company_id;

        // $product->ali_url_product = $request->ali_url_product;
        // $product->ali_product_id = $request->ali_product_id;



        $images = $request->file('image');
        $i = 1;
        foreach ($images as $image) {
            $image_variante = new Images_product;
            // on crée une random string pour ajouter au nom de l'image
            $random = substr(str_shuffle("0123456789abcdefghijklmnopqrstvwxyz"), 0, 10);
            // on explode pour récuppérer le nom sans l'extention
            $imageName = explode(".", $image->getClientOriginalName());
            $imageName[0] = str_replace(" ", "", $imageName[0]);

            // on reconstruit le nom de l'image
            if ($image->getClientOriginalExtension() == '') {
                // si l'image a été drag drop d'un autre site elle n'aura peut-être pas d'extention même si c'est un fichier png ou autres
                $input['image'] = $imageName[0] . '_' .  $random . '.jpg';
            } else {
                // ici tout est normale
                $input['image'] = $imageName[0] . '_' .  $random . '.' .  '.jpg';
            }

            $destinationPath = public_path('/images');
            $imgFile = Image::make($image);
            // $imgFile->resize(400, 400, function ($constraint) {
            //     $constraint->aspectRatio();
            // });
            $imgFile->save($destinationPath . '/' . $input['image']);

            $image_variante->path = 'images/' . $input['image'];
            $image_variante->ordre = $i;
            $image_variante->product_id = $product->id;
            $image_variante->save();

            $i++;
        }

        // Insertion dans product_details - on boucle car chaque détail  correspond à un enregistrement dans la table product_details
        foreach (json_decode($request->obj, true) as $detail => $value) {
            $id_type_detail_product = Options_name::where('name', $value['type'])->first();

            $ordre = 1;
            foreach ($value['detail'] as $libelle) {
                $product_detail =  new Options_value;
                $product_detail->libelle = $libelle;
                $product_detail->ordre = $ordre;
                $product_detail->product_id = $product->id;
                $product_detail->type_detail_product_id = $id_type_detail_product['id'];
                $product_detail->save();
                $ordre++;
            }
        }

        if (!empty($request->technicalSheet)) {
            $product_sheet = new Product_sheet;
            $product_sheet->text = $request->technicalSheet;
            $product_sheet->product_id = $product->id;
            $product_sheet->save();
        }


        return redirect('/products/create')->with('status', 'Le produit ' . $input['image'] . ' a été ajouté');
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



    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        // !!! N EST PLUS UTILISE !!!
        // return view('product.edit', ['id' => $id]);
    }

    public function editProduct($productId)
    {

        $product = Product::find($productId);
        $sheet = $product->product_sheet->text;


        $details = $product->product_details;
        $temp_Array = [];
        $objDetails = [];
        $detailName = [];

        foreach ($details as $detail) {
            $temp_Array['libelle'] = $detail->libelle;
            $temp_Array['ordre'] = $detail->ordre;

            $detailName = Options_name::find($detail->type_detail_product_id);
            $temp_Array['type'] = $detailName['name'];

            array_push($objDetails, $temp_Array);
        }
        // dd($objDetails);

        return ['product' => $product, 'sheet' => $sheet, 'objDetails' => $objDetails];
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


    // pour react edit_images.jsx
    public function editImagesProduct($id)
    {
        $images_product = Images_product::where('product_id', $id)
            ->orderBy('ordre')
            ->get();

        return $images_product;
    }


    public function replaceImagesProduct(Request $request)
    {
        // dd($request);
        $image_variante = Images_product::find($request->id);

        if ($request->hasFile('newImage')) {

            File::delete($image_variante->path);

            $image = $request->file('newImage');
            // on crée une random string pour ajouter au nom de l'image
            $random = substr(str_shuffle("0123456789abcdefghijklmnopqrstvwxyz"), 0, 10);
            // on explode pour récuppérer le nom sans l'extention
            $imageName = explode(".", $image->getClientOriginalName());
            $imageName[0] = str_replace(" ", "", $imageName[0]);

            // on reconstruit le nom de l'image
            if ($image->getClientOriginalExtension() == '') {
                // si l'image a été drag drop d'un autre site elle n'aura peut-être pas d'extention même si c'est un fichier png ou autres
                $input['image'] = $imageName[0] . '_' .  $random . '.jpg';
            } else {
                // ici tout est normale
                $input['image'] = $imageName[0] . '_' .  $random . '.' .  '.jpg';
            }

            $destinationPath = public_path('/images');
            $imgFile = Image::make($image);
            // $imgFile->resize(400, 400, function ($constraint) {
            //     $constraint->aspectRatio();
            // });
            $imgFile->save($destinationPath . '/' . $input['image']);

            $image_variante->path = 'images/' . $input['image'];
            $image_variante->save();

            return back();
        } else {
            return back();
        }
    }

    // Ajoute des images pour un produit donné
    public function addImagesProduct(Request $request)
    {

        $product_id = $request->id;

        $images = $request->file('image');
        foreach ($images as $image) {
            $image_variante = new Images_product;
            // on crée une random string pour ajouter au nom de l'image
            $random = substr(str_shuffle("0123456789abcdefghijklmnopqrstvwxyz"), 0, 10);
            // on explode pour récuppérer le nom sans l'extention
            $imageName = explode(".", $image->getClientOriginalName());
            $imageName[0] = str_replace(" ", "", $imageName[0]);

            // on reconstruit le nom de l'image
            if ($image->getClientOriginalExtension() == '') {
                // si l'image a été drag drop d'un autre site elle n'aura peut-être pas d'extention même si c'est un fichier png ou autres
                $input['image'] = $imageName[0] . '_' .  $random . '.jpg';
            } else {
                // ici tout est normale
                $input['image'] = $imageName[0] . '_' .  $random . '.' .  '.jpg';
            }

            $destinationPath = public_path('/images');
            $imgFile = Image::make($image);
            // $imgFile->resize(400, 400, function ($constraint) {
            //     $constraint->aspectRatio();
            // });
            $imgFile->save($destinationPath . '/' . $input['image']);


            // récup max ordre pour déterminer l'ordre à inserer
            $max = Images_product::where('product_id', $product_id)->max('ordre');
            $image_variante->ordre = $max + 1;
            $image_variante->path = 'images/' . $input['image'];
            $image_variante->product_id = $product_id;

            $image_variante->save();
        }

        $images_products = Images_product::where('product_id', $product_id)->get();

        return back()->with('images_product', $images_products);
    }

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

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request)
    {
        // dd($request);
        $this->validate($request, ['name' => 'required', 'price' => 'required', 'collection' => 'required', 'description' => 'required']);

        $product =  Product::find($request->id);
        $product->name = $request->name;
        $product->price = $request->price;
        $product->description = $request->description;

        $link = str_replace(' ', '-', $request->name);
        $search = array('À', 'Á', 'Â', 'Ã', 'Ä', 'Å', 'Ç', 'È', 'É', 'Ê', 'Ë', 'Ì', 'Í', 'Î', 'Ï', 'Ò', 'Ó', 'Ô', 'Õ', 'Ö', 'Ù', 'Ú', 'Û', 'Ü', 'Ý', 'à', 'á', 'â', 'ã', 'ä', 'å', 'ç', 'è', 'é', 'ê', 'ë', 'ì', 'í', 'î', 'ï', 'ð', 'ò', 'ó', 'ô', 'õ', 'ö', 'ù', 'ú', 'û', 'ü', 'ý', 'ÿ');
        $replace = array('A', 'A', 'A', 'A', 'A', 'A', 'C', 'E', 'E', 'E', 'E', 'I', 'I', 'I', 'I', 'O', 'O', 'O', 'O', 'O', 'U', 'U', 'U', 'U', 'Y', 'a', 'a', 'a', 'a', 'a', 'a', 'c', 'e', 'e', 'e', 'e', 'i', 'i', 'i', 'i', 'o', 'o', 'o', 'o', 'o', 'o', 'u', 'u', 'u', 'u', 'y', 'y');
        $cleanLink = str_replace($search, $replace, $link);
        $product->link = strtolower($cleanLink);
        $product->ordre = $product->ordre;

        $product->save();

        // collection_product
        $collections = explode(",", $request->collection);
        $idCollections = [];
        foreach ($collections as $collection) {
            $collection_id = Collection::where('name', $collection)->first('id');
            array_push($idCollections, $collection_id->id);

            $product->collections()->sync($idCollections);
        }

        // Product_sheet
        if (!empty($request->technicalSheet)) {
            Product_sheet::query()->where('product_id', $request->id)->update(array('text' => $request->technicalSheet));
        }

        // Options_value
        // on supprime tous les détails du produit
        Options_value::where('product_id', $request->id)->delete();

        // Insertion dans product_details - on boucle car chaque détail  correspond à un enregistrement dans la table product_details
        if ($request->obj) {

            foreach (json_decode($request->obj, true) as $key => $value) {
                if (array_key_exists('typeOption', $value)) {
                    $type = $value['typeOption'];
                } else {
                    $type = $value['type'];
                }

                // on récupère le Options_name pour en extraire l'id et l'enregistrer dans $product_detail->type_detail_product_id
                $id_type_detail_product = Options_name::where('name', $type)->first();

                $ordre = 1;
                foreach ($value['detail'] as $key => $libelle) {
                    $product_detail =  new Options_value;
                    $product_detail->libelle = $libelle;
                    $product_detail->ordre = $ordre;
                    $product_detail->product_id = $product->id;
                    $product_detail->type_detail_product_id = $id_type_detail_product['id'];
                    $product_detail->save();
                    $ordre++;
                }
            }
        }

        return redirect('/products')->with('status', 'Product updated!');
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy(Product $product)
    {
        dd($product);
        $images_products = Images_product::where('product_id', $product->id)->get();

        // suppression des fichiers images dans public/images
        foreach ($images_products as $image_variante) {
            if (File::exists(public_path($image_variante->path))) {
                File::delete(public_path($image_variante->path));
            }
        }

        // supprimer toutes les images d'un produit donné
        Images_product::where('product_id', $product->id)->delete();
        // supprimer tous les détails d'un produit donné
        Options_value::where('product_id', $product->id)->delete();
        // supprimer fiche produit d'un produit donné
        Product_sheet::where('product_id', $product->id)->delete();
        // supprime les clés étrangères dans la table pivot entre produit et collection
        DB::table('collection_product')->where('product_id', $product->id)->delete();

        $product->delete();
        return back();
    }


    public function bestSeller(Request $request)
    {
        // met le champ best_sell à 1 ou null selon que la checkbox best seller est cochée ou pas
        $product =  Product::find($request->id);

        $product->best_sell = $request->checked == 1 ? 1 : null;

        $product->save();
    }

    public function fetchImage(Request $request) {
        // dd($request->url);
        $img = file_get_contents($request->url);
        dd($img);
        return $img;                          
    }
}
