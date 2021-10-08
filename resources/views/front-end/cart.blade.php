@extends('layouts.head-frontend')

@section('content')
<div class="container_cart">
    <div class="cart_header">
        <h1>Votre panier</h1>
    </div>

    @if(isset($cart) && !empty($cart))
    <div class="cart_body">
        @foreach($cart as $cartProduct)
        <!-- @dump($cartProduct['quantity'])
        @dump($cartProduct[0]->collections[0]->name) -->
        <div class="cart_card">
            <a href="/collections/{{$cartProduct[0]->collections[0]->name}}/{{$cartProduct[0]->link}}">
                <figure id="img_Cart">
                    @isset($cartProduct[0]->images_products->first()->path)
                    <img src="{{  $cartProduct[0]->images_products->first()->path }}">
                    @endisset
                </figure>
            </a>

            <div class="text_cart_card">
                <a href="/collections/{{$cartProduct[0]->collections[0]->name}}/{{$cartProduct[0]->link}}">
                    <h2>{{ $cartProduct[0]->name }}</h2>
                </a>

                <!-- détails -->
                @include('front-end.cart_and_sheet_elements.details_for_cart')

                <!-- quantity buttons -->
                <div class="cart_block_quantity">
                    <span id="quantityBuy">Quantité</span>
                    <div class="nbArticles">
                        <div class="wrapper_quantity">
                            <button class="btn-quantity" onclick="dec_NbArticle_cart(event, <?php echo json_encode($cartProduct['product_id_cart']) ?>), addQuantityToCart(event, <?php echo json_encode($cartProduct['product_id_cart']) ?>)" aria-label="Augmenter la quantité de l'article de un">-</button>

                            <input type="text" maxlength="3" onkeypress="return event.charCode >= 48 && event.charCode <= 57" value="@if(isset($cartProduct['quantity'])) {{$cartProduct['quantity']}} @else 1 @endif" id="price_productId_{{$cartProduct['product_id_cart']}}" name="quantity" class="nbArticles_input" onchange="addQuantityToCart(event, <?php echo json_encode($cartProduct['product_id_cart']) ?>)">

                            <button onclick="inc_NbArticle_cart(event, <?php echo json_encode($cartProduct['product_id_cart']) ?>), addQuantityToCart(event, <?php echo json_encode($cartProduct['product_id_cart']) ?>)" aria-label="Réduire la quantité de l'article de un">+</button>
                        </div>
                    </div>
                </div>
            </div>

            <div class="cart_block_price_delete">
                <div class="text_cart_card_2">
                    <h3 id="text_cart_card_price">{{ $cartProduct['quantity'] * $cartProduct[0]->price }} €</h3>
                </div>

                <form action="/carts/{{ $loop->index }}" method="post" class="delete_from_cart">
                    @csrf
                    @method('delete')
                    <button type="submit" name="delete" class="btn btn-outline-danger"><i class="far fa-trash-alt"></i></button>
                </form>
            </div>

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

<!-- gestion input quantity -->
<script>
    // ajoute 1 à la quantité
    const inc_NbArticle_cart = (e, productId) => {
        e.preventDefault();
        if (document.getElementById('price_productId_' + productId).value < 999) {
            document.getElementById('price_productId_' + productId).value++;
        }
    };

    // enlève 1 de la quantité
    const dec_NbArticle_cart = (e, productId) => {
        e.preventDefault();
        if (document.getElementById('price_productId_' + productId).value > 1) {
            document.getElementById('price_productId_' + productId).value--;
        }
    };

    // empèche le paste sur l'input quantité de produit
    document.querySelectorAll('.nbArticles_input').forEach(item => {
        item.addEventListener('paste', e => e.preventDefault());
    });


    // met à 1 la quantité si elle est == à '' ou == à 0
    document.querySelectorAll('.nbArticles_input').forEach(item => {
        window.addEventListener('click', e => {
            if (item.value == '' || item.value == 0)
                item.value = 1
        });
    });

    // modify quantity
    const addQuantityToCart = (e, productId) => {
        e.preventDefault();
        document.getElementById('price_productId_' + productId).value = 999;
        console.log(productId);
    }
</script>

@endsection