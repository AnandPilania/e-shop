<tr>
    <td class="td_id">
        {{$product->id}}
    </td>
    <td>
        @isset($product->images_products->first()->path)
        <img src="{{  $product->images_products->first()->path }}">
        @endisset
    </td>
    <td>
        {{$product->name}}
    </td>
    <td>
        @isset($product->collections->first()->name)
            @foreach($product->collections as $collection)
                {{$collection->name}}
                <br>
            @endforeach
        @endisset
    </td>
    <td>
        {{$product->price}}
    </td>
    <td>
        <input type="checkbox" id="{!! $product->id !!}" onclick="bestSellChecked(id)" @if ($product->best_sell === 1) checked @endif />
    </td>
    <td class="td_buton">
        <button class="btn btn_img"><a href="/editImagesProduct/{{$product->id}}">Image</a></button>

        <button class="btn btn_edit"><a href="/products/{{$product->id}}/edit">Modifier</a></button>


        <form action="/products/{{ $product->id }}" method="post">
            @csrf
            @method('delete')
            <input type="submit" value="Supprimer" name="delete" class="btn btn_delete" >
        </form>

    </td>
</tr>


<script src="https://unpkg.com/axios/dist/axios.min.js"></script>
<script>
    var check = false;

    function bestSellChecked(id) {
        if (document.getElementById(id).checked) {
            check = 1;
        } else {
            check = 0;
        }

        axios.post(`http://127.0.0.1:8000/bestSeller`, {
                id: id,
                checked: check
            })
            .then(res => {
                console.log('res:   ' + res);
            }).catch(function(error) {
                console.log('error:   ' + error);
            });
    }
</script>