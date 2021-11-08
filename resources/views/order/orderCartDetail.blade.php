@extends('layouts.head_admin')

@section('content')

@dump($order)
<div class="order_details">
    <span>Order id : {{ $order->id }}</span>
    <span>User : {{ $order->user->first_name }} {{ $order->user->last_name }}</span>
    <span>Address user : {{ $order->user->address_user }}</span>
    <span>userLastName : {{ $order->user->last_name }}</span>

    @foreach ($order->cartAndProduct as $item)
    @foreach ($item as $key => $value)
    @if ($key != 'product')
    <span>{{ $key }} : {{ $value }}</span><br>
    @else
    <span>Product name : {{ $value->name}}</span><br>
    @endif
    @endforeach
    @endforeach
</div>



<script>
    // import require from 'require';
    const scrape = require('aliexpress-product-scraper');
    



    const product = scrape('32958933105');
    product.then(res => {
        console.log('The JSON: ', res);
    });
</script>