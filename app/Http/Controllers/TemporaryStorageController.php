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
        /// check and delete record and image if exist
        $tmp_storage = Temporary_storage::where('key', $request->key)->get();

        // exclur les éléments du tableau avant de delete
        $except = array("tmp_tinyMceImages");
        if ($tmp_storage != null && !in_array($request->key, $except)) {
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

                $destinationPath = public_path('/temporaryStorage');
                $imgFile = Image::make($image);
                $imgFile->save($destinationPath . '/' . $input['image']);

                $tmp_storage->key = $request->key;
                $tmp_storage->value = '/temporaryStorage/' . $input['image'];
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

    // delete removed images in folder and db
    public function deleteTinyMceTemporayStoredImages(Request $request)
    {

        $tab_dataToDelete = explode(',', $request->value);
        $tinyImagesInDB = Temporary_storage::where('key', $request->key)->get();

        foreach ($tinyImagesInDB as $imageDB) {

            if (!in_array($imageDB->value,  $tab_dataToDelete)) {

                File::delete(public_path(substr($imageDB->value, 1)));
                Temporary_storage::destroy($imageDB->id);
            }
        }
    }

    // remove records from db and files from folders when unused more
    public function cleanTemporayStorage(Request $request)
    {

        $toDelete = Temporary_storage::where('key', $request->key)->get();

        foreach ($toDelete as $deleteMe) {

                File::delete(public_path(substr($deleteMe->value, 1)));
                Temporary_storage::destroy($deleteMe->id);
        }
    }
}
