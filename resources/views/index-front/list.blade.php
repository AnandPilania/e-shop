@extends('layouts.head_admin')

@section('content')

<div class="card">
    <div class="card-body">
        <h4 class="card-title">Jumbotron</h4>
        @if (Session::has('status'))
        <div class="alert alert-succes">{{Session::get('status')}}</div>
        @endif
        <div class="row">
        <button class="btn btn-outline-primary"><a href="/jumbos/create">Nouveau</a></button>
        <br><br>
            <div class="col-12">
                <div class="table-responsive">
                    <table id="order-listing" class="table">
                        <thead>
                            <tr>
                                <th>Texte</th>
                                <th>Texte du bouton</th>
                                <th>Image</th>
                                <th>Alt</th>
                            </tr>
                        </thead>
                        <tbody>
                            @each('jumbo.one', $jumbos, 'jumbo')
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
</div>


@endsection

