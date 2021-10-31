<?php

namespace App\Http\Controllers\Auth;

use App\Models\User;
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
    public function store(Request $request)
    {
        // dd($request);

        // determine if use existing user or create new user
        $user =
            $user = Auth::check() ? User::find(Auth::id()) : new User;
        $address_user = Auth::check() ? $user->address_user : new Address_user;

        $price = $request->price * 100;
        // stripe payment
        $user->charge($price, $request->payment_method);


        $request->validate([
            'last_name' => 'required|string|max:255',
            'first_name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8',
            'rgpd' => 'nullable',

            'country' => 'required|string|max:255',
            'address' => 'required|string|max:255',
            'addressComment' => 'nullable|string|max:500',
            'cp' => 'required|numeric|max:999999999999999999999999',
            'city' => 'required|string|max:255',
            'phone' => 'nullable|numeric|max:999999999999999999999999',
            'civilite' => 'nullable|string|max:1',

            // if bill address is different
            'last_nameBill' => 'nullable|string|max:255',
            'first_nameBill' => 'nullable|string|max:255',
            'countryBill' => 'nullable|string|max:255',
            'addressBill' => 'nullable|string|max:255',
            'addressCommentBill' => 'nullable|string|max:255',
            'cpBill' => 'nullable|numeric|max:999999999999999999999999',
            'cityBill' => 'nullable|string|max:255',
        ]);


        $user->first_name = $request->first_name;
        $user->last_name = $request->last_name;
        $user->email = $request->email;
        $user->password = Hash::make($request->password);
        $user->role = 'guest';
        $user->rgpd = $request->rgpd;
        $user->save();

        $address_user->country = $request->country;
        $address_user->address = $request->address;
        $address_user->addressComment = $request->addressComment;
        $address_user->cp = $request->cp;
        $address_user->city = $request->city;
        $address_user->civilite = $request->civilite;
        $address_user->phone = $request->phone;

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
        Auth::login($user);

        // save user data in cookies 
        $userData = [];
        array_push($userData, $user);
        array_push($userData, $address_user);

        $cookie_name = "0s9m1c8p2l7p3f6";
        $cookie_value = json_encode($userData);
        Cookie::queue($cookie_name, $cookie_value, 525600);

        // dd(json_decode(Cookie::get('0s9m1c8p2l7p3f6', true)));
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
