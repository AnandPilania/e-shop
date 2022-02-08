<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Temporary_storage;
use Illuminate\Support\Facades\File;
use Intervention\Image\Facades\Image;
use App\Http\Requests\TemporaryStorageRequest;
use App\Http\Controllers\Functions\StringTools;

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
        // dd(mime_content_type(public_path($request->value)));
        // dd(filetype($request->value));
        // dd($request);



        // !--!--!--!--!--!--!--!--!--!--!--!--!--!--!--!--!--!--!--!--!--!--!// !--!--!--!--!--!--!--!--!--!--!--!--!--!--!--!--!--!--!--!--!--!--!
        // // concerne image collection -- delete previous image collection before save the new
        // $only_imageCollection = Temporary_storage::where('key', $request->key)->get();
        // if (count($only_imageCollection) > 0 && $request->key === 'tmp_imageCollection') {
        //     File::delete(public_path($only_imageCollection[0]->value));
        //     Temporary_storage::destroy($only_imageCollection[0]->id);
        // }
        // !--!--!--!--!--!--!--!--!--!--!--!--!--!--!--!--!--!--!--!--!--!--!
        // !--!--!--!--!--!--!--!--!--!--!--!--!--!--!--!--!--!--!--!--!--!--!

        if ($request->hasFile('value')) {

            $file = $request->file('value');
            $originalName = $file->getClientOriginalName();
            // if ($originalName === 'blob') {

            // }
            $ext = $file->getClientOriginalExtension();
            $ext_videos_array = array("mp4", "m4v", "ogv", "webm", "mov");
            $ext_images_array = array('jpeg', 'jpg', 'jpe', 'jfi', 'jif', 'jfif', 'png', 'gif', 'bmp', 'webp');

            $tmp_storage = new Temporary_storage;
            $tools = new StringTools;
            $newName = $tools->nameGenerator($file);

            if (in_array($ext, $ext_images_array) || $originalName === 'blob') {
                $Path = public_path('temporaryStorage/');
                $imgFile = Image::make($file);
                $imgFile->save($Path . $newName);

                $tmp_storage->key = $request->key;
                $tmp_storage->value = 'temporaryStorage/' . $newName;
                $tmp_storage->save();

                return $tmp_storage->value;
            } elseif (in_array($ext, $ext_videos_array)) {
                $path = 'temporaryStorage/';
                $file->move($path, $newName);

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
    public function deleteTemporayStoredElements(Request $request)
    {
        $tmp_storage = Temporary_storage::where('key', $request->key)->get();
        foreach ($tmp_storage as $toDelete) {
            File::delete(public_path($toDelete->value));
            Temporary_storage::destroy($toDelete->id);
        }
        return 'ok';
    }

    // remove records from db and files from folders 
    public function cleanTemporayStorage(Request $request)
    {
        foreach ($request->keys as $key) {
            $dataInDB = Temporary_storage::where('key', $key)->get();
            foreach ($dataInDB as $item) {
                File::delete(public_path($item->value));
                Temporary_storage::destroy($item->id);
            }
        }
    }

    // delete removed tinyMCE images in folder and db
    public function handleTinyMceTemporaryElements(Request $request)
    {
        // dd($request);

        $tab_data = explode(',', $request->value);
        $tinyImagesVideosInDB = Temporary_storage::where('key', 'tmp_tinyMceImages')->orWhere('key', 'tmp_tinyMceVideos')->get();
        $destinationFolder = '';
        foreach ($tinyImagesVideosInDB as $item) {
            // check if video or image for determine destination folder
            foreach ([".mp4", ".m4v", ".ogv", ".webm", ".mov"] as $ext) {
                if (str_ends_with($item->value, $ext)) {
                    $destinationFolder = 'videos/';
                    break;
                } else {
                    $destinationFolder = 'images/';
                }
            }
            // si une image ou video en db n'est pas dans les images qu'on a reçu alors on la delete sinon on la déplace dans son dossier permanent        
            if (!in_array($item->value, $tab_data) && $tab_data[0] !== "") {
                File::delete(public_path($item->value));
            } else {
                $name = str_replace('temporaryStorage/', '', $item->value);
                File::move(public_path($item->value), public_path($destinationFolder . $name));
            }
            Temporary_storage::destroy($item->id);
        }
    }
}
