@extends('layouts.head_admin')

@section('content')


<div class="card">
    <div class="card-body">
        <h4 class="card-title">Commandes</h4>
        <div class="row">
            <button class="btn btn-outline-primary"><a href="/orders/create">Nouveau</a></button>
            <br><br>
            <div class="col-12">
                <div class="table-responsive">
                    <table id="order-listing" class="table">
                        <thead>
                            <tr>
                                <th>Order date</th>
                                <th>Client_Id</th>
                                <th>Nom_client</th>
                                <th>Pays</th>
                                <th>Code_postal</th>
                                <th>Montant</th>
                                <th>Panier</th>
                                <th>Payement_id</th>
                                <th>PayementOperator</th>
                                <th></th>
                                <th></th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            @each('order.one', $orders, 'order')
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
</div>


@endsection