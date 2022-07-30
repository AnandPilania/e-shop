<?php

namespace App\Http\Controllers;

use App\Models\Config;
use Illuminate\Http\Request;

class ConfigController extends Controller
{
    // récupère toutes les configurations
    public function getConfigs()
    {
        return Config::all();
    }




    // récupère une configuration
    public function getConfig($param)
    {
        $config = Config::where('param', $param)->first();

        return $config;
    }


    // modifie une configuration
    public function updateConfig(Request $request)
    {
        $config = Config::where('param', $request->param)->first();

        if ($request->filled('value')) {
            $config->value = $request->value;
        }
        if ($request->filled('json_obj')) {
            $config->json_obj = $request->json_obj;
        }

        $config->save();

        return 'ok';
    }

    // get user localisation
    public function getUserLocalisation()
    {
        $user_ip = getenv('REMOTE_ADDR');
        $geo = unserialize(file_get_contents("http://www.geoplugin.net/php.gp?ip=$user_ip"));
        $country = $geo["geoplugin_countryName"];
        $city = $geo["geoplugin_city"];
        
        return ['country' => $country, 'city' => $city];
    }
}
