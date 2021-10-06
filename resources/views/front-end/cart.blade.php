@extends('layouts.head-frontend')

@section('content')
<div class="container_cart">
    <div class="cart_header">
        <h1>Votre panier</h1>
    </div>
    @if(isset($cart))
    <div class="cart_body">
        @foreach($cart as $cartProduct)
        <div class="cart_card">
            <figure id="img_Cart">
                @isset($cartProduct->images_products->first()->path)
                <img src="{{  $cartProduct->images_products->first()->path }}">
                @endisset
            </figure>
            <section id="text_cart_card">
                <h2>{{ $cartProduct->name }}</h2>
    
            </section>
            <section id="text_cart_card_2">

                <h3 id="text_cart_card_price">{{ $cartProduct->price }}</h3>
            </section>
        </div>
        @endforeach
    </div>
    @else
    <h2>Votre panier est vide</h2>
    @endif

    <form action="panier-vider" method="get">
        @csrf
        <input class="btn" type="submit" value="Vider le panier">
    </form>
    

</div>
</div>
@endsection