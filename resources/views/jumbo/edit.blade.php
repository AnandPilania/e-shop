@extends('layouts.head_admin')

@section('title')
<h2>Modifier un jumbotron</h2>
@endsection

@section('content')
<div class="wrapper-form">
    <h4 class="card-title">Modifier un jumbotron</h4>
    @if (Session::has('status'))
    <div class="alert">{{Session::get('status')}}</div>
    @endif
    <form method="post" action="/jumbos/{{ $jumbo->id }}" enctype="multipart/form-data">
        @csrf
        @method('put')
        <label for="text">Texte</label>
        <input id="text" name="text" type="text" value="{{ $jumbo->text }}">
        @error('Texte')
        <div class="alert">{{ $message }}</div>
        @enderror
        <label for="button_text">Texte bouton</label>
        <input id="button_text" name="button_text" type="text" value="{{ $jumbo->button_text }}">
        @error('button_text')
        <div class="alert">{{ $message }}</div>
        @enderror
        <label for="image">Image</label>
        <input type="file" name="image" id="image" value="{{ $jumbo->image }}">
        @error('image')
        <div class="alert">{{ $message }}</div>
        @enderror
        <label for="alt">Alt</label>
        <input id="alt" name="alt" type="text" value="{{ $jumbo->alt }}">
        @error('alt')
        <div class="alert">{{ $message }}</div>
        @enderror
        <input class="btn" type="submit" value="Envoyer">
    </form>
</div>
@endsection