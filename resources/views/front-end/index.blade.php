@extends('layouts.head-frontend')

@section('content')
<div class="container_index-front">

    <h1 class="text_jumbo">{{ $jumbo[0]->text }}</h1>

    <img src="{{ $jumbo[0]->image }}" alt="{{ $jumbo[0]->text }}" class="image_jumbo">

    <div class="text-accueil">
        <h3>LE REPAIRE DES ESPRITS LIBRES</h3>
        <p>
            Affirme fièrement ta nature profonde et libère-toi du regard des autres chez Crâne Faction. Véritables symboles d’indépendance, nos produits Tête de Mort te permettront d'exposer ton mode de vie et tes convictions avec style.
        </p>
    </div>


    <div class="gallery_3_images_container">
        <div class="gallery_3_images">
            <img src="{{ asset('e-shopImages\jupe.jpg') }}" alt="">
            <h2>Jupes</h2>
            <a href="" class="gallery_3_lien">Voir les jupes</a>
        </div>

        <div class="gallery_3_images">
            <img src="{{ asset('e-shopImages\jeans.jpg') }}" alt="">
            <h2>Jeans</h2>
            <a href="" class="gallery_3_lien">Voir les jeans</a>
        </div>

        <div class="gallery_3_images">
            <img src="{{ asset('e-shopImages\chaussures.jpg') }}" alt="">
            <h2>Chaussures</h2>
            <a href="" class="gallery_3_lien">Voir les chaussures</a>
        </div>
    </div>

    <div class="best_seller_wrapper">
        @for ($i = 0; $i < 5; $i++) <div class="best_seller_sheet">
            <div class="best_seller_image">
                <img src="{{  $bestSellers[$i]->images_products[0]->path }}" alt="">
            </div>
            <h2>{{ $bestSellers[$i]->name }}</h2>
            <h5>{{ $bestSellers[$i]->price }}</h5>
    </div>
    @endfor
</div>

<div class="banniere ban-left">
    @isset($bannieres[0])
    <div class="banniere_img">
        <img src="{{ $bannieres[0]->image }}" alt="{{ $bannieres[0]->alt }}">
    </div>
    <div class="banniere_txt">
        <h2>{{ $bannieres[0]->h2 }}</h2>
        <div class="banniere_p">
            {!! $bannieres[0]->p !!}
        </div>
        <button><a href="{{ $bannieres[0]->link }}">mon lien</a></button>
    </div>
    @endisset
</div>
</div>
@endsection