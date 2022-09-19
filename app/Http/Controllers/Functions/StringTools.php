<?php

namespace App\Http\Controllers\Functions;

use Illuminate\Support\Str;


class StringTools
{

    public function cleanCaracters($str)
    {
        $search = array('À', 'Á', 'Â', 'Ã', 'Ä', 'Å', 'Ç', 'È', 'É', 'Ê', 'Ë', 'Ì', 'Í', 'Î', 'Ï', 'Ò', 'Ó', 'Ô', 'Õ', 'Ö', 'Ù', 'Ú', 'Û', 'Ü', 'Ý', 'à', 'á', 'â', 'ã', 'ä', 'å', 'ç', 'è', 'é', 'ê', 'ë', 'ì', 'í', 'î', 'ï', 'ð', 'ò', 'ó', 'ô', 'õ', 'ö', 'ù', 'ú', 'û', 'ü', 'ý', 'ÿ');
        $replace = array('A', 'A', 'A', 'A', 'A', 'A', 'C', 'E', 'E', 'E', 'E', 'I', 'I', 'I', 'I', 'O', 'O', 'O', 'O', 'O', 'U', 'U', 'U', 'U', 'Y', 'a', 'a', 'a', 'a', 'a', 'a', 'c', 'e', 'e', 'e', 'e', 'i', 'i', 'i', 'i', 'o', 'o', 'o', 'o', 'o', 'o', 'u', 'u', 'u', 'u', 'y', 'y');
        $cleanCaracters = str_replace($search, $replace, $str);

        return strtolower($cleanCaracters);
    }


    public function nameGeneratorFromFile($file)
    {
        $str = $this->cleanCaracters($file->getClientOriginalName());
        $str = str_replace(strrchr($str, '.'), '', $str); // delete extension

        $pattern = '/(-\d+\.[a-zA-Z]{2,4})$/';
        $str = preg_replace($pattern, '', $str);

        $pattern = '/(\.[a-zA-Z]{2,4})$/';
        $str = preg_replace($pattern, '', $str);

        $pattern = '/[\!\^\$\?\+\*\|&"\'_=\-\.\(\)\{\}¤£¨\/,;:ù%µ@€ ]+/';
        $str = preg_replace($pattern, '-', $str);

        if ($file->getClientOriginalExtension() !== '') {
            $ext = $file->getClientOriginalExtension();
        } else {
            $ext = $this->getExtesion($file);
        }
        
        // remplace all specials caracteres and lowerCase
        $newName = $this->cleanCaracters($str) . '-' . Str::uuid() . '.' . $ext;

        return $newName;
    }

    public function nameGeneratorFromString($string, $file)
    {
        $pattern = '/(-\d+\.[a-zA-Z]{2,4})$/';
        $str = preg_replace($pattern, '', $string);

        $pattern = '/(\.[a-zA-Z]{2,4})$/';
        $str = preg_replace($pattern, '', $str);

        $pattern = '/[\!\^\$\?\+\*\|&"\'_=\-\.\(\)\{\}¤£¨\/,;:ù%µ@€ ]+/i';
        $str = preg_replace($pattern, '-', $str);

        $ext = $this->getExtesion($file);
        // remplace all specials caracteres and lowerCase
        $newName = $this->cleanCaracters($str) . '-' . time() . '.' . $ext;

        return $newName;
    }

    public function getExtesion($file)
    {
        $mimeType = $file->getClientMimeType();
        $extension = '';

        switch ($mimeType) {
            case 'video/mp4':
                $extension = 'mp4';
                break;
            case 'video/webm':
                $extension = 'webm';
                break;
            case 'video/ogg':
                $extension = 'ogv';
                break;
            case 'video/avi':
                $extension = 'avi';
                break;
            case 'video/mpeg':
                $extension = 'mpeg';
                break;
            case 'video/quicktime':
                $extension = 'mov';
                break;
            case 'video/x-msvideo':
                $extension = 'avi';
                break;
            case 'video/x-ms-wmv':
                $extension = 'wmv';
                break;
            case 'image/gif':
                $extension = 'gif';
                break;
            case 'image/png':
                $extension = 'png';
                break;
            case 'image/jpeg':
                $extension = 'jpg';
                break;
            case 'image/webp':
                $extension = 'webp';
                break;
            default:
                return 'error';
        }

        return $extension;
    }
}
