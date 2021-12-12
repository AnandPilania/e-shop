@extends('layouts.head_admin')

@section('content')


<div class="card">
    <h4 class="card-title">Produits</h4>
    <button class="btn btn_ajouter"><a href="/products/create">Ajouter un article</a></button>
    <br><br>
    <table class="table">
        <thead>
            <tr class="tr_thead">
                <th>Order #</th>
                <th>Image</th>
                <th>Nom</th>
                <th>Collection</th>
                <th>Prix</th>
                <th>Best Seller</th>
                <th>Actions</th>
            </tr>
        </thead>
        <tbody>
            @each('product.one', $products, 'product')
        </tbody>
    </table>
</div>

@endsection