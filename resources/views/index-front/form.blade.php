@extends('layouts.head_admin')

@section('title')
<h2>Ajouter une catégorie</h2>
@endsection

@section('content')
<div class="wrapper-form">
    <h4 class="card-title">Ajouter un jumbotron</h4>
    <form method="post" action="/jumbos" enctype="multipart/form-data">
        @csrf
        <!-- header text accueil -->
        <!-- ICI CKEDITOR -->
        <label for="HeadText">Header text accueil</label>
        <div id="HeadText" name="HeadText"></div>
        @error('HeadText')
        <div class="alert">{{ $message }}</div>
        @enderror
        <br>
        <!-- gallery 3 images de tête-->
        @for ($i = 0; $i < 3; $i++) <label for="{{'image ' . $i}}">{{'Image ' . $i}}</label>
            <input type="file" name="{{'image ' . $i}}" id="{{'image ' . $i}}" />
            @error('image ' . $i)
            <div class="alert">{{ $message }}</div>
            @enderror
            <label for="{{'altImage' . $i}}">{{'AltImage' . $i}}</label>
            <input id="{{'altImage' . $i}}" name="{{'altImage' . $i}}" type="text">
            @error('altImage' . $i)
            <div class="alert">{{ $message }}</div>
            @enderror
            <label for="{{'texteImage' . $i}}">{{'TexteImage' . $i}}</label>
            <input id="{{'texteImage' . $i}}" name="{{'texteImage' . $i}}" type="text">
            @error('texteImage' . $i)
            <div class="alert">{{ $message }}</div>
            @enderror
            <label for="{{'lienImage'  . $i}}" . $i>{{'LienImage' . $i}}</label>
            <input id="{{'lienImage'  . $i}}" name="{{'lienImage'  . $i}}" type="text">
            @error('lienImage' . $i)
            <div class="alert">{{ $message }}</div>
            @enderror
            @endfor
            <br><br>

            <!-- block collection 1 -->

            <!-- image header -->
            <label for="imgColl1">Image block collection 1</label>
            <input type="file" name="imgColl1" id="imgColl1">
            @error('imgColl1')
            <div class="alert">{{ $message }}</div>
            @enderror
            <label for="{{'altImgColl1' . $i}}">{{'AltImageCollection1' . $i}}</label>
            <input id="{{'altImgColl1' . $i}}" name="{{'altImgColl1' . $i}}" type="text">
            @error('altImgColl1' . $i)
            <div class="alert">{{ $message }}</div>
            @enderror

            <!-- text en dessous de image header -->
            <label for="headerColl1">Header text accueil</label>
            <div id="headerColl1" name="headerColl1"></div>
            @error('headerColl1')
            <div class="alert">{{ $message }}</div>
            @enderror


            <br><br>
            <!-- images et textes produits collection 1 -->
            @for ($i = 0; $i < 5; $i++) <!-- image -->
                <label for="{{'imgProdColl1_' . $i}}">{{'Image product coll ' . $i}}</label>
                <input type="file" name="{{'imgProdColl1_' . $i}}" id="{{'imgProdColl1_' . $i}}" />
                @error('imgProdColl1_' . $i)
                <div class="alert">{{ $message }}</div>
                @enderror
                <!-- Alt -->
                <label for="{{'altimgProdColl1_' . $i}}">{{'Alt Image Product Collection' . $i}}</label>
                <input id="{{'altimgProdColl1_' . $i}}" name="{{'altimgProdColl1_' . $i}}" type="text">
                @error('altimgProdColl1_' . $i)
                <div class="alert">{{ $message }}</div>
                @enderror
                <!-- texte -->
                <label for="{{'txtColl1_' . $i}}">{{'Texte Collection 1 ' . $i}}</label>
                <input id="{{'txtColl1_' . $i}}" name="{{'txtColl1_' . $i}}" type="text">
                @error('txtColl1_' . $i)
                <div class="alert">{{ $message }}</div>
                @enderror

                <!-- price -->
                <label for="{{'priceColl1_' . $i}}">{{'Prix Collection 1 ' . $i}}</label>
                <input id="{{'priceColl1_' . $i}}" name="{{'priceColl1_' . $i}}" type="number">
                @error('priceColl1_' . $i)
                <div class="alert">{{ $message }}</div>
                @enderror
                @endfor

                <input class="btn" type="submit" value="Envoyer">
    </form>
</div>
@endsection

@section('scripts')
<!-- ckeditor5 -->
<script src="[ckeditor-build-path]/ckeditor.js"></script>
<script src="https://cdn.ckeditor.com/ckeditor5/29.1.0/classic/ckeditor.js"></script>

<script>
    ClassicEditor
        .create(document.querySelector('#HeadText'))
        .then(editor => {
            console.log(editor);
        })
        .catch(error => {
            console.error(error);
        });

    ClassicEditor
        .create(document.querySelector('#headerColl1'))
        .then(editor => {
            console.log(editor);
        })
        .catch(error => {
            console.error(error);
        });
</script>
@endsection