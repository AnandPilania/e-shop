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
}
