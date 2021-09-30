@extends('layouts.head_admin')

@section('content')


<div class="card">
    <div class="card-body">
        <h4 class="card-title">Carts</h4>
        <div class="row">
        <button class="btn btn-outline-primary"><a href="/products/create">Nouveau</a></button>
        <br><br>
            <div class="col-12">
                <div class="table-responsive">
                    <table id="order-listing" class="table">
                        <thead>
                            <tr>
                                <th>Id</th>
                                <th>Image</th>
                                <th>Product</th>
                                <th>User</th>
                                <th>Quantity</th>
                                <th>Selected</th>
                                <th>Created_at</th>
                                <th>Updated_at</th>
                            </tr>
                        </thead>
                        <tbody>
                            @each('cart.one', $carts, 'cart')
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
</div>

@endsection

