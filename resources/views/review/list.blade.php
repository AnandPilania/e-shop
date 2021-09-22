@extends('layouts.head_admin')

@section('content')

<div class="card">
    <div class="card-body">
        <h4 class="card-title">Reviews</h4>
        @if (Session::has('status'))
        <div class="alert alert-succes">{{Session::get('status')}}</div>
        @endif
        <div class="row">
        <button class="btn btn-outline-primary"><a href="/reviews/create">Nouveau</a></button>
        <br><br>
            <div class="col-12">
                <div class="table-responsive">
                    <table id="order-listing" class="table">
                        <thead>
                            <tr>
                                <th>Prooduct</th>
                                <th>Image</th>
                                <th>User</th>
                                <th>Title</th>
                                <th>$reviews</th>
                                <th>Stars</th>
                            </tr>
                        </thead>
                        <tbody>
                            @each('review.one', $reviews, 'review')
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
</div>


@endsection

