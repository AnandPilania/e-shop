 <!-- Détails -->
 {{ $lastValue = '' }}

<div class="wrapper_details">
    @foreach ($product->product_details as $value)
    <!-- referme la div quand on change de type de détails -->
    @if ($value->type_detail_product->name != $lastValue && !$loop->first)
</div>
@endif
<!-- nom du détail -->
@if ($value->type_detail_product->name != $lastValue)
<div class="block_detail">
    <h4 id="nomDetail">{{ $lastValue = $value->type_detail_product->name }}</h4>
    <span id="{{ $value->type_detail_product->name }}" class="missingDetails">Ce champ est obligatoire</span>
    <script>
        listDetailsToAddToCart("{!! $value->type_detail_product->name !!}");
    </script>
    @endif
    <!-- valeur du détail -->
    @if ($value->type_detail_product->name == $lastValue)
    <input type="radio" class="details radio_item" value="{{ $value->libelle }}" name="{{ $value->type_detail_product->name }}" id="{{ $value->libelle }}" required onclick="addDetailToCart(event)">
    <label class="label_item" for="{{ $value->libelle }}"> {{ $value->libelle }}</label>
    @endif
    <!-- referme la div quand on change de type de détails -->
    @if ($loop->last)
</div>
@endif
@endforeach