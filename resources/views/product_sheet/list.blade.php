@extends('layouts.head_admin')

@section('content')


<div class="card">
    <div class="card-body">
        <h4 class="card-title">Produits</h4>
        <div class="row">
        <button class="btn btn-outline-primary"><a href="/products/create">Nouveau</a></button>
        <br><br>
            <div class="col-12">
                <div class="table-responsive">
                    <table id="order-listing" class="table">
                        <thead>
                            <tr>
                                <th>Order #</th>
                                <th>Image</th>
                                <th>Nom</th>
                                <th>Collection</th>
                                <th>Prix</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            @each('product.one', $products, 'product')
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
</div>

@endsection

