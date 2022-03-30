<?php


use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\View;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Cookie;
use Illuminate\Support\Facades\Session;
use App\Http\Controllers\CartController;
use App\Http\Controllers\TaxeController;
use App\Http\Controllers\HackerRank_Test;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\JumbosController;
use App\Http\Controllers\ReviewController;
use App\Http\Controllers\SliderController;
use App\Http\Controllers\BackEndController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\BanniereController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\CommandeController;
use App\Http\Controllers\CustomerController;
use App\Http\Controllers\FrontEndController;
use App\Http\Controllers\AliExpressController;
use App\Http\Controllers\CollectionController;
use App\Http\Controllers\ProductSheetController;
use App\Http\Controllers\ProductDetailController;
use App\Http\Controllers\TemporaryStorageController;
use App\Http\Controllers\Auth\RegisteredUserController;
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


Route::get('/', [FrontEndController::class, 'index']);
Route::get('/panier', [CartController::class, 'index_panier']);
Route::get('/vider-panier', [CartController::class, 'viderPanier']);

//Back-end//
Route::get('/dashboard', [BackEndController::class, 'dashboard']);

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
Route::resource('/orders', OrderController::class);

// use in create.jsx Collections
Route::get('/getCategories', [CategoryController::class, 'getCategories']);

// store la collection
Route::post('/save-collection', [CollectionController::class, 'storeAndAssign']);

// cette route remplace Route::resource('/collections INDEX car j'ai besoin de l'URL collections pour le front end pour le SEO
Route::get('/collections-list-back-end', [CollectionController::class, 'collectionsListBackEnd']);

// stocke temporairement dans temporary_storages une ou plusieurs images
Route::post('/temporaryStoreImages', [TemporaryStorageController::class, 'temporaryStoreImages']);

// get temporary collection image
Route::get('/getSingleTemporaryImage/{id}', [TemporaryStorageController::class, 'getSingleTemporaryImage']);

// delete temporary collection image
Route::post('/deleteTemporayStoredElements', [TemporaryStorageController::class, 'deleteTemporayStoredElements']);

// handle tinyMCE temporary images and videos when collection is registred
Route::post('/handleTinyMceTemporaryElements', [TemporaryStorageController::class, 'handleTinyMceTemporaryElements']);

// remove records from db and files from folders when unused more
Route::post('/cleanTemporayStorage', [TemporaryStorageController::class, 'cleanTemporayStorage']);

Route::get('/listtype', [Type_detail_productController::class, 'listtype']);

// utilisé dans selectCollections.jsx 
Route::get('/getCollections', [CollectionController::class, 'getCollections']);

// récupère une collection pour l'éditer
Route::get('/getCollectionById/{id}', [CollectionController::class, 'getCollectionById']);

// renvoi les collections correspondants aux ids reçus
Route::post('/getCollectionByIds', [CollectionController::class, 'getCollectionByIds']);

// supprime une collection
Route::post('/deleteCollection', [CollectionController::class, 'deleteCollection']);

// change le status d'activation de la collection
Route::post('/handleStatus', [CollectionController::class, 'handleStatus']);




Route::get('/editProduct/{productId}', [ProductController::class, 'editProduct']);
Route::get('/selectCollections/{productId}', [ProductController::class, 'selectCollections']);


// pour blade -> edit_images.blade !!! N EST PLUS UTILISE
// Route::get('/editImagesProduct/{id}', [ProductController::class, 'editImagesProduct']);

// pour react edit_images.jsx
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

// check if email exist when checkout
Route::post('/checkEmailExist', [RegisteredUserController::class, 'checkEmailExist']);
// save ali express product in db
Route::post('/getAliExpressProduct', [ProductController::class, 'getAliExpressProduct']);

Route::get('/aliProductImport', [AliExpressController::class, 'aliProductImportView']);
Route::post('/importProduct', [AliExpressController::class, 'importProduct']);


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


Route::post('/registerFromPayment', [RegisteredUserController::class, 'store']);

// Stripe
Route::post('/webhook/payment/succeeded', [OrderController::class, 'storeAfterStripePayment']);
// Route::post('webhook/payment/succeeded', function (Request $request) {

//     $orderController = new OrderController;
//     $orderController->storeAfterStripePayment($request);

//     return 'ok';

// });

//breeze----------------------------
// Route::get('/', function () {
//     return view('welcome');
// });

// Route::get('/dashboard', function () {
//     return view('dashboard');
// })->middleware(['auth'])->name('dashboard');


Route::get('/accordion', function () {
    return View('test_menu_accordion.menu');
});


// affiche back-end.backend quand l'url commence par admin. Les sous domaines qui suivent admin sont gérés par reactRouter dans app.jsx 
Route::pattern('path', '^admin+[a-zA-Z0-9-/]*');
Route::any('{path}', function ($page) {
    return view('back-end.backend');
});




require __DIR__ . '/auth.php';


// pour les test HackerRank
Route::get('/hackerRanck', [HackerRank_Test::class, 'hackerRanck']);