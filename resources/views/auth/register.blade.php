@extends('layouts.head-frontend')

@section('content')
<x-slot name="logo">
    <a href="/">
        <x-application-logo />
    </a>
</x-slot>

<!-- Validation Errors -->
<x-auth-validation-errors :errors="$errors" style="color:red;" />

<form method="POST" action="{{ route('register') }}" class="auth auth_inscription">
    @csrf

    <h1>Inscription</h1>
    <!-- Name -->
    <label for="nom" class="auth_label">Nom</label>

    <x-input id="nom" class="auth_input" type="text" name="nom" :value="old('nom')" required autofocus />


    <label for="prenom" class="auth_label">Prénom</label>

    <x-input id="prenom" class="auth_input" type="text" name="prenom" :value="old('prenom')" required autofocus />


    <!-- Civilité -->
    <div id="civilite">
        <div>
            <input type="radio" id="madame" name="civilite" value="old('civilite')" required> 
            <label for="madame" style="margin-right: 20px;">Madame</label>
        </div>

        <div>
            <input type="radio" id="monsieur" name="civilite" value="old('civilite')" required>
            <label for="monsieur">Monsieur</label>
        </div>
    </div>


    <!-- Email Address -->

    <label for="email" class="auth_label">Email</label>

    <x-input id="email" class="auth_input" type="email" name="email" :value="old('email')" required />

    <!-- Password -->

    <label for="password" class="auth_label">Mot de passe</label>

    <x-input id="password" class="auth_input" type="password" name="password" required autocomplete="new-password" />

    <!-- Confirm Password -->

    <label for="password_confirmation" class="auth_label">Confirmer mot de passe</label>

    <x-input id="password_confirmation" class="auth_input" type="password" name="password_confirmation" required />

    <div class="rgpd">
        <input type="checkbox" id="rgpd" name="rgpd" required>
        <label for="rgpd" id="label_rgpd">j’ai lu et j’accepte la politique de confidentialité du site m-egalitefemmeshommes.org</label>
    </div>

    <div class="g-recaptcha" data-sitekey="{{ config('captcha.v2-site') }}" required></div>

    <div class="auth_footer">
        <a href="{{ route('login') }}">
            Déjà inscrit
        </a>

        <x-button>
            M'inscrire
        </x-button>
    </div>




</form>
@endsection