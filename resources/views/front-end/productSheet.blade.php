@extends('layouts.head-frontend')

@section('content')
<div class="container_sheet">

    <div class="product_sheet">

        <div class="image_product">

            <div id="slide-wrapper">
                <div class="arrow-wrapper">
                    <img id="arrowTop" class="arrow" src="{{ asset('images/used/arrowUp.png') }}" style="display: none" alt="flèche vers le haut">
                </div>

                <div id="slider">
                    @foreach ($product->images_products as $image)
                    <img class="thumbnail" src="{{ asset($image->path) }}" alt="{{ $image->alt }}">
                    @endforeach
                </div>

                <div class="arrow-wrapper">
                    <img id="arrowBottom" class="arrow" src="{{ asset('images/used/arrowDown.png') }}" alt="flèche vers le bas">
                </div>
            </div>

            <img id=featured src="{{ asset($product->images_products[0]->path) }}" alt="{{ $product->images_products[0]->alt }}" class="active">

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
                <input type="radio" class="details radio_item" value="{{ $key }}" name="{{ $value }}" id="{{ $key }}" required>
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
                <button class="btn-quantity" onclick="dec_NbArticle(event)" aria-label="Augmenter la quantité de l'article de un">-</button>

                <input type="text" maxlength="3" onkeypress="return event.charCode >= 48 && event.charCode <= 57" value="1" id="quantity" name="quantity" class="nbArticles_input">

                <button onclick="inc_NbArticle(event)" aria-label="Réduire la quantité de l'article de un">+</button>
            </div>
            <button class="addToCart">Ajouter au panier</button>
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
<div class="technical_sheet">
    {!! $product->product_sheet->text !!}
</div>

<div class="promo_wrapper">
    <h2>PROMO LIMITÉE : 20% OFFERTS SUR CE PACK</h2>

    <div class="promo">
        <div class="image_promo">
            <img id="imagePromo1" src="{{ asset($product->images_products[0]->path) }}" alt="{{ $product->images_products[0]->alt }}">

            <span id="promoSpanPlus1">+</span>

            <img id="imagePromo2" src="{{ asset($promos['promo1']->images_products[0]->path) }}" alt="{{ $promos['promo1']->images_products[0]->alt }}">

            <span id="promoSpanPlus2">+</span>

            <img id="imagePromo3" src="{{ asset($promos['promo2']->images_products[0]->path) }}" alt="{{ $promos['promo2']->images_products[0]->alt }}">
        </div>

        <div class="priceAndAddCart">
            <h5><span id="textPrixPromo">Prix : </span><span id="finalPrice"></span> &nbsp; &nbsp; <span id="previousPrice"></span> </h5>
            <button class="addToCart" id="addToCartPromo">Ajouter au panier</button>
        </div>
    </div>

    <div class="promo_checkbox">
        <input type="checkbox" id="checkboxPromo1" name="checkboxPromo1" value="{{ $product->id }}" class="checkbox_promo" checked>
        <label for="checkboxPromo1" id="labelPromo1"> {{ $product->name }} {{ $product->price }}</label><br>

        <input type="checkbox" id="checkboxPromo2" name="checkboxPromo2" value="{{ $promos['promo1']->id }}" class="checkbox_promo" checked>
        <label for="checkboxPromo2" id="labelPromo2"> {{ $promos['promo1']->name }}
            {{ $promos['promo1']->price }}</label><br>

        <input type="checkbox" id="checkboxPromo3" name="checkboxPromo3" value="{{ $promos['promo2']->id }}" class="checkbox_promo" checked>
        <label for="checkboxPromo3" id="labelPromo3"> {{ $promos['promo2']->name }}
            {{ $promos['promo2']->price }}</label><br>

    </div>
</div>

{{-- Gestion des checkbox de PROMO --}}
<script>
    var price1 = <?php echo json_encode($product->price); ?>;
    var price2 = <?php echo json_encode($promos['promo1']->price); ?>;
    var price3 = <?php echo json_encode($promos['promo2']->price); ?>;

    var packagePrice = price1 + price2 + price3;
    document.getElementById('finalPrice').innerHTML = (packagePrice * 0.8).toFixed(2) + '€';
    document.getElementById('previousPrice').innerHTML = packagePrice.toFixed(2) + '€';


    const showPrice = () => {
        // si toutes les checkbox son checked alors on accorde 20% de baisse
        if (document.getElementById('checkboxPromo1').checked &&
            document.getElementById('checkboxPromo2').checked &&
            document.getElementById('checkboxPromo3').checked) {
            document.getElementById('finalPrice').innerHTML = (packagePrice * 0.8).toFixed(2) + '€';
            document.getElementById('previousPrice').style.display = "inline-block";
        } else {
            document.getElementById('finalPrice').innerHTML = packagePrice.toFixed(2) + '€';
            document.getElementById('previousPrice').style.display = "none";
        }

        // si toutes les checkbox son pas checked alors on masque les prix et le bouton ajout panier
        if (!document.getElementById('checkboxPromo1').checked &&
            !document.getElementById('checkboxPromo2').checked &&
            !document.getElementById('checkboxPromo3').checked) {

            document.getElementById('textPrixPromo').style.display = "none";
            document.getElementById('finalPrice').style.display = "none";
            document.getElementById('previousPrice').style.display = "none";
            document.getElementById('addToCartPromo').style.display = "none";

        }

        // si au moins une des checkbox est checked alors on affiche les prix et le bouton ajout panier
        if (document.getElementById('checkboxPromo1').checked ||
            document.getElementById('checkboxPromo2').checked ||
            document.getElementById('checkboxPromo3').checked) {

            document.getElementById('textPrixPromo').style.display = "inline-block";
            document.getElementById('finalPrice').style.display = "inline-block";
            document.getElementById('addToCartPromo').style.display = "block";

        }

    }

    // gestion de la visibilité des images de promo et du "+" en fonction des checkbox sélectionnées
    // calcul du price en additionnant ou soustrayant le prix du produit sélectionné ou désélectionné
    document.getElementById('checkboxPromo1').addEventListener('change', function() {
        if (this.checked) {
            document.getElementById('imagePromo1').style
                .display = "block";
            document.getElementById('labelPromo1').style.opacity = "1";
            packagePrice += price1;
            showPrice();

            if (document.getElementById('checkboxPromo2').checked ||
                document.getElementById('checkboxPromo3').checked) {
                document.getElementById('promoSpanPlus1').style
                    .display = "block";
            }
        } else {
            document.getElementById('imagePromo1').style
                .display = "none";
            document.getElementById('labelPromo1').style.opacity = "0.5";
            packagePrice -= price1;
            showPrice();
            document.getElementById('promoSpanPlus1').style
                .display = "none";
            if (!document.getElementById('checkboxPromo3').checked) {
                document.getElementById('promoSpanPlus2').style
                    .display = "none";
            }
            if (!document.getElementById('checkboxPromo2').checked) {
                document.getElementById('promoSpanPlus2').style
                    .display = "none";
            }
        }
    });

    document.getElementById('checkboxPromo2').addEventListener('change', function() {
        if (this.checked) {
            document.getElementById('imagePromo2').style
                .display = "block";
            document.getElementById('labelPromo2').style.opacity = "1";
            packagePrice += price2;
            showPrice();
            if (document.getElementById('checkboxPromo1').checked) {
                document.getElementById('promoSpanPlus1').style
                    .display = "block";
            } else {
                document.getElementById('promoSpanPlus1').style
                    .display = "none";
            }

            if (document.getElementById('checkboxPromo3').checked) {
                document.getElementById('promoSpanPlus2').style
                    .display = "block";
            } else {
                document.getElementById('promoSpanPlus2').style
                    .display = "none";
            }

        } else {
            document.getElementById('imagePromo2').style
                .display = "none";
            document.getElementById('labelPromo2').style.opacity = "0.5";
            packagePrice -= price2;
            showPrice();
            document.getElementById('promoSpanPlus1').style
                .display = "none";
            if (!document.getElementById('checkboxPromo1').checked) {
                document.getElementById('promoSpanPlus2').style
                    .display = "none";
            }
        }
    });

    document.getElementById('checkboxPromo3').addEventListener('change', function() {
        if (this.checked) {
            document.getElementById('imagePromo3').style
                .display = "block";
            document.getElementById('labelPromo3').style.opacity = "1";
            packagePrice += price3;
            showPrice();
            if (document.getElementById('checkboxPromo1').checked) {
                document.getElementById('promoSpanPlus2').style
                    .display = "block";
            }
            if (document.getElementById('checkboxPromo2').checked) {
                document.getElementById('promoSpanPlus2').style
                    .display = "block";
            }
            if (!document.getElementById('checkboxPromo1').checked &&
                !document.getElementById('checkboxPromo2').checked) {
                document.getElementById('promoSpanPlus2').style
                    .display = "none";
            }

        } else {
            document.getElementById('imagePromo3').style
                .display = "none";
            document.getElementById('labelPromo3').style.opacity = "0.5";
            packagePrice -= price3;
            showPrice();
            document.getElementById('promoSpanPlus2').style
                .display = "none";
            if (!document.getElementById('checkboxPromo1').checked) {
                document.getElementById('promoSpanPlus1').style
                    .display = "none";
            }
        }
    });
</script>

<!-- REVIEWS -->
<div class="reviews_wrapper">
    <h2>Commentaires client</h2>
    <!-- Trigger/Open The Modal -->
    <button id="reviewBtn">Écrire un avis</button>

    <!-- The Modal -->
    <div id="myModal" class="modal">

        <!-- Modal content -->
        <div class="modal-content">
            <div class="modal-header">
                <span class="close">&times;</span>
                <h2>Modal Header</h2>
            </div>

            <div class="sliderReviews">

                <a href="#slide-1">1</a>
                <a href="#slide-2">2</a>
                <a href="#slide-3">3</a>
                <a href="#slide-4">4</a>
                <a href="#slide-5">5</a>

                <div class="reviewsSlides">
                    <div id="slide-1">
                    <button class="scoreButtons" id="modal-button-score5" onclick="setScore(5, this.id)"><i class="fas fa-star"></i> <i class="fas fa-star"></i>
                    <i class="fas fa-star"></i> <i class="fas fa-star"></i>
                    <i class="fas fa-star"></i> &nbsp; &nbsp; Parfait !
                </button>
                <button class="scoreButtons" id="modal-button-score4" onclick="setScore(4, this.id)"><i class="fas fa-star"></i> <i class="fas fa-star"></i>
                    <i class="fas fa-star"></i> <i class="fas fa-star"></i>
                    <i class="far fa-star"></i> &nbsp; &nbsp; J'aime
                </button>
                <button class="scoreButtons" id="modal-button-score3" onclick="setScore(3, this.id)"><i class="fas fa-star"></i> <i class="fas fa-star"></i>
                    <i class="fas fa-star"></i> <i class="far fa-star"></i>
                    <i class="far fa-star"></i> &nbsp; &nbsp; Assez bien
                </button>
                <button class="scoreButtons" id="modal-button-score2" onclick="setScore(2, this.id)"><i class="fas fa-star"></i> <i class="fas fa-star"></i>
                    <i class="far fa-star"></i> <i class="far fa-star"></i>
                    <i class="far fa-star"></i> &nbsp; &nbsp; Je n'ai pas aimé
                </button>
                <button class="scoreButtons" id="modal-button-score1" onclick="setScore(1, this.id)"><i class="fas fa-star"></i> <i class="far fa-star"></i>
                    <i class="far fa-star"></i> <i class="far fa-star"></i>
                    <i class="far fa-star"></i> &nbsp; &nbsp; Je déteste
                </button>
                    </div>
                    <div id="slide-2">
                    <div id="divTextReview">
                    <label for="textReview">Nous en dire plus !</label>
                    <textarea name="textReview" id="textReview" placeholder="Partagez votre expérience"></textarea>
                </div>

                <div id="fileReview"></div>
                <ul id="nameFileReview"></ul>
                    </div>
                    <div id="slide-3">
                        3
                    </div>
                    <div id="slide-4">
                        4
                    </div>
                    <div id="slide-5">
                        5
                    </div>
                </div>
            </div>

            <div class="modal-body">
                <!-- <button class="scoreButtons" id="modal-button-score5" onclick="setScore(5, this.id)"><i class="fas fa-star"></i> <i class="fas fa-star"></i>
                    <i class="fas fa-star"></i> <i class="fas fa-star"></i>
                    <i class="fas fa-star"></i> &nbsp; &nbsp; Parfait !
                </button>
                <button class="scoreButtons" id="modal-button-score4" onclick="setScore(4, this.id)"><i class="fas fa-star"></i> <i class="fas fa-star"></i>
                    <i class="fas fa-star"></i> <i class="fas fa-star"></i>
                    <i class="far fa-star"></i> &nbsp; &nbsp; J'aime
                </button>
                <button class="scoreButtons" id="modal-button-score3" onclick="setScore(3, this.id)"><i class="fas fa-star"></i> <i class="fas fa-star"></i>
                    <i class="fas fa-star"></i> <i class="far fa-star"></i>
                    <i class="far fa-star"></i> &nbsp; &nbsp; Assez bien
                </button>
                <button class="scoreButtons" id="modal-button-score2" onclick="setScore(2, this.id)"><i class="fas fa-star"></i> <i class="fas fa-star"></i>
                    <i class="far fa-star"></i> <i class="far fa-star"></i>
                    <i class="far fa-star"></i> &nbsp; &nbsp; Je n'ai pas aimé
                </button>
                <button class="scoreButtons" id="modal-button-score1" onclick="setScore(1, this.id)"><i class="fas fa-star"></i> <i class="far fa-star"></i>
                    <i class="far fa-star"></i> <i class="far fa-star"></i>
                    <i class="far fa-star"></i> &nbsp; &nbsp; Je déteste
                </button> -->

                <!-- <div id="divTextReview">
                    <label for="textReview">Nous en dire plus !</label>
                    <textarea name="textReview" id="textReview" placeholder="Partagez votre expérience"></textarea>
                </div>

                <div id="fileReview"></div>
                <ul id="nameFileReview"></ul> -->
                @guest
                <label for="firstNameReview">Prénom*</label>
                <input type="text" id="firstNameReview">
                <label for="lastNameReveiw">Nom</label>
                <input type="text" id="lastNameReveiw">
                <label for="emailReveiw">Email*</label>
                <input type="text" id="emailReveiw">
                @endguest

                @auth
                <h1>ok ok</h1>
                @endauth



                <script>
                    // open file selector when clicked on the drop region
                    var fakeInput = document.createElement("input");
                    fakeInput.type = "file";
                    fakeInput.accept = "image/*";
                    fakeInput.multiple = true;

                    var getFileReview = document.getElementById('fileReview');
                    getFileReview.innerText = "Ajouter des photos";

                    // open files exploratore when click on dropRegion
                    getFileReview.addEventListener('click', function() {
                        fakeInput.click();
                    });

                    fakeInput.addEventListener("change", function() {
                        var reviewFiles = fakeInput.files;

                        Array.from(reviewFiles).forEach(file => {
                            var li_FileReview = document.createElement("li");
                            li_FileReview.innerText = file.name;
                            var wrapper = document.getElementById("nameFileReview");
                            wrapper.appendChild(li_FileReview);
                        });



                        console.log(reviewFiles[0].name)
                        // handleFiles(files);
                    });
                </script>

            </div>
            <div class="modal-footer">
                <h3>Modal Footer</h3>
            </div>
        </div>

    </div>

</div>

<!-- Gestion modal -->
<script>
    // Get the modal
    var modal = document.getElementById("myModal");

    // Get the button that opens the modal
    var btn = document.getElementById("reviewBtn");

    // Get the <span> element that closes the modal
    var span = document.getElementsByClassName("close")[0];

    // When the user clicks the button, open the modal 
    btn.onclick = function() {
        modal.style.display = "block";
    }

    // When the user clicks on <span> (x), close the modal
    span.onclick = function() {
        modal.style.display = "none";
    }

    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }

    // gestion score
    function setScore(scoreValue, scoreId) {

        var score = scoreValue;

        document.querySelectorAll('.scoreButtons').forEach(function(currentValue) {
            currentValue.style.backgroundColor = "#ffffff";
        })

        document.getElementById(scoreId).style.backgroundColor = "rgb(224, 224, 224)";
    }
</script>


<div class="lesClientAyantAcheté">
    <p>LES CLIENTS AYANT ACHETÉ CET ARTICLE ONT ÉGALEMENT ACHETÉ</p>
</div>


</div>

@endsection