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
use App\Http\Controllers\ConfigController;
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
use App\Http\Controllers\ShippingController;
use App\Http\Controllers\SupplierController;
use App\Http\Controllers\AliExpressController;
use App\Http\Controllers\CollectionController;
use App\Http\Controllers\ProductSheetController;
use App\Http\Controllers\OptionsValueController;
use App\Http\Controllers\TemporaryStorageController;
use App\Http\Controllers\Auth\RegisteredUserController;
use App\Http\Controllers\OptionsNameController;

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
// Route::resource('/taxes', TaxeController::class);
Route::resource('/customers', CustomerController::class);
Route::resource('/collections', CollectionController::class);
Route::resource('/type_detail_products', OptionsNameController::class);
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


// change order of images when drag and drop images products on create product form
Route::post('/reOrderImagesProducts', [TemporaryStorageController::class, 'reOrderImagesProducts']);

// get temporary collection image
Route::get('/getSingleTemporaryImage/{id}', [TemporaryStorageController::class, 'getSingleTemporaryImage']);

// get temporary collection image
Route::get('/getTemporaryImages/{key}', [TemporaryStorageController::class, 'getTemporaryImages']);

// delete temporary element by id
Route::get('/deleteOneElementById/{id}', [TemporaryStorageController::class, 'deleteOneElementById']);

// delete temporary collection image
Route::post('/deleteTemporayStoredElements', [TemporaryStorageController::class, 'deleteTemporayStoredElements']);

// delete "count" ModalImageVariante images from Temporary_storage
Route::post('/deleteModalImageVariantes', [TemporaryStorageController::class, 'deleteModalImageVariantes']);

// handle tinyMCE temporary images and videos when collection or product are registred
Route::post('/handleTinyMceTemporaryElements', [TemporaryStorageController::class, 'handleTinyMceTemporaryElements']);

// remove records from db and files from folders when unused more
Route::post('/cleanTemporayStorage', [TemporaryStorageController::class, 'cleanTemporayStorage']);

Route::get('/listtype', [OptionsNameController::class, 'listtype']);

// utilisé dans selectCollections.jsx 
Route::get('/getCollections', [CollectionController::class, 'getCollections']);

// récupère une collection pour l'éditer
Route::get('/getCollectionById/{id}', [CollectionController::class, 'getCollectionById']);

// supprime une collection
Route::post('/deleteCollection', [CollectionController::class, 'deleteCollection']);

// change le status d'activation de la collection
Route::post('/handleStatus', [CollectionController::class, 'handleStatus']);

// ajoute des conditions à un group de colection depuis la liste des colletions
Route::post('/addCondtionsToGroup', [CollectionController::class, 'addCondtionsToGroup']);

// suppliers list
Route::get('/suppliers-list', [SupplierController::class, 'index']);

// save supplier
Route::post('/save-supplier', [SupplierController::class, 'store']);

// shipping list
Route::get('/shipping-list', [ShippingController::class, 'index']);

// save shipping
Route::post('/save-shipping', [ShippingController::class, 'saveShipping']);

// edit shipping
Route::post('/edit-shipping', [ShippingController::class, 'editShipping']);

// delete shipping
Route::post('/delete-shipping', [ShippingController::class, 'deleteShipping']);

// save shipping mode
Route::post('/save-Shipping_mode', [ShippingController::class, 'saveShipping_mode']);

// update shipping mode
Route::post('/update-Shipping_mode', [ShippingController::class, 'updateShipping_mode']);

// delete shipping mode
Route::post('/delete-Shipping_mode', [ShippingController::class, 'deleteShipping_mode']);


Route::get('/editProduct/{productId}', [ProductController::class, 'editProduct']);

Route::get('/selectCollections/{productId}', [ProductController::class, 'selectCollections']);

// get image from url
Route::post('/fetchImage', [ProductController::class, 'fetchImage']);


// pour blade -> edit_images.blade !!! N EST PLUS UTILISE
// Route::get('/editImagesProduct/{id}', [ProductController::class, 'editImagesProduct']);

// pour react edit_images.jsx
Route::get('/editImagesProduct/{id}', [ProductController::class, 'editImagesProduct']);
Route::post('/replaceImagesProduct', [ProductController::class, 'replaceImagesProduct']);
Route::post('/addImagesProduct', [ProductController::class, 'addImagesProduct']);
Route::get('/deleteImagesProduct/{id}', [ProductController::class, 'deleteImagesProduct']);

Route::post('/updateProduct', [ProductController::class, 'update']);

Route::get('/creatFrontIndex', [FrontEndController::class, 'create']);
// Route::get('/jumbos', [JumbosController::class, 'index']);

// store les reviews envoyées par les users
Route::post('/storeReveiw', [ReviewController::class, 'storeReveiw']);
Route::get('/getProducts', [ProductController::class, 'index']);
// //sert à rien ??
// Route::post('/details', [OptionsValueController::class, 'details']);

// // A SUPPRIMER ? !!!
// Route::get('/detailCompletion', [OptionsValueController::class, 'detailCompletion']);

Route::get('/getOptionValues', [OptionsValueController::class, 'getOptionValues']);

// renvoi les valeurs d'option d'un produit donné
Route::get('/getOptionValues', [OptionsValueController::class, 'getOptionValues']);

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


// CONFIGS ----------------------------------------------------------
Route::get('/getConfigs', [ConfigController::class, 'getConfigs']);
Route::get('/getConfig/{param}', [ConfigController::class, 'getConfig']);
Route::post('/updateConfig', [ConfigController::class, 'updateConfig']);
Route::get('/getUserLocalisation', [ConfigController::class, 'getUserLocalisation']);


// TAXES ------------------------------------------------------------
Route::get('/getTaxes', [TaxeController::class, 'getTaxes']);
Route::post('/deleteTaxes', [TaxeController::class, 'deleteTaxes']);
Route::post('/addTaxes', [TaxeController::class, 'addTaxes']);
Route::post('/updateTaxes', [TaxeController::class, 'updateTaxes']);
Route::post('/updateTvaRate', [TaxeController::class, 'updateTvaRate']);


require __DIR__ . '/auth.php';


// pour les test HackerRank
Route::get('/hackerRanck', [HackerRank_Test::class, 'hackerRanck']);

