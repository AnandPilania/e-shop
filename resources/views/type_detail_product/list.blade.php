@extends('layouts.head_admin')

@section('content')

<div class="card">
    <div class="card-body">
        <h4 class="card-title">Type de détail</h4>
        @if (Session::has('status'))
        <div class="alert alert-succes">{{Session::get('status')}}</div>
        @endif
        <div class="row">
        <button class="btn btn-outline-primary"><a href="/type_detail_products/create">Nouveau</a></button>
        <br><br>
            <div class="col-12">
                <div class="table-responsive">
                    <table id="order-listing" class="table">
                        <thead>
                            <tr>
                                <th>Order #</th>
                                <th>Nom du type de détail</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            @each('type_detail_product.one', $type_details, 'type_detail')
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
</div>


@endsection

