<?php

namespace App\Http\Controllers\Auth;

use App\Models\Cart;
use App\Models\User;
use App\Models\Order;
use App\Models\Product;
use App\Models\Address_user;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Http;
use Illuminate\Auth\Events\Registered;
use Illuminate\Support\Facades\Cookie;
use App\Providers\RouteServiceProvider;
use Illuminate\Support\Facades\Session;
use App\Http\Requests\Auth\LoginRequest;
use App\Http\Requests\RegisteredUserRequest;
use App\Events\EmptySessionCart_DestroyCookieCart;

class RegisteredUserController extends Controller
{
    /**
     * Display the registration view.
     *
     * @return \Illuminate\View\View
     */
    public function create()
    {
        $countries = DB::table('countries')
            ->select('name_fr')
            ->orderBy('name_fr', 'asc')
            ->get();

        return view('auth.register', ['countries' => $countries]);
    }

    /**
     * Handle an incoming registration request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\RedirectResponse
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(RegisteredUserRequest $request)
    {
        // dd(json_encode(Session::get('cart')));
        // dd($request);

        // ICI JE DOIS ENREGISTER LE payment_methode QUELQUE PART !!!!
        // POUR FAIRE LE LIEN AVEC L USER ET LE PAIEMENT SUR STRIPE

        // determine if use existing user or create a new user
        $user = Auth::check() ? User::find(Auth::id()) : new User;
        $address_user = Auth::check() ? $user->address_user : new Address_user;

        // save user in db
        // on sauvegarde d'office même les users déjà dans la db pour tenir compte des éventuels changements dans les infos
        $user->first_name = $request->first_name;
        $user->last_name = $request->last_name;
        $user->email = $request->email;
        $user->password = Hash::make($request->password);
        $user->role = 'guest';
        $user->rgpd = $request->rgpd;
        $user->save();

        // save address user in db
        $address_user->user_id = $user->id;
        $address_user->country = $request->country;
        $address_user->address = $request->address;
        $address_user->addressComment = $request->addressComment;
        $address_user->cp = $request->cp;
        $address_user->city = $request->city;
        $address_user->civilite = $request->civilite;
        $address_user->phone = $request->phone;

        // save bill address user in db
        if ($request->address_bill == 'different') {
            $address_user->first_nameBill = $request->first_nameBill;
            $address_user->last_nameBill = $request->last_nameBill;
            $address_user->countryBill = $request->countryBill;
            $address_user->addressBill = $request->addressBill;
            $address_user->addressCommentBill = $request->addressCommentBill;
            $address_user->cpBill = $request->cpBill;
            $address_user->cityBill = $request->cityBill;
            $address_user->user_id = $user->id;
        }

        $address_user->save();

        // if it's a new user he is logged
        !Auth::check() && Auth::login($user);

        // save user data in cookies !!! A QUOI CA SERT ???
        // $userData = [];
        // array_push($userData, $user);
        // array_push($userData, $address_user);

        // $cookie_name = "0s9m1c8p2l7p3f6";
        // $cookie_value = json_encode($userData);
        // Cookie::queue($cookie_name, $cookie_value, 525600);

        // calcule le prix total de façon sécurisée
        if (Session::exists('cart')) {

            $cart = Session::get('cart');
            $total_price = 0;

            if ($cart != null) {
                foreach ($cart as $products) {

                    $product = Product::find($products['product_id_cart']);
    
                    $total_price += ((int) $products['quantity'] * $product->price);
                }
            }
        }

        // puisque je ne sais pas accéder à Session('cart') dans OrderController je met le cart en db et le récupère à partir de la db dans OrderController -> storeAfterStripePayment
        if (Cart::where('user_id', $user->id)->exists()) {
            $cart = Cart::where('user_id', $user->id)->first();
            $cart->user_id = $user->id;
            $cart->cart = json_encode(Session::get('cart'));
            $cart->save();
        } else {
            $cart = new Cart();
            $cart->user_id = $user->id;
            $cart->cart = json_encode(Session::get('cart'));
            $cart->save();
        }

        // supression session et cookie du cart
        setcookie("2c7a6r9t5f4u3c2k5", "", time() - 3600);
        Session::forget('cart');

        // STRIPE
        $user->createOrGetStripeCustomer();

        // stripe doit recevoir le prix en centimes
        if ($total_price) {
            $price = $total_price * 100;
            // stripe payment
            $user->charge($price, $request->payment_method, [
                "description" => $user->id,
            ]);
        }

        return back();
    }


    public function checkEmailExist(LoginRequest $request)
    {
        $user = User::where('email', $request->email)->first();

        // si l'email existe et que le mdp est le même que celui en db alors on renvoi les adresses de users et on passe à la partie shipping de la page paiement
        if ($user) {
            if (Hash::check($request->password, $user->password)) {
                $userData = [];
                array_push($userData, $user);
                array_push($userData, $user->address_user);

                $credentials = $request->only('email', 'password');

                Auth::attempt($credentials);

                return $userData;
            } else {
                return 'exist';
            }
        }
        if (!$user) {
            return 'not exist';
        }
    }
}
