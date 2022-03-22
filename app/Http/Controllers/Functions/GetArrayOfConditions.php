<?php

namespace App\Http\Controllers\Functions;

use App\Models\Product;
use App\Models\Supplier;
use App\Models\Tag;
use App\Models\Variante;
use Illuminate\Support\Facades\DB;

class GetArrayOfConditions
{
    public function getArrayOfConditions($conditions)
    {
        $list_match = [];
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
                    $field = 'price'; // prix avec promo
                    break;
                case '5':
                    $field = 'tag';
                    break;
                case '6':
                    $field = 'price_before_discount'; // prix avant promo
                    break;
                case '7':
                    $field = 'weight';
                    break;
                case '8':
                    $field = 'stock';
                    break;
                default:
                    $field = 'name';
                    break;
            }

            // if($field === 'created_at') echo $condition->value . '<br>';

            // check de quel operator il s'agit
            $value = trim($condition->value);

            switch ($condition->operator) {
                case '1':
                    // est égale à
                    if ($field === 'name' || $field === 'type') {
                        $products = Product::where($field, $value)->get();
                        foreach ($products as $item) {
                            $list_match[] = $item->id;
                        }
                        break;
                    } else if ($field === 'supplier') {
                        $suppliers = DB::table('products')
                            ->join('variantes', 'products.id', '=', 'variantes.product_id')
                            ->join('suppliers', 'suppliers.id', '=', 'variantes.supplier_id')
                            ->Where('suppliers.name', $value)
                            ->groupBy('variantes.product_id')
                            ->get();
                        foreach ($suppliers as $supplier) {
                            $list_match[] = $supplier->product_id;
                        }
                        break;
                    } else if ($field === 'tag') {
                        $tag = Tag::where('name', $value)
                            ->first();
                        foreach ($tag->products as $product) {
                            $list_match[] = $product->id;
                        }
                        break;
                    } else {
                        $variantes = Variante::where($field, $value)
                            ->groupBy('product_id')
                            ->get();
                        foreach ($variantes as $item) {
                            $list_match[] = $item->product_id;
                        }
                        break;
                    }
                case '2':
                    // n'est pas égale à
                    if ($field === 'name' || $field === 'type') {
                        $products = Product::where($field, '!=', $value)->get();
                        foreach ($products as $item) {
                            $list_match[] = $item->id;
                        }
                        break;
                    } else if ($field === 'supplier') {
                        $suppliers = DB::table('products')
                            ->join('variantes', 'products.id', '=', 'variantes.product_id')
                            ->join('suppliers', 'suppliers.id', '=', 'variantes.supplier_id')
                            ->Where('suppliers.name', '!=', $value)
                            ->groupBy('variantes.product_id')
                            ->get();
                        foreach ($suppliers as $supplier) {
                            $list_match[] = $supplier->product_id;
                        }
                        break;
                    } else {
                        $variantes = Variante::where($field, '!=', $value)
                            ->groupBy('product_id')
                            ->get();
                        foreach ($variantes as $item) {
                            $list_match[] = $item->product_id;
                        }
                        break;
                    }
                case '3':
                    // est suppérieur à
                    $variantes = Variante::where($field, '>', $value)
                        ->groupBy('product_id')
                        ->get();
                    foreach ($variantes as $item) {
                        $list_match[] = $item->product_id;
                    }
                    break;
                case '4':
                    // est infèrieur à
                    $variantes = Variante::where($field, '<', $value)
                        ->groupBy('product_id')
                        ->get();
                    foreach ($variantes as $item) {
                        $list_match[] = $item->product_id;
                    }
                    break;
                case '5':
                    // commence par
                    if ($field === 'name' || $field === 'type') {
                        $products = Product::where($field, 'like', $value . '%')->get();
                        foreach ($products as $item) {
                            $list_match[] = $item->id;
                        }
                        break;
                    } else if ($field === 'supplier') {
                        $suppliers = DB::table('products')
                            ->join('variantes', 'products.id', '=', 'variantes.product_id')
                            ->join('suppliers', 'suppliers.id', '=', 'variantes.supplier_id')
                            ->Where('suppliers.name', 'like', $value . '%')
                            ->groupBy('variantes.product_id')
                            ->get();
                        foreach ($suppliers as $supplier) {
                            $list_match[] = $supplier->product_id;
                        }
                        break;
                    }
                case '6':
                    //  se termine par
                    if ($field === 'name' || $field === 'type') {
                        $products = Product::where($field, 'like', '%' . $value)->get();
                        foreach ($products as $item) {
                            $list_match[] = $item->id;
                        }
                        break;
                    } else if ($field === 'supplier') {
                        $suppliers = DB::table('products')
                            ->join('variantes', 'products.id', '=', 'variantes.product_id')
                            ->join('suppliers', 'suppliers.id', '=', 'variantes.supplier_id')
                            ->Where('suppliers.name', 'like', '%' . $value)
                            ->groupBy('variantes.product_id')
                            ->get();
                        foreach ($suppliers as $supplier) {
                            $list_match[] = $supplier->product_id;
                        }
                        break;
                    }
                case '7':
                    // contient
                    if ($field === 'name' || $field === 'type') {
                        $products = Product::where($field, 'like', '%' . $value . '%')->get();
                        foreach ($products as $item) {
                            $list_match[] = $item->id;
                        }
                        break;
                    } else {
                        if ($field === 'supplier') {
                            $suppliers = DB::table('products')
                                ->join('variantes', 'products.id', '=', 'variantes.product_id')
                                ->join('suppliers', 'suppliers.id', '=', 'variantes.supplier_id')
                                ->Where('suppliers.name', 'like', '%' . $value . '%')
                                ->groupBy('variantes.product_id')
                                ->get();
                            foreach ($suppliers as $supplier) {
                                $list_match[] = $supplier->product_id;
                            }
                            break;
                        }
                    }
                case '8':
                    // ne contient pas
                    if ($field === 'name' || $field === 'type') {
                        $products = Product::where($field, 'not like', '%' . $value . '%')->get();
                        foreach ($products as $item) {
                            $list_match[] = $item->id;
                        }
                        break;
                    } else {
                        if ($field === 'supplier') {
                            $suppliers = DB::table('products')
                                ->join('variantes', 'products.id', '=', 'variantes.product_id')
                                ->join('suppliers', 'suppliers.id', '=', 'variantes.supplier_id')
                                ->Where('suppliers.name', 'not like', '%' . $value . '%')
                                ->groupBy('variantes.product_id')
                                ->get();
                            foreach ($suppliers as $supplier) {
                                $list_match[] = $supplier->product_id;
                            }
                            break;
                        }
                    }
                case '9':
                    // n'est pas vide
                    if ($field === 'price_before_discount') {
                        $variantes = Variante::where($field, '!=', 0)
                            ->groupBy('product_id')
                            ->get();
                        foreach ($variantes as $item) {
                            $list_match[] = $item->product_id;
                        }
                        break;
                    } else {
                        $variantes = Variante::where($field, '!=', '')
                            ->orWhere($field, '!=', null)
                            ->groupBy('product_id')
                            ->get();
                        foreach ($variantes as $item) {
                            $list_match[] = $item->product_id;
                        }
                        break;
                    }
                case '10':
                    // est vide
                    if ($field === 'price_before_discount') {
                        $variantes = Variante::where($field, '==', 0)
                            ->groupBy('product_id')
                            ->get();
                        foreach ($variantes as $item) {
                            $list_match[] = $item->product_id;
                        }
                        break;
                    } else {
                        $variantes = Variante::where($field, '==', '')
                            ->orWhere($field, '==', null)
                            ->groupBy('product_id')
                            ->get();
                        foreach ($variantes as $item) {
                            $list_match[] = $item->product_id;
                        }
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
