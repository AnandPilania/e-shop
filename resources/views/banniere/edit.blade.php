@extends('layouts.head_admin')

@section('title')
<h2>Modifier un jumbotron</h2>
@endsection

@section('content')
<div class="wrapper-form">
    <h4 class="card-title">Ajouter une bannière</h4>
    @if (Session::has('status'))
    <div class="alert">{{Session::get('status')}}</div>
    @endif
    <form method="post" action="/bannieres/{{ $banniere->id }}" enctype="multipart/form-data">
        @csrf
        @method('put')
        <label for="h2">Titre</label>
        <input id="h2" name="h2" type="text" value="{{ $banniere->h2 }}">
        @error('h2')
        <div class="alert">{{ $message }}</div>
        @enderror
        <label for="paragrphe">P</label>
        <textarea id="paragrphe" name="paragrphe">{{ $banniere->p }}</textarea>
        @error('paragrphe')
        <div class="alert">{{ $message }}</div>
        @enderror
        <br>
            <label for="image">Image</label>
            <input type="file" name="image" id="image">
        @error('image')
        <div class="alert">{{ $message }}</div>
        @enderror
            <label for="alt">Alt</label>
            <input id="alt" name="alt" type="text" value="{{ $banniere->alt }}">
        @error('alt')
        <div class="alert">{{ $message }}</div>
        @enderror
            <label for="link">Lien du bouton vers la collection</label>
            <input id="link" name="link" type="text" value="{{ $banniere->link }}">
        @error('link')
        <div class="alert">{{ $message }}</div>
        @enderror
        <input class="btn" type="submit" value="Envoyer">
    </form>
</div>
@endsection

@section('scripts')
<!-- ckeditor5 -->

<script src="https://cdn.ckeditor.com/ckeditor5/29.1.0/classic/ckeditor.js"></script>

<script>
    ClassicEditor
        .create(document.querySelector('#paragrphe'))
        .then(editor => {
            console.log(editor);
        })
        .catch(error => {
            console.error(error);
        });
</script>
@endsection