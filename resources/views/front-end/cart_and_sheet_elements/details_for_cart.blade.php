 <!-- Détails -->
 {{ $lastValue = '' }}


 @foreach ($cartProduct[0]->product_details as $value)
 <!-- @dump($cartProduct) -->

 <div class="cart_block_details">


     <!-- nom du détail -->
     @if ($value->type_detail_product->name != $lastValue)
     <!-- permet de refermer le select quand on change de nom de détail -->
     @if ($value->type_detail_product->name != $lastValue && $loop->index != 0)
     </select>
     @endif
     <h4 id="nomDetail">{{ $lastValue = $value->type_detail_product->name }}</h4>

     <!-- <script>
     listDetailsToAddToCart("{!! $value->type_detail_product->name !!}");
 </script> -->

     <select name="{{ $value->type_detail_product->name }}" id="{{ $cartProduct['product_id_cart'] }}" onchange="handleDetails(event, <?php echo json_encode($cartProduct['product_id_cart']) ?>)">
         @endif

         <!-- valeur du détail -->
         @if ($value->type_detail_product->name == $lastValue)

         <option value="{{ $value->libelle }}" {{$value->libelle == $cartProduct[$value->type_detail_product->name] ? 'selected' : ''}}>{{ $value->libelle }}</option>
         @endif

         <!-- REFERME LE SELECT A LA DERNI7RE BOUCLE -->
         @if ($loop->last)

     </select>
     @endif
 </div>
 @endforeach