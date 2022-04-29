<?php

namespace App\Http\Controllers;

use App\Models\Group;
use App\Models\Style;
use Illuminate\Http\Request;

class StyleController extends Controller
{

    public function index()
    {
        $styles = Style::all();

        $groups = Group::all();

        return view('stylesList', ['styles' => $styles, 'groups' => $groups]);
    }

    public function create()
    {
        return view('createStyle');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|max:255',
        ]);

        $style = new Style;

        $style->name = $request->name;

        $style->save();

        return redirect('/create_style');
    }

    public function edit($id)
    {
        $style = Style::find($id);

        return view('editStyle')->with('style', $style);
    }

    public function update(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|max:255',
        ]);

        $style = Style::find($request->id);

        $style->name = $request->name;

        $style->save();

        return redirect('/list_styles');
    }

    public function destroy($id)
    {
        $styles = Style::all();

        $isUsed = Group::where('style_id', $id)->first();

        if ($isUsed === null) {

            $style = Style::find($id);

            $style->delete();

            return redirect('list_styles');
        } else {

            return redirect('list_styles');
        }
    }
}
