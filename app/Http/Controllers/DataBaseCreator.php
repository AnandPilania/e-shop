<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class DataBaseCreator extends Controller
{
    private $databaseName = "myNewDB";

    public function createDataDase()
    {
        DB::connection('mysql')->statement("CREATE DATABASE {$this->databaseName} ");
    }
}
