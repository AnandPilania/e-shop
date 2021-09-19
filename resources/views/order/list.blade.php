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
                                <th>Order #</th>
                                <th>Nom du client</th>
                                <th>Adresse</th>
                                <th>panier</th>
                                <th>Payement Id</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>1</td>
                                <td>nomcli</td>
                                <td>adress</td>
                                <td>panier</td>
                                <td>idpay</td>
                                <td>
                                    <button class="btn btn-outline-primary">Voir</button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
</div>


@endsection

