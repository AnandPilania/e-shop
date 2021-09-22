@extends('layouts.head_admin')

@section('title')
<h2>Ajouter un commentaire</h2>
@endsection

@section('content')

<div class="wrapper-form">
    <h4 class="card-title">Ajouter une commentaire</h4>
    @if (Session::has('status'))
    <div class="alert">{{Session::get('status')}}</div>
    @endif
    <form method="post" action="/reviews">
        @csrf
        <label for="title">Title</label>
        <input id="title" name="title" type="text">
        @error('title')
        <div class="alert">{{ $message }}</div>
        @enderror
        <label for="review">Review</label>
        <input id="review" name="review" type="text">
        @error('review')
        <div class="alert">{{ $message }}</div>
        @enderror
        <label for="stars">Stars</label>
        <input id="stars" name="stars" type="number">
        @error('stars')
        <div class="alert">{{ $message }}</div>
        @enderror
        <input class="btn" type="submit" value="Envoyer">
    </form>
</div>
@endsection