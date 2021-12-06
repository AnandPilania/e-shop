<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class AliExpressController extends Controller
{


    public function aliProductImportView(Request $request)
    {
        return view('aliProductImport.aliProductImport');
    }


    public function importProduct(Request $request)
    {
        // dd($request->url);
        // dd($request->price);

        $source = $this->getCurl($request->url);
        // $source = $this->doCurl($request->url);
        // dd($source);
        $pathObj = $this->getXPathObj($source);
        // dd($pathObj);

        $jsonContainerJs = null;
        $discount = 0;
        $cardPrice = (float) $request->price;


        // extraction du container js contenant les données du produit
        $product_data = $pathObj->query("//script");
        foreach ($product_data as $element) {
            if (str_contains($element->textContent, 'window.runParams')) {
                $containerJs_product_infos = substr($element->textContent, 0, strpos($element->textContent, "csrfToken"));
                $containerJs_product_infos = trim($containerJs_product_infos);
                $containerJs_product_infos = substr_replace($containerJs_product_infos, "", -1);
                $containerJs_product_infos = str_replace("window.runParams = {", "", $containerJs_product_infos);
                $containerJs_product_infos = str_replace("data: ", "", $containerJs_product_infos);
                // $containerJs_product_infos = str_replace(" ", "", $containerJs_product_infos);

                $jsonContainerJs = json_decode($containerJs_product_infos);
            }
        }

        // toutes les images du slider
        if (isset($jsonContainerJs->imageModule->imagePathList)) {
            $images_slider = $jsonContainerJs->imageModule->imagePathList;
            // dd($images_slider);
        }        
        
        // fiche technique
        if (isset($jsonContainerJs->specsModule->props)) {
            $technical_sheet = $jsonContainerJs->specsModule->props;
            // dd($technical_sheet);
        }


        // toutes les images des details ---------------------------------
        $imageDetailsTab = [];
        if (isset($jsonContainerJs->skuModule->productSKUPropertyList)) {
            foreach ($jsonContainerJs->skuModule->productSKUPropertyList as $productSKUPropertiesList) {
                foreach ($productSKUPropertiesList as $key => $value) {
                    if ($key == 'skuPropertyValues') {
                        foreach ($value as $property) {
                            foreach ($property as $propertyName => $propertyValue) {
                                if ($propertyName == 'skuPropertyImagePath') {
                                    $imageDetailsTab[] = $propertyValue;
                                }
                            }
                        }
                    }
                }
            }
            // dd($imageDetailsTab);
        }



        // lien vers une page qui contient toutes les images en description
        // dd($jsonContainerJs->descriptionModule->descriptionUrl);

        // toutes les images dans la partie description
        if (isset($jsonContainerJs->descriptionModule->descriptionUrl)) {
            $imagesDescriptionUrl = $jsonContainerJs->descriptionModule->descriptionUrl;
            $source_url_images_description = $this->getCurl($imagesDescriptionUrl);
            $pathObj_img_descr = $this->getXPathObj($source_url_images_description);

            $images_description_list = $pathObj_img_descr->query("//img/@src");
            $all_images_in_description = [];
            foreach ($images_description_list as $imgDescr) {
                $all_images_in_description[] = $imgDescr->textContent;
            }
            // dd($all_images_in_description);
        }



        // // coupons
        if (isset($jsonContainerJs->couponModule->fixedDiscountLevelList)) {
            $coupons = $jsonContainerJs->couponModule->fixedDiscountLevelList;
            // dd($coupons);
        }       

        // // product title
        if (isset($jsonContainerJs->titleModule->subject)) {
            $title = $jsonContainerJs->titleModule->subject;
            // dd($title);
        }       

        // product description
        if (isset($jsonContainerJs->pageModule->description)) {
            $description = $jsonContainerJs->pageModule->description;
            // dd($description);
        }

        // // shipping company
        if (isset($jsonContainerJs->shippingModule->freightCalculateInfo->freight->company)) {
            $shipping_company = $jsonContainerJs->shippingModule->freightCalculateInfo->freight->company;
            // dd($shipping_company);
        }

        // // shipping cost
        if (isset($jsonContainerJs->shippingModule->freightCalculateInfo->freight->freightAmount->value)) {
            $shipping_cost = $jsonContainerJs->shippingModule->freightCalculateInfo->freight->freightAmount->value;
            // dd($shipping_cost);
        }

        // // shipping cost currency cost delivery
        if (isset($jsonContainerJs->shippingModule->freightCalculateInfo->freight->freightAmount->currency)) {
            $shipping_cost_currency = $jsonContainerJs->shippingModule->freightCalculateInfo->freight->freightAmount->currency;
            // dd($shipping_cost_currency);
        }



        // récupère dans l'url le skuProductId de la variante pour pouvoir calculer le taux du discount 
        $product_variante_id = null;
        $pattern = '/%22[0-9]+%22%7D$/';
        if (preg_match($pattern, $request->url, $match)) {
            $toDelete = array("%22", "%7D");
            $product_variante_id = str_replace($toDelete, "", $match[0]);
        }

        // calcule le taux du discount pour pouvoir calculer le prix exacte affiché sur la fiche produit
        foreach ($jsonContainerJs->skuModule->skuPriceList as $skuPriceOffer) {

            $sku_amount = $skuPriceOffer->skuVal->skuAmount->value;

            if (isset($skuPriceOffer->skuId) && $skuPriceOffer->skuId == $product_variante_id) {
                $discount =  round((($sku_amount - $cardPrice) / $sku_amount) * 100);
                break;
            } else {
                $discount = 0;
            }
        }


        // récupère les détails
        foreach ($jsonContainerJs->skuModule->skuPriceList as $skuPriceOffer) {
            // dd($jsonContainerJs);
            $skuVariantFullName = [];
            $skuProps = explode(",", $skuPriceOffer->skuPropIds);
            // dd($skuProps);
            $imageLinkIfSpecified = '';

            foreach ($skuProps as $skuId) {
                // si il n'y a pas de variante et donc aucune caractéristique ou pays d'expédition alors productSKUPropertyList n'existera pas
                if (isset($jsonContainerJs->skuModule->productSKUPropertyList)) {
                    foreach ($jsonContainerJs->skuModule->productSKUPropertyList as $nextPropertyGroup) {
                        foreach ($nextPropertyGroup->skuPropertyValues as $nextPropertyGroupValue) {
                            if ((int)$nextPropertyGroupValue->propertyValueId === (int)$skuId) {
                                // nextParam contient le nom de la propriété et sa valeur
                                $nextParam = $nextPropertyGroup->skuPropertyName . ': ' . $nextPropertyGroupValue->propertyValueDisplayName;
                                // on met nextParam dans un tableau
                                $skuVariantFullName[] = $nextParam;
                                // si cette propriété a une image on la récupère dans imageLinkIfSpecified
                                if (isset($nextPropertyGroupValue->skuPropertyImagePath)) {
                                    $imageLinkIfSpecified = $nextPropertyGroupValue->skuPropertyImagePath;
                                }
                            }
                        }
                    }
                } else {
                    $skuVariantFullName[] = 'empty';
                }
            }

            if (isset($skuPriceOffer->skuId)) {
                $sku_id = $skuPriceOffer->skuId;
            }
            if (isset($skuVariantFullName)) {
                $characteristiques =  implode(", ", $skuVariantFullName);
            }             
            if (isset($skuPriceOffer->skuVal->availQuantity)) {
                $Available = $skuPriceOffer->skuVal->availQuantity;
            } 
            if (isset($skuPriceOffer->skuVal->skuAmount->value)) {
                $calculated_price = round(($skuPriceOffer->skuVal->skuAmount->value / 100) * (100 - $discount), 2);
            }
            if (isset($skuPriceOffer->skuVal->skuAmount)) {
                $Price_skuAmount = $skuPriceOffer->skuVal->skuAmount->value;
            } 
            if (isset($skuPriceOffer->skuVal->discount)) {
                $discount_fromAli = $skuPriceOffer->skuVal->discount;
            } 
            if (isset($skuPriceOffer->skuVal->discount)) {
                $calculatedDiscount = $discount;
            }
            if (isset($imageLinkIfSpecified) && !empty($imageLinkIfSpecified)) {
                $image_variante = $imageLinkIfSpecified;
            }
        
            $variante = (object) array(
                'sku_id' => $sku_id, 
                'characteristiques' => $characteristiques,
                'Available' => $Available, 
                'calculated_price' => $calculated_price,
                'Price_skuAmount' => $Price_skuAmount, 
                'discount_fromAli' => $discount_fromAli,
                'calculatedDiscount' => $calculatedDiscount,
                'image_variante' => $image_variante
            );
 
            $variantes[] = $variante;

            // $nextSKUOffer =  implode(", ", $skuVariantFullName) . ', ' .

            //     (isset($skuPriceOffer->skuId) ? ' skuId: ' . $skuPriceOffer->skuId : '  ') .

            //     (isset($skuPriceOffer->skuVal->availQuantity) ? ', Available: ' . $skuPriceOffer->skuVal->availQuantity : '  ') .

            //     ',  calculated_price: ' . round(($skuPriceOffer->skuVal->skuAmount->value / 100) * (100 - $discount), 2) .

            //     (isset($skuPriceOffer->skuVal->skuAmount) ? ', Price_skuAmount: ' . $skuPriceOffer->skuVal->skuAmount->value : '[not Price_skuAmount] ')  . ' ' .

            //     (isset($skuPriceOffer->skuVal->discount) ? ', discount: ' . $skuPriceOffer->skuVal->discount : '[not discount] ') . '   calculatedDiscount ' . $discount;

            // if (isset($imageLinkIfSpecified) && !empty($imageLinkIfSpecified))
            //     $nextSKUOffer .= ', Image: ' . $imageLinkIfSpecified;

            // $result[] = $nextSKUOffer;
        }

        $imported_product = (object) array(
            'images_slider' => $images_slider, 
            'imageDetailsTab' => $imageDetailsTab,
            'all_images_in_description' => $all_images_in_description, 
            'coupons' => $coupons,
            'title' => $title,
            'description' => $description, 
            'technical_sheet' => $technical_sheet, 
            'shipping_company' => $shipping_company, 
            'shipping_cost' => $shipping_cost, 
            'shipping_cost_currency' => $shipping_cost_currency, 
            'variantes' => $variantes, 
        );

        dd(json_encode($imported_product));
        // dd($result);
    }




    // Method for making a POST request using cURL

    public function getCurl($url)
    {
        $useragent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/81.0.4044.138 Safari/537.36 OPR/68.0.3618.125'; // Setting user agent of a popular browser

        $ch = curl_init();

        $cookie = 'C:\wamp64\www\TEST\AMAZON\controller\session-id.txt';

        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
        curl_setopt($ch, CURLOPT_CAINFO, 'C:\wamp64\www\TEST\AMAZON\controller\certif.cer');
        curl_setopt($ch, CURLOPT_HEADER, false);
        curl_setopt($ch, CURLOPT_FAILONERROR, TRUE); // Script should fail silently on error
        curl_setopt($ch, CURLOPT_COOKIESESSION, TRUE);
        curl_setopt($ch, CURLOPT_COOKIEFILE, $cookie);
        curl_setopt($ch, CURLOPT_COOKIEJAR, $cookie);
        curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_USERAGENT, $useragent);
        curl_setopt($ch, CURLOPT_POST, false);
        // curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($postFields));
        $results = curl_exec($ch);

        curl_close($ch);

        return $results;
    }


    // function doCurl($url)
    // {

    //     $type = 'GET';
    //     $headers = [];
    //     $post_fields = [];
    //     $user_agent = '';
    //     $referrer = '';
    //     $follow = true;
    //     $use_ssl = false;
    //     $con_timeout = 10;
    //     $timeout = 40;


    //     $crl = curl_init($url);
    //     curl_setopt($crl, CURLOPT_CUSTOMREQUEST, $type);
    //     curl_setopt($crl, CURLOPT_USERAGENT, $user_agent);
    //     curl_setopt($crl, CURLOPT_REFERER, $referrer);
    //     if ($type == 'POST') {
    //         curl_setopt($crl, CURLOPT_POST, true);
    //         if (!empty($post_fields)) {
    //             curl_setopt($crl, CURLOPT_POSTFIELDS, $post_fields);
    //         }
    //     }
    //     if (!empty($headers)) {
    //         curl_setopt($crl, CURLOPT_HTTPHEADER, $headers);
    //     }
    //     curl_setopt($crl, CURLOPT_FOLLOWLOCATION, $follow);
    //     curl_setopt($crl, CURLOPT_CONNECTTIMEOUT, $con_timeout);
    //     curl_setopt($crl, CURLOPT_TIMEOUT, $timeout);
    //     curl_setopt($crl, CURLOPT_SSL_VERIFYHOST, $use_ssl);
    //     curl_setopt($crl, CURLOPT_SSL_VERIFYPEER, $use_ssl);
    //     curl_setopt($crl, CURLOPT_RETURNTRANSFER, true);
    //     $call_response = curl_exec($crl);
    //     $http_response_code = curl_getinfo($crl, CURLINFO_HTTP_CODE);
    //     curl_close($crl);
    //     if ($http_response_code == 200) {
    //         return $call_response; //Return data
    //     } else {
    //         return array('http_response_code' => $http_response_code); //Call failed
    //     }
    // }


    // get XPath object
    public function getXPathObj($item)
    {
        $xmlPageDom = new \DomDocument();

        @$xmlPageDom->loadHTML($item);

        $xmlPageXPath = new \DOMXPath($xmlPageDom);
        return $xmlPageXPath;
    }
}
