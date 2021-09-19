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
                        <h4 class="card-title">Modifier un jumbotron</h4>
                        @if (Session::has('status'))
                        <div class="alert alert-succes">{{Session::get('status')}}</div>
                        @endif
                        <form class="cmxform" id="commentForm" method="post" action="/jumbos/{{ $jumbo->id }}" enctype="multipart/form-data">
                            @csrf
                            @method('put')
                            <fieldset>
                                <div class="form-group">
                                    <label for="text">Texte</label>
                                    <input id="text" class="form-control" name="text" type="text" value="{{ $jumbo->text }}">
                                </div>
                                @error('Texte')
                                <div class="alert alert-danger">{{ $message }}</div>
                                @enderror
                                <div class="form-group">
                                    <label for="button_text">Texte bouton</label>
                                    <input id="button_text" class="form-control" name="button_text" type="text" value="{{ $jumbo->button_text }}">
                                </div>
                                @error('button_text')
                                <div class="alert alert-danger">{{ $message }}</div>
                                @enderror
                                <div class="form-group">
                                    <label for="image">Image</label>
                                    <input type="file" name="image" id="image" class="form-control" value="{{ $jumbo->image }}">
                                </div>
                                @error('image')
                                <div class="alert alert-danger">{{ $message }}</div>
                                @enderror
                                <div class="form-group">
                                    <label for="alt">Alt</label>
                                    <input id="alt" class="form-control" name="alt" type="text" value="{{ $jumbo->alt }}">
                                </div>
                                @error('alt')
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

