@extends('layouts.head-frontend')

@section('content')
    <div class="container_sheet">

        <div class="product_sheet">

            <div class="image_product">

                <div id="slide-wrapper">
                    <div class="arrow-wrapper">
                        <img id="arrowTop" class="arrow" src="{{ asset('images/used/arrowUp.png') }}"
                            style="display: none">
                    </div>

                    <div id="slider">
                        @foreach ($product->images_products as $image)
                            <img class="thumbnail" src="{{ asset($image->path) }}">
                        @endforeach
                    </div>

                    <div class="arrow-wrapper">
                        <img id="arrowBottom" class="arrow" src="{{ asset('images/used/arrowDown.png') }}">
                    </div>
                </div>

                <img id=featured src="{{ asset($product->images_products[0]->path) }}" class="active">

            </div>

            {{-- GESTION IMAGES --}}
            <script type="text/javascript">
                let thumbnails = document.getElementsByClassName('thumbnail')

                let activeImages = document.getElementsByClassName('active')

                for (var i = 0; i < thumbnails.length; i++) {

                    thumbnails[i].addEventListener('mouseover', function() {
                        console.log(activeImages)

                        if (activeImages.length > 0) {
                            activeImages[0].classList.remove('active')
                        }


                        this.classList.add('active')
                        document.getElementById('featured').src = this.src
                    })
                }

                let buttonBottom = document.getElementById('arrowBottom');
                let buttonTop = document.getElementById('arrowTop');

                buttonTop.addEventListener('click', function() {
                    document.getElementById('slider').scrollTop -= 300
                })

                buttonBottom.addEventListener('click', function() {
                    document.getElementById('slider').scrollTop += 300
                })

                // si le scroll atteint la fin la flèche est masquée
                const slider = document.getElementById('slider')
                slider.addEventListener('scroll', () => {

                    if (slider.scrollTop == 0) {
                        document.getElementById('arrowTop').style.display = 'none';
                    }

                    if (slider.offsetHeight + slider.scrollTop >= slider.scrollHeight) {
                        document.getElementById('arrowBottom').style.display = 'none';
                    }

                    if (slider.scrollTop != 0) {
                        document.getElementById('arrowTop').style.display = 'block';
                    }

                    if (slider.offsetHeight + slider.scrollTop < slider.scrollHeight) {
                        document.getElementById('arrowBottom').style.display = 'block';
                    }
                })
            </script>


            <div class="text_product">
                <h1>{{ $product->name }}</h1>
                <h2>{{ $product->description }}</h2>
                <h5 id="price_product">{{ $product->price }} €</h5>

                {{ $lastValue = '' }}

                <div class="wrapper_details">
                    @foreach ($tabDetails as $key => $value)
                    {{-- referme la div quand on change de type de détails --}}
                    @if ($value != $lastValue && !$loop->first)
                         </div>
                    @endif
                    {{-- nom du détail --}}
                    @if ($value != $lastValue)
                        <div class="block_detail">
                            <h4 id="nomDetail">{{ $lastValue = $value }}</h4>
                         @endif
                    {{-- valeur du détail --}}
                    @if ($value == $lastValue)
                        <input type="radio" class="details radio_item" value="{{ $key }}"
                            name="{{ $value }}" id="{{ $key }}" required>
                        <label class="label_item" for="{{ $key }}"> {{ $key }}</label>
                    @endif
                    {{-- referme la div quand on change de type de détails --}}
                    @if ($loop->last)
                        </div>
                    @endif
                    @endforeach
                </div>



                <span id="quantityBuy">Quantité</span>
                <form action="" class="nbArticles">
                    @csrf
                    <div class="wrapper_quantity">
                        <button class="btn-quantity" onclick="dec_NbArticle(event)"
                            aria-label="Augmenter la quantité de l'article de un">-</button>

                        <input type="text" maxlength="3" onkeypress="return event.charCode >= 48 && event.charCode <= 57"
                            value="1" id="quantity" name="quantity" class="nbArticles_input">

                        <button onclick="inc_NbArticle(event)"
                            aria-label="Réduire la quantité de l'article de un">+</button>
                    </div>
                    <button id="addToCart">Ajouter au panier</button>
                </form>

                {{-- gestion input quantity --}}
                <script>
                    // ajoute 1 à la quantité
                    const inc_NbArticle = (e) => {
                        e.preventDefault();
                        if (document.getElementById('quantity').value < 999) {
                            document.getElementById('quantity').value++;
                        }
                    };

                    // enlève 1 de la quantité
                    const dec_NbArticle = (e) => {
                        e.preventDefault();
                        if (document.getElementById('quantity').value > 1) {
                            document.getElementById('quantity').value--;
                        }
                    };

                    // empèche le paste sur l'input quantité de produit
                    var inputQuantity = document.getElementById('quantity');
                    inputQuantity.addEventListener('paste', e => e.preventDefault());

                    // met à 1 la quantité si elle est == à '' ou == à 0
                    window.addEventListener('click', e => {
                        if (document.getElementById('quantity').value == '' || document.getElementById('quantity').value == 0)
                            document.getElementById('quantity').value = 1
                    });
                </script>

            </div>
        </div>
    </div>

@endsection
