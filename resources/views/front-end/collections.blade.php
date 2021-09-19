@extends('layouts.head-frontend')

@section('content')
<div class="container_collections_front">
    <div class="collections_header">
        <h1>NOS COLLECTIONS</h1>
        <h2>Découvrez les collections de notre boutique.</h2>
    </div>
    <div class="collections_wrapper">
        @foreach($collections as $collection)
        <div class="collection_card">
             <a href="/collections/{{$collection->link}}">
                <h2>{{$collection->name}}</h2>
                <span>Tout afficher</span>
                <img src="{{$collection->image}}" alt="{{$collection->alt}}">
            </a>
        </div>
        @endforeach

    </div>
    <h1>hello</h1>

</div>
@endsection