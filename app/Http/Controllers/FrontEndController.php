<?php

namespace App\Http\Controllers;

use App\Models\Cart;
use App\Models\Jumbo;
use App\Models\Product;
use App\Models\Banniere;
use App\Models\Category;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

use Intervention\Image\Facades\Image;
use App\Http\Requests\StoreIndexFront;
use Illuminate\Support\Facades\Cookie;

use function PHPUnit\Framework\isNull;
use function PHPUnit\Framework\isEmpty;
use Illuminate\Support\Facades\Session;

class FrontEndController extends Controller
{
    public function index()
    {
            return view('front-end.index');
    }

    public function create()
    {
        return view('index-front.form');
    }


    // public function store(StoreIndexFront $request)
    // {
    //     $validated = $request->validated();

    //     $formation = new formation;
    //     $formation->titre = Arr::get($validated, 'titre');
    //     $formation->description = Arr::get($validated, 'description');
    //     $formation->langue = Arr::get($validated, 'langue');
    //     $formation->detail = Arr::get($validated, 'detail');
    //     $formationsCount = formation::all()->max('ordre') + 1;
    //     $formation->ordre = $formationsCount;
    //     if ($request->hasFile('image_formation')) {
    //         // si il y a un fichier image on le redimenssionne avec "intervention image" 
    //         // avant la sauvegarde
    //         $image = $request->file('image_formation');
    //         $filename = time() . $image->getClientOriginalName();
    //         $image_resize = Image::make($image->getRealPath());
    //         $image_resize->fit(400, 250, function ($constraint) {
    //             $constraint->upsize();
    //         });
    //         $image_resize->save(storage_path('app/public/images/' . $filename));
    //         $formation->image_formation = 'images/' . $filename;
    //     }

    //     $formation->save();

    //     return redirect('formations');
    // }

}
