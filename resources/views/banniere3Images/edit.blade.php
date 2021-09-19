@extends('layouts.head_admin')

@section('title')
<h2>Modifier un jumbotron</h2>
@endsection

@section('content')
<div class="main-panel">
    <div class="content-wrapper">
        <div class="row grid-margin">
            <div class="col-lg-12">
                <div class="card">
                    <div class="card-body">
                        <h4 class="card-title">Ajouter une bannière</h4>
                        @if (Session::has('status'))
                        <div class="alert alert-succes">{{Session::get('status')}}</div>
                        @endif
                        <form class="cmxform" id="commentForm" method="post" action="/bannieres/{{ $banniere->id }}" enctype="multipart/form-data">
                            @csrf
                            @method('put')
                            <fieldset>
                                <div class="form-group">
                                    <label for="h2">Titre</label>
                                    <input id="h2" class="form-control" name="h2" type="text" value="{{ $banniere->h2 }}">
                                </div>
                                @error('h2')
                                <div class="alert alert-danger">{{ $message }}</div>
                                @enderror
                                <label for="paragrphe">P</label>
                                <textarea id="paragrphe" name="paragrphe">{{ $banniere->p }}</textarea>
                                @error('paragrphe')
                                <div class="alert alert-danger">{{ $message }}</div>
                                @enderror
                                <br>
                                <div class="form-group">
                                    <label for="image">Image</label>
                                    <input type="file" name="image" id="image" class="form-control">
                                </div>
                                @error('image')
                                <div class="alert alert-danger">{{ $message }}</div>
                                @enderror
                                <div class="form-group">
                                    <label for="alt">Alt</label>
                                    <input id="alt" class="form-control" name="alt" type="text" value="{{ $banniere->alt }}">
                                </div>
                                @error('alt')
                                <div class="alert alert-danger">{{ $message }}</div>
                                @enderror
                                <div class="form-group">
                                    <label for="link">Lien du bouton vers la collection</label>
                                    <input id="link" class="form-control" name="link" type="text" value="{{ $banniere->link }}">
                                </div>
                                @error('link')
                                <div class="alert alert-danger">{{ $message }}</div>
                                @enderror
                                <input class="btn btn-primary" type="submit" value="Envoyer">
                            </fieldset>
                        </form>
                    </div>
                </div>
            </div>
        </div>

    </div>
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