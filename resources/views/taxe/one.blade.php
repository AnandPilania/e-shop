<tr>
    <td>{{$taxe->id}}</td>
    <td>{{$taxe->tva_rate}}</td>
    <td class="td_Button">
        <form action="/taxes/{{$taxe->id}}/edit" method="get">
            @csrf
            <input type="submit" value="Modifier" name="update" class="btn btn-outline-primary">
        </form>
    </td>
    <td>
        <form action="/taxes/{{ $taxe->id }}" method="post">
            @csrf
            @method('delete')
            <input type="submit" value="Supprimer" name="delete" class="btn btn-outline-danger">
        </form>
    </td>
</tr>

