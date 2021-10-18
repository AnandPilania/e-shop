<?php


use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\CartController;
use App\Http\Controllers\TaxeController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\ClientController;
use App\Http\Controllers\JumbosController;
use App\Http\Controllers\ReviewController;
use App\Http\Controllers\SliderController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\BanniereController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\CommandeController;
use App\Http\Controllers\CustomerController;
use App\Http\Controllers\FrontEndController;
use App\Http\Controllers\CollectionController;
use App\Http\Controllers\ProductSheetController;
use App\Http\Controllers\ProductDetailController;
use App\Http\Controllers\Type_detail_productController;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

//Client//
Route::get('/', [FrontEndController::class, 'index']);
Route::get('/home', [ClientController::class, 'home']);
Route::get('/shop', [ClientController::class, 'shop']);
Route::get('/panier', [ClientController::class, 'panier']);
Route::get('/client_login', [ClientController::class, 'client_login']);
Route::get('/signup', [ClientController::class, 'signup']);
Route::get('/paiement', [ClientController::class, 'paiement']);

Route::get('/panier', [CartController::class, 'index_panier']);
Route::get('/vider-panier', [CartController::class, 'viderPanier']);

//Admin//
Route::get('/dashboard', [AdminController::class, 'dashboard']);

//resources//
Route::resource('/categories', CategoryController::class);
Route::resource('/products', ProductController::class);
Route::resource('/sliders', SliderController::class);
Route::resource('/commandes', CommandeController::class);
Route::resource('/taxes', TaxeController::class);
Route::resource('/customers', CustomerController::class);
Route::resource('/collections', CollectionController::class);
Route::resource('/type_detail_products', Type_detail_productController::class);
Route::resource('/jumbos', JumbosController::class);
Route::resource('/bannieres', BanniereController::class);
Route::resource('/reviews', ReviewController::class);
Route::resource('/carts', CartController::class);



// cette route remplace Route::resource('/collections INDEX car j'ai besoin de l'URL collections pour le front end pour le SEO
Route::get('/collectionsBackEnd', [CollectionController::class, 'collectionsBackEnd']);



Route::get('/listtype', [Type_detail_productController::class, 'listtype']);
Route::get('/createProduct', [ProductController::class, 'createProduct']);
Route::get('/editProduct/{productId}', [ProductController::class, 'editProduct']);
Route::get('/selectCollections/{productId}', [ProductController::class, 'selectCollections']);
Route::get('/editImagesProduct/{id}', [ProductController::class, 'editImagesProduct']);
Route::post('/replaceImagesProduct', [ProductController::class, 'replaceImagesProduct']);
Route::post('/addImagesProduct', [ProductController::class, 'addImagesProduct']);
Route::get('/deleteImagesProduct/{id}', [ProductController::class, 'deleteImagesProduct']);
Route::post('/updateProduct', [ProductController::class, 'update']);
Route::get('/detailCompletion', [ProductDetailController::class, 'detailCompletion']);
Route::get('/creatFrontIndex', [FrontEndController::class, 'create']);
// Route::get('/jumbos', [JumbosController::class, 'index']);

// store les reviews envoyées par les users
Route::post('/storeReveiw', [ReviewController::class, 'storeReveiw']);

//sert à rien ??
Route::post('/details', [ProductDetailController::class, 'details']);

//met en best seller un produit dans la table products
Route::post('/bestSeller', [ProductController::class, 'bestSeller']);

// renvoi la fiche du produit
Route::get('/collections/{collection}/{productLink}/{productId}', [ProductSheetController::class, 'productSheet']);

// update le cart // put ne prend pas cette requête
Route::post('/cartUpdate', [CartController::class, 'update']);

// show payment view and give $cart_session data
Route::get('/paiement', [PaymentController::class, 'index']);


Route::get('/logout', function () {
    Auth::logout();
    return redirect('/');
});

Route::get('/vie-privee', function () {
    return View('legale.viePrivee');
});

Route::get('/cookies', function () {
    return View('legale.cookies');
});

Route::get('/conditionsUtilisation', function () {
    return View('legale.conditionsUtilisation');
})->name('cu');

//breeze----------------------------
// Route::get('/', function () {
//     return view('welcome');
// });

// Route::get('/dashboard', function () {
//     return view('dashboard');
// })->middleware(['auth'])->name('dashboard');

require __DIR__ . '/auth.php';
