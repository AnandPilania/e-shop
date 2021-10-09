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


                <div class="cart_block_quantity">
                    <!-- quantity buttons -->
                    <div id="quantityBuy">
                        <h5>Quantité</h5>
                    </div>
                    <div class="nbArticles">
                        <div class="wrapper_quantity">
                            <button class="btn-quantity" onclick="dec_NbArticle_cart(event, <?php echo json_encode($cartProduct['product_id_cart']) ?>), addQuantityToCart(event, <?php echo json_encode($cartProduct['product_id_cart']) ?>)" aria-label="Augmenter la quantité de l'article de un">-</button>

                            <input type="text" maxlength="3" onkeypress="return event.charCode >= 48 && event.charCode <= 57" value="@if(isset($cartProduct['quantity'])) {{$cartProduct['quantity']}} @else 1 @endif" id="quantity_id_{{$cartProduct['product_id_cart']}}" name="quantity" class="nbArticles_input" onchange="addQuantityToCart(event, <?php echo json_encode($cartProduct['product_id_cart']) ?>)">

                            <button onclick="inc_NbArticle_cart(event, <?php echo json_encode($cartProduct['product_id_cart']) ?>), addQuantityToCart(event, <?php echo json_encode($cartProduct['product_id_cart']) ?>)" aria-label="Réduire la quantité de l'article de un">+</button>
                        </div>
                    </div>

                    <!-- delete -->
                    <form action="/carts/{{ $loop->index }}" method="post" class="delete_from_cart">
                        @csrf
                        @method('delete')
                        <button type="submit" name="delete" class="btn btn-outline-danger"><span>Retirer</span></button>
                    </form>
                </div>
            </div>

            <!-- price -->
            <div class="cart_block_price">
                <div class="text_cart_card_2">
                    <h3 id="text_cart_card_price_{{$cartProduct['product_id_cart']}}" class="price_list">{{ (int) $cartProduct['quantity'] * $cartProduct[0]->price }}</h3>&nbsp;<span>€</span>
                    <input type="hidden" id="hidden_price_{{$cartProduct['product_id_cart']}}" value="{{ $cartProduct[0]->price }}">
                </div>
            </div>

        </div>
        @endforeach
        <div id="cart_total_price">
            <h3 id="total_priceId">

            </h3>
        </div>
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
    var cartObj = {};

    calculTotalPrice();

    // ajoute 1 à la quantité
    const inc_NbArticle_cart = (e, productId) => {
        e.preventDefault();
        // incrémente quantity
        if (document.getElementById('quantity_id_' + productId).value < 999) {
            document.getElementById('quantity_id_' + productId).value++;
        };

        //  calcule le prix par nombre d'article " quantity x price "
        var qt = document.getElementById('quantity_id_' + productId).value;
        var pr = document.getElementById('hidden_price_' + productId).value;
        document.getElementById('text_cart_card_price_' + productId).innerHTML = qt * pr;

        cartObj['quantity'] = qt;

        calculTotalPrice();
    };

    // enlève 1 de la quantité
    const dec_NbArticle_cart = (e, productId) => {
        e.preventDefault();
        if (document.getElementById('quantity_id_' + productId).value > 1) {
            document.getElementById('quantity_id_' + productId).value--;
        }

        //  calcule le prix par nombre d'article " quantity x price "
        var qt = document.getElementById('quantity_id_' + productId).value;
        var pr = document.getElementById('hidden_price_' + productId).value;
        document.getElementById('text_cart_card_price_' + productId).innerHTML = qt * pr;

        cartObj['quantity'] = qt;

        calculTotalPrice();
    };

    // modify quantity
    const addQuantityToCart = (e, productId) => {
        e.preventDefault();
        //  calcule le prix par nombre d'article " quantity x price "
        var qt = document.getElementById('quantity_id_' + productId).value;
        if (qt == 0) qt = 1;
        var pr = document.getElementById('hidden_price_' + productId).value;
        document.getElementById('text_cart_card_price_' + productId).innerHTML = qt * pr;

        cartObj['quantity'] = qt;

        calculTotalPrice();
    }

    // empèche le paste sur l'input quantity product
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

    // calcule le total des prix
    function calculTotalPrice() {
        var allPrices = document.getElementsByClassName('price_list');
        var total_price = 0;

        for (var j = 0; j < allPrices.length; j++) {
            total_price += parseFloat(allPrices[j].innerHTML);
        }

        document.getElementById('total_priceId').innerHTML = total_price;



        // ajoute dans cartObj les détails et leur valeur
        // cartObj[e.target.name] = e.target.value;
        // cartObj['product_id_cart'] = product_id_cart;
        // cartObj['quantity'] = quantity_cart;

    }

    // handle details
    const handleDetails = (e) => {
        cartObj[e.target.id] = e.target.value;
        cartObj['product_id_cart'] = e.target.name;
        console.log(e.target);
        console.log(cartObj);
        console.log(e.target.id);
    }


    // save modifications in cart
    const saveModificationCart = () => {
        // transformation de l'objet en string JSON
        var cart = JSON.stringify(cartObj);

        var formData = new FormData();
        formData.append("cart", cart);

        axios.post(`http://127.0.0.1:8000/carts`, formData)
            .then(res => {
                console.log('res.data  --->  ok');

            }).catch(function(error) {
                console.log('error:   ' + error);
            });
    }
</script>

@endsection