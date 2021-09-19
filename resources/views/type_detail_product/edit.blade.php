@extends('layouts.head_admin')

@section('title')
<h2>Modifier un type de détail pour les produits</h2>
@endsection

@section('content')
<div class="wrapper-form">
    <h4 class="card-title">Modifier un type de détail</h4>
    @if (Session::has('status'))
    <div class="alert">{{Session::get('status')}}</div>
    @endif
   <form method="post" action="/type_detail_products/{{ $type_detail->id }}">
        @csrf
        @method('put')
        <label for="name">Nom</label>
        <input id="name" name="name" type="text" value="{{ $type_detail->name }}">
        <input class="btn" type="submit" value="Envoyer">
        @error('name')
        <div class="alert">{{ $message }}</div>
        @enderror
        </fieldset>
    </form>
</div>
@endsection