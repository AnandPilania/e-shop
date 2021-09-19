@extends('layouts.head_admin')

@section('content')

<div class="card">
    <div class="card-body">
        <h4 class="card-title">Catégories</h4>
        @if (Session::has('status'))
        <div class="alert alert-succes">{{Session::get('status')}}</div>
        @endif
        <div class="row">
        <button class="btn btn-outline-primary"><a href="/categories/create">Nouveau</a></button>
        <br><br>
            <div class="col-12">
                <div class="table-responsive">
                    <table id="order-listing" class="table">
                        <thead>
                            <tr>
                                <th>Order #</th>
                                <th>Nom de la catégorie</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            @each('category.one', $categories, 'category')
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
</div>


@endsection

