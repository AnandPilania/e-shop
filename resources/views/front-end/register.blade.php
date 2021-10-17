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

        <h2 style="margin-bottom: 10px;">Coordonnées</h2>

        <div id="block_register_1">
            <!-- Name -->
            <div class="register_block_name">
                <x-input id="first_name" class="auth_input" type="text" name="first_name" :value="old('first_name')" required autocomplete="on" placeholder="Prénom*" />

                <x-input id="last_name" class="auth_input" type="text" name="last_name" :value="old('last_name')" required autocomplete="on" placeholder="Nom*" />
            </div>

            <!-- Email Address -->
            <x-input id="email" class="auth_input" type="email" name="email" :value="old('email')" autocomplete="on" required placeholder="Email*" />

            <!-- phone -->
            <div class="phone">
                <x-input id="phone" class="auth_input_phone" type="phone" name="phone" :value="old('ciphoney')" autocomplete="on" required placeholder="Téléphone (facultatif)" />
                <div class="icon_question">
                    <i class="fas fa-question-circle tooltip">
                        <span class="tooltiptext">Au cas où nous aurions besoin de vous contacter à propos de votre commande</span>
                    </i>
                </div>
            </div>


            <!-- Password -->
            <x-input id="password" class="auth_input" type="password" name="password" required autocomplete="new-password" placeholder="Mot de passe* (min 8 caractères)" />

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
        </div>

        <div id="shippingAdresse">
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
        </script>

        <div id="block_register_2">
            <!-- Adresse -->
            <div class="register_block_adresse">
                <select name="countryShip" id="countryShip" :value="old('countryShip')" class="auth_input classic" autocomplete="on">
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

                <x-input id="addressShip" class="auth_input" type="text" name="addressShip" :value="old('addressShip')" autocomplete="on" placeholder="Adresse de livraison*" />

                <x-input id="addressCommentShip" class="auth_input" type="text" name="addressCommentShip" :value="old('addressCommentShip')" autocomplete="on" placeholder="Complément d'adresse de livraison (facultatif)" />
            </div>

            <!-- Cp & Ville -->
            <div class="register_block_cp_city">
                <x-input id="cpShip" class="auth_input" type="text" name="cpShip" :value="old('cpShip')" autocomplete="on" placeholder="Code postal*" />

                <x-input id="cityShip" class="auth_input" type="text" name="cityShip" :value="old('cityShip')" autocomplete="on" placeholder="Ville*" />
            </div>
        </div>

        <div class="rgpd">
            <input type="checkbox" id="rgpd" name="rgpd" :value="old('rgpd')" value="agreed">
            <label for="rgpd" id="label_rgpd"> En créant mon compte, je certifie avoir 15 ans ou plus, et avoir pris connaissance de <a href="{{ route('cu') }}">notre Politique de données personnelles*</a></label>
        </div>


        <div class="auth_footer">
            <a href="{{ route('login') }}">
                Déjà inscrit
            </a>


            <x-button data-action='submit' id="authRegisterSubmit">
                M'inscrire
            </x-button>
        </div>

    </form>

</div>