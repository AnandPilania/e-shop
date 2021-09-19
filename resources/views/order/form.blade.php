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
                        <h4 class="card-title">Ajouter un produit</h4>
                        <form class="cmxform" id="commentForm" method="post" action="/categories" enctype="multipart/form-data">
                            @csrf
                            <fieldset>
                                <div class="form-group">
                                    <label for="name">Nom</label>
                                    <input id="name" class="form-control" name="name" type="text" required>
                                </div>
                                <div class="form-group">
                                    <label for="price">Prix</label>
                                    <input id="price" class="form-control" type="number" name="price" required>
                                </div>
                                <div class="form-group">
                                    <label for="category">Catégorie</label>
                                    <p>
                                        <select class="form-control" name="category" id="category">
                                            <option value="">Sélectionnez une catégorie</option>
                                            @foreach($categories as $category)
                                            <option value="{{ $category->id }}">{{ $category->name }}</option>
                                            @endforeach
                                        </select>
                                    </p>
                                </div>
                                <div class="form-group">
                                    <label for="image">Image</label>
                                    <input type="file" name="image" id="image" class="form-control" required>
                                </div>
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

