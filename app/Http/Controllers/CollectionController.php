<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Collection;
use Illuminate\Http\Request;
use Intervention\Image\Facades\Image;
use Illuminate\Support\Facades\File;


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

    // renvoi vers la page de liste des collections dans le backend
    public function collectionsBackEnd()
    {
        $collections = Collection::all();
        return view('collection.list')->with('collections', $collections);
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
