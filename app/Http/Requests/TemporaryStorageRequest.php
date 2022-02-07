<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class TemporaryStorageRequest extends FormRequest
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
            'key' => 'required|string',
            'value' => 'required|file|mimes:jpeg,jpg,jpe,jfi,jif,jfif,png,gif,bmp,webp,mp4,m4v,ogv,webm,mov'
        ];
    }
}
