@extends('layouts.head_admin')

@section('title')
<h2>Modifier une collection</h2>
@endsection

@section('content')
<div class="wrapper-form">
    <h4 class="card-title">Modifier une collection</h4>
    @if (Session::has('status'))
    <div class="alert">{{Session::get('status')}}</div>
    @endif
    <form method="post" action="/collections/{{ $collection->id }}" enctype="multipart/form-data">
        @csrf
        @method('put')
        <label for="name">Nom</label>
        <input id="name" name="name" minlength="2" type="text" value="{{ $collection->name }}">
        @error('name')
        <div class="alert">{{ $message }}</div>
        @enderror
        <label for="category">Catégorie</label>
        <p>
            <select name="category" id="category">
                <option value="{{ $collection->category_id }}">{{ $collection->category ? $collection->category->name : 'Sélectionnez une catégorie'}}</option>
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
        <input id="alt" name="alt" type="text" value="{{ $collection->alt }}">
        @error('alt')
        <div class="alert">{{ $message }}</div>
        @enderror
        <div> <input class="btn" type="submit" value="Envoyer"></div>
    </form>
</div>
@endsection