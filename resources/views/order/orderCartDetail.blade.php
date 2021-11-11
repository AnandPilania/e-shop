@extends('layouts.head_admin')

@section('content')

@dump($order)
<div class="order_details" style="background-color: #1e1e2f;">
    <div class="wrapper_order_detail">
        <div class="block_order_detail block_order_detail_user">
            <div class="title_order_detail">Client</div>
            <span>Id : {{ $order->user->id }}</span><br>
            <span>Nom : {{ $order->user->first_name }} {{ $order->user->last_name }}</span><br>
            <span>Email : {{ $order->user->email }}</span><br>
            <span>Téléphone : {{ $order->user->address_user->phone }}</span><br>
            <span>Inscrit le : {{ $order->user->created_at }}</span><br>
        </div>

        <div class="block_order_detail block_order_detail_address">
            <div class="title_order_detail">Adresse de livraison</div>
            <span>Adresse : {{ $order->user->address_user->address }}</span><br>
            <span>Adresse complément : {{ $order->user->address_user->addressComment }}</span><br>
            <span>Code postal : {{ $order->user->address_user->cp }}</span><br>
            <span>Ville : {{ $order->user->address_user->city }}</span><br>
            <span>Pays : {{ $order->user->address_user->country }}</span><br>
        </div>

        <div class="block_order_detail block_order_detail_addressBill">
            <div class="title_order_detail">Adresse de facturation</div>
            <span>Nom : {{ $order->user->address_user->first_nameBill }} {{ $order->user->address_user->last_nameBill }}</span><br>
            <span>Adresse : {{ $order->user->address_user->addressBill }}</span><br>
            <span>Adresse complément : {{ $order->user->address_user->addressCommentBill }}</span><br>
            <span>Code postal : {{ $order->user->address_user->cpBill }}</span><br>
            <span>Ville : {{ $order->user->address_user->cityBill }}</span><br>
            <span>Pays : {{ $order->user->address_user->countryBill }}</span><br>
        </div>

        <div class="block_order_detail block_order_detail_product">
            <div class="title_order_detail">Commande(s) </div>
            <span>Order id : {{ $order->id }}</span><br><br>


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

        <div id="extends">Mon extension</div>
        <img src="https://ae01.alicdn.com/kf/H6b37ffe30d014b0a9d67498c2aead4306/MIZHSE-Vernis-ongles-UV-Gel-r-fl-chissant-brillant-12-couleurs-Semi-Permanent-hybride-pour-Nail.jpg_50x50.jpg_.webp" class="" title="Silver diamood 001" alt="Silver diamood 001" data-spm-anchor-id="a2g0o.detail.1000016.i2.12544d2dCp2kbM">

    </div>


</div>

@endsection