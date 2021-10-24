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
        $user = User::find(7);
        // $user->charge(100000, $request->payment_method);
        // dd($request);
        if ($request->has('conserve')) {
            
            $request->validate([
                'last_name' => 'required|string|max:255',
                'first_name' => 'required|string|max:255',
                'email' => 'required|string|email|max:255|unique:users',
                // 'password' => 'required|string|min:8',
                // 'rgpd' => 'required',

                'country' => 'required|string|max:255',
                'address' => 'required|string|max:255',
                // 'addressComment' => 'string|max:500',
                'addressComment' => 'max:500',
                'cp' => 'required|numeric|max:999999999999999999999999',
                'city' => 'required|string|max:255',
                'phone' => 'numeric|max:999999999999999999999999',
                // 'civilite' => 'string|max:1',

                // if bill address is different
                'last_nameBill' => 'string|max:255',
                'first_nameBill' => 'string|max:255',
                'countryBill' => 'string|max:255',
                'addressBill' => 'string|max:255',
                // 'addressCommentBill' => 'string|max:255',
                'addressCommentBill' => 'max:255',
                'cpBill' => 'numeric|max:999999999999999999999999',
                'cityBill' => 'string|max:255',
            ]);


            $user = new User;
            $user->first_name = $request->first_name;
            $user->last_name = $request->last_name;
            $user->email = $request->email;
            $user->password = Hash::make($request->password);
            $user->role = 'guest';
            $user->rgpd = ' à créer'; //$request->rgpd;
            $user->save();

            $address_user = new Address_user;
            $address_user->country = $request->country;
            $address_user->address = $request->address;
            $address_user->addressComment = $request->addressComment;
            $address_user->cp = $request->cp;
            $address_user->city = $request->city;
            // $address_user->civilite = $request->civilite;

            $address_user->countryShip = $request->countryShip;
            $address_user->addressShip = $request->addressShip;
            $address_user->addressCommentShip = $request->addressCommentShip;
            $address_user->cpShip = $request->cpShip;
            $address_user->cityShip = $request->cityShip;
            $address_user->phone = $request->phone;
            $address_user->user_id = $user->id;
            $address_user->save();


            Auth::login($user);

            // cookie
            // save user data in cookies

            $userData = [];
            array_push($userData, $user);
            array_push($userData, $address_user);

            $cookie_name = "0s9m1c8p2l7p3f6";
            $cookie_value = json_encode($userData);
            Cookie::queue($cookie_name, $cookie_value, 525600);
            return back();
        }
    }
}
