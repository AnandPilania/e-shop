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
                        <h4 class="card-title">Modifier un produit</h4>
                        @if (Session::has('status'))
                        <div class="alert alert-succes">{{Session::get('status')}}</div>
                        @endif
                        <form class="cmxform" id="commentForm" method="post" action="/products/{{ $product->id }}" enctype="multipart/form-data">
                            @csrf
                            @method('put')
                            <fieldset>
                                <div class="form-group">
                                    <label for="name">Nom</label>
                                    <input id="name" class="form-control" name="name"  type="text" value="{{ $product->name }}">
                                </div>
                                @error('name')
                                <div class=" alert alert-danger">{{ $message }}
                                </div>
                                @enderror
                                <div class="form-group">
                                    <label for="price">Prix</label>
                                    <input id="price" class="form-control" type="number" name="price" value="{{ $product->price }}">
                                </div>
                                @error('price')
                                <div class=" alert alert-danger">{{ $message }}
                                </div>
                                @enderror
                                <div class="form-group">
                                    <label for="category">Taux de TVA</label>
                                    <p>
                                        <select class="form-control" name="taxe" id="taxe">                 
                                            <option value="{{ $product->taxe_id }}">{{ $product->taxe ? $product->taxe->tva_rate : 'Sélectionnez un taux de TVA' }}</option>
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
                                    <label for="category">Catégorie</label>
                                    <p>
                                        <select class="form-control" name="category" id="category">
                                            <option value="{{ $product->category_id }}">{{ $product->category ? $product->category->name : 'Sélectionnez une catégorie'}}</option>
                                            @foreach($categories as $category)
                                            <option value="{{ $category->id }}">{{ $category->name }}</option>
                                            @endforeach
                                        </select>
                                    </p>
                                </div>
                                @error('category')
                                <div class="alert alert-danger">{{ $message }}</div>
                                @enderror
                                <div class="form-group">
                                    <label for="image">Image</label>
                                    <input type="file" name="image" id="image" class="form-control">
                                </div>
                                @error('image')
                                <div class=" alert alert-danger">{{ $message }}
                                </div>
                                @enderror
                                <div class="form-group">
                                    <label for="description">Déscription</label>
                                    <input id="description" class="form-control" name="description"  type="text" value="{{ $product->description }}">
                                </div>
                                @error('description')
                                <div class=" alert alert-danger">{{ $message }}
                                </div>
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

