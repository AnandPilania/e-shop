<tr>
    <td>{{$jumbo->text}}</td>
    <td>{{$jumbo->button_text}}</td>
    <td>{{$jumbo->image}}</td>
    <td>{{$jumbo->alt}}</td>
    <td class="td_Button">
        <form action="/jumbos/{{$jumbo->id}}/edit" method="get">
            @csrf
            <input type="submit" value="Modifier" name="update" class="btn btn-outline-primary">
        </form>
    </td>
    <td>
        <form action="/jumbos/{{ $jumbo->id }}" method="post">
            @csrf
            @method('delete')
            <input type="submit" value="Supprimer" name="delete" class="btn btn-outline-danger">
        </form>
    </td>
</tr>

