<script src="https://js.stripe.com/v3/"></script>

<div class="payment_wrapper_register">

    <!-- reCaptch v3 -->
    {!! htmlScriptTagJsApi([
    'action' => 'register',
    'callback_then' => 'callbackThen',
    'callback_catch' => 'callbackCatch'
    ]) !!}

    <!-- IMPORTANT!!! remember CSRF token -->
    <meta name="csrf-token" content="{{ csrf_token() }}">

    <script type="text/javascript">
        function callbackThen(response) {
            // read HTTP status
            console.log(response.status);

            // read Promise object
            response.json().then(function(data) {
                console.log(data);
            });
        }

        function callbackCatch(error) {
            console.error('Error:', error)
        }
    </script>

    <x-slot name="logo">
        <a href="/">
            <x-application-logo />
        </a>
    </x-slot>

    <!-- Validation Errors -->
    <x-auth-validation-errors :errors="$errors" style="color:red;" />

    <form method="POST" action="{{ route('register') }}" class="auth" autocomplete="on" id="form_payment">
        @csrf

        <div class="ariane_payment">
            <a href="/panier" id="ariane_panier">Panier</a>
            <i class="fas fa-chevron-right"></i>
            <span id="ariane_information">Informations</span>
            <i class="fas fa-chevron-right"></i>
            <span id="ariane_shipping">Livraison</span>
            <i class="fas fa-chevron-right"></i>
            <span id="ariane_payment">Paiement</span>
        </div>

        <div id="information_block">
            <div class="register_title">
                <h2>Coordonnées</h2>
                <div class="alreadyAccount">
                    <span>Vous avez déjà un compte ?</span>
                    <a href="{{ route('login') }}">
                        Ouvrir une session
                    </a>
                </div>
            </div>

            <!-- Email Address -->
            <div class="input-container" id="email_container">
                <x-input id="email" class="missingField" type="email" name="email" :value="old('email')" autocomplete="on" onfocusout="validateForm()" required maxlength="255" />
                <label for="email">Adresse e-mail*</label>
                <span id="email_" class="missingFieldMessage missingMargin">Entrez une adresse e-mail valide</span>
            </div>


            <div class="register_title">
                <h2>Adresse de livraison</h2>
            </div>

            <!-- Name -->
            <div class="register_block_name">
                <div class="input-container input-container_half">
                    <x-input id="first_name" class="missingField" type="text" name="first_name" :value="old('first_name')" required autocomplete="on" onfocusout="validateForm()" maxlength="255" />
                    <label for="first_name">Votre prénom*</label>
                    <span id="first_name_" class="missingFieldMessage missingMargin">Entrez un prénom</span>
                </div>

                <div class="input-container input-container_half">
                    <x-input id="last_name" class="missingField" type="text" name="last_name" :value="old('last_name')" required autocomplete="on" onfocusout="validateForm()" maxlength="255" />
                    <label for="last_name">Votre nom*</label>
                    <span id="last_name_" class="missingFieldMessage missingMargin">Entrez un nom</span>
                </div>
            </div>

            <!-- Adresse -->
            <div class="input-container">
                <select name="country" id="country" :value="old('country')" class="classic missingField" autocomplete="on" onfocusout="validateForm()" required>
                    <option value="" disabled selected></option>
                    <option value="France">France</option>
                    <option value="Belgique">Belgique</option>
                    <option value="Suisse">Suisse</option>
                    <option value="Canada">Canada</option>
                    <option value="---" disabled>---</option>
                    @foreach($countries as $country)
                    <option value="{{ $country->name_fr }}">{{ $country->name_fr }}</option>
                    @endforeach
                </select>
                <label for="country">Pays*</label>
                <span id="country_" class="missingFieldMessage missingMargin">Entrez un pays</span>
            </div>

            <div class="input-container">
                <x-input id="address" class="missingField" type="text" name="address" :value="old('address')" required autocomplete="on" onfocusout="validateForm()" maxlength="500" />
                <label for="address">Adresse*</label>
                <span id="address_" class="missingFieldMessage missingMargin">Entrez une adresse</span>
            </div>

            <div class="input-container">
                <x-input id="addressComment" type="text" name="addressComment" :value="old('addressComment')" required="false" autocomplete="on" maxlength="255" />
                <label for="addressComment">Complément d'adresse (facultatif)</label>
            </div>


            <!-- Cp & Ville -->
            <div class="register_block_cp_city">
                <div class="input-container input-container_half">
                    <x-input id="cp" class="missingField" type="number" name="cp" :value="old('cp')" autocomplete="on" required onfocusout="validateForm()" maxlength="25" />
                    <label for="cp">Code postal*</label>
                    <span id="cp_" class="missingFieldMessage missingMargin">Entrez un code postal</span>
                </div>
                <div class="input-container input-container_half">
                    <x-input id="city" class="missingField" type="text" name="city" :value="old('city')" autocomplete="on" required onfocusout=" validateForm()" maxlength="100" />
                    <label for="city">Ville*</label>
                    <span id="city_" class="missingFieldMessage missingMargin">Entrez une ville</span>
                </div>
            </div>


            <!-- phone -->
            <div class="input-container phone">
                <x-input id="phone" class="auth_input_phone" type="text" name="phone" :value="old('phone')" required="false" autocomplete="on" maxlength="50" />

                <div class="icon_question">
                    <i class="fas fa-question-circle tooltip">
                        <span class="tooltiptext">Au cas où nous aurions besoin de vous contacter à propos de votre commande</span>
                    </i>
                </div>
                <label for="phone">Téléphone (facultatif)</label>
            </div>

            <!-- conserve -->
            <div class="conserve">
                <input type="checkbox" id="conserve" name="conserve" :value="old('conserve')" value="conserve">
                <label for="conserve" id="label_conserve">Sauvegarder mes coordonnées pour la prochaine fois</label>

                <!-- <label for="rgpd" id="label_rgpd"> En créant mon compte, je certifie avoir 15 ans ou plus, et avoir pris connaissance de <a href="{{ route('cu') }}">notre Politique de données personnelles*</a></label> -->
            </div>

        </div>

        <!-- shipping -->
        <div id="shipping_block">

            <h2>Vos informations</h2>
            <div class="control_coordonees">
                <div class="contact_control">
                    <span>Contact </span>
                    <span id="contact_control"></span>
                    <h6 class="go_to_information">Modifier</h6>
                </div>

                <div class="adress_control">
                    <span>Expédier à </span>
                    <span id="adress_control"></span>
                    <h6 class="go_to_information">Modifier</h6>
                </div>
            </div>

            <h2>Mode d'expédition</h2>
            <div class="mode_expedition">
                <div class="standard_ship">
                    <input type="radio" name="mode_shipping" id="standard_ship" value="standard" checked onchange="get_mode_shipping('Standard'), get_shipping_price('Gratuit');">
                    <label for="standard_ship">Livraison Standard </label>
                    <h6>Gratuit</h6>
                </div>

                <div class="secure_ship">
                    <input type="radio" name="mode_shipping" id="secure_ship" value="secure" onchange="get_mode_shipping('Livraison Sécurisée - Perte/Vol/Casse · 4,99 €'), get_shipping_price(4.99);">
                    <label for="secure_ship">Livraison Sécurisée - Perte/Vol/Casse </label>
                    <h6>4,99 €</h6>
                </div>
            </div>

        </div>


        <!-- payment -->
        <div id="payment_block">
            <h2>Vos informations</h2>
            <div class="control_coordonees">
                <div class="contact_control">
                    <span>Contact </span>
                    <span id="contact_control_payment"></span>
                    <h6 class="go_to_information">Modifier</h6>
                </div>

                <div class="adress_control">
                    <span>Expédier à </span>
                    <span id="adress_control_payment"></span>
                    <h6 class="go_to_information">Modifier</h6>
                </div>

                <div class="mode_shipping_control">
                    <span>Type d'expédition </span>
                    <span id="shipping_control"></span>
                    <h6 class="go_to_shipping">Modifier</h6>
                </div>
            </div>

            <!-- stripe elements --------------------------------------------->
            <div class="stripe_wrapper">
                <div id="header_stripe">
                    <h2>Carte de crédit</h2>
                    <div class="icon_cards">
                        <img src="{{ asset('images/card/visa.png') }}" alt="Carte de crédit visa">
                        <img src="{{ asset('images/card/master card.png') }}" alt="Carte de crédit master card">
                        <img src="{{ asset('images/card/amex.png') }}" alt="Carte de crédit american express">
                    </div>
                </div>
                <div class="input-container block_stripe">
                    <x-input id="cardName" type="text" name="cardName" required autocomplete="off" placeholder="Nom sur la carte" style="padding: 0 0 0 40px;" />
                    <!-- <label for="cardName">Nom sur la carte </label> -->
                    <input type="hidden" name="payment_method" id="payment_method" />
                    <div id="card-element"></div>
                </div>
            </div>
            <!-- ---------------------------------------------------------- -->

            <h2 id="Adresse_de_facturation">Adresse de facturation</h2>
            <p>Sélectionnez l'adresse qui correspond à votre carte ou à votre moyen de paiement.</p>
            <div class="adresse_facturation">
                <div class="idem_address">
                    <input type="radio" name="address_bill" id="address_idem_ship" value="idem" checked onclick="hide_bill_block(),                 removeAllFieldsFormBill();">
                    <label for="address_idem_ship"> Identique à l'adresse de livraison </label>
                </div>

                <div class="different_address">
                    <input type="radio" name="address_bill" id="address_different_ship" value="different" onclick="show_bill_block();">
                    <label for="address_different_ship">Utiliser une adresse de facturation différente </label>
                </div>
            </div>

        </div>


        <!-- Adresse de facturation -->
        <div id="bill_block">
            <!-- Name -->
            <div class="register_block_name">
                <div class="input-container input-container_half">
                    <x-input id="first_nameBill" class="missingFieldBill" type="text" name="first_nameBill" :value="old('first_nameBill')" required autocomplete="on" onfocusout="validateFormBill()" />
                    <label for="first_nameBill">Votre prénom*</label>
                    <span id="first_nameBill_" class="missingFieldMessage missingMargin">Entrez un prénom</span>
                </div>

                <div class="input-container input-container_half">
                    <x-input id="last_nameBill" class="missingFieldBill" type="text" name="last_nameBill" :value="old('last_nameBill')" required autocomplete="on" onfocusout="validateFormBill()" />
                    <label for="last_nameBill">Votre nom*</label>
                    <span id="last_nameBill_" class="missingFieldMessage missingMargin">Entrez un nom</span>
                </div>
            </div>
            <!-- Adresse -->
            <div class="input-container">
                <select name="countryBill" class="missingFieldBill" id="countryBill" :value="old('countryBill')" class="classic" autocomplete="on" required onfocusout="validateFormBill()">
                    <option value="" disabled selected></option>
                    <option value="France">France</option>
                    <option value="Belgique">Belgique</option>
                    <option value="Suisse">Suisse</option>
                    <option value="Canada">Canada</option>
                    <option value="---" disabled>---</option>
                    @foreach($countries as $country)
                    <option value="{{ $country->name_fr }}">{{ $country->name_fr }}</option>
                    @endforeach
                </select>
                <label for="email">Pays*</label>
                <span id="countryBill_" class="missingFieldMessage missingMargin">Entrez un pays</span>
            </div>

            <div class="input-container">
                <x-input id="addressBill" class="missingFieldBill" type="text" name="addressBill" :value="old('addressBill')" required autocomplete="on" onfocusout="validateFormBill()" />
                <label for="addressBill">Adresse*</label>
                <span id="addressBill_" class="missingFieldMessage missingMargin">Entrez une adresse</span>
            </div>

            <div class="input-container">
                <x-input id="addressCommentBill" type="text" name="addressCommentBill" :value="old('addressCommentBill')" required="false" autocomplete="on" onfocusout="validateFormBill()" />
                <label for="addressCommentBill">Complément d'adresse (facultatif)</label>
            </div>


            <!-- Cp & Ville -->
            <div class="register_block_cp_city">
                <div class="input-container input-container_half">
                    <x-input id="cpBill" class="missingFieldBill" type="number" name="cpBill" :value="old('cpBill')" autocomplete="on" required onfocusout="validateFormBill()" />
                    <label for="cpBill">Code postal*</label>
                    <span id="cpBill_" class="missingFieldMessage missingMargin">Entrez un code postal</span>
                </div>
                <div class="input-container input-container_half">
                    <x-input id="cityBill" class="missingFieldBill" type="text" name="cityBill" :value="old('cityBill')" autocomplete="on" required="false" onfocusout="validateFormBill()" />
                    <label for="cityBill">Ville*</label>
                    <span id="cityBill_" class="missingFieldMessage missingMargin">Entrez une ville</span>
                </div>
            </div>
        </div>

        <script>
            // state_bill_block sert à conserver l'état du bill_block lorsqu'on revient en arrière vers l'expédition dans le formulaire de paiement
            var state_bill_block = 'hide';

            function show_bill_block() {
                state_bill_block = 'show';
                document.getElementById('bill_block').style.display = 'block';
            }

            function hide_bill_block() {
                state_bill_block = 'hide';
                document.getElementById('bill_block').style.display = 'none';
            }
        </script>


        <!-- Button to next -->
        <div class="auth_footer">
            <button id="authRegisterSubmit" onclick="changePage(), get_shipping_price_realTime();">
                Continuer vers l'expédition
            </button>

            <input type="submit" value="Envoyer" id="submit-button">

            <!-- link to previous page in checkout -->
            <a href="/panier" class="payment_link" id="go_to_panier">Retour au panier</a>
            <span class="payment_link go_to_information" id="go_to_information">Revenir aux informations</span>
            <span class="payment_link go_to_shipping" id="go_to_shipping">Revenir à l'expédition</span>
        </div>

        <!-- Stripe block -->
        <script>
            const stripe = Stripe(" {{ env('STRIPE_KEY') }} ");

            const elements = stripe.elements();

            const cardElement = elements.create('card', {
                style: {
                    base: {
                        iconColor: '#c4f0ff',
                        color: '#7e7e7e',
                        fontWeight: 'normal',
                        fontFamily: 'Roboto, Open Sans, Segoe UI, sans-serif',
                        fontSize: '16px',
                        fontSmoothing: 'antialiased',
                        ':-webkit-autofill': {
                            color: '#7e7e7e',
                        },
                        '::placeholder': {
                            color: '#7e7e7e',
                        },
                    },
                    invalid: {
                        iconColor: 'red',
                        color: '#7e7e7e',
                    },
                },
            });

            cardElement.mount('#card-element');

            const cardButton = document.getElementById('submit-button');

            cardButton.addEventListener('click', async (e) => {
                e.preventDefault();

                const {
                    paymentMethod,
                    error
                } = await stripe.createPaymentMethod('card', cardElement);

                if (error) {
                    console.log(error);
                } else {
                    document.getElementById('payment_method').value = paymentMethod.id;
                }


                // validation des champs de addressBill
                validateFormBill();

                if (!unvalidBill) {
                    document.getElementById('form_payment').submit();
                }

            })
        </script>


        <script>
            var page = 'livraison';
            var unvalid = true;
            var unvalidBill = true;
            var modeShipping = '';
            var informationsIsValid = false;
            var shippingIsValid = false;
            var paymentIsValid = false;

            // show link to cart
            document.getElementById('go_to_panier').style.display = 'inline-block';

            // <-- breadcrumb -->
            var ariane_information = document.getElementById('ariane_information');
            var ariane_shipping = document.getElementById('ariane_shipping');
            var ariane_payment = document.getElementById('ariane_payment');

            // <-- breadcrumb initialisation fontWeight bold "Informations" -->
            ariane_information.style.color = '#000';
            ariane_information.style.fontWeight = 'bold';

            // link to page "information"
            var goto_information = document.getElementsByClassName('go_to_information');
            for (let i = 0; i < goto_information.length; i++) {
                goto_information[i].addEventListener('click', function() {
                    page = 'information';
                    document.getElementById('bill_block').style.display = 'none';
                    document.getElementById('submit-button').style.display = 'none';
                    document.getElementById('authRegisterSubmit').style.display = 'block';
                    // réinitialise CalculeALEtapeSuivante pour afficher 'Calculé à l\'étape suivante' pour le prix de livraison
                    CalculeALEtapeSuivante();
                    changePage();
                })
            }

            // link to page "shipping"
            var goto_shipping = document.getElementsByClassName('go_to_shipping');
            for (let i = 0; i < goto_shipping.length; i++) {
                goto_shipping[i].addEventListener('click', function() {
                    page = 'livraison';
                    document.getElementById('bill_block').style.display = 'none';
                    document.getElementById('submit-button').style.display = 'none';
                    document.getElementById('authRegisterSubmit').style.display = 'block';
                    changePage();
                })
            }

            // link to page "payment"
            var goto_payment = document.getElementsByClassName('goto_payment');
            for (let i = 0; i < goto_payment.length; i++) {
                goto_payment[i].addEventListener('click', function() {
                    page = 'payment';
                    document.getElementById('bill_block').style.display = 'none';
                    changePage();
                })
            }

            // assigne le mode de livraison choisi  
            var mode_shipping = document.getElementsByName('mode_shipping');
            for (let i = 0; i < mode_shipping.length; i++) {
                if (mode_shipping[i].checked) {
                    modeShipping = mode_shipping[i].value;
                }
            }

            // assigne le mode de livraison choisi  
            function get_mode_shipping(modeShippingSlected) {
                modeShipping = modeShippingSlected;
            }

            // navigue à travers les pages du formulaire de paiement
            function changePage() {
                event.preventDefault();

                validateForm();

                if (!unvalid) {
                    // hide all link to previous page
                    var links = document.getElementsByClassName('payment_link');
                    for (let i = 0; i < links.length; i++) {
                        links[i].style.display = 'none';
                    }
                }

                // récupère toutes les données pour les afficher dans "le cadre Vos informations" et pour les submit dans un formData
                var first_name_data = document.getElementById('first_name').value;
                var last_name_data = document.getElementById('last_name').value;
                var email_data = document.getElementById('email').value;
                var address_data = document.getElementById('address').value;
                var addressComment_data = document.getElementById('addressComment').value;
                var cp_data = document.getElementById('cp').value;
                var city_data = document.getElementById('city').value;
                var country_data = document.getElementById('country').value;

                var address = address_data + ' ' + addressComment_data + ' ' + cp_data + ' ' + city_data + ' ' + country_data;

                var formData = new FormData();
                formData.append("first_name", first_name_data);
                formData.append("last_name", last_name_data);
                formData.append("email", email_data);
                formData.append("address", address_data);
                formData.append("addressComment", addressComment_data);
                formData.append("cp", cp_data);
                formData.append("city", city_data);
                formData.append("country", country_data);


                if (!unvalid) {
                    var information_block = document.getElementById('information_block');
                    var shipping_block = document.getElementById('shipping_block');
                    var payment_block = document.getElementById('payment_block');
                    var submit_button = document.getElementById('submit-button');
                    var authRegisterSubmit = document.getElementById('authRegisterSubmit');
                    var contact_control = document.getElementById('contact_control');
                    var adress_control = document.getElementById('adress_control');
                    var contact_control_payment = document.getElementById('contact_control_payment').innerHTML = email_data;
                    var adress_control_payment = document.getElementById('adress_control_payment')
                    var shipping_control = document.getElementById('shipping_control');
                    var card_element = document.getElementById('card-element');

                    switch (page) {
                        case 'information':
                            hide_bill_block();

                            information_block.style.display = 'inline-block';
                            shipping_block.style.display = 'none';
                            payment_block.style.display = 'none';
                            submit_button.style.display = 'none';
                            authRegisterSubmit.style.display = 'block';
                            authRegisterSubmit.innerHTML = 'Continuer vers l\'expédition';
                            go_to_panier.style.display = 'inline-block';

                            // <-- breadcrumb -->
                            ariane_information.style.color = '#000';
                            ariane_information.style.fontWeight = 'bold';
                            ariane_information.onclick = null;
                            ariane_information.addEventListener("mousemove", function() {
                                ariane_information.style.cursor = 'text';
                            });

                            // affiche "Calculé à l'étape suivante" dans le décompte du panier
                            CalculeALEtapeSuivante();

                            // si les informations ont déjà été validées au moins une fois alors le breadcrum ariane_shipping doit être activé sinon non
                            if (informationsIsValid) {
                                ariane_shipping.style.color = '#bb1e0c';
                                ariane_shipping.style.fontWeight = 'normal';
                                ariane_shipping.onclick = function() {
                                    page = 'livraison';
                                    changePage();
                                }
                                ariane_shipping.addEventListener("mousemove", function() {
                                    ariane_shipping.style.cursor = 'pointer';
                                });
                            } else {
                                ariane_shipping.style.color = '#000';
                                ariane_shipping.style.fontWeight = 'normal';
                                ariane_shipping.onclick = null;
                                ariane_shipping.addEventListener("mousemove", function() {
                                    ariane_shipping.style.cursor = 'text';
                                });
                            }

                            // activation du lien paiement vers payment si étape précédente validée au moins une fois
                            if (paymentIsValid) {
                                ariane_payment.style.color = '#bb1e0c';
                                ariane_payment.style.fontWeight = 'normal';
                                ariane_payment.onclick = function() {
                                    page = 'payment';
                                    changePage();
                                }
                                ariane_payment.addEventListener("mousemove", function() {
                                    ariane_payment.style.cursor = 'pointer';
                                });
                            } else {
                                ariane_payment.style.color = '#000';
                                ariane_payment.style.fontWeight = 'normal';
                                ariane_payment.onclick = null;
                                ariane_payment.addEventListener("mousemove", function() {
                                    ariane_payment.style.cursor = 'text';
                                });
                            }

                            page = 'livraison';
                            break;
                        case 'livraison':
                            hide_bill_block();

                            informationsIsValid = true;
                            information_block.style.display = 'none';
                            payment_block.style.display = 'none';
                            shipping_block.style.display = 'inline-block';
                            authRegisterSubmit.innerHTML = 'Continuer vers le paiement';
                            authRegisterSubmit.style.display = 'block';
                            submit_button.style.display = 'none';
                            go_to_information.style.display = 'inline-block';
                            contact_control.innerHTML = email_data;
                            adress_control.innerHTML = address;
                            page = 'payment';

                            // affiche le prix du transport dans le décompte du panier
                            get_shipping_price_realTime();

                            // <-- breadcrumb -->
                            ariane_information.style.color = '#bb1e0c';
                            ariane_information.style.fontWeight = 'normal';
                            ariane_information.onclick = function() {
                                page = 'information';
                                changePage();
                            }
                            ariane_information.addEventListener("mousemove", function() {
                                ariane_information.style.cursor = 'pointer';
                            });

                            ariane_shipping.style.color = '#000';
                            ariane_shipping.style.fontWeight = 'bold';
                            ariane_shipping.onclick = null;
                            ariane_shipping.addEventListener("mousemove", function() {
                                ariane_shipping.style.cursor = 'text';
                            });

                            // si lle shipping a été validé alors payment doit être activé lorsqu'on revient vers les précétdentes pages  pcq tous ce qui menait à payment a été validé
                            if (shippingIsValid) {
                                ariane_payment.style.color = '#bb1e0c';
                                ariane_payment.style.fontWeight = 'normal';
                                ariane_payment.onclick = function() {
                                    page = 'payment';
                                    changePage();
                                }
                                ariane_payment.addEventListener("mousemove", function() {
                                    ariane_payment.style.cursor = 'pointer';
                                });
                            } else {
                                ariane_payment.style.color = '#000';
                                ariane_payment.style.fontWeight = 'normal';
                                ariane_payment.onclick = null;
                                ariane_payment.addEventListener("mousemove", function() {
                                    ariane_payment.style.cursor = 'text';
                                });
                            }

                            break;
                        case 'payment':
                            if (document.getElementById('address_different_ship').checked) {
                                show_bill_block();
                            }
                            shippingIsValid = true;
                            paymentIsValid = true;
                            information_block.style.display = 'none';
                            shipping_block.style.display = 'none';
                            payment_block.style.display = 'inline-block';
                            authRegisterSubmit.style.display = 'none';
                            go_to_shipping.style.display = 'inline-block';
                            contact_control_payment.innerHTML = email_data;
                            adress_control_payment.innerHTML = address;
                            shipping_control.innerHTML = modeShipping;
                            card_element.style.display = 'block';
                            submit_button.style.display = 'block';
                            submit_button.innerHTML = 'Payer maintenant';

                            // state_bill_block sert à conserver l'état du bill_block lorsqu'on revient en arrière vers l'expédition dans le formulaire de paiement
                            if (state_bill_block == 'show') show_bill_block();
                            if (state_bill_block == 'hide') hide_bill_block();


                            // affiche le prix du transport dans le décompte du panier
                            get_shipping_price_realTime();

                            // <-- breadcrumb -->
                            ariane_information.style.color = '#bb1e0c';
                            ariane_information.style.fontWeight = 'normal';
                            ariane_information.onclick = function() {
                                page = 'information';
                                changePage();
                            }
                            ariane_information.addEventListener("mousemove", function() {
                                ariane_information.style.cursor = 'pointer';
                            });
                            // on active le lien vers shipping puisqu'il a été validé précédement
                            ariane_shipping.style.color = '#bb1e0c';
                            ariane_shipping.style.fontWeight = 'normal';
                            ariane_shipping.onclick = function() {
                                page = 'livraison';
                                changePage();
                            }
                            ariane_shipping.addEventListener("mousemove", function() {
                                ariane_shipping.style.cursor = 'pointer';
                            });

                            ariane_payment.style.color = '#000';
                            ariane_payment.style.fontWeight = 'bold';
                            ariane_payment.onclick = null;
                            ariane_payment.addEventListener("mousemove", function() {
                                ariane_payment.style.cursor = 'text';
                            });

                            break;
                        default:
                            information_block.style.display = 'block';
                            shipping_block.style.display = 'none';
                    }
                }
            }


            // check si tous les champs sont remplis et si l'adresse email est valide
            function validateForm() {
                var missingCount = 0;
                var missingFields = document.getElementsByClassName('missingField');
                for (let i = 0; i < missingFields.length; i++) {
                    if (missingFields[i].value.length == 0) {
                        document.getElementById(missingFields[i].id + '_').style.display = 'block';
                        missingCount++;
                        unvalid = true;
                    }
                    if (missingCount === 0) {
                        document.getElementById(missingFields[i].id + '_').style.display = 'none';
                        unvalid = false;
                    }
                }
                if (missingCount === 0) {
                    var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
                    var email = document.getElementById('email').value;
                    console.log(email);
                    if (email.match(mailformat)) {
                        unvalid = false;
                    } else {
                        document.getElementById('email_').style.display = 'block';
                        unvalid = true;
                    }

                }
            }

            // check si tous les champs de l'adresse de facturation sont remplis
            function validateFormBill() {
                var missingCount = 0;
                var missingFields = document.getElementsByClassName('missingFieldBill');
                for (let i = 0; i < missingFields.length; i++) {
                    if (missingFields[i].value.length == 0) {
                        document.getElementById(missingFields[i].id + '_').style.display = 'block';
                        missingCount++;
                        unvalidBill = true;
                    }
                    if (missingCount === 0) {
                        document.getElementById(missingFields[i].id + '_').style.display = 'none';
                        unvalidBill = false;
                    }
                }
            }

            // efface les champs de "adresse de facturation"
            function removeAllFieldsFormBill() {
                var missingFields = document.getElementsByClassName('missingFieldBill');
                for (let i = 0; i < missingFields.length; i++) {
                    missingFields[i].value = null
                }
                document.getElementById('addressCommentBill').value = null;
            }
        </script>

    </form>

</div>



<!-- ------------------------------------------------------------------ -->


<!-- ------------------------------------------------------------ -->

<!-- Password -->
<!-- <x-input id="password" class="auth_input" type="password" name="password" required autocomplete="new-password" placeholder="Mot de passe* (min 8 caractères)" /> -->

<!-- Confirm Password -->
<!-- <x-input id="password_confirmation" class="auth_input" type="password" name="password_confirmation" autocomplete="on" required placeholder="Confirmer mot de passe*" /> -->

<!-- Civilité -->
<!-- <div class="register_block_civilite">
            <div>
                <input type="radio" id="madame" name="civilite" :value="old('civilite')" value="f">
                <label for="madame" style="margin-right: 20px;">Madame</label>
            </div>

            <div>
                <input type="radio" id="monsieur" name="civilite" :value="old('civilite')" value="m">
                <label for="monsieur">Monsieur</label>
            </div>
            </div> -->