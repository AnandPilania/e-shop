<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class HackerRank_Test extends Controller
{

    // Algorithms Warmup Diagonal Difference
    // public function hackerRanck() {
    //     $arr = [[11,2,4],[4,5,6],[10,8,-12]];
    //     $first = 0;
    //     $second = 0;
    //     for($i = 0; $i < count($arr); $i++) {
    //         $first += $arr[$i][$i];
    //         $second += $arr[$i][count($arr) - $i - 1];
    //     }
    //     dd(abs($first - $second));
    // }


    function hackerRanck() {
        $s = '07:05:45PM';
        $time = '';
        $toRep = intval(substr($s, 0, 2)); 
        if(preg_match('/PM$/', $s)) {
            $time = substr($s, 0, -2);
            if ($toRep < 12) {
                $toRep += 12;
                $time = substr_replace($time, $toRep, 0, 2);
            } 
        } else if(preg_match('/AM$/', $s)) {
            $time = substr($s, 0, -2);
            if ($toRep > 11) {
                $toRep = $toRep - 12;
                if ($toRep < 10) {$toRep = strval('0' . $toRep);}
                $time = substr_replace($time, $toRep, 0, 2);
            } 
        } 
    dd(strval($time));
    }



}
