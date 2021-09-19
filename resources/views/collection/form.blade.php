@extends('layouts.head_admin')

@section('title')
<h2>Ajouter une collection</h2>
@endsection

@section('content')
<div class="wrapper-form">
    <h4 class="card-title">Ajouter une collection</h4>
    @if (Session::has('status'))
    <div class="alert">{{Session::get('status')}}</div>
    @endif
    <form method="post" action="/collections" enctype="multipart/form-data">
        @csrf
        <label for="name">Nom</label>
        <input id="name" name="name" type="text">
        @error('name')
        <div class="alert">{{ $message }}</div>
        @enderror
        <label for="category">Catégorie</label>
        <p>
            <select name="category" id="category">
                <option value="">Sélectionnez une catégorie</option>
                @foreach($categories as $category)
                <option value="{{ $category->id }}">{{ $category->name }}</option>
                @endforeach
            </select>
        </p>
        @error('category')
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
        <div><input class="btn" type="submit" value="Envoyer"></div>
        </fieldset>
    </form>
</div>
@endsection