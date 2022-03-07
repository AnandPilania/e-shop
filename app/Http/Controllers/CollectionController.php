<?php

namespace App\Http\Controllers;

use DateTime;
use DOMDocument;
use App\Models\Product;
use App\Models\Category;
use App\Models\Collection;
use Illuminate\Http\Request;
use App\Models\Temporary_storage;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\File;
use Intervention\Image\Facades\Image;
use App\Http\Controllers\Functions\CleanLink;
use App\Http\Requests\StoreCollectionRequest;
use App\Http\Controllers\Functions\StringTools;
use App\Http\Controllers\Functions\GetArrayOfConditions;

class CollectionController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    // renvoi la page de présentation de toutes les collections dans le front
    public function index()
    {
        $collections = Collection::all();
        $categories = Category::all();
        return view('front-end.collections', ['collections' => $collections, 'categories' => $categories]);
    }

    // utilisé dans formProduct.jsx 
    public function getCollections()
    {
        $collections = Collection::all();
        return ['collections' => $collections];
    }

    // renvoi vers la page de liste des collections dans le backend
    public function collectionsListBackEnd()
    {
        $categories = Category::all('name');
        $collections = Collection::with('category')->orderBy('created_at', 'desc')->get();
        return json_encode([$collections, $categories]);
    }

    // renvoi vers la page de liste des collections dans le backend
    public function getCollectionById($id)
    {
        $collection = Collection::where('id', $id)->with('category')->first();
        return json_encode($collection);
    }


    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        $categories = Category::all();
        return view('collection.form')->with('categories', $categories);
    }


    public function storeAndAssign(StoreCollectionRequest $request)
    {

        // dd($request);

        
        if ($request->id !== 'null') {
            // if collection is edited
            $collection = Collection::find($request->id);
            // to delete previous images and thumbnail - see above
            $imageToDelete = public_path('/') . $collection->image;
            $thumbNailToDelete = public_path('/') . $collection->thumbnail;
        } else {
            $collection = new Collection;
        }

        // check if has conditions
        if ($request->automatise === "true") {
            $conditions = json_decode($request->objConditions);
            // renvoi un ou plusieurs tableaux avec les produits qui correspondes aux conditions demandées
            $getMatchedProduct = new GetArrayOfConditions;
            $list_match = $getMatchedProduct->getArrayOfConditions($conditions);
            // dd($request);
            $stack = [];
            // met tous les ids des variantes de tous les tableaux dans stack pour avoir un seul tableau sur lequel tester si les variantes correspondent à toutes les conditions
            foreach ($list_match as $item_match) {
                foreach ($item_match as $item) {
                    array_push($stack, $item->id);
                }
            }
            // renvoi un tableau avec comme key les ids des produits que l'on doit compter et comme value leur nombre d'occurence dans le tableau $stack
            $tmp_tab = array_count_values($stack);
            $all_conditions_matched = [];
            // si un produit correspond à toutes les conditions donc qu'il apparait dans tous les tableaux à l'interieur du tableau $list_match alors on le met dans all_conditions_matched pour insertion dans la table pivot collection_product
            while ($item = current($tmp_tab)) {
                if ($item == count(json_decode($request->objConditions))) {
                    array_push($all_conditions_matched, key($tmp_tab));
                }
                next($tmp_tab);
            }
        } 

        $collection->name = $request->name;  
        // remplace dans les src de la description le dossier temporaryStorage par celui de la destionation finale des images et vidéos. !!! c'est handleTinyMceTemporaryElements qui se charge de déplacer les fichiers dans ces dossiers !!!
        $tmp_description = str_replace('temporaryStorage', 'images', $request->description);      
        $collection->description = preg_replace('/(<source src=").+(images)/', '<source src="' . url('') . '/videos', $tmp_description);
        $collection->automatise = $request->automatise === 'true' ? 1 : 0;
        $collection->notIncludePrevProduct = $request->notIncludePrevProduct === 'true' ? 1 : 0;
        $collection->allConditionsNeeded = $request->allConditionsNeeded === 'true' ? 1 : 0;
        $collection->objConditions = $request->objConditions;
        $cleanLink = new CleanLink;
        $collection->link = $cleanLink->cleanLink($request->name);
        $collection->meta_title = $request->metaTitle != null ? $request->metaTitle : $collection->nam;
        // enlève les balises img avec leur contenu ainsi que tout le balisage html de la tinyMCE description
        $pattern = '#\s{1,}|  {1,}#i';
        $descriptionWithoutImgTag = preg_replace($pattern, ' ', $request->descriptionForMeta);
        $collection->meta_description = $request->metaDescription != null ? $request->metaDescription : $descriptionWithoutImgTag;
        $collection->meta_url = $request->metaUrl != null ? $request->metaUrl : $collection->link;
        // Retourne un nouvel objet DateTime représentant la date et l'heure spécifiées par la string time, qui a été formaté dans le format donné.
        $date = DateTime::createFromFormat('d-m-Y H:i:s', $request->dateActivation);
        $collection->dateActivation = $date->format('Y-m-d H:i:s');
        $collection->category_id = $request->categoryId;
        $collection->alt = $request->alt !== null ? $request->alt :  $request->name;


        if ($request->hasFile('image')) {
            $image = $request->file('image');
            $tools = new StringTools;
            if ($request->imageName !== null) {
                $input['image'] = $tools->nameGeneratorFromString($request->imageName, $image);
            } else {
                $input['image'] = $tools->nameGeneratorFromFile($image);
            }

            $destinationPath = public_path('/images');
            $imgFile = Image::make($image);
            $thumbnail = Image::make($image);
            $thumbnail->resize(150, null, function ($constraint) {
                $constraint->aspectRatio();
            });

            // $height = Image::make($image)->height();
            $width = Image::make($image)->width();

            if ($width > 1920) {
                $imgFile->resize(1920, null, function ($constraint) {
                    $constraint->aspectRatio();
                });
                // $imgFile->crop(1920, 500);
            }

            $imgFile->save($destinationPath . '/' . $input['image']);
            $thumbnail->save($destinationPath . '/' . 'thumbnail_' . $input['image']);
            $collection->image = 'images/' . $input['image'];
            $collection->thumbnail = 'images/' . 'thumbnail_' . $input['image'];
        }

        $collection->save();

        // fill pivot table with relations between collection and product
        if (isset($all_conditions_matched)) {
            DB::table('collection_product')->where('collection_id', $collection->id)->delete();
            foreach ($all_conditions_matched as $id) {
                $collection->products()->attach($id);
            }
        }

        // remove image collection from temporaryStorage, folder and db 
        $tmp_storage = Temporary_storage::where('key', 'tmp_imageCollection')->get();
        foreach ($tmp_storage as $toDelete) {
            File::delete(public_path($toDelete->value));
            Temporary_storage::destroy($toDelete->id);
        }

        // if is edit collection then remove previous image and thumbnail from images folder
        isset($imageToDelete) && File::delete($imageToDelete, $thumbNailToDelete);

        return 'ok';
    }


    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($link)
    {
        // récupération de l'id de la collection
        // $collection = Collection::where('link', $link)->first();
        // $categories = Category::all();
        // return view('front-end.products', ['categories' => $categories, 'collection' => $collection]);
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        $collection = Collection::find($id);
        $categories = Category::all();
        return view('collection.edit', ['collection' => $collection, 'categories' => $categories]);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        // dd($request);
        $this->validate($request, ['name' => 'required', 'category' => 'required', 'alt' => 'required']);

        $collection =  Collection::find($id);
        $collection->name = $request->name;
        $collection->category_id = $request->category;
        $collection->alt = $request->alt;

        $link = str_replace(' ', '-', $request->name);
        $search = array('À', 'Á', 'Â', 'Ã', 'Ä', 'Å', 'Ç', 'È', 'É', 'Ê', 'Ë', 'Ì', 'Í', 'Î', 'Ï', 'Ò', 'Ó', 'Ô', 'Õ', 'Ö', 'Ù', 'Ú', 'Û', 'Ü', 'Ý', 'à', 'á', 'â', 'ã', 'ä', 'å', 'ç', 'è', 'é', 'ê', 'ë', 'ì', 'í', 'î', 'ï', 'ð', 'ò', 'ó', 'ô', 'õ', 'ö', 'ù', 'ú', 'û', 'ü', 'ý', 'ÿ');
        $replace = array('A', 'A', 'A', 'A', 'A', 'A', 'C', 'E', 'E', 'E', 'E', 'I', 'I', 'I', 'I', 'O', 'O', 'O', 'O', 'O', 'U', 'U', 'U', 'U', 'Y', 'a', 'a', 'a', 'a', 'a', 'a', 'c', 'e', 'e', 'e', 'e', 'i', 'i', 'i', 'i', 'o', 'o', 'o', 'o', 'o', 'o', 'u', 'u', 'u', 'u', 'y', 'y');
        $cleanLink = str_replace($search, $replace, $link);
        $collection->link = strtolower($cleanLink);

        if ($request->hasFile('image')) {

            File::delete(public_path($collection->image));

            $image = $request->file('image');
            $input['image'] = time() . '.' . $image->getClientOriginalExtension();

            $destinationPath = public_path('/images');

            $imgFile = Image::make($image->getRealPath());

            $imgFile->resize(1080, 480, function ($constraint) {
                $constraint->aspectRatio();
            })->save($destinationPath . '/' . $input['image']);

            $image->move($destinationPath, $input['image']);

            $collection->image = 'images/' . $input['image'];
        } else {
            $collection->image = $collection->image;
        }

        $collection->save();

        return redirect('/collectionsBackEnd')->with('status', 'La modification a été éffectuée');
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function deleteCollection(Request $request)
    {
        dd($request->id);

        // File::delete(public_path($collection->image));

        // $collection->delete();
        return 'Collection has been removed';
    }
}
