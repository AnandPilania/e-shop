@extends('layouts.head_admin')

@section('title')
<h2>Modifier un commentaire</h2>
@endsection

@section('content')
<div class="wrapper-form">
    <h4 class="card-title">Modifier un commentaire</h4>
    @if (Session::has('status'))
    <div class="alert">{{Session::get('status')}}</div>
    @endif
    <form method="post" action="/taxes/{{ $taxe->id }}">
        @csrf
        @method('put')
        <label for="title">Title</label>
        <input id="title" name="title" type="text" value="{{ $review->title }}">
        @error('title')
        <div class="alert">{{ $message }}</div>
        @enderror
        <label for="review">Review</label>
        <input id="review" name="review" type="text" value="{{ $review->review }}">
        @error('review')
        <div class="alert">{{ $message }}</div>
        @enderror
        <label for="stars">Stars</label>
        <input id="stars" name="stars" type="number" value="{{ $review->stars }}">
        @error('stars')
        <div class="alert">{{ $message }}</div>
        @enderror
        <input class="btn" type="submit" value="Envoyer">
    </form>
</div>
@endsection