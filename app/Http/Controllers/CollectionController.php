<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Category;
use App\Models\Collection;
use Illuminate\Http\Request;
use App\Models\Temporary_storage;
use Illuminate\Support\Facades\File;
use Intervention\Image\Facades\Image;


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
    // !!! N EST PLUS UTILISEE !!!
    // public function collectionsBackEnd()
    // {
    //     $collections = Collection::all();
    //     return view('collection.list')->with('collections', $collections);
    // }

    // renvoi vers la page de liste des collections dans le backend
    // Route '/collections-list-back-end'
    public function collectionsListBackEnd()
    {
        $collections = Collection::all();
        return $collections;
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

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        // $this->validate($request, ['name' => 'required', 'category' => 'required', 'image' => 'required', 'alt' => 'required']);

        // File::move(public_path('exist/test.png'), public_path('move/test_move.png'));

        $collection = new Collection;
        $collection->name = $request->name;
        $collection->category_id = $request->category;
        $collection->alt = $request->alt;

        $link = str_replace(' ', '-', $request->name);
        $search = array('À', 'Á', 'Â', 'Ã', 'Ä', 'Å', 'Ç', 'È', 'É', 'Ê', 'Ë', 'Ì', 'Í', 'Î', 'Ï', 'Ò', 'Ó', 'Ô', 'Õ', 'Ö', 'Ù', 'Ú', 'Û', 'Ü', 'Ý', 'à', 'á', 'â', 'ã', 'ä', 'å', 'ç', 'è', 'é', 'ê', 'ë', 'ì', 'í', 'î', 'ï', 'ð', 'ò', 'ó', 'ô', 'õ', 'ö', 'ù', 'ú', 'û', 'ü', 'ý', 'ÿ');
        $replace = array('A', 'A', 'A', 'A', 'A', 'A', 'C', 'E', 'E', 'E', 'E', 'I', 'I', 'I', 'I', 'O', 'O', 'O', 'O', 'O', 'U', 'U', 'U', 'U', 'Y', 'a', 'a', 'a', 'a', 'a', 'a', 'c', 'e', 'e', 'e', 'e', 'i', 'i', 'i', 'i', 'o', 'o', 'o', 'o', 'o', 'o', 'u', 'u', 'u', 'u', 'y', 'y');
        $cleanLink = str_replace($search, $replace, $link);
        $collection->link = strtolower($cleanLink);

        $image = $request->file('image');
        $input['image'] = time() . '.' . $image->getClientOriginalExtension();

        $destinationPath = public_path('/images');

        $imgFile = Image::make($image->getRealPath());

        $imgFile->resize(1080, 480, function ($constraint) {
            $constraint->aspectRatio();
        })->save($destinationPath . '/' . $input['image']);

        $image->move($destinationPath, $input['image']);

        $collection->image = 'images/' . $input['image'];


        $collection->save();

        return redirect('/collectionsBackEnd/create')->with('status', 'La collection ' . $collection->name . ' a été ajoutée');
    }


    public function storeAndAssign(Request $request)
    {
        // !!! if imagenAME THEN CHANGE NAME OF IMAGE !!!

        // dd($request);
        // METTRE CE QUI SUIT A LA FIN !!!!!!!!!!!!
        $tmp_storage = Temporary_storage::where('key', $request->key)->get();
        foreach ($tmp_storage as $toDelete) {
            File::delete(public_path($toDelete->value));
            Temporary_storage::destroy($toDelete->id);
        }


        // foreach($request->imagesFromTonyMCE as $tinyImage) {
        //     dd($tinyImage);
        // }

        // dd(json_decode($request->objConditions));
        // $this->validate($request, ['name' => 'required', 'category' => 'required', 'image' => 'required', 'alt' => 'required']);

        $conditions = json_decode($request->objConditions);

        // dd($conditions);
        foreach ($conditions as $condition) {

            $field = '';
            // check de quel paramètre il s'agit
            switch ($condition->parameter) {
                case '1':
                    $field = 'name';
                    break;
                case '2':
                    $field = 'type';
                    break;
                case '3':
                    $field = 'supplier';
                    break;
                case '4':
                    $field = 'price';
                    break;
                case '5':
                    $field = 'tag';
                    break;
                case '6':
                    $field = 'prev_price'; // prix avant promo
                    break;
                case '7':
                    $field = 'weight';
                    break;
                case '8':
                    $field = 'stock';
                    break;
                case '9':
                    $field = 'sku_name'; // variante name
                    break;
                default:
                    $field = 'name';
                    break;
            }

            // check de quel operator il s'agit
            $value = trim($condition->value);
            switch ($condition->operator) {
                case '1':
                    // est égale à
                    $list_match[] = Product::where($field, $value)->get();
                    break;
                case '2':
                    // n'est pas égale à
                    $list_match[] = Product::where($field, '!=', $value)->get();
                    break;
                case '3':
                    // est suppérieur à
                    $list_match[] = Product::where($field, '>', $value)->get();
                    break;
                case '4':
                    // est infèrieur à
                    $list_match[] = Product::where($field, '<', $value)->get();
                    break;
                case '5':
                    // commence par
                    $list_match[] = Product::where($field, 'like', $value . ' %')->get();
                    break;
                case '6':
                    //  se termine par
                    $list_match[] = Product::where($field, 'like', '% ' . $value)->get();
                    break;
                case '7':
                    // contient
                    $list_match[] = Product::where($field, $value)
                        ->orWhere($field, 'like', $value . ' %')
                        ->orWhere($field, 'like', '% ' . $value)
                        ->orWhere($field, 'like', '% ' . $value . ' %')->get();
                    break;
                case '8':
                    // ne contient pas
                    $list_match[] = Product::where($field, 'not like', '%' . $value . '%')->get();
                    break;
                case '9':
                    // n'est pas vide
                    $list_match[] = Product::whereNotNull($field)->where($field, 'not like', '')->get();
                    break;
                case '10':
                    // est vide
                    $list_match[] = Product::whereNull($field)->where($field, 'like', '')->get();
                    break;
                default:
                    $list_match[] = '';
                    break;
            }
        }


        $stack = [];
        foreach ($list_match as $item_match) {
            foreach ($item_match as $item) {
                array_push($stack, $item->id);
            }
        }

        $tmp_tab = array_count_values($stack);
        dd($tmp_tab);
        $all_conditions_matched = [];

        // while ($item = current($tmp_tab)) {
        //     if ($item == count($list_match)) {
        //         echo key($tmp_tab), "\n";
        //     }
        //     next($tmp_tab);
        // }


        foreach ($tmp_tab as $item) {
            if ($item === count($list_match)) {
                array_push($all_conditions_matched, $item);
            }
        }
        dd($all_conditions_matched);

        $collection = new Collection;
        $collection->name = $request->name;
        $collection->description = $request->description;
        $collection->notIncludePrevProduct = $request->notIncludePrevProduct;
        $collection->allConditionsNeeded = $request->allConditionsNeeded;
        $collection->objConditions = $request->objConditions;
        $collection->dateActivation = $request->dateActivation;
        $collection->categoryId = $request->categoryId;
        $collection->alt = $request->alt;
        $collection->imageName = $request->imageName;
        $collection->image = $request->image;
        $collection->key = $request->key;

        $link = str_replace(' ', '-', $request->name);
        $search = array('À', 'Á', 'Â', 'Ã', 'Ä', 'Å', 'Ç', 'È', 'É', 'Ê', 'Ë', 'Ì', 'Í', 'Î', 'Ï', 'Ò', 'Ó', 'Ô', 'Õ', 'Ö', 'Ù', 'Ú', 'Û', 'Ü', 'Ý', 'à', 'á', 'â', 'ã', 'ä', 'å', 'ç', 'è', 'é', 'ê', 'ë', 'ì', 'í', 'î', 'ï', 'ð', 'ò', 'ó', 'ô', 'õ', 'ö', 'ù', 'ú', 'û', 'ü', 'ý', 'ÿ');
        $replace = array('A', 'A', 'A', 'A', 'A', 'A', 'C', 'E', 'E', 'E', 'E', 'I', 'I', 'I', 'I', 'O', 'O', 'O', 'O', 'O', 'U', 'U', 'U', 'U', 'Y', 'a', 'a', 'a', 'a', 'a', 'a', 'c', 'e', 'e', 'e', 'e', 'i', 'i', 'i', 'i', 'o', 'o', 'o', 'o', 'o', 'o', 'u', 'u', 'u', 'u', 'y', 'y');
        $cleanLink = str_replace($search, $replace, $link);

        $collection->link = strtolower($cleanLink);

        $image = $request->file('image');
        $input['image'] = time() . '.' . $image->getClientOriginalExtension();
        $destinationPath = public_path('/images');
        $imgFile = Image::make($image->getRealPath());
        $imgFile->resize(1080, 480, function ($constraint) {
            $constraint->aspectRatio();
        })->save($destinationPath . '/' . $input['image']);
        $image->move($destinationPath, $input['image']);

        $collection->image = 'images/' . $input['image'];


        $collection->save();

        $newName = 'new name of image';
        // return $newName;
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
        $collection = Collection::where('link', $link)->first();
        $categories = Category::all();
        return view('front-end.products', ['categories' => $categories, 'collection' => $collection]);
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
    public function destroy(Collection $collection)
    {
        File::delete(public_path($collection->image));

        $collection->delete();
        return back();
    }
}
