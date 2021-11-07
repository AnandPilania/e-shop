@extends('layouts.head_admin')

@section('title')
<h2>Ajouter une commande</h2>
@endsection

@section('content')
<div class="wrapper-form">
    <h4 class="card-title">Ajouter une commande</h4>
    @if (Session::has('status'))
    <div class="alert">{{Session::get('status')}}</div>
    @endif
    <form method="post" action="/orders">
        @csrf
        <label for="name">Id</label>
        <input id="id" name="id" type="text" value="{{ $order->id }}">
        @error('id')
        <div class="alert">{{ $message }}</div>
        @enderror
        <label for="last_name">Nom</label>
        <input id="last_name" name="last_name" type="text" value="{{ $order->user->last_name }}">
        @error('last_name')
        <div class="alert">{{ $message }}</div>
        @enderror
        <div class="input-container">
            <select name="country" id="country" value="{{ $order->user->address_user->country }}" class="classic missingFieldShipping">
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
            @error('country')
            <div class="alert">{{ $message }}</div>
            @enderror
        </div>
        <div class="input-container input-container_half">
            <input id="cp" class="missingFieldShipping" type="number" name="cp" value="{{ $order->user->address_user->cp }}" maxlength="25" />
            <label for="cp">Code postal*</label>
            @error('cp')
            <div class="alert">{{ $message }}</div>
            @enderror
        </div>
        <label for="name">Montant</label>
        <input id="amount" name="amount" type="number" step="0.01" value="{{ $order->total_amount }}">
        @error('amount')
        <div class="alert">{{ $message }}</div>
        @enderror
        <label for="cart">Panier</label>
        <input id="cart" name="cart" type="text" value="{{ $order->cart }}">
        @error('cart')
        <div class="alert">{{ $message }}</div>
        @enderror
        <label for="payment_id">Payment_id</label>
        <input id="payment_id" name="payment_id" type="text" value="{{ $order->stripe_id }}">
        @error('payment_id')
        <div class="alert">{{ $message }}</div>
        @enderror
        <label for="PayementOperator">Panier</label>
        <input id="payementOperator" name="payementOperator" type="text" value="{{ $order->payment_operator }}">
        @error('payementOperator')
        <div class="alert">{{ $message }}</div>
        @enderror

        <div><input class="btn" type="submit" value="Envoyer"></div>
        </fieldset>
    </form>
</div>
@endsection