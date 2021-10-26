@extends('layouts.head-frontend')

@section('content')


<div class="container_payment">

    @include('front-end.register')

    <div class="payment_cart_product_wrapper">
        @foreach($cart as $cartProduct)
        <div class="payment_card">
            <!-- image -->
            <figure id="img_payment">
                @isset($cartProduct[0]->images_products->first()->path)
                <img src="{{  $cartProduct[0]->images_products->first()->path }}">
                @endisset
                @if(isset($cartProduct['quantity']))
                <span class="qnt">{{$cartProduct['quantity']}}</span>
                @else
                <span class="qnt">1</span>
                @endif
                
            </figure>

            <div class="text_cart_card">
                <!-- name -->
                <h2 id="payment_name">{{ $cartProduct[0]->name }}</h2>

                <div class="payment_block_details">
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
            <div class="text_payment_card_price">
                <h3 class="payment_price_list">{{ (int) $cartProduct['quantity'] * $cartProduct[0]->price }}</h3>&nbsp;<span>€</span>
            </div>

        </div>
        @endforeach

        <div class="payment_total">
            <div class="payment_sous_total_price">
                <h3>Sous-total</h3>
                <h3 id="payment_sous_total_Id"></h3>
                </h3>
            </div>
            <div class="payment_shipping_price">
                <h3>Livraison</h3>
                <h3 id="payment_shipping_Id"><span  id="CalculeALEtapeSuivante">Calculé à l'étape suivante</span></h3>
            </div>
            <div class="payment_total_price">
                <h3>Total</h3>
                <h3 id="payment_total_Id"></h3>
            </div>
        </div>

    </div>

</div>

<script>

    var shippingModePrice = 0;
    var first = 0;

    if (window.addEventListener) {
        window.addEventListener('load', calculSousTotalPrice);
    } else if (window.attachEvent) {
        window.attachEvent('onload', calculSousTotalPrice);
    } else {
        window.onload = calculSousTotalPrice;
    }

    // reçoit le "Gratuit" ou "4,99" quand on sélectionne le mode de livraison. 
    function get_shipping_price(price) {

        shippingModePrice = price == 'Gratuit' ? 0 : 4.99;

        var signEuro = price == 'Gratuit' ? '' : '&nbsp;<span>€</span>';
        document.getElementById('payment_shipping_Id').innerHTML = price + signEuro;

        calculSousTotalPrice();
    }

    // L'appel se fait dans register.blade 
    // permet d'afficher le prix du mode de livraison choisi sans le modifier à chaques fois que le bouton prochaine étape est cliqué " Continuer vers ..." 
    function get_shipping_price_realTime() {

        if (shippingModePrice == 0) {
            get_shipping_price('Gratuit');
        } else {
            get_shipping_price(4.99);
        }
            
    }

    // réinitialise CalculeALEtapeSuivante pour afficher 'Calculé à l\'étape suivante' dans le cadre d'information
    function CalculeALEtapeSuivante() {
        document.getElementById('payment_shipping_Id').innerHTML = 'Calculé à l\'étape suivante';
    }

    // calcule le sous-total des prix
    function calculSousTotalPrice() {
        var allPrices = document.getElementsByClassName('payment_price_list');
        var total_price = 0;

        if (allPrices.length) {
            for (var j = 0; j < allPrices.length; j++) {
                total_price += parseFloat(allPrices[j].innerHTML);
            }

            document.getElementById('payment_sous_total_Id').innerHTML = total_price + '&nbsp;<span>€</span>'

            calculTotalPrice();
        }
    };

        // calcule le total des prix
        function calculTotalPrice() {
        var allPrices = document.getElementsByClassName('payment_price_list');
        var total_price = 0;

        if (allPrices.length) {
            for (var j = 0; j < allPrices.length; j++) {
                total_price += parseFloat(allPrices[j].innerHTML);
            }
            
            total_price += shippingModePrice;

            document.getElementById('payment_total_Id').innerHTML = total_price + '&nbsp;<span>€</span>'
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