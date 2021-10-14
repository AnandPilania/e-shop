@extends('layouts.head-frontend')

@section('content')
<div class="container_sheet">

    <div class="breadcrumb">
        <a href="{{ asset('/') }}">Accueil</a> 
        <i class="fas fa-chevron-right"></i>
        <a href="{{ asset('collections/') }}">Collections</a> 
        <i class="fas fa-chevron-right"></i>
        <a href="{{ asset('collections/' . $product->collections[0]->link) }}">{{ $product->collections[0]->name }}</a> 
        <i class="fas fa-chevron-right"></i>
        <a href="{{ asset('collections/' . $product->collections[0]->link) . '/' . $product->link . '/' . $product->id }}">{{ $product->name }}</a> 
    </div>
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

        <!-- doit être placé avant <div class="text_product"> pour ne pas être undefined -->
        <!-- sert à vérifier si tous les détails sont bien dans detailsObj -->
        <script>
            var details = [];

            function listDetailsToAddToCart(detail) {
                details.push(detail);
            }
        </script>

        <div class="text_product">
            <h1 id="product_name">{{ $product->name }}</h1>
            <h2>{{ $product->description }}</h2>
            <h5 id="price_product">{{ $product->price }} €</h5>


            <!-- Détails -->
            {{ $lastValue = '' }}

            <div class="wrapper_details">
                @foreach ($product->product_details as $value)
                <!-- referme la div quand on change de type de détails -->
                @if ($value->type_detail_product->name != $lastValue && !$loop->first)
            </div>
            @endif
            <!-- nom du détail -->
            @if ($value->type_detail_product->name != $lastValue)
            <div class="block_detail">
                <h4 id="nomDetail">{{ $lastValue = $value->type_detail_product->name }}</h4>
                <span id="{{ $value->type_detail_product->name }}" class="missingDetails">Ce champ est obligatoire</span>
                <script>
                    listDetailsToAddToCart("{!! $value->type_detail_product->name !!}");
                </script>
                @endif
                <!-- valeur du détail -->
                @if ($value->type_detail_product->name == $lastValue)
                <input type="radio" class="details radio_item" value="{{ $value->libelle }}" name="{{ $value->type_detail_product->name }}" id="{{ $value->libelle }}" required onclick="addDetailToCart(event)">
                <label class="label_item" for="{{ $value->libelle }}"> {{ $value->libelle }}</label>
                @endif
                <!-- referme la div quand on change de type de détails -->
                @if ($loop->last)
            </div>
            @endif
            @endforeach
        </div>

        <!-- Boutons pour la quantité -->
        <span id="quantityBuy">Quantité</span>
        <div class="nbArticles">
            <div class="wrapper_quantity">
                <button class="btn-quantity" onclick="dec_NbArticle(event), addQuantityToCart(event)" aria-label="Augmenter la quantité de l'article de un">-</button>

                <input type="text" maxlength="3" onkeypress="return event.charCode >= 48 && event.charCode <= 57" value="@if(isset($cartProduct['quantity'])) {{$cartProduct['quantity']}} @else 1 @endif" id="quantity" name="quantity" class="nbArticles_input" onchange="addQuantityToCart(event)">

                <button onclick="inc_NbArticle(event), addQuantityToCart(event)" aria-label="Réduire la quantité de l'article de un">+</button>
            </div>
        </div>

        <!-- gestion input quantity -->
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

        <button class="addToCart" id="addToCart" onclick="addCart(event)">Ajouter au panier</button>

        @dump(Session::all())

        <!------- The Modal_Cart warning double in cart ------->
        <div id="modal_double_in_cart" class="modal_cart">
            <!-- Modal_cart content -->
            <div class="modal-content_cart">
                <div class="modal-body_cart">
                    <h5 id="message_modal_cart"></h5>
                </div>
                <div class="btn_modal_cart">
                    <button onclick="updateQantityCart()">Oui</button>
                    <button onclick="goToCart()">Voir mon panier</button>
                    <button onclick="document.getElementById('modal_double_in_cart').style.display = 'none'">Annuler</button>
                </div>
            </div>
        </div>

        <!------- The Modal_Cart confirmation add in cart ------->
        <div id="modal_confirm_add_in_cart" class="modal_cart">
            <!-- Modal_cart content -->
            <div class="modal-content_confirm_cart">

                <div id="header_confirm_cart">
                    <h4>Votre produit a bien été ajouté au panier</h4>
                    <span class="close_modal_cart" onclick="closeModalCartAndReload()">&#10006;</span>
                </div>

                <figure id="figure_confirm_add_cart">
                    <img id="img_confirm_add_cart" src="{{ asset($product->images_products[0]->path) }}" alt="{{ $product->images_products[0]->alt }}">
                </figure>

                <div id="block_txt_confirm_add_cart">
                    <h2 id="confirm_message_modal_cart"></h2>
                    <span id="confirm_price_modal_cart"></span>
                    <button id="btn_confirm_add_cart" onclick="goToCart()">
                        ACCÉDER À MON PANIER
                    </button>
                    <span id="confirm_keep_buy_modal_vart" onclick="document.getElementById('modal_confirm_add_in_cart').style.display = 'none', location.reload();">
                        <i class="far fa-arrow-alt-circle-left"></i></i> Continuer mes achats </span>
                </div>


            </div>
        </div>

        <!-- handle addToCart -->
        <script>
            var formData = new FormData();
            var quantity_cart = document.getElementById('quantity').value;
            var product_id_cart = <?php echo json_encode($product->id); ?>;
            var alreadySaved = false;

            // renvoi vers le panier
            function goToCart() {
                document.location.href = 'http://127.0.0.1:8000/panier';
            }

            // modify quantity
            const addQuantityToCart = (e) => {
                e.preventDefault();
                quantity_cart = document.getElementById('quantity').value;
            }

            var detailsObj = {};
            // handle add details
            function addDetailToCart(e) {
                // ajoute dans detailsObj les détails et leur valeur
                detailsObj[e.target.name] = e.target.value;
                Object.entries(detailsObj).map(item => console.log(item));
                // masque le message d'erreur s'il y en avait un
                document.getElementById(e.target.name).style.display = "none"
            }

            // Envoi un message d'avertissement si on tente de mettre un produit déjà dans le panier avec les même détails.
            // si on confirme alors on augmente juste la quantité du produit déjà présent
            const messageDoubleInCart = (nameProdcut) => {
                var modalCart = document.getElementById("modal_double_in_cart");

                document.getElementById("message_modal_cart").innerText = "l'article " + nameProdcut + " est déjà dans votre panier avec les mêmes caractèristiques. Voulez-vous augmenter la quantité ?";
                modalCart.style.display = "block";
            }

            // message de confirmation d'ajout d'un produit dans le panier
            const confirmAddInCart = () => {
                var modalCart = document.getElementById("modal_confirm_add_in_cart");
                var nameProdcut = document.getElementById('product_name').innerHTML

                document.getElementById("confirm_message_modal_cart").innerText = nameProdcut;

                document.getElementById("confirm_price_modal_cart").innerText = document.getElementById("price_product").innerText;

                modalCart.style.display = "block";
            }

            // ferme la modal et recharge la page
            const closeModalCartAndReload = () => {
                document.getElementById("modal_confirm_add_in_cart").style.display = 'none';

                location.reload();
            }

            // Add to cart
            function addCart(e) {
                e.preventDefault();

                // vérifie si tous les détails sont bien dans detailsObj
                // details contient tous les noms des détails présent sur le produit
                var missingDetails = [];
                for (var x = 0; x < details.length; x++) {
                    if (!Object.keys(detailsObj).includes(details[x]))
                        missingDetails.push(details[x]);
                }
                if (missingDetails.length === 0) {
                    missingDetails.forEach(item => document.getElementById(item).style.display = "none");

                    detailsObj['product_id_cart'] = product_id_cart;
                    detailsObj['quantity'] = quantity_cart;
                    // transformation de l'objet en string JSON
                    var cart = JSON.stringify(detailsObj);


                    formData.append("cart", cart);

                    // check double in cart
                    var product_name = document.getElementById('product_name').innerHTML;
                    var cartSession = <?php echo json_encode(session()->get('cart')); ?>;
                    // si on a un cart dans la session alors on check s'il n'y a pas de doublon
                    if (cartSession) {
                        var productAlreadyInCart = [];
                        // extrait les mêmes produits que product_id_cart s'ils sont présent dans cartSession
                        cartSession.forEach(item => {
                            if (item.product_id_cart === product_id_cart) {
                                productAlreadyInCart.push(item);
                            }
                        });

                        let countDetails = 0;
                        // check si le produit est déjà dans le panier avec les mêmes caractèristiques
                        if (productAlreadyInCart.length) {
                            productAlreadyInCart.forEach(item => {

                                Object.entries(detailsObj).map(detail => {

                                    if (!['product_id_cart', 'quantity'].includes(detail[0]) && item[detail[0]] == detail[1]) {
                                        console.log(item[detail[0]], detail[1]);
                                        countDetails++;
                                    }
                                });
                            });

                            // details contient la liste de tous les détails
                            // si on a le même produit avec les mêmes détails alors warning !!!
                            if (countDetails === details.length) {
                                alreadySaved = true;
                                messageDoubleInCart(product_name);
                            }

                            // si on a le même produit mais pas avec les mêmes détails alors save
                            if (countDetails != details.length && !alreadySaved) {
                                console.log('on a le même produit mais pas avec les mêmes détails');
                                save();
                            }

                        } else {
                            // si le produit n'est pas du tout dans le panier
                            console.log('le produit n\'est pas du tout dans le panier');
                            save();
                        }


                    } else {
                        // s'il n'y a pas de session alors on save directement
                        save();
                        console.log('s\'il n\'y a pas de session alors on save directement');
                    }
                } else {
                    missingDetails.forEach(item => document.getElementById(item).style.display = "block");
                }
            };


            // save in cart
            function save() {
                axios.post(`http://127.0.0.1:8000/carts`, formData)
                    .then(res => {
                        console.log('res.data  --->  ok save');
                        alreadySaved = true;
                        confirmAddInCart();

                    }).catch(function(error) {
                        console.log('error:   ' + error);
                    });
            };

            // si dans le warning "indiquant "produit en double dans le panier" on clique sur oui pour sauvegarder alors on additionne juste la quantité du produit avec celle demandée dans la productSheet
            function updateQantityCart() {
                // ferme d'abord la fenêtre warning duplicata
                document.getElementById('modal_double_in_cart').style.display = 'none'

                var cartSession = <?php echo json_encode(session()->get('cart')); ?>;
                cartSession.forEach(item => {
                    if (item.product_id_cart == product_id_cart) {
                        item.quantity = parseInt(item.quantity) + parseInt(quantity_cart);
                        console.log(item.quantity, item.product_id_cart);

                        // transformation de l'objet en string JSON
                        var cart = JSON.stringify(cartSession);

                        var formData = new FormData();
                        formData.append("cart", cart);

                        axios.post(`http://127.0.0.1:8000/cartUpdate`, formData)
                            .then(res => {
                                console.log('res.data  --->  ok cartUpdate');
                                confirmAddInCart();
                            }).catch(function(error) {
                                console.log('error:   ' + error);
                            });
                    }
                });
                alreadySaved = true;
            };
        </script>


    </div>
</div>

<!-- fiche technique -->
<div class="technical_sheet">
    {!! $product->product_sheet->text !!}
</div>

<!-- Promo -->
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

@include('front-end.review')

<div class="lesClientAyantAcheté">
    <p>LES CLIENTS AYANT ACHETÉ CET ARTICLE ONT ÉGALEMENT ACHETÉ</p>
</div>

@endsection