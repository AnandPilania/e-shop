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
                $containerJs_product_infos = str_replace(" ", "", $containerJs_product_infos);

                $jsonContainerJs = json_decode($containerJs_product_infos);
            }
        }

        // extrait de l'url reçue dans $request->url le skuProductId de la variante pour pouvoir calculer le taux du discount 
        $product_variante_id = null;
        $pattern = '/%22[0-9]+%22%7D$/';
        if (preg_match($pattern, $request->url, $match)) {
            $toDelete = array("%22", "%7D");
            $product_variante_id = str_replace($toDelete, "", $match[0]);
        }

        // calcule le % de discount
        foreach ($jsonContainerJs->skuModule->skuPriceList as $skuPriceOffer) {

            $sku_amount = $skuPriceOffer->skuVal->skuAmount->value;

            if (isset($skuPriceOffer->skuId) && $skuPriceOffer->skuId == $product_variante_id) {
                $discount =  round((($sku_amount - $cardPrice) / $sku_amount) * 100);
                break;
            } else {
                $discount = 0;
            }
        }

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
                            if ((float)$nextPropertyGroupValue->propertyValueId === (float)$skuId) {
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

            $nextSKUOffer =  implode(",", $skuVariantFullName) . ', ' .

                (isset($skuPriceOffer->skuId) ? ', skuId: ' . $skuPriceOffer->skuId : '  ') .

                (isset($skuPriceOffer->skuVal->availQuantity) ? ', Available: ' . $skuPriceOffer->skuVal->availQuantity : '  ') .

                ',  calculated_price: ' . round(($skuPriceOffer->skuVal->skuAmount->value / 100) * (100 - $discount), 2) .

                (isset($skuPriceOffer->skuVal->skuAmount) ? ', Price_skuAmount: ' . $skuPriceOffer->skuVal->skuAmount->value : '[not Price_skuAmount] ')  . ' ' .

                (isset($skuPriceOffer->skuVal->discount) ? ', discount: ' . $skuPriceOffer->skuVal->discount : '[not discount] ') . '   calculatedDiscount ' . $discount;

            if (isset($imageLinkIfSpecified) && !empty($imageLinkIfSpecified))
                $nextSKUOffer .= ', Image: ' . $imageLinkIfSpecified;

            $result[] = $nextSKUOffer;
        }

        dd($result);
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
