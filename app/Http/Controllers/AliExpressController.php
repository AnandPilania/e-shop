<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class AliExpressController extends Controller
{

    public function importProduct(Request $request)
    {
        // dd($request->dataUrl);
        $source = $this->getCurl($request->dataUrl);
        // dd($source);
        $pathObj = $this->getXPathObj($source);
        // dd($pathObj);

        $product_data = $pathObj->query("//script");
        foreach ($product_data as $element) {
            if (str_contains($element->textContent, 'window.runParams')) {
                $containerJs_product_infos = substr($element->textContent, 0, strpos($element->textContent, "csrfToken"));
                $containerJs_product_infos = trim($containerJs_product_infos);
                $containerJs_product_infos = substr_replace($containerJs_product_infos, "", -1);
                $containerJs_product_infos = str_replace("window.runParams = {", "", $containerJs_product_infos);
                $containerJs_product_infos = str_replace("data: ", "", $containerJs_product_infos);



                
                $containerJs_product_infos = substr($containerJs_product_infos, 0, strpos($element->textContent, "Vous avez gagné"));

                $containerJs_product_infos = str_replace(array("\r", "\n"), '', $containerJs_product_infos);


                echo $containerJs_product_infos;
            }
        }

        dd(' ');     
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
    // Method to get XPath object

    public function getXPathObj($item)
    {
        // Instantiating a new DomDocument object
        $xmlPageDom = new \DomDocument();
        // Loading the HTML from downloaded page
        @$xmlPageDom->loadHTML($item);
        // Instantiating new XPath DOM object
        $xmlPageXPath = new \DOMXPath($xmlPageDom);
        return $xmlPageXPath;
        //get xpath
    }
}