@extends('layouts.head_admin')

@section('title')
<h2>Ajouter une catégorie</h2>
@endsection

@section('content')
<div class="wrapper-form">
    <h4 class="card-title">Ajouter un jumbotron</h4>
    <form method="post" action="/jumbos" enctype="multipart/form-data">
        @csrf
        <label for="text">Texte</label>
        <input id="text" name="text" type="text">
        @error('texte')
        <div class="alert">{{ $message }}</div>
        @enderror
        <label for="button_text">Texte bouton</label>
        <input id="button_text" name="button_text" type="text">
        @error('button_text')
        <div class="alert">{{ $message }}</div>
        @enderror
        <label for="image">Image</label>
        <input type="file" name="image" id="image">
        @error('image')
        <div class="alert">{{ $message }}</div>
        @enderror
        <label for="alt">Alt</label>
        <input id="alt" name="alt" type="text">
        @error('alt')
        <div class="alert">{{ $message }}</div>
        @enderror
        <input class="btn" type="submit" value="Envoyer">
    </form>
</div>
@endsection