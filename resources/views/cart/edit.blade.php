@extends('layouts.head_admin')

@section('title')
<h2>Modifier un panier</h2>
@endsection

@section('content')
<div class="main-panel">
    <div class="content-wrapper">
        <div class="row grid-margin">
            <div class="col-lg-12">
                <div class="card">
                    <div class="card-body">
                        <h4 class="card-title">Modifier un panier</h4>
                        @if (Session::has('status'))
                        <div class="alert alert-succes">{{Session::get('status')}}</div>
                        @endif
                        <form class="cmxform" id="commentForm" method="post" action="/carts/{{ $cart->id }}">
                            @csrf
                            @method('put')
                            <fieldset>
                            <div class="form-group">
                                    <label for="cart_id">CartId</label>
                                    <input id="cart_id" class="form-control" name="cart_id"  type="text" value="{{ $cart->cart_id }}">
                                </div>
                                @error('cart_id')
                                <div class=" alert alert-danger">{{ $message }}
                                </div>
                                @enderror
                                <div class="form-group">
                                    <label for="product_id">ProductId</label>
                                    <input id="product_id" class="form-control" name="product_id"  type="text" value="{{ $cart->product_id }}">
                                </div>
                                @error('product_id')
                                <div class=" alert alert-danger">{{ $message }}
                                </div>
                                @enderror
                                <div class="form-group">
                                    <label for="quantity">Quantity</label>
                                    <input id="quantity" class="form-control" name="quantity"  type="text" value="{{ $cart->quantity }}">
                                </div>
                                @error('quantity')
                                <div class=" alert alert-danger">{{ $message }}
                                </div>
                                @enderror
                                <div class="form-group">
                                    <label for="selected">Selected</label>
                                    <input id="selected" class="form-control" name="selected"  type="checkbox" value="{{ $cart->selected }}">
                                </div>
                                @error('selected')
                                <div class=" alert alert-danger">{{ $message }}
                                </div>
                                @enderror
                                <input class="btn btn-primary" type="submit" value="Envoyer">
                            </fieldset>
                        </form>
                    </div>
                </div>
            </div>
        </div>

    </div>
</div>
@endsection

