 <!-- Détails -->
 {{ $lastValue = '' }}


 @foreach ($cartProduct->product_details as $value)

 <!-- nom du détail -->
 @if ($value->type_detail_product->name != $lastValue)
 @if ($value->type_detail_product->name != $lastValue && $loop->index != 0)
 </select>
 @endif
 <h4 id="nomDetail">{{ $lastValue = $value->type_detail_product->name }}</h4>

 <script>
     listDetailsToAddToCart("{!! $value->type_detail_product->name !!}");
 </script>

 <select name="{{ $value->type_detail_product->name }}" id="{{ $value->type_detail_product->name }}" onchange="addDetailToCart(event)">
     @endif

     <!-- valeur du détail -->
     @if ($value->type_detail_product->name == $lastValue)
     <option value="{{ $value->libelle }}">{{ $value->libelle }}</option>

     @endif
     @if ($loop->last)
 </select>
 @endif
 @endforeach