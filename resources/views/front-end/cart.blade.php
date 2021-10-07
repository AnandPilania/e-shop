@extends('layouts.head-frontend')

@section('content')
<div class="container_cart">
    <div class="cart_header">
        <h1>Votre panier</h1>
    </div>

    @if(isset($cart) && !empty($cart)) 
    <div class="cart_body">
        @foreach($cart as $cartProduct)
        <div class="cart_card">  
            <figure id="img_Cart">
                @isset($cartProduct[0]->images_products->first()->path)
                <img src="{{  $cartProduct[0]->images_products->first()->path }}">
                @endisset
            </figure>
            <section id="text_cart_card">
                <h2>{{ $cartProduct[0]->name }}</h2>
            </section>
            <section id="text_cart_card_2">
                <h3 id="text_cart_card_price">{{ $cartProduct[0]->price }}</h3>
            </section>
            <!-- Boutons pour la quantité -->
            @include('front-end.cart_and_sheet_elements.quantity_buttons')
            @include('front-end.cart_and_sheet_elements.details_for_cart')
            <form action="/carts/{{ $loop->index }}" method="post" class="delete_from_cart">
                @csrf
                @method('delete')
                <input type="submit" value="Supprimer" name="delete" class="btn btn-outline-danger">
            </form>
        </div>
        @endforeach
    </div>
    @else
    <h2>Votre panier est vide</h2>
    @endif

    <form action="vider-panier" method="get">
        @csrf
        <input class="btn" type="submit" value="Vider le panier">
    </form>


</div>

@endsection