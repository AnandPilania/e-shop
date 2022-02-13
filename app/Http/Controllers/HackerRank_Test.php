<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class HackerRank_Test extends Controller
{

    // Algorithms Warmup Diagonal Difference
    public function hackerRanck() {
        $arr = [[11,2,4],[4,5,6],[10,8,-12]];
        $first = 0;
        $second = 0;
        for($i = 0; $i < count($arr); $i++) {
            $first += $arr[$i][$i];
            $second += $arr[$i][count($arr) - $i - 1];
        }
        dd(abs($first - $second));
    }



}
