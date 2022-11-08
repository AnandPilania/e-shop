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
use App\Http\Controllers\TemporaryStorageController;
use App\Http\Controllers\Auth\RegisteredUserController;
use App\Http\Controllers\OptionsVarianteController;

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
//resources//
Route::resource('/categories', CategoryController::class);
Route::resource('/products', ProductController::class);
Route::resource('/sliders', SliderController::class);
Route::resource('/commandes', CommandeController::class);
// Route::resource('/taxes', TaxeController::class);
Route::resource('/customers', CustomerController::class);
Route::resource('/collections', CollectionController::class);
// Route::resource('/type_detail_products', OptionsNameController::class);
Route::resource('/jumbos', JumbosController::class);
Route::resource('/bannieres', BanniereController::class);
Route::resource('/reviews', ReviewController::class);
Route::resource('/carts', CartController::class);
Route::resource('/orders', OrderController::class);


Route::get('/aliProductImport', [AliExpressController::class, 'aliProductImportView']);
Route::post('/importProduct', [AliExpressController::class, 'importProduct']);

//Back-end//
Route::get('/dashboard', [BackEndController::class, 'dashboard']);

Route::get('/panier', [CartController::class, 'index_panier']);
Route::get('/vider-panier', [CartController::class, 'viderPanier']);
// update le cart // put ne prend pas cette requête
Route::post('/cartUpdate', [CartController::class, 'update']);

// use in create.jsx Collections
Route::get('/getCategories', [CategoryController::class, 'getCategories']);

Route::get('/', [FrontEndController::class, 'index']);
Route::get('/creatFrontIndex', [FrontEndController::class, 'create']);

// CONFIGS ----------------------------------------------------------
Route::controller(ConfigController::class)->group(function () {
    Route::get('/getConfigs', 'getConfigs');
    Route::get('/getConfig/{param}', 'getConfig');
    Route::post('/updateConfig', 'updateConfig');
    Route::get('/getUserLocalisation', 'getUserLocalisation');
});

Route::controller(CollectionController::class)->group(function () {
    // utilisé dans selectCollections.jsx 
    Route::get('/getCollections', 'getCollections');
    // récupère une collection pour l'éditer
    Route::get('/getCollectionById/{id}', 'getCollectionById');
    Route::get('/getCollectionTmpImage', 'getCollectionTmpImage');
    Route::post('/saveTemporaryImage', 'saveTemporaryImage');
    // supprime une collection
    Route::post('/deleteCollection', 'deleteCollection');
    // change le status d'activation de la collection
    Route::post('/handleStatus', 'handleStatus');
    // ajoute des conditions à un group de colection depuis la liste des colletions
    Route::post('/addCondtionsToGroup', 'addCondtionsToGroup');
    // store la collection
    Route::post('/save-collection', 'storeAndAssign');
    // cette route remplace Route::resource('/collections INDEX car j'ai besoin de l'URL collections pour le front end pour le SEO
    Route::get('/collections-list-back-end', 'collectionsListBackEnd');
});

// ancien listtype !!!
Route::get('/getOptionsNames', [OptionsVarianteController::class, 'getOptionsNames']);

Route::get('/getOptionValues', [OptionsVarianteController::class, 'getOptionValues']);

Route::get('/getOptionsNamesValuesList', [OptionsVarianteController::class, 'getOptionsNamesValuesList']);

Route::post('/saveOptionVariante', [OptionsVarianteController::class, 'store']);

Route::get('/deleteOptionNameAndHerOptionsValues/{id}', [OptionsVarianteController::class, 'deleteOptionNameAndHerOptionsValues']);

Route::get('/deleteOneOptionValue/{id}', [OptionsVarianteController::class, 'deleteOneOptionValue']);



// Stripe
Route::post('/webhook/payment/succeeded', [OrderController::class, 'storeAfterStripePayment']);
// Route::post('webhook/payment/succeeded', function (Request $request) {

//     $orderController = new OrderController;
//     $orderController->storeAfterStripePayment($request);

//     return 'ok';

// });

// show payment view and give $cart_session data
Route::get('/paiement', [PaymentController::class, 'index']);

Route::controller(ProductController::class)->group(function () {
    Route::post('/getProduct', 'getProduct');
    Route::get('/selectCollections/{productId}', 'selectCollections');
    // get image from url
    Route::post('/fetchImage', 'fetchImage');
    // pour react edit_images.jsx
    Route::get('/editImagesProduct/{id}', 'editImagesProduct');
    Route::post('/replaceImagesProduct', 'replaceImagesProduct');
    Route::post('/addImagesProduct', 'addImagesProduct');
    Route::post('/deleteImageProduct', 'deleteImageProduct');
    // get images by prodcut id
    Route::get('/getTemporaryImagesProduct/{productId}', 'getTemporaryImagesProduct');
    Route::post('/updateProduct', 'update');
    Route::post('/storeTmpImages', 'storeTmpImages');
    Route::post('/clean_Images_product_table', 'clean_Images_product_table');
    // delete "count" ModalImageVariante images from images_products
    Route::post('/deleteModalImageHasBeenCanceled', 'deleteModalImageHasBeenCanceled');
    // change order of images when drag and drop images products in create product form
    Route::post('/reOrderImagesProducts', 'reOrderImagesProducts');
    Route::get('/reOrderImagesProductById/{productId}', 'reOrderImagesProductById');
    Route::get('/getProducts', 'getProducts');
    // change le status d'activation d'un produit'
    Route::post('/handleProductStatus', 'handleProductStatus');
    // delete on or sevreal products
    Route::post('/deleteProducts', 'deleteProducts');
    // delete all tmp products
    Route::get('/deleteTmpProducts', 'deleteTmpProducts');
    // store product
    Route::post('/storeProduct', 'storeProduct');
    // save ali express product in db
    Route::post('/getAliExpressProduct', 'getAliExpressProduct');
    Route::get('/getMaxIdValues_Names', 'getMaxIdValues_Names');
});

// renvoi la fiche du produit
Route::get('/collections/{collection}/{productLink}/{productId}', [ProductSheetController::class, 'productSheet']);

// check if email exist when checkout
Route::post('/checkEmailExist', [RegisteredUserController::class, 'checkEmailExist']);
Route::post('/registerFromPayment', [RegisteredUserController::class, 'store']);

// store les reviews envoyées par les users
Route::post('/storeReveiw', [ReviewController::class, 'storeReveiw']);

Route::controller(ShippingController::class)->group(function () {
    // shipping list
    Route::get('/shipping-list', 'index');
    // save shipping
    Route::post('/save-shipping', 'saveShipping');
    // edit shipping
    Route::post('/edit-shipping', 'editShipping');
    // delete shipping
    Route::post('/delete-shipping', 'deleteShipping');
    // save shipping mode
    Route::post('/save-Shipping_mode', 'saveShipping_mode');
    // update shipping mode
    Route::post('/update-Shipping_mode', 'updateShipping_mode');
    // delete shipping mode
    Route::post('/delete-Shipping_mode', 'deleteShipping_mode');
});

Route::controller(SupplierController::class)->group(function () {
    // suppliers list
    Route::get('/suppliers-list', 'index');
    // save supplier
    Route::post('/save-supplier', 'store');
});

// TAXES ------------------------------------------------------------
Route::controller(TaxeController::class)->group(function () {
    Route::get('/getTaxes', 'getTaxes');
    Route::post('/deleteTaxes', 'deleteTaxes');
    Route::post('/addTaxes', 'addTaxes');
    Route::post('/updateTaxes', 'updateTaxes');
    Route::post('/updateTvaRate', 'updateTvaRate');
});

Route::controller(TemporaryStorageController::class)->group(function () {
    // stocke temporairement dans temporary_storages une ou plusieurs images
    Route::post('/temporaryStoreImages', 'temporaryStoreImages');
    // // change order of images when drag and drop images products on create product form
    // Route::post('/reOrderImagesProducts', 'reOrderImagesProducts');
    // get temporary collection image
    Route::get('/getSingleTemporaryImage/{id}', 'getSingleTemporaryImage');
    // get temporary collection image
    Route::get('/getTemporaryImages/{key}', 'getTemporaryImages');
    // delete temporary element by id
    Route::get('/deleteOneElementById/{id}', 'deleteOneElementById');
    // delete temporary collection image
    Route::post('/deleteTemporayStoredElements', 'deleteTemporayStoredElements');
    // delete "count" ModalImageVariante images from Temporary_storage
    Route::post('/deleteModalImageVariantes', 'deleteModalImageVariantes');
    // handle tinyMCE temporary images and videos when collection or product are registred
    Route::post('/handleTinyMceTemporaryElements', 'handleTinyMceTemporaryElements');
    // remove records from db and files from folders when unused more
    Route::post('/cleanTemporayStorage', 'cleanTemporayStorage');
});


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
// Route::get('/dashboard', function () {
//     return view('dashboard');
// })->middleware(['auth'])->name('dashboard');

// A SUPPRIMER
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
