@extends('layouts.head-frontend')

@section('content')
<div class="container_products_front">
    <div class="product_header">
        <h1>{{$collection->name}}</h1>
        <h2>Découvrez les collections de notre boutique.</h2>
    </div>
    <div class="products_wrapper">
        @foreach($collection->products as $product)
        <div class="product_card">
            <a href="/collections/{{$collection->link}}/{{$product->link}}/{{$product->id}}">
                @foreach($product->images_products->sortBy('order') as $image)
                    <img src="{{ asset($image->path) }}" alt="">
                    @break
                @endforeach
                <h2>{{$product->name}}</h2>
                <span>{{$product->price}}</span>
            </a>        
        </div>
        @endforeach

    </div>
    <h1>hello</h1>

</div>

@endsection