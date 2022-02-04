<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Temporary_storage;
use Illuminate\Support\Facades\File;
use Intervention\Image\Facades\Image;
use Illuminate\Support\Facades\Storage;
use App\Http\Controllers\Functions\StringTools;

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

                $tools = new StringTools;
                $input['image'] = $tools->nameGenerator($image);
                
                $destinationPath = public_path('/temporaryStorage');
                $imgFile = Image::make($image);
                $imgFile->save($destinationPath . '/' . $input['image']);

                $tmp_storage->key = $request->key;
                $tmp_storage->value = '/temporaryStorage/' . $input['image'];
                $tmp_storage->save();
            }
            // return response()->json(['location' => $tmp_storage->value]); <- no touch
            return $tmp_storage->value;
        }
    }

    //
    public function temporaryStoreTinyDescription(Request $request)
    {
        if ($request->hasFile('value')) {
            $file = $request->file('value');
            $ext_video = $file->getClientOriginalExtension();
            $ext_videos_array = array("mp4", "m4v", "ogv", "webm", "mov");
            if (in_array($ext_video, $ext_videos_array)) {

                $tools = new StringTools;
                $newName = $tools->nameGenerator($file);
                $path = 'temporaryStorage/';
                $file->move($path, $newName);

                $tmp_storage = new Temporary_storage;
                $tmp_storage->key = $request->key;
                $tmp_storage->value = $path . $newName;
                $tmp_storage->save();

                return $path . $newName;
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
    public function deleteTinyMceTemporayStoredImagesVideos(Request $request)
    {
        // dd($request);
        $ext_videos_check = array(".mp4", ".m4v", ".ogv", ".webm", ".mov");

        $tab_data = explode(',', $request->value);
        $tinyImagesVideosInDB = Temporary_storage::where('key', 'tmp_tinyMceImages')->orWhere('key', 'tmp_tinyMceVideos')->get();

        foreach ($tinyImagesVideosInDB as $imageVideoDB) {
            // check if video file for remove the first '/' from name
            foreach ($ext_videos_check as $end_string) {
                if (str_ends_with($imageVideoDB->value, $end_string)) {
                    $imageVideoDB->value = '/' . $imageVideoDB->value;
                }
            }
            // si une image ou video en db n'est pas dans les images qu'on a reçu alors on la delete
            echo $imageVideoDB->value . '<br>';
            
            // if (!in_array($imageVideoDB->value, $tab_data)) {
            //     Temporary_storage::destroy($imageVideoDB->id);
            //     File::delete(public_path(substr($imageVideoDB->value, 1)));
            // }
        }
        echo '<br><br><br><br>';
        foreach($tab_data as $data) {
            echo $data . '<br>';
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
