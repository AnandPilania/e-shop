@extends('layouts.head_admin')

@section('title')
<h2>Ajouter un type de détal pour les produits</h2>
@endsection

@section('content')
<div class="wrapper-form">
    <h4 class="card-title">Ajouter un type de détail</h4>
    @if (Session::has('status'))
    <div class="alert">{{Session::get('status')}}</div>
    @endif
    <form method="post" action="/type_detail_products">
        @csrf
        <label for="name">Nom</label>
        <input id="name" name="name" type="text">
        @error('name')
        <div class="alert">{{ $message }}</div>
        @enderror
        <div><input class="btn" type="submit" value="Envoyer"></div>
    </form>
</div>
@endsection