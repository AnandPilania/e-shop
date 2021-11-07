<tr>
    <td>
        {{$order->created_at}}
    </td>
    <td>
        {{$order->user->id}}
    </td>
    <td>
        {{$order->user->last_name}}
    </td>
    <td>
        {{$order->user->address_user->country}}
    </td>
    <td>
        {{$order->user->address_user->cp}}
    </td>
    <td>
        {{$order->total_amount}} €
    </td>
    <td style="max-width: 200px;">
        {{$order->cart}}
    </td>
    <td>
        {{$order->stripe_id}}
    </td>
    <td>
        {{$order->payment_operator}}
    </td>

    @if(Auth::check())
    <td class="td_Button">
        <a href="/orders/{{ $order->id }}" class="btn btn_img" style="text-decoration: none; color: white;">Panier
        </a>
    </td>
    <td class="td_Button">
        <form action="/orders/{{ $order->id }}" method="post">
            @csrf
            @method('delete')
            <input type="submit" value="Supprimer" name="delete" class="btn btn_delete">
        </form>
    </td>
    <td class="td_Button">
        <form action="/orders/{{ $order->id }}/edit" method="get">
            @csrf
            <input type="submit" value="Modifier" name="update" class="btn btn_edit">
        </form>
    </td>
    @endif
</tr>
