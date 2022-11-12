<?php

namespace App\Http\Controllers;

use DOMDocument;
use App\Models\Product;
use App\Models\Collection;
use Illuminate\Http\Request;
use App\Models\Temporary_storage;
use Illuminate\Support\Facades\File;
use Intervention\Image\Facades\Image;
use Illuminate\Support\Facades\Storage;
use App\Http\Requests\TemporaryStorageRequest;
use App\Http\Controllers\Functions\StringTools;

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
        $images = Temporary_storage::where('key', $key)
            ->orderBy('ordre')
            ->get();

        return $images;
    }


    // stock des images temporaires
    public function temporaryStoreImages(Request $request)
    {
        // dd($request);

        // concerne image collection: delete previous image collection before save the new
        $only_imageCollection = Temporary_storage::where('key', $request->key)->first();
        if ($only_imageCollection && $request->key === 'tmp_imageCollection') {
            if (Storage::disk('public')->exists($only_imageCollection->path)) {
                Storage::disk('public')->delete($only_imageCollection->path);
            }
            Temporary_storage::destroy($only_imageCollection->id);
        }

        if ($request->hasFile('file')) {
            $file = $request->file('file');
            $mimeType = $file->getClientMimeType();

            if (in_array($mimeType, ["image/jpeg", "image/jpg", "image/png"])) {
                $path = Storage::disk('public')->put('images', $file);
            } elseif (in_array($mimeType, ["video/mp4", "video/x-ms-wmv", "video/x-msvideo", "video/quicktime"])) {
                $path = Storage::disk('public')->put('videos', $file);
            } else {
                return 'This file type is not allowed';
            }

            $tmp_storage = new Temporary_storage;
            $tmp_storage->key = $request->key;
            $tmp_storage->value = $path;
            $tmp_storage->ordre = Temporary_storage::where('key', $request->key)->max('ordre') + 1;
            $tmp_storage->save();
            // dd($path);
            return $path;
        } else {
            return 'There is no file to save !';
        }
    }




    // public function reOrderImagesProducts(Request $request)
    // {
    //     // dd($request->image);
    //     $imagesProducts = json_decode($request->image);
    //     $ndx = 1;

    //     foreach ($imagesProducts as $values) {
    //         foreach ($values as $item) {
    //             $tmp_productImage = Temporary_storage::where('value', $item->path)->first();

    //             $tmp_productImage->ordre = $ndx;
    //             $tmp_productImage->save();

    //             $ndx++;
    //         }
    //     }
    // }




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

    // delete "countFile" ModalImageVariante images from Temporary_storage
    public function deleteModalImageVariantes(Request $request)
    {
        $tmp_storage = Temporary_storage::where('key', $request->key)
            ->orderBy('id', 'desc')
            ->limit($request->countFile)
            ->get();

        if (isset($tmp_storage) && count($tmp_storage) > 0) {
            foreach ($tmp_storage as $toDelete) {
                File::delete(public_path($toDelete->value));
                Temporary_storage::destroy($toDelete->id);
            }
        }

        return 'ok';
    }

    // delete one element by id 
    public function deleteOneElementById($id)
    {
        $tmp_storage = Temporary_storage::where('id', $id)->first();

        Storage::disk('public')->delete($tmp_storage->value);
        Temporary_storage::destroy($tmp_storage->id);

        return 'ok';
    }


    // remove records from db and files from folders 
    public function cleanTemporayStorage(Request $request)
    {
        foreach ($request->keys as $key) {
            $dataInDB = Temporary_storage::where('key', $key)->get();
            foreach ($dataInDB as $item) {
                Storage::disk('public')->delete($item->value);
                Temporary_storage::destroy($item->id);
            }
        }
    }

    // delete removed tinyMCE images in folder and db
    public function handleTinyMceTemporaryElements(Request $request)
    {
        $tab_data = explode(',', $request->value);

        // Ici on supprime les images ou vidéos qui ne sont plus dans l'editor dans chacun de les dossiers storage/public/images et storage/public/videos.

        // cette partie n'est utilisé que quand on édite
        if ($request->id == "null") {
            // lorsqu'on edit on récupère dabord le model édité pour effacer toutes les images et vidéos avant de save celles qui vont les remplacer
            if ($request->sender == 'collection') {
                $description = Collection::where('id', $request->id)->first('description');
            }
            if ($request->sender == 'product') {
                $description = Product::where('id', $request->id)->first('description');
            }

            if ($description) {
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
                            Storage::disk('public')->delete($to_delete);
                        }
                    }
                    if ($is_image !== false) {
                        $to_delete = str_replace($tab, '', $is_image);
                        $to_delete = 'images/' . substr($to_delete, 0, -1);
                        if (!in_array($to_delete, $tab_data) && $tab_data[0] !== "") {
                            Storage::disk('public')->delete($to_delete);
                        }
                    }
                }
            }
        }


        // supprime les images et vidéos dans le dossier temporaryStorage qui ne sont plus dans le tiny editor. Celles qui y sont encore sont conservées dans leurs dossiers -> images ou videos
        $tinyImagesVideosInDB = Temporary_storage::where('key', 'tmp_tinyMceImages')->orWhere('key', 'tmp_tinyMceVideos')->get();
        $destinationFolder = '';

        foreach ($tinyImagesVideosInDB as $item) {
            // check if is video or image to destination folder
            foreach ([".mp4", ".mov", "avi", ".wmv"] as $ext) {
                if (str_ends_with($item->value, $ext)) {
                    $destinationFolder = 'videos/';
                    break;
                } else {
                    $destinationFolder = 'images/';
                }
            }
            // si une image ou video en db n'est pas dans les images ou vidéos qu'on a reçu alors on les delete 
            if (!in_array($item->value, $tab_data) && $tab_data[0] !== "") {
                Storage::disk('public')->delete($item->value);
            }
            Temporary_storage::destroy($item->id);
        }
    }
}
