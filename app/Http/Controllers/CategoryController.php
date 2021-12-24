<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    // n'est plus utilisé !!!!
    public function index()
    {
        $categories = Category::get();
        return view('category.list')->with('categories', $categories);
    }

    public function getCategories()
    {
        $categories = Category::all();

        return $categories;
    }

    public function store(Request $request)
    {
        $this->validate($request, ['name' => 'required']);

        $category = new Category;
        $category->name = $request->name;

        $category->save();

        return 'ok';
    }

    public function update(Request $request, $id)
    {
        $this->validate($request, ['name' => 'required']);

        $category =  Category::find($id);
        $category->name = $request->name;

        $category->save();

        return 'ok';
    }

    public function destroy(Category $category)
    {
        $category->delete();
        return 'ok';
    }
}
