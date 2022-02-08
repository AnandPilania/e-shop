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
            'value' => 'required|mimetypes:image/gif, image/png, image/jpeg, image/webp, video/webm, video/ogg, video/avi, video/mpeg, video/quicktime'
        ];
    }
}
