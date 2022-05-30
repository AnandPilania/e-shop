<?php

namespace App\Http\Controllers;

use DOMDocument;
use App\Models\Collection;
use Illuminate\Http\Request;
use App\Models\Temporary_storage;
use Illuminate\Support\Facades\File;
use Intervention\Image\Facades\Image;
use App\Http\Requests\TemporaryStorageRequest;
use App\Http\Controllers\Functions\StringTools;
use App\Models\Product;

class TemporaryStorageController extends Controller
{
    public function getSingleTemporaryImage($id)
    {
        // if not collection is edit then get image path from temporaryStockage table
        $tmp_img = Temporary_storage::where('key', 'tmp_imageCollection')->first();

        if ($tmp_img !== null) {
            return $tmp_img->value;
        } else {
            // if is edit collection get image path from collection table with id
            $tmp_img = Collection::where('id', $id)->first();
            if ($tmp_img !== null) {
                return $tmp_img->image;
            } else {
                return '';
            }
        }
    }


    // récupère toutes les image pour une key donnée
    public function getTemporaryImages($key)
    {

        $images = Temporary_storage::where('key', $key)->get();

        return $images;
    }


    // stock des images temporaires
    public function temporaryStoreImages(Request $request)
    {
        // dd($request);

        // concerne image collection: delete previous image collection before save the new
        $only_imageCollection = Temporary_storage::where('key', $request->key)->first();
        if ($only_imageCollection && $request->key === 'tmp_imageCollection') {
            File::delete(public_path($only_imageCollection->value));
            Temporary_storage::destroy($only_imageCollection->id);
        }

        if ($request->hasFile('value')) {

            $file = $request->file('value');
            $mimeType = $file->getClientMimeType();
            $mimeType_videos_array = array('video/webm', 'video/ogg', 'video/avi', 'video/mp4', 'video/mpeg');
            $mimeType_images_array = array('image/gif', 'image/png', 'image/jpeg', 'image/webp');

            $tmp_storage = new Temporary_storage;
            $tools = new StringTools;
            $newName = $tools->nameGeneratorFromFile($file);

            if (in_array($mimeType, $mimeType_images_array)) {
                $Path = public_path('temporaryStorage/');
                $imgFile = Image::make($file);
                $imgFile->save($Path . $newName, 80, 'jpg');

                $tmp_storage->key = $request->key;
                $tmp_storage->value = 'temporaryStorage/' . $newName;
                $tmp_storage->save();

                return $tmp_storage->value;
            } else if (in_array($mimeType, $mimeType_videos_array)) {
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



    // delete all images which have the provided key from Temporary_storage
    public function deleteTemporayStoredElements(Request $request)
    {
        $tmp_storage = Temporary_storage::where('key', $request->key)->get();
        foreach ($tmp_storage as $toDelete) {
            File::delete(public_path($toDelete->value));
            Temporary_storage::destroy($toDelete->id);
        }

        // Concerne COLLECTION -> si la collection a déjà été suvegardée on supprime l'image et la thumbnail dans la db et dans le dossier images
        $collection = Collection::find($request->idCollection)->first();
        if ($collection !== null) {
            File::delete(public_path($collection->image));
            File::delete(public_path($collection->thumbnail));
            $collection->image = null;
            $collection->thumbnail = null;
            $collection->save();
        }
        return 'ok';
    }

    // delete one element by id 
    public function deleteOneElementById($id)
    {
        // dd($id);
        $tmp_storage = Temporary_storage::where('id', $id)->first();

        File::delete(public_path($tmp_storage->value));
        Temporary_storage::destroy($tmp_storage->id);

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

        // dans tiny editor on a 3 sources possibles pour le stockages des images et vidéos. 1 public/temporaryStocage, 2 public/images, 3 public/videos. Ici on supprime les images ou vidéos qui ne sont plus dans l'editor dans chacun de ces dossiers.

        // cette partie n'est utilisé que quand on édite
        if ($request->id == "null") {
            // lorsqu'on edit on récupère dabord le model édité pour effacer toutes les images et vidéos avant de save celles qui vont les remplcer
            if ($request->sender == 'collection') {
                $description = Collection::where('id', $request->id)->first('description');
            }
            if ($request->sender == 'product') {
                $description = Product::where('id', $request->id)->first('description');
            }

            $doc = new DOMDocument();
            @$doc->loadHTML($description);
            $xpath = new \DOMXpath($doc);
            $tags = $xpath->query('//img/@src | //source/@src');
            $tab = array("\/images\/", "\/videos\/", "\\");
            foreach ($tags as $tag) {
                // strstr retourne une sous-chaîne allant de la première occurrence (incluse) jusqu'à la fin de la chaîne
                $is_video = strstr($tag->value, '\/videos\/');
                $is_image = strstr($tag->value, '\/images\/');
                if ($is_video !== false) {
                    $to_delete = str_replace($tab, '', $is_video);
                    $to_delete = 'videos/' . substr($to_delete, 0, -1);
                    if (!in_array($to_delete, $tab_data) && $tab_data[0] !== "") {
                        if (File::exists(public_path($to_delete))) File::delete(public_path($to_delete));
                    }
                }
                if ($is_image !== false) {
                    $to_delete = str_replace($tab, '', $is_image);
                    $to_delete = 'images/' . substr($to_delete, 0, -1);
                    if (!in_array($to_delete, $tab_data) && $tab_data[0] !== "") {
                        if (File::exists(public_path($to_delete))) File::delete(public_path($to_delete));
                    }
                }
            }
        }


        // supprime les images et vidéos dans le dossier temporaryStorage qui ne sont plus dans le tiny editor. Celles qui y sont encore sont déplacées dans leurs dossiers finaux. cette fonction est appelée dans index submit collection
        $tinyImagesVideosInDB = Temporary_storage::where('key', 'tmp_tinyMceImages')->orWhere('key', 'tmp_tinyMceVideos')->get();
        $destinationFolder = '';

        foreach ($tinyImagesVideosInDB as $item) {
            // check if is video or image for determine destination folder
            foreach ([".mp4", ".mpeg", ".ogv", ".webm", ".mov", "avi", ".wmv"] as $ext) {
                if (str_ends_with($item->value, $ext)) {
                    $destinationFolder = 'videos/';
                    break;
                } else {
                    $destinationFolder = 'images/';
                }
            }
            // si une image ou video en db n'est pas dans les images ou vidéos qu'on a reçu alors on les delete sinon on les déplace dans leurs dossiers permanents  
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
