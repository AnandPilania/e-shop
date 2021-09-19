@extends('layouts.head_admin')

@section('title')
<h2>Ajouter une catégorie</h2>
@endsection

@section('content')
<div id="editFormProduct"></div>

<script>
    var productId = "{{ $id }}"

</script>

<script src="{{ asset('js/editProduct.js') }}"></script>
@endsection