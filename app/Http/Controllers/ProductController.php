<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Collection;
use Illuminate\Http\Request;
use App\Models\Product_sheet;
use App\Models\Images_product;
use App\Models\Product_detail;
use Illuminate\Support\Facades\DB;
use App\Models\Type_detail_product;
use Illuminate\Support\Facades\File;
use Intervention\Image\Facades\Image;




class ProductController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $products = Product::paginate(5);
        return view('product.list')->with('products', $products);
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

    public function createProduct()
    {
        $collections = Collection::all();
        return ['collections' => $collections];
    }


    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        // dd($request);
        $this->validate($request, ['name' => 'required', 'price' => 'required', 'collection' => 'required', 'image' => 'required', 'description' => 'required']);

        $collections = new Collection;

        $product =  new Product;
        $product->name = $request->name;
        $product->price = $request->price;
        $product->description = $request->description;

        $link = str_replace(' ', '-', $request->name);
        $search = array('À', 'Á', 'Â', 'Ã', 'Ä', 'Å', 'Ç', 'È', 'É', 'Ê', 'Ë', 'Ì', 'Í', 'Î', 'Ï', 'Ò', 'Ó', 'Ô', 'Õ', 'Ö', 'Ù', 'Ú', 'Û', 'Ü', 'Ý', 'à', 'á', 'â', 'ã', 'ä', 'å', 'ç', 'è', 'é', 'ê', 'ë', 'ì', 'í', 'î', 'ï', 'ð', 'ò', 'ó', 'ô', 'õ', 'ö', 'ù', 'ú', 'û', 'ü', 'ý', 'ÿ');
        $replace = array('A', 'A', 'A', 'A', 'A', 'A', 'C', 'E', 'E', 'E', 'E', 'I', 'I', 'I', 'I', 'O', 'O', 'O', 'O', 'O', 'U', 'U', 'U', 'U', 'Y', 'a', 'a', 'a', 'a', 'a', 'a', 'c', 'e', 'e', 'e', 'e', 'i', 'i', 'i', 'i', 'o', 'o', 'o', 'o', 'o', 'o', 'u', 'u', 'u', 'u', 'y', 'y');
        $cleanLink = str_replace($search, $replace, $link);
        $product->link = strtolower($cleanLink);

        $product->save();

        $collections = explode(",", $request->collection);

        foreach ($collections as $collection) {
            $collection_id = Collection::where('name', $collection)->first('id');
            $product->collections()->attach($collection_id);
        }

        $images = $request->file('image');
        $i = 1;
        foreach ($images as $image) {
            $image_product = new Images_product;
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

            $image_product->path = 'images/' . $input['image'];
            $image_product->ordre = $i;
            $image_product->product_id = $product->id;
            $image_product->save();

            $i++;
        }

        // Insertion dans product_details - on boucle car chaque détail  correspond à un enregistrement dans la table product_details
        foreach (json_decode($request->obj, true) as $detail => $value) {
            $id_type_detail_product = Type_detail_product::where('name', $value['type'])->first();

            $ordre = 1;
            foreach ($value['detail'] as $libelle) {
                $product_detail =  new Product_detail;
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
        // $product = Product::find($id);
        // $collections_id = DB::table('collection_product')->where('product_id', $id)->first();
        // $collections = Collection::where('id', $collections_id->id)->get();

        // return view('product.edit', ['product' => $product, 'collections' => $collections]);
        return view('product.edit', ['id' => $id]);
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

            $detailName = Type_detail_product::find($detail->type_detail_product_id);
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


    public function editImagesProduct($id)
    {
        $images_product = Images_product::where('product_id', $id)
            ->orderBy('ordre')
            ->get();
            
        return view('product.edit_images', ['images_product' => $images_product, 'product_id' => $id]);
    }


    public function replaceImagesProduct(Request $request)
    {
        // dd($request);
        $image_product = Images_product::find($request->id);

        if ($request->hasFile('newImage')) {

            File::delete($image_product->path);

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

            $image_product->path = 'images/' . $input['image'];
            $image_product->save();

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
            $image_product = new Images_product;
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
            $image_product->ordre = $max + 1;
            $image_product->path = 'images/' . $input['image'];
            $image_product->product_id = $product_id;

            $image_product->save();
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
        // du champ ordre
        $images_products = Images_product::where('product_id', $images_product->product_id)
            ->orderBy('ordre', 'asc')
            ->get();

        $i = 1;
        foreach ($images_products  as $image_product) {
            $image_product->ordre = $i;
            $image_product->save();
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

        // Product_detail
        // on supprime tous les détails du produit
        Product_detail::where('product_id', $request->id)->delete();

        // Insertion dans product_details - on boucle car chaque détail  correspond à un enregistrement dans la table product_details
        if ($request->obj) {

            foreach (json_decode($request->obj, true) as $key => $value) {
                if (array_key_exists('typeOption', $value)) {
                    $type = $value['typeOption'];
                } else {
                    $type = $value['type'];
                }

                // on récupère le Type_detail_product pour en extraire l'id et l'enregistrer dans $product_detail->type_detail_product_id
                $id_type_detail_product = Type_detail_product::where('name', $type)->first();

                $ordre = 1;
                foreach ($value['detail'] as $key => $libelle) {
                    $product_detail =  new Product_detail;
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
    { dd($product);
        $images_products = Images_product::where('product_id', $product->id)->get();

        // suppression des fichiers images dans public/images
        foreach ($images_products as $image_product) {
            if (File::exists(public_path($image_product->path))) {
                File::delete(public_path($image_product->path));
            }
        }

        // supprimer toutes les images d'un produit donné
        Images_product::where('product_id', $product->id)->delete();
        // supprimer tous les détails d'un produit donné
        Product_detail::where('product_id', $product->id)->delete();
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


}
