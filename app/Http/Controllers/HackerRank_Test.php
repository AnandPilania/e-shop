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
    //     return abs($first - $second));
    // }


    // function hackerRanck() {
    //     $s = '07:05:45PM';
    //     $time = '';
    //     $toRep = intval(substr($s, 0, 2)); 
    //     if(preg_match('/PM$/', $s)) {
    //         $time = substr($s, 0, -2);
    //         if ($toRep < 12) {
    //             $toRep += 12;
    //             $time = substr_replace($time, $toRep, 0, 2);
    //         } 
    //     } else if(preg_match('/AM$/', $s)) {
    //         $time = substr($s, 0, -2);
    //         if ($toRep > 11) {
    //             $toRep = $toRep - 12;
    //             if ($toRep < 10) {$toRep = strval('0' . $toRep);}
    //             $time = substr_replace($time, $toRep, 0, 2);
    //         } 
    //     } 
    // return strval($time));
    // }


    // function hackerRanck()
    // {
    //     $grades = [73, 67, 38, 33];

    //     foreach ($grades as $item) {
    //         $fiveSteps = 5 * floor($item / 5);
    //         $nextStep = $fiveSteps + 5;
    //         $spread = $nextStep - $item;
    //         if ($nextStep >= 40) {
    //             if ($spread < 3) {
    //                 $arr_out[] = $nextStep;
    //             } else {
    //                 $arr_out[] = $item;
    //             }
    //         } else {
    //             $arr_out[] = $item;
    //         }
    //     }
    //     return $arr_out);
    // }    


    // function hackerRanck()
    // {
    //     $s = 7;
    //     $t = 11;
    //     $a = 5;
    //     $b = 15;
    //     //3 2
    //     $apples = [-2, 2, 1];
    //     $oranges = [5, -6,];
    //     $appOut = 0;
    //     $oraOut = 0;

    //     foreach ($apples as $item) {
    //         $dist = $a + $item;
    //         if ($dist >= $s && $dist <= $t) {
    //             $appOut += 1;
    //         }
    //     }
    //     foreach ($oranges as $item) {
    //         $dist = $b + $item;
    //         if ($dist >= $s && $dist <= $t) {
    //             $oraOut += 1;
    //         }
    //     }
    //     print $appOut;
    //     echo "\n";
    //     print $oraOut;

    // }    

    function hackerRanck()
    {
        $x1 = 4;
        $v1 = 3;
        $x2 = 4;
        $v2 = 2;

        if ($x2 > $x1) {
            if ($v2 < $v1) {
                if (($x2 - $x1) % ($v1 - $v2) == 0)
                    return "YES";
                else
                    return "NO";
            } else
                return "NO";
        } else {
            if ($v1 > $v2) {
                if (($x1 - $x2) % ($v2 - $v1) == 0)
                    return "YES";
                else
                    return "NO";
            } else if ($x1 == $x2 && $v1 == $v2)
                return "YES";
            else
                return "NO";
        }

    }
}
