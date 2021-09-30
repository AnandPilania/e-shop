<tr>
    <th>Id</th>
    <th>Image</th>
    <th>Product</th>
    <th>User</th>
    <th>Quantity</th>
    <th>Selected</th>
    <th>Created_at</th>
    <th>Updated_at</th>
    <td>
        {{$cart->id}}
    </td>
    <td>
        {{$cart->product->images_products->first()->path}}
    </td>
    <td>
        {{$cart->product->name}}
    </td>
    <td>
        {{$cart->user->last_name}}
    </td>
    <td>
        {{$cart->quantity}}
    </td>
    <td>
        {{$cart->selected}}
    </td>
    <td>
        {{$cart->created_at}}
    </td>
    <td>
        {{$cart->updated_at}}
    </td>
    <td class="td_Button">
        <form action="/carts/{{$cart->id}}/edit" method="get">
            @csrf
            <input type="submit" value="Modifier" name="update" class="btn btn-outline-primary">
        </form>
    </td>
    <td>
        <form action="/carts/{{ $cart->id }}" method="post">
            @csrf
            @method('delete')
            <input type="submit" value="Supprimer" name="delete" class="btn btn-outline-danger">
        </form>
    </td>
</tr>