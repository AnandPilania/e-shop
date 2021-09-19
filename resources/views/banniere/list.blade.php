@extends('layouts.head_admin')

@section('content')

<div class="card">
    <div class="card-body">
        <h4 class="card-title">Bannière</h4>
        @if (Session::has('status'))
        <div class="alert alert-succes">{{Session::get('status')}}</div>
        @endif
        <div class="row">
        <button class="btn btn-outline-primary"><a href="/bannieres/create">Nouveau</a></button>
        <br><br>
            <div class="col-12">
                <div class="table-responsive">
                    <table id="order-listing" class="table">
                        <thead>
                            <tr>
                                <th>H2</th>
                                <th>P</th>
                                <th>Image</th>
                                <th>Alt</th>
                                <th>Lien</th>
                            </tr>
                        </thead>
                        <tbody>
                            @each('banniere.one', $bannieres, 'banniere')
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
</div>


@endsection

