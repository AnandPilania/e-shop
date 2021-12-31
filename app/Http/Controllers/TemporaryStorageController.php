<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Temporary_storage;
use Intervention\Image\Facades\Image;
use Illuminate\Support\Facades\File;


class TemporaryStorageController extends Controller
{
    public function getTemporaryImage()
    {
        $tmp_img = Temporary_storage::where('key', 'tmp_imageCollection')->first();

        return $tmp_img->value;
    }

    // Ajoute des images pour un produit donné
    public function temporaryStoreImages(Request $request)
    {
        if ($request->hasFile('value')) {
            $images = $request->file('value');
            foreach ($images as $image) {
                $tmp_storage = new Temporary_storage;
                // on crée une random string pour ajouter au nom de l'image
                $random = substr(str_shuffle("0123456789abcdefghijklmnopqrstvwxyz"), 0, 10);
                // on explode pour récuppérer le nom sans l'extention
                $imageName = explode(".", $image->getClientOriginalName());
                $imageName[0] = str_replace(" ", "", $imageName[0]);

                // on reconstruit le nom de l'image
                if ($image->getClientOriginalExtension() == '') {
                    // si l'image a été drag drop d'un autre site elle n'aura peut-être pas d'extension même si c'est un fichier png ou autres images
                    $input['image'] = $imageName[0] . '_' .  $random . '.jpg';
                } else {
                    // image avec extension
                    $input['image'] = $imageName[0] . '_' .  $random .  '.jpg';
                }

                $destinationPath = public_path('/temporaryStorage');
                $imgFile = Image::make($image);
                $imgFile->save($destinationPath . '/' . $input['image']);

                $tmp_storage->key = $request->key;
                $tmp_storage->value = 'temporaryStorage/' . $input['image'];
                $tmp_storage->save();
            }

            return 'ok';
        }
    }

    public function deleteTemporayStoredImages($key)
    {
        $tmp_storage = Temporary_storage::where('key', $key)->get();

        foreach ($tmp_storage as $toDelete) {
            // value contien le chemin du stockage de l'image
            File::delete($tmp_storage->value);
            Temporary_storage::destroy($toDelete->id);
        }

        return 'ok';
    }
}
