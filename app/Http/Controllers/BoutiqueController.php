<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Http\Request;

class BoutiqueController extends Controller
{
    public function index()
    {
        $categories = Category::all();
        return view('website.index', ['categories' => $categories]);
    }
}
