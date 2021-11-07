@extends('layouts.head_admin')

@section('title')
<h2>Modifier une commande</h2>
@endsection

@section('content')
<div class="wrapper-form">
    <h4 class="card-title">Modifier une commande</h4>
    @if (Session::has('status'))
    <div class="alert">{{Session::get('status')}}</div>
    @endif
    <form method="post" action="/orders/{{ $order->id }}">
        @csrf
        @method('put')
        <label for="name">Date de commande</label>
        <input id="created_at" name="created_at" type="text" value="{{ $order->created_at }}">
        @error('created_at')
        <div class="alert">{{ $message }}</div>
        @enderror
        <label for="name">User_id</label>
        <input id="user_id" name="user_id" type="text" value="{{ $order->user->id }}">
        @error('user_id')
        <div class="alert">{{ $message }}</div>
        @enderror
        <label for="last_name">Nom</label>
        <input id="last_name" name="last_name" type="text" value="{{ $order->user->last_name }}">
        @error('last_name')
        <div class="alert">{{ $message }}</div>
        @enderror
        <label for="country">Pays*</label>
        <select name="country" id="country">
            <option value="{{ $order->user->address_user->country }}"  selected>{{ $order->user->address_user->country }}</option>
            <option value="France">France</option>
            <option value="Belgique">Belgique</option>
            <option value="Suisse">Suisse</option>
            <option value="Canada">Canada</option>
            <option value="---" disabled>---</option>
            @foreach($countries as $country)
            <option value="{{ $country->name_fr }}">{{ $country->name_fr }}</option>
            @endforeach
        </select>
        @error('country')
        <div class="alert">{{ $message }}</div>
        @enderror
        <label for="cp">Code postal*</label>
        <input id="cp" class="missingFieldShipping" type="number" name="cp" value="{{ $order->user->address_user->cp }}" maxlength="25" />
        @error('cp')
        <div class="alert">{{ $message }}</div>
        @enderror
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

        <label for="PayementOperator">Payement Operator</label>
        <input id="payementOperator" name="payementOperator" type="text" value="{{ $order->payment_operator }}">
        @error('payementOperator')
        <div class="alert">{{ $message }}</div>
        @enderror

        <div><input class="btn" type="submit" value="Envoyer"></div>
        </fieldset>
    </form>
</div>
@endsection