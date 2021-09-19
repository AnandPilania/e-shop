@extends('layouts.head_admin')

@section('content')

<div class="card">
    <div class="card-body">
        <h4 class="card-title">Collections</h4>
        <button class="btn"><a href="/collections/create">Nouveau</a></button>
        <br><br>
            <div class="col-12">
                <div class="table-responsive">
                    <table id="order-listing" class="table">
                        <thead>
                            <tr>
                                <th>Order #</th>
                                <th>Nom</th>
                                <th>Image</th>
                                <th>Alt</th>
                                <th>Catégorie</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            @each('collection.one', $collections, 'collection')
                        </tbody>
                    </table>
                </div>
            </div>
    </div>
</div>


@endsection

