@extends('layouts.head_admin')

@section('title')
<h2>Modifier une catégorie</h2>
@endsection

@section('content')
<div class="wrapper-form">
    <h4 class="card-title">Modifier une catégorie</h4>
    @if (Session::has('status'))
    <div class="alert">{{Session::get('status')}}</div>
    @endif
    <form method="post" action="/categories/{{ $category->id }}">
        @csrf
        @method('put')
        <label for="name">Nom</label>
        <input id="name" name="name" minlength="2" type="text" value="{{ $category->name }}">
        <input class="btn" type="submit" value="Envoyer">
        @error('name')
        <div class="alert">{{ $message }}</div>
        @enderror
    </form>
</div>
@endsection