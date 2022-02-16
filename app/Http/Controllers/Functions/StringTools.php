<?php

namespace App\Http\Controllers\Functions;


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
        // on crée une random string pour ajouter au nom de l'image
        // $random = substr(str_shuffle("0123456789abcdefghijklmnopqrstvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"), 0, 10);
        // on explode pour récuppérer le nom sans l'extention
        $imageName = explode(".", $file->getClientOriginalName());
        $index = strpos($imageName[0], '-');
        $index > 0 && $imageName[0] = substr($imageName[0], 0, $index);
        $pattern = '/[\!\^\$\?\+\*\|&"\'_=\- ]+/i';
        $imageName[0] =  preg_replace($pattern, '-', $imageName[0]);

        if ($file->getClientOriginalExtension() !== '') {
            $ext = $file->getClientOriginalExtension();
        } else {
            $ext = $this->getExtesion($file);
        }
        
        // remplace all specials caracteres and lowerCase
        $newName = $this->cleanCaracters($imageName[0]) . '-' . time() . '.' . $ext;

        return $newName;
    }

    public function nameGeneratorFromString($string, $file)
    {
        // on explode pour récuppérer le nom sans l'extention
        $str = explode(".", $string);
        $index = strpos($str[0], '-');
        $index > 0 && $str[0] = substr($str[0], 0, $index);
        $pattern = '/[\!\^\$\?\+\*\|&"\'_=\- ]+/i';
        $str[0] =  preg_replace($pattern, '-', $str[0]);
        $ext = $this->getExtesion($file);
        // remplace all specials caracteres and lowerCase
        $newName = $this->cleanCaracters($str[0]) . '-' . time() . '.' . $ext;

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