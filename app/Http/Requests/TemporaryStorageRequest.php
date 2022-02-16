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
            'key' => 'nullable|string',
            'value' => 'nullable|mimetypes:video/mp4,video/webm,video/ogg,video/avi,video/mpeg,video/quicktime,video/x-msvideo,video/x-ms-wmv,image/gif,image/png,image/jpeg,image/webp'
        ];
    }
}