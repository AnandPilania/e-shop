<tr>
    <td>
        {{$product->id}}
    </td>
    <td>
        {{$product->images_products->first()->path}}
    </td>
    <td>
        {{$product->name}}
    </td>
    <td>
        {{$product->category->name}}
    </td>
    <td>
        {{$product->price}}
    </td>
    <td> <label class="badge badge-info">Status </label>
    </td>
    <td>
    <button class="btn btn-outline-primary"><a href="/products/{{$product->id}}/edit">Modifier</a></button>
        <button class="btn btn-outline-danger">Supprimer</button>
    </td>
</tr>

