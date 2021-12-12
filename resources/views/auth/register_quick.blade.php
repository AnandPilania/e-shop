@extends('layouts.head-frontend')

@section('content')

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

<form method="POST" action="{{ route('registerQuick') }}" class="auth auth_inscription" id="auth_inscription" autocomplete="on">
    @csrf

    <h1>Coordonnées</h1>

    <div id="block_register_1">
        <!-- Name -->
        <div class="register_block_name">
            <x-input id="first_name" class="auth_input" type="text" name="first_name" :value="old('first_name')" required autocomplete="on" placeholder="Votre prénom*" />
        </div>

        <!-- Email Address -->
        <x-input id="email" class="auth_input" type="email" name="email" :value="old('email')" autocomplete="on" required placeholder="Email*" />

        <!-- Password -->
        <x-input id="password" class="auth_input" type="password" name="password" required autocomplete="new-password" placeholder="Mot de passe* (min 8 caractères)" />
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
@endsection