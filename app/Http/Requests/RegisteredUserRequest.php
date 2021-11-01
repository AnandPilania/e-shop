<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class RegisteredUserRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        return [
            'last_name' => 'required|string|max:255',
            'first_name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255',
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
        ];
    }
}
