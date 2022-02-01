<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreCollectionRequest extends FormRequest
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

            'name' => 'required|string|max:255',
            'description' => 'nullable |string|',
            'automatise' => 'required|string|max:5',
            'notIncludePrevProduct' => 'nullable|string|max:5',
            'allConditionsNeeded' => 'nullable|string|max:5',
            'objConditions' => 'nullable|string',
            'dateActivation' => 'required|string|max:255',
            'categoryId' => 'nullable|numeric',
            'alt' => 'nullable|string|max:255',
            'imageName' => 'nullable|string|max:255',
            'image' => 'nullable|sometimes|image|mimes:jpeg,bmp,png,jpg,svg|max:2000',
            'metaTitle' => 'required|string|max:255',
            'metaDescription' => 'nullable|string',
            'metaUrl' => 'nullable|string|max:2045',

        ];
    }
}
