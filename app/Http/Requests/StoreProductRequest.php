<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreProductRequest extends FormRequest
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
            'nameProduct' => 'required|string|max:255',
            'ribbonProduct' => 'nullable|string|max:255',
            'isInAutoCollection' => 'required',
            'descriptionProduct' => 'nullable|string',
            'transporter' => 'nullable|string',
            'metaUrlProduct' => 'nullable|string|max:2047',
            'metaTitleProduct' => 'nullable|string|max:2047',
            'metaDescriptionProduct' => 'nullable|string|max:2047',
            'tva' => 'nullable|string',
            'supplier' => 'nullable|string|max:255',
            'collection' => 'nullable|string',
            'variantes' => 'nullable|string',
            'productPrice' => 'required|numeric',
            'productCost' => 'nullable|numeric',
            'reducedProductPrice' => 'nullable|numeric',
            'productParcelWeight' => 'nullable|numeric',
            'WeightMeasureUnit' => 'required|string',
            'productStock' => 'nullable|numeric',
            'unlimitedStock' => 'required',
            'productSKU' => 'required|string',
            'imageVariantes' => 'nullable|string',
        ];
    }
}
