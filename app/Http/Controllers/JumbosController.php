<?php

namespace App\Http\Controllers;

use App\Models\Jumbo;
use Illuminate\Http\Request;
use Intervention\Image\Facades\Image;
use Illuminate\Support\Facades\File;


class JumbosController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $jumbos = Jumbo::all();
        return view('jumbo.list')->with('jumbos', $jumbos);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        $jumbos = Jumbo::all();
        return view('jumbo.form')->with('jumbos', $jumbos);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $this->validate($request, ['text' => 'required', 'button_text' => 'required', 'image' => 'required', 'alt' => 'required']);

        $jumbos = new Jumbo;
        $jumbos->text = $request->text;
        $jumbos->button_text = $request->button_text;
        $jumbos->alt = $request->alt;

        $image = $request->file('image');
        $input['image'] = time() . '.' . $image->getClientOriginalExtension();

        $destinationPath = public_path('/images');

        $imgFile = Image::make($image->getRealPath());

        $imgFile->resize(1920, 980, function ($constraint) {
            $constraint->aspectRatio();
        })->save($destinationPath . '/' . $input['image']);

        $destinationPath = public_path('/uploads');
        $image->move($destinationPath, $input['image']);

        $jumbos->image = 'images/' . $input['image'];
 
        $jumbos->save();

        return redirect('/jumbos/create')->with('status', 'Le jumbo a été ajouté');
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
        $jumbo = Jumbo::find($id);
        return view('jumbo.edit')->with('jumbo', $jumbo);
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

        $this->validate($request, ['text' => 'required', 'button_text' => 'required', 'alt' => 'required']);

        $jumbo =  Jumbo::find($id);
        $jumbo->text = $request->text;
        $jumbo->button_text = $request->button_text;
        $jumbo->alt = $request->alt;

        if ($request->hasFile('image')) {

            File::delete(public_path($jumbo->image));

            $image = $request->file('image');
            $input['image'] = time() . '.' . $image->getClientOriginalExtension();

            $destinationPath = public_path('/images');

            $imgFile = Image::make($image->getRealPath());

            $imgFile->resize(1920, 980, function ($constraint) {
                $constraint->aspectRatio();
            })->save($destinationPath . '/' . $input['image']);

            $destinationPath = public_path('/uploads');
            $image->move($destinationPath, $input['image']);

            $jumbo->image = 'images/' . $input['image'];
 
            $jumbo->save();

            return redirect('/jumbos')->with('status', 'Jumbotron updated!');

        } else {

            $jumbo->image = $jumbo->image;

            $jumbo->save();

            return redirect('/jumbos')->with('status', 'Jumbotron updated!');
        }
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy(Jumbo $jumbo)
    {
        $jumbo->delete();
        return back();
    }
}
