<?php

namespace App\Http\Controllers;

use App\Models\Banniere;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;
use Intervention\Image\Facades\Image;

class BanniereController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $bannieres = Banniere::all();
        return view('banniere.list')->with('bannieres', $bannieres);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        $bannieres = Banniere::all();
        return view('banniere.form')->with('bannieres', $bannieres);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $this->validate($request, ['h2' => 'required', 'paragrphe' => 'required', 'image' => 'required', 'alt' => 'required', 'link' => 'required']);

        $banniere = new Banniere;
        $banniere->h2 = $request->h2;
        $banniere->p = $request->paragrphe;
        $banniere->alt = $request->alt;
        $banniere->link = $request->link;

        $image = $request->file('image');
        $input['image'] = time() . '.' . $image->getClientOriginalExtension();

        $destinationPath = public_path('/images');

        $imgFile = Image::make($image->getRealPath());

        // $imgFile->resize(1920, 980, function ($constraint) {
        //     $constraint->aspectRatio();
        // })->save($destinationPath . '/' . $input['image']);

        $imgFile->save($destinationPath . '/' . $input['image']);

        $destinationPath = public_path('/uploads');
        $image->move($destinationPath, $input['image']);

        $banniere->image = 'images/' . $input['image'];

        $banniere->save();

        return redirect('/bannieres/create')->with('status', 'Le jumbo a été ajouté');
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show(Request $request)
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
        $banniere = Banniere::find($id);
        return view('banniere.edit')->with('banniere', $banniere);
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
        $this->validate($request, ['h2' => 'required', 'paragrphe' => 'required', 'alt' => 'required', 'link' => 'required']);

        $banniere = Banniere::find($id);
        $banniere->h2 = $request->h2;
        $banniere->p = $request->paragrphe;
        $banniere->alt = $request->alt;
        $banniere->link = $request->link;

        if ($request->hasFile('image')) {

            File::delete(public_path($banniere->image));

            $image = $request->file('image');
            $input['image'] = time() . '.' . $image->getClientOriginalExtension();

            $destinationPath = public_path('/images');

            $imgFile = Image::make($image->getRealPath());

            // $imgFile->resize(1920, 980, function ($constraint) {
            //     $constraint->aspectRatio();
            // })->save($destinationPath . '/' . $input['image']);

            $imgFile->save($destinationPath . '/' . $input['image']);

            $destinationPath = public_path('/uploads');
            $image->move($destinationPath, $input['image']);

            $banniere->image = 'images/' . $input['image'];

            $banniere->save();

            return redirect('/bannieres')->with('status', 'Bannière mise à jour');
        } else {

            $banniere->image = $banniere->image;

            $banniere->save();

            return redirect('/bannieres')->with('status', 'Bannière mise à jour');
        }
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy(Banniere $banniere)
    {
        $banniere->delete();
        return back();
    }
}
