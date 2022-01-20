<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Temporary_storage;
use Intervention\Image\Facades\Image;
use Illuminate\Support\Facades\File;


class TemporaryStorageController extends Controller
{
    public function getSingleTemporaryImage()
    {
        $tmp_img = Temporary_storage::where('key', 'tmp_imageCollection')->first();

        if (isset($tmp_img->value)) return $tmp_img->value;
    }


    // stock des images temporaires
    public function temporaryStoreImages(Request $request)
    {
// dd('ok ok ok ok');
        /// check and delete record and image if exist
        $tmp_storage = Temporary_storage::where('key', $request->key)->get();
       
        if ($tmp_storage != null && $request->key !== 'tmp_tinyMceImages') {
            foreach ($tmp_storage as $toDelete) {
                File::delete(public_path($toDelete->value));
                Temporary_storage::destroy($toDelete->id);
            }
        }

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

                $destinationPath = public_path('/admin/temporaryStorage');
                $imgFile = Image::make($image);
                $imgFile->save($destinationPath . '/' . $input['image']);

                $tmp_storage->key = $request->key;
                $tmp_storage->value = '/admin/temporaryStorage/' . $input['image'];
                $tmp_storage->save();
            }
            // return response()->json(['location' => $tmp_storage->value]);
            return $tmp_storage->value;
        }
    }

    public function deleteTemporayStoredImages(Request $request)
    {

        $tmp_storage = Temporary_storage::where('key', $request->key)->get();

        foreach ($tmp_storage as $toDelete) {
            File::delete(public_path($toDelete->value));
            Temporary_storage::destroy($toDelete->id);
        }

        return 'ok';
    }

    public function deleteTinyMceTemporayStoredImages(Request $request)
    {

        $tmp_storage = Temporary_storage::where('key', $request->key)->get();

        foreach ($tmp_storage as $toDelete) {
            File::delete(public_path($toDelete->value));
            Temporary_storage::destroy($toDelete->id);
        }

        return 'ok';
    }
}
