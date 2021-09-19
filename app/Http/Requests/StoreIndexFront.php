<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreIndexFront extends FormRequest
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
            'titre' => 'required|max:100|string',
            'description' => 'required|max:100',
            'langue' => 'required|max:50',
            'image_formation' => 'required|image',
            'detail' => 'required|max:400|string',
        ];
    }
}
