@extends('layouts.head_admin')

@section('title')
<h2>Ajouter une catégorie</h2>
@endsection

@section('content')
<div class="main-panel">
    <div class="content-wrapper">
        <div class="row grid-margin">
            <div class="col-lg-12">
                <div class="card">
                    <div class="card-body">
                        <h4 class="card-title">Ajouter une fiche produit</h4>
                        @if (Session::has('status'))
                        <div class="alert alert-succes">{{Session::get('status')}}</div>
                        @endif
                        <form class="cmxform" id="commentForm" method="post" action="/products" enctype="multipart/form-data">
                            @csrf
                            <fieldset>
                                <div class="form-group">
                                    <label for="h1">H1</label>
                                    <input id="h1" class="form-control" name="h1" type="text">
                                </div>
                                @error('h1')
                                <div class="alert alert-danger">{{ $message }}</div>
                                @enderror
                                <div class="form-group">
                                    <label for="price">Prix</label>
                                    <input id="price" class="form-control" type="number" name="price">
                                </div>
                                @error('price')
                                <div class="alert alert-danger">{{ $message }}</div>
                                @enderror
                                <div class="form-group">
                                    <label for="category">Taux de TVA</label>
                                    <p>
                                        <select class="form-control" name="taxe" id="taxe">
                                            <option value="">Sélectionnez un taux de TVA</option>
                                            @foreach($taxes as $taxe)
                                            <option value="{{ $taxe->id }}">{{ $taxe->tva_rate }}</option>
                                            @endforeach
                                        </select>
                                    </p>
                                </div>
                                @error('taxe')
                                <div class="alert alert-danger">{{ $message }}</div>
                                @enderror
                                <div class="form-group">
                                    <label for="collection">Collection</label>
                                    <p>
                                        <select class="form-control" name="collection" id="collection">
                                            <option value="">Sélectionnez une collection</option>
                                            @foreach($collections as $collection)
                                            <option value="{{ $collection->id }}">{{ $collection->name }}</option>
                                            @endforeach
                                        </select>
                                    </p>
                                </div>
                                @error('collection')
                                <div class="alert alert-danger">{{ $message }}</div>
                                @enderror
                                <div class="form-group">
                                    <label for="image">Image</label>
                                    <input type="file" name="image" id="image" class="form-control">
                                </div>
                                @error('image')
                                <div class="alert alert-danger">{{ $message }}</div>
                                @enderror
                                <div class="form-group">
                                    <label for="description">Déscription</label>
                                    <input id="description" class="form-control" name="description" type="text">
                                </div>
                                @error('description')
                                <div class="alert alert-danger">{{ $message }}</div>
                                @enderror
                                <input class="btn btn-primary" type="submit" value="Envoer">
                            </fieldset>
                        </form>
                    </div>
                </div>
            </div>
        </div>

    </div>
</div>
@endsection

