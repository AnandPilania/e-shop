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

    <form method="POST" action="{{ route('register') }}" class="auth  payment_auth_inscription" autocomplete="on" style="margin-top: 0;padding-top: 0;">
        @csrf

        <div class="first_line">
            <h2 style="margin-bottom: 10px;">Coordonnées</h2>

            <div class="alreadyAccount">
                <span>Vous avez déjà un compte ?</span>
                <a href="{{ route('login') }}">
                    Ouvrir une session
                </a>
            </div>
        </div>



        <div id="information_block">

            <!-- Name -->
            <div class="register_block_name">
                <div class="input-container">
                    <x-input id="first_name" type="text" name="first_name" :value="old('first_name')" required autocomplete="on" onclick="this.style.border = 'none';" onfocusout="waitFade()"/>
                    <label for="first_name">Votre prénom*</label>
                </div>

                <div class="input-container">
                    <x-input id="last_name" type="text" name="last_name" :value="old('last_name')" required autocomplete="on" onclick="this.style.border = 'none';" onfocusout="waitFade()"/>
                    <label for="last_name">Votre nom*</label>
                </div>
            </div>

            <!-- Email Address -->
            <div class="input-container">
                <x-input id="email" type="email" name="email" :value="old('email')" autocomplete="on" onclick="this.style.border = 'none';" onfocusout="waitFade()" required />
                <label for="email">Adresse e-mail*</label>
            </div>


            <h2 style="margin-top: 30px; margin-bottom: 10px">Adresse de livraison</h2>
            <!-- Adresse -->
            <div class="register_block_adresse">
                <select name="country" id="country" :value="old('country')" class="auth_input classic" autocomplete="on" required>
                    <option value="" disabled selected>Pays*</option>
                    <option value="France">France</option>
                    <option value="Belgique">Belgique</option>
                    <option value="Suisse">Suisse</option>
                    <option value="Canada">Canada</option>
                    <option value="---" disabled>---</option>
                    @foreach($countries as $country)
                    <option value="{{ $country->name_fr }}">{{ $country->name_fr }}</option>
                    @endforeach
                </select>

                <x-input id="address" class="auth_input" type="text" name="address" :value="old('address')" required autocomplete="on" placeholder="Adresse*" />

                <x-input id="addressComment" class="auth_input" type="text" name="addressComment" :value="old('addressComment')" autocomplete="on" placeholder="Complément d'adresse (facultatif)" />
            </div>

            <!-- Cp & Ville -->
            <div class="register_block_cp_city">
                <x-input id="cp" class="auth_input" type="text" name="cp" :value="old('cp')" autocomplete="on" required placeholder="Code postal*" />

                <x-input id="city" class="auth_input" type="text" name="city" :value="old('city')" autocomplete="on" required placeholder="Ville*" />
            </div>


            <!-- phone -->
            <div class="phone">
                <x-input id="phone" class="auth_input_phone" type="phone" name="phone" :value="old('ciphoney')" autocomplete="on" required placeholder="Téléphone (facultatif)" />
                <div class="icon_question">
                    <i class="fas fa-question-circle tooltip">
                        <span class="tooltiptext">Au cas où nous aurions besoin de vous contacter à propos de votre commande</span>
                    </i>
                </div>
            </div>

        </div>

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



        <div id="shipping_block">
            <!-- Name -->
            <div class="register_block_name">
                <x-input id="first_nameBill" class="auth_input" type="text" name="first_nameBill" :value="old('first_nameBill')" autocomplete="on" placeholder="Prénom*" />

                <x-input id="last_nameBill" class="auth_input" type="text" name="last_nameBill" :value="old('last_nameBill')" autocomplete="on" placeholder="Nom*" />
            </div>

            <!-- Adresse -->
            <div class="register_block_adresse">
                <select name="countryBill" id="countryBill" :value="old('countryBill')" class="auth_input classic" autocomplete="on">
                    <option value="" disabled selected>Pays*</option>
                    <option value="France">France</option>
                    <option value="Belgique">Belgique</option>
                    <option value="Suisse">Suisse</option>
                    <option value="Canada">Canada</option>
                    <option value="---" disabled>---</option>
                    @foreach($countries as $country)
                    <option value="{{ $country->name_fr }}">{{ $country->name_fr }}</option>
                    @endforeach
                </select>

                <x-input id="addressBill" class="auth_input" type="text" name="addressBill" :value="old('addressBill')" autocomplete="on" placeholder="Adresse de facturation*" />

                <x-input id="addressCommentBill" class="auth_input" type="text" name="addressCommentBill" :value="old('addressCommentBill')" autocomplete="on" placeholder="Complément d'adresse de facturation (facultatif)" />
            </div>

            <!-- Cp & Ville -->
            <div class="register_block_cp_city">
                <x-input id="cpBill" class="auth_input" type="text" name="cpBill" :value="old('cpBill')" autocomplete="on" placeholder="Code postal*" />

                <x-input id="cityBill" class="auth_input" type="text" name="cityBill" :value="old('cityBill')" autocomplete="on" placeholder="Ville*" />
            </div>
        </div>

        <!-- conserve -->
        <div class="conserve">
            <input type="checkbox" id="conserve" name="conserve" :value="old('conserve')" value="conserve">
            <label for="conserve" id="label_conserve">Sauvegarder mes coordonnées pour la prochaine fois</label>

            <!-- <label for="rgpd" id="label_rgpd"> En créant mon compte, je certifie avoir 15 ans ou plus, et avoir pris connaissance de <a href="{{ route('cu') }}">notre Politique de données personnelles*</a></label> -->
        </div>


        <div class="auth_footer">
            <button id="authRegisterSubmit" onclick="changePage()">
                Continuer vers l'expédition
            </button>

            <!-- link to previous page in checkout -->
            <a href="/panier" class="payment_link" id="go_to_panier">panier</a>
            <span class="payment_link" id="go_to_information">info</span>
            <span class="payment_link" id="go_to_livraison">ship</span>
        </div>

        <script>
            var page = 'livraison';
            document.getElementById('go_to_panier').style.display = 'inline-block';

            // link to previous page
            document.getElementById('go_to_information').addEventListener('click', function() {
                page = 'information';
                changePage();
            })


            function changePage() {
                event.preventDefault();

                // hide all link to previous page
                var links = document.getElementsByClassName('payment_link');
                for (let i = 0; i < links.length; i++) {
                    links[i].style.display = 'none';
                }


                switch (page) {
                    case 'information':
                        document.getElementById('information_block').style.display = 'inline-block';
                        document.getElementById('shipping_block').style.display = 'none';
                        document.getElementById('authRegisterSubmit').innerHTML = 'Continuer vers l\'expédition';
                        document.getElementById('go_to_panier').style.display = 'inline-block';
                        page = 'livraison';
                        break;
                    case 'livraison':
                        document.getElementById('information_block').style.display = 'none';
                        document.getElementById('shipping_block').style.display = 'inline-block';
                        document.getElementById('authRegisterSubmit').innerHTML = 'Continuer vers le paiement';
                        document.getElementById('go_to_information').style.display = 'inline-block';
                        break;
                        // case 'paiement':
                        //     // code block
                        //     break;
                    default:
                        document.getElementById('information_block').style.display = 'block';
                        document.getElementById('shipping_block').style.display = 'none';
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