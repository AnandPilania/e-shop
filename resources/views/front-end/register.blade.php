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

    <form method="POST" action="{{ route('register') }}" class="auth" autocomplete="on">
        @csrf

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

            <!-- Name -->
            <div class="register_block_name">
                <div class="input-container input-container_half">
                    <x-input id="first_name" class="missingField" type="text" name="first_name" :value="old('first_name')" required autocomplete="on" onclick="this.style.border = 'none';" onfocusout="waitFade(), validateForm()" maxlength="255" />
                    <label for="first_name">Votre prénom*</label>
                    <span id="first_name_" class="missingFieldMessage missingMargin">Entrez un prénom</span>
                </div>

                <div class="input-container input-container_half">
                    <x-input id="last_name" class="missingField" type="text" name="last_name" :value="old('last_name')" required autocomplete="on" onclick="this.style.border = 'none';" onfocusout="waitFade(), validateForm()" maxlength="255" />
                    <label for="last_name">Votre nom*</label>
                    <span id="last_name_" class="missingFieldMessage missingMargin">Entrez un nom</span>
                </div>
            </div>

            <!-- Email Address -->
            <div class="input-container">
                <x-input id="email" class="missingField" type="email" name="email" :value="old('email')" autocomplete="on" onclick="this.style.border = 'none';" onfocusout="waitFade(), validateForm()" required maxlength="255" />
                <label for="email">Adresse e-mail*</label>
                <span id="email_" class="missingFieldMessage missingMargin">Entrez une adresse e-mail valide</span>
            </div>


            <div class="register_title">
                <h2>Adresse de livraison</h2>
            </div>

            <!-- Adresse -->
            <div class="input-container">
                <select name="country" id="country" :value="old('country')" class="classic missingField" autocomplete="on" onclick="this.style.border = 'none';" onfocusout="waitFade(), validateForm()" required>
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
                <x-input id="address" class="missingField" type="text" name="address" :value="old('address')" required autocomplete="on" onclick="this.style.border = 'none';" onfocusout="waitFade(), validateForm()" maxlength="500" />
                <label for="address">Adresse*</label>
                <span id="address_" class="missingFieldMessage missingMargin">Entrez une adresse</span>
            </div>

            <div class="input-container">
                <x-input id="addressComment" type="text" name="addressComment" :value="old('addressComment')" required="false" autocomplete="on" onclick="this.style.border = 'none';" onfocusout="waitFade()" maxlength="255" />
                <label for="addressComment">Complément d'adresse (facultatif)</label>
            </div>


            <!-- Cp & Ville -->
            <div class="register_block_cp_city">
                <div class="input-container input-container_half">
                    <x-input id="cp" class="missingField" type="number" name="cp" :value="old('cp')" autocomplete="on" required onclick="this.style.border = 'none';" onfocusout="waitFade(), validateForm()" maxlength="25" />
                    <label for="cp">Code postal*</label>
                    <span id="cp_" class="missingFieldMessage missingMargin">Entrez un code postal</span>
                </div>
                <div class="input-container input-container_half">
                    <x-input id="city" class="missingField" type="text" name="city" :value="old('city')" autocomplete="on" required onclick="this.style.border = 'none';" onfocusout="waitFade(), validateForm()" maxlength="100" />
                    <label for="city">Ville*</label>
                    <span id="city_" class="missingFieldMessage missingMargin">Entrez une ville</span>
                </div>
            </div>


            <!-- phone -->
            <div class="input-container phone">
                <x-input id="phone" class="auth_input_phone" type="text" name="phone" :value="old('phone')" required="false" autocomplete="on" onclick="this.style.border = 'none';" onfocusout="waitFade()" maxlength="50" />

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

        <!-- gère la réapparition des bordures des inputs après l'animation des labels -->
        <script>
            var evnt = null;

            function waitFade() {
                event.target.style.border = 'none';
                evnt = event;
                setTimeout(borderFade, 350);
            }

            function borderFade() {
                evnt.target.style.border = 'solid 1px rgb(196, 196, 196)';
                console.log(evnt.target);
            }
        </script>

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
        </div>

        <!-- <div id="bill_block"> -->
        <!-- Name -->
        <!-- <div class="register_block_name">
                <div class="input-container input-container_half">
                    <x-input id="first_nameBill" type="text" name="first_nameBill" :value="old('first_nameBill')" required autocomplete="on" onclick="this.style.border = 'none';" onfocusout="waitFade()" />
                    <label for="first_nameBill">Votre prénom*</label>
                </div>

                <div class="input-container input-container_half">
                    <x-input id="last_nameBill" type="text" name="last_nameBill" :value="old('last_nameBill')" required autocomplete="on" onclick="this.style.border = 'none';" onfocusout="waitFade()" />
                    <label for="last_nameBill">Votre nom*</label>
                </div>
            </div>

            <div class="register_title">
                <h2>Adresse de facturation</h2>
            </div> -->

        <!-- Adresse -->
        <!-- <div class="input-container">
                <select name="countryBill" id="countryBill" :value="old('countryBill')" class="classic" autocomplete="on" onclick="this.style.border = 'none';" onfocusout="waitFade()" required>
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
            </div>

            <div class="input-container">
                <x-input id="addressBill" type="text" name="addressBill" :value="old('addressBill')" required autocomplete="on" onclick="this.style.border = 'none';" onfocusout="waitFade()" />
                <label for="addressBill">Adresse*</label>
            </div>

            <div class="input-container">
                <x-input id="addressCommentBill" type="text" name="addressCommentBill" :value="old('addressCommentBill')" required="false" autocomplete="on" onclick="this.style.border = 'none';" onfocusout="waitFade()" />
                <label for="addressCommentBill">Complément d'adresse (facultatif)</label>
            </div> -->


        <!-- Cp & Ville -->
        <!-- <div class="register_block_cp_city">
                <div class="input-container input-container_half">
                    <x-input id="cpBill" type="text" name="cpBill" :value="old('cpBill')" autocomplete="on" required onclick="this.style.border = 'none';" onfocusout="waitFade()" />
                    <label for="cpBill">Code postal*</label>
                </div>
                <div class="input-container input-container_half">
                    <x-input id="cityBill" type="number" name="cityBill" :value="old('cityBill')" autocomplete="on" required="false" onclick="this.style.border = 'none';" onfocusout="waitFade()" />
                    <label for="cityBill">Ville*</label>
                </div>
            </div>
        </div> -->




        <div class="auth_footer">
            <button id="authRegisterSubmit" onclick="changePage(), get_shipping_price_realTime();">
                Continuer vers l'expédition
            </button>

            <!-- link to previous page in checkout -->
            <a href="/panier" class="payment_link" id="go_to_panier">Retour au panier</a>
            <span class="payment_link go_to_information" id="go_to_information">Revenir aux informations</span>
            <span class="payment_link go_to_shipping" id="go_to_shipping">Revenir à l'expédition</span>
        </div>

        <script>
            var page = 'livraison';
            var unvalid = false;
            var alreadyTruToSubmit = false;
            var modeShipping = '';

            document.getElementById('go_to_panier').style.display = 'inline-block';

            // link to previous page "information"
            var goto_information = document.getElementsByClassName('go_to_information');
            for (let i = 0; i < goto_information.length; i++) {
                goto_information[i].addEventListener('click', function() {
                    page = 'information';
                    // réinitialise CalculeALEtapeSuivante pour afficher 'Calculé à l\'étape suivante' pour le prix de livraison
                    CalculeALEtapeSuivante();
                    changePage();
                })
            }

            // link to previous page "shipping"
            var goto_shipping = document.getElementsByClassName('go_to_shipping');
            for (let i = 0; i < goto_shipping.length; i++) {
                goto_shipping[i].addEventListener('click', function() {
                    page = 'livraison';
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
                alreadyTruToSubmit = true;
                validateForm();

                // hide all link to previous page
                var links = document.getElementsByClassName('payment_link');
                for (let i = 0; i < links.length; i++) {
                    links[i].style.display = 'none';
                }

                // data to control
                var first_name_data = document.getElementById('first_name').value;
                var last_name_data = document.getElementById('last_name').value;
                var email_data = document.getElementById('email').value;
                var address_data = document.getElementById('address').value;
                var addressComment_data = document.getElementById('addressComment').value;
                var cp_data = document.getElementById('cp').value;
                var city_data = document.getElementById('city').value;
                var country_data = document.getElementById('country').value;

                var address = address_data + ' ' + addressComment_data + ' ' + cp_data + ' ' + city_data + ' ' + country_data;


                if (!unvalid) {
                    switch (page) {
                        case 'information':
                            document.getElementById('information_block').style.display = 'inline-block';
                            document.getElementById('shipping_block').style.display = 'none';
                            document.getElementById('payment_block').style.display = 'none';
                            document.getElementById('authRegisterSubmit').innerHTML = 'Continuer vers l\'expédition';
                            document.getElementById('go_to_panier').style.display = 'inline-block';
                            page = 'livraison';
                            break;
                        case 'livraison':
                            document.getElementById('information_block').style.display = 'none';
                            document.getElementById('payment_block').style.display = 'none';
                            document.getElementById('shipping_block').style.display = 'inline-block';
                            document.getElementById('authRegisterSubmit').innerHTML = 'Continuer vers le paiement';
                            document.getElementById('go_to_information').style.display = 'inline-block';

                            document.getElementById('contact_control').innerHTML = email_data;
                            document.getElementById('adress_control').innerHTML = address;
                            page = 'payment';
                            break;
                        case 'payment':
                            document.getElementById('shipping_block').style.display = 'none';
                            document.getElementById('payment_block').style.display = 'inline-block';
                            document.getElementById('authRegisterSubmit').innerHTML = 'Payer maintenant';
                            document.getElementById('go_to_shipping').style.display = 'inline-block';
                            document.getElementById('contact_control_payment').innerHTML = email_data;
                            document.getElementById('adress_control_payment').innerHTML = address;
                            document.getElementById('shipping_control').innerHTML = modeShipping;
                            break;
                        default:
                            document.getElementById('information_block').style.display = 'block';
                            document.getElementById('shipping_block').style.display = 'none';
                    }
                }

            }


            function validateEmail() {

            }


            function validateForm() {
                if (alreadyTruToSubmit) {
                    var missingFields = document.getElementsByClassName('missingField');
                    for (let i = 0; i < missingFields.length; i++) {
                        if (missingFields[i].value == '') {
                            document.getElementById(missingFields[i].id + '_').style.display = 'block';
                            unvalid = true;
                        } else {
                            document.getElementById(missingFields[i].id + '_').style.display = 'none';
                            unvalid = false;
                        }
                    }
                }
            }
        </script>

    </form>

</div>



<!-- ------------------------------------------------------------------ -->
<!-- <div id="shippingAdresse">
            <div id="toggleShipping" onclick="toggleShipping()">
                <div id="onOffShipping"></div>
            </div>

            <h4 onclick="toggleShipping()">Adresse de facturation différente</h4>
        </div>


        <script>
            function toggleShipping() {
                var onOffShipping = document.getElementById('onOffShipping');
                var block_register_2 = document.getElementById('block_register_2');

                if (onOffShipping.style.marginLeft === '28px') {
                    onOffShipping.style.marginLeft = '2px';
                    onOffShipping.style.backgroundColor = 'rgb(129, 5, 5)';
                    block_register_2.style.display = 'none';
                } else {
                    onOffShipping.style.marginLeft = '28px';
                    onOffShipping.style.backgroundColor = 'green';
                    block_register_2.style.display = 'block';
                }
            }
        </script> -->

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