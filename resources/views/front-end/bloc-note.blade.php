<!-- // check si tous les champs de l'adresse de livraison sont remplis -->
function validateFormShipping() {
var missingCount = 0;
var missingFields = document.getElementsByClassName('missingFieldShipping');
for (let i = 0; i < missingFields.length; i++) { if (missingFields[i].value.length==0) { document.getElementById(missingFields[i].id + '_' ).style.display='block' ; missingCount++; unvalidBill=true; } if (missingCount===0) { document.getElementById(missingFields[i].id + '_' ).style.display='none' ; unvalidBill=false; } } } 


<div id="shipping_block">

    <div class="register_title">
        <h2>Adresse de livraison</h2>
    </div>

    <!-- Adresse -->
    <div class="input-container">
        <x-input id="address" class="missingFieldShipping" type="text" name="address" :value="old('address')" required autocomplete="on" onfocusout="validateForm()" maxlength="500" />
        <label for="address">Adresse*</label>
        <span id="address_" class="missingFieldMessage missingMargin">Entrez une adresse</span>
    </div>

    <div class="input-container">
        <x-input id="addressComment" type="text" name="addressComment" :value="old('addressComment')" required="false" autocomplete="off" maxlength="255" />
        <label for="addressComment">Complément d'adresse (facultatif)</label>
    </div>

    <!-- Cp & Ville -->
    <div class="register_block_cp_city">
        <div class="input-container input-container_half">
            <x-input id="city" class="missingFieldShipping" type="text" name="city" :value="old('city')" autocomplete="on" required onfocusout=" validateForm()" maxlength="100" />
            <label for="city">Ville*</label>
            <span id="city_" class="missingFieldMessage missingMargin">Entrez une ville</span>
        </div>

        <div class="input-container input-container_half">
            <x-input id="cp" class="missingFieldShipping" type="number" name="cp" :value="old('cp')" autocomplete="on" required onfocusout="validateForm()" maxlength="25" />
            <label for="cp">Code postal*</label>
            <span id="cp_" class="missingFieldMessage missingMargin">Entrez un code postal</span>
        </div>
    </div>

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