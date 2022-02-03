<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Temporary_storage;
use Illuminate\Support\Facades\File;
use Intervention\Image\Facades\Image;
use Illuminate\Support\Facades\Storage;
use App\Http\Controllers\Functions\CleanCaracters;

class TemporaryStorageController extends Controller
{
    public function getSingleTemporaryImage()
    {

        $tmp_img = Temporary_storage::where('key', 'tmp_imageCollection')->first();
        // echo $tmp_img->value;
        if (isset($tmp_img->value)) return $tmp_img->value;
    }


    // stock des images temporaires
    public function temporaryStoreImages(Request $request)
    {
        // dd($request);

        // $ext_images_array = array("gif", "jpeg", "jpg", "png", "tif", "tiff", "bmp");
        // $ext_images = $request->file('value')->getClientOriginalExtension();


        /// check and delete record and image if exist
        $tmp_storage = Temporary_storage::where('key', $request->key)->get();

        // concerne image collection -- delete previous image collection before save the new
        if (count($tmp_storage) > 0 && $request->key === 'tmp_imageCollection') {
            File::delete(public_path($tmp_storage[0]->value));
            Temporary_storage::destroy($tmp_storage[0]->id);
        }

        if ($request->hasFile('value')) {
            $images = $request->file('value');
            foreach ($images as $image) {
                $tmp_storage = new Temporary_storage;
                // on crée une random string pour ajouter au nom de l'image
                $random = substr(str_shuffle("0123456789abcdefghijklmnopqrstvwxyz"), 0, 10);
                // on explode pour récuppérer le nom sans l'extention
                $imageName = explode(".", $image->getClientOriginalName());
                $pattern = '/[\!\^\$\?\+\*\|&"\'_=\- ]+/i';
                $imageName[0] =  preg_replace($pattern, '-', $imageName[0]);
                $cleanCaracters = new CleanCaracters;
                // remplace all specials caracteres and lowerCase
                $imageName[0] = $cleanCaracters->cleanCaracters($imageName[0]);

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

    //
    public function temporaryStoreTinyDescription(Request $request)
    {
        // dd($request->videoFile);
        if ($request->hasFile('value')) {
            $file = $request->file('value');
            $ext_videos = $file->getClientOriginalExtension();
            $ext_videos_array = array("mp4", "m4v", "ogv", "webm", "mov");
            if (in_array($ext_videos, $ext_videos_array)) {

            // on crée une random string pour ajouter au nom de l'image
                $random = substr(str_shuffle("0123456789abcdefghijklmnopqrstvwxyz"), 0, 10);
                // on explode pour récuppérer le nom sans l'extention
                $imageName = explode(".", $file->getClientOriginalName());
                $pattern = '/[\!\^\$\?\+\*\|&"\'_=\- ]+/i';
                $imageName[0] =  preg_replace($pattern, '-', $imageName[0]);
                $cleanCaracters = new CleanCaracters;
                // remplace all specials caracteres and lowerCase
                $url = $cleanCaracters->cleanCaracters($imageName[0]) . '-' . $random . '.' . $file->getClientOriginalExtension();


                $path = 'temporaryStorage/';
                $file->move($path, $url);

                $tmp_storage = new Temporary_storage;
                $tmp_storage->key = $request->key;
                $tmp_storage->value = $path . $url;
                $tmp_storage->save();

                return $path . $url;
            } else {
                return 'This file type is not allowed';
            }
        }   
    }

    // delete all images which have the provided key
    public function deleteTemporayStoredImages(Request $request)
    {
        $tmp_storage = Temporary_storage::where('key', $request->key)->get();
        foreach ($tmp_storage as $toDelete) {
            File::delete(public_path($toDelete->value));
            Temporary_storage::destroy($toDelete->id);
        }
        return 'ok';
    }

    // delete removed tinyMCE images in folder and db
    public function deleteTinyMceTemporayStoredImages(Request $request)
    {
        // dd($request->key);
        $tab_dataToDelete = explode(',', $request->value);
        $tinyImagesInDB = Temporary_storage::where('key', 'tmp_tinyMceImages')->get();
        foreach ($tinyImagesInDB as $imageDB) {
            // si une image en db n'est pas dans les images qu'on a reçu alors on la delete
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
