@extends('layouts.head_admin')

@section('title')
<h2>Modifier une catégorie</h2>
@endsection

@section('content')
<div class="wrapper-form">
    <h4 class="card-title">Modifier le taux de TVA</h4>
    @if (Session::has('status'))
    <div class="alert">{{Session::get('status')}}</div>
    @endif
    <form method="post" action="/taxes/{{ $taxe->id }}">
        @csrf
        @method('put')
        <label for="tva_rate">Taux de TVA</label>
        <input id="tva_rate" name="tva_rate" type="text" value="{{ $taxe->tva_rate }}">
        <input class="btn" type="submit" value="Envoyer">
        @error('tva_rate')
        <div class="alert">{{ $message }}</div>
        @enderror
    </form>
</div>
@endsection