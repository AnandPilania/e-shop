<?php

namespace App\Http\Controllers\Functions;

use App\Models\Product;


class GetArrayOfConditions
{
    public function getArrayOfConditions($conditions)
    {
        foreach ($conditions as $condition) {

            $field = '';
            // check de quel paramètre il s'agit
            switch ($condition->parameter) {
                case '1':
                    $field = 'name';
                    break;
                case '2':
                    $field = 'type';
                    break;
                case '3':
                    $field = 'supplier';
                    break;
                case '4':
                    $field = 'price';
                    break;
                case '5':
                    $field = 'tag';
                    break;
                case '6':
                    $field = 'prev_price'; // prix avant promo
                    break;
                case '7':
                    $field = 'weight';
                    break;
                case '8':
                    $field = 'stock';
                    break;
                case '9':
                    $field = 'varianteId'; // variante id
                    break;
                default:
                    $field = 'name';
                    break;
            }

            // check de quel operator il s'agit
            $value = trim($condition->value);
            switch ($condition->operator) {
                case '1':
                    // est égale à
                    $list_match[] = Product::where($field, $value)->get();
                    break;
                case '2':
                    // n'est pas égale à
                    $list_match[] = Product::where($field, '!=', $value)->get();
                    break;
                case '3':
                    // est suppérieur à
                    $list_match[] = Product::where($field, '>', $value)->get();
                    break;
                case '4':
                    // est infèrieur à
                    $list_match[] = Product::where($field, '<', $value)->get();
                    break;
                case '5':
                    // commence par
                    $list_match[] = Product::where($field, 'like', $value . ' %')->get();
                    break;
                case '6':
                    //  se termine par
                    $list_match[] = Product::where($field, 'like', '% ' . $value)->get();
                    break;
                case '7':
                    // contient
                    $list_match[] = Product::where($field, $value)
                        ->orWhere($field, 'like', $value . ' %')
                        ->orWhere($field, 'like', '% ' . $value)
                        ->orWhere($field, 'like', '% ' . $value . ' %')->get();
                    break;
                case '8':
                    // ne contient pas
                    $list_match[] = Product::where($field, 'not like', '%' . $value . '%')->get();
                    break;
                case '9':
                    // n'est pas vide
                    $list_match[] = Product::whereNotNull($field)->where($field, 'not like', '')->get();
                    break;
                case '10':
                    // est vide
                    $list_match[] = Product::whereNull($field)->where($field, 'like', '')->get();
                    break;
                default:
                    $list_match[] = '';
                    break;
            }
        }

        return $list_match;
    }

}
