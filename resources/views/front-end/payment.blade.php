@extends('layouts.head-frontend')

@section('content')


<div class="container_payment">

    @include('front-end.register')

    <div class="payment_cart_product_wrapper">
        @foreach($cart as $cartProduct)
        <div class="payment_card">
            <!-- image -->
            <a href="/collections/{{$cartProduct[0]->collections[0]->name}}/{{$cartProduct[0]->link}}/{{$cartProduct[0]->id}}">
                <figure id="img_payment">
                    @isset($cartProduct[0]->images_products->first()->path)
                    <img src="{{  $cartProduct[0]->images_products->first()->path }}">
                    @endisset
                </figure>
            </a>

            <div class="text_cart_card">
                <!-- name -->
                <a href="/collections/{{$cartProduct[0]->collections[0]->name}}/{{$cartProduct[0]->link}}/{{$cartProduct[0]->id}}">
                    <h2 id="payment_name">{{ $cartProduct[0]->name }}</h2>
                </a>

                <div class="payment_block_details">
                    <!-- quantity -->
                    <div class="payment_block_quantity">
                        <!-- quantity buttons -->
                        <div id="payment_quantityBuy">
                            @if(isset($cartProduct['quantity']))
                            <h5>Quantité: {{$cartProduct['quantity']}}</h5>
                            @else
                            <h5>Quantité: 1</h5>
                            @endif

                        </div>
                    </div>
                    <!-- Détails -->
                    {{ $lastValue = '' }}
                    @foreach ($cartProduct[0]->product_details as $value)
                    <!-- nom du détail -->
                    @if ($value->type_detail_product->name != $lastValue)
                    <h5 id="payment_Detail_name">{{ $lastValue = $value->type_detail_product->name }}:</h5>
                    @endif
                    <!-- détail value -->
                    @if($value->libelle == $cartProduct[$value->type_detail_product->name])
                    <h5 id="payment_Detail_value">{{ $value->libelle }}:</h5>
                    @endif
                    @endforeach
                </div>
            </div>

            <!-- price -->
            <div class="cart_block_price">
                <div class="text_cart_card_2">
                    <h3 class="payment_price_list">{{ (int) $cartProduct['quantity'] * $cartProduct[0]->price }}</h3>&nbsp;<span>€</span>
                </div>
            </div>

        </div>
        @endforeach

        <div class="payment_total_price">
            <h3 id="payment_total_priceId"></h3>&nbsp;<span>€</span>
        </div>
    </div>

</div>

<script>
    if (window.addEventListener) {
        window.addEventListener('load', calculTotalPrice);
    } else if (window.attachEvent) {
        window.attachEvent('onload', calculTotalPrice);
    } else {
        window.onload = calculTotalPrice;
    }
    // calcule le total des prix
    function calculTotalPrice() {
        var allPrices = document.getElementsByClassName('payment_price_list');
        var total_price = 0;

        if (allPrices.length) {
            for (var j = 0; j < allPrices.length; j++) {
                total_price += parseFloat(allPrices[j].innerHTML);
            }

            document.getElementById('payment_total_priceId').innerHTML = 'Total &nbsp;&nbsp;&nbsp;' + total_price;
        }
    };
</script>


<!-- load axios and put csrf -->
<script src="https://unpkg.com/axios/dist/axios.min.js"></script>
<!-- <script src="{{ asset('js/app.js') }}"></script> -->
<script>
    let token = document.head.querySelector('meta[name="csrf-token"]');
    if (token) {
        window.axios.defaults.headers.common['X-CSRF-TOKEN'] = token.content;
    } else {
        console.error('CSRF token not found: https://laravel.com/docs/csrf#csrf-x-csrf-token');
    }
</script>
@endsection