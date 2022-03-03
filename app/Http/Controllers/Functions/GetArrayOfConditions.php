<?php

namespace App\Http\Controllers\Functions;

use App\Models\Product;
use App\Models\Variante;


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
                    $field = 'varianteName'; // variante id
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
                    if ($field === 'name') {
                        $list[] = Product::where($field, $value)->get();
                        foreach($list as $item) {
                            $list_match[] = Variante::where('product_id', $item->id)->get('product_id');
                        }
                        dd($list_match);
                        break;
                    } else {
                        $list_match[] = Variante::where($field, $value)->get('product_id');
                        break;
                    }
                case '2':
                    // n'est pas égale à
                    if ($field === 'name') {
                        $list_match[] = Product::where($field, '!=', $value)->get('id');
                        break;
                    } else {
                        $list_match[] = Variante::where($field, '!=', $value)->get('product_id');
                        break;
                    }
                case '3':
                    // est suppérieur à
                    $list_match[] = Variante::where($field, '>', $value)->get('product_id');
                    break;
                case '4':
                    // est infèrieur à
                    $list_match[] = Variante::where($field, '<', $value)->get('product_id');
                    break;
                case '5':
                    // commence par
                    if ($field === 'name') {
                        $list_match[] = Product::where($field, 'like', $value . ' %')->get('id');
                        break;
                    } else {
                        $list_match[] = Variante::where($field, 'like', $value . ' %')->get('product_id');
                        break;
                    }
                case '6':
                    //  se termine par
                    if ($field === 'name') {
                        $list_match[] = Product::where($field, 'like', '% ' . $value)->get('id');
                        break;
                    } else {
                        $list_match[] = Variante::where($field, 'like', '% ' . $value)->get('product_id');
                        break;
                    }
                case '7':
                    // contient
                    if ($field === 'name') {
                        $list_match[] = Product::where($field, $value)
                        ->orWhere($field, 'like', $value . ' %')
                        ->orWhere($field, 'like', '% ' . $value)
                        ->orWhere($field, 'like', '% ' . $value . ' %')->get('id');
                        break;
                    } else {
                        $list_match[] = Variante::where($field, $value)
                            ->orWhere($field, 'like', $value . ' %')
                            ->orWhere($field, 'like', '% ' . $value)
                            ->orWhere($field, 'like', '% ' . $value . ' %')->get('product_id');
                        break;
                    }
                case '8':
                    // ne contient pas
                    if ($field === 'name') {
                        $list_match[] = Product::where($field, 'not like', '%' . $value . '%')->get('id');
                        break;
                    } else {
                        $list_match[] = Variante::where($field, 'not like', '%' . $value . '%')->get('product_id');
                        break;
                    }
                case '9':
                    // n'est pas vide
                    if ($field === 'name') {
                        $list_match[] = Product::whereNotNull($field, 'not like', '')->get('id');
                        break;
                    } else {
                        $list_match[] = Variante::whereNotNull($field)->where($field, 'not like', '')->get('product_id');
                        break;
                    }
                case '10':
                    // est vide
                    if ($field === 'name') {
                        $list_match[] = Product::whereNull($field, 'like', '')->get('id');
                        break;
                    } else {
                        $list_match[] = Variante::whereNull($field)->where($field, 'like', '')->get('product_id');
                        break;
                    }
                default:
                    $list_match[] = '';
                    break;
            }
        }

        return $list_match;
    }
}
