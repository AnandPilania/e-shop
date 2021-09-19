<tr>
    <td>{{$banniere->h2}}</td>
    <td>{{$banniere->p}}</td>
    <td>{{$banniere->image}}</td>
    <td>{{$banniere->alt}}</td>
    <td>{{$banniere->link}}</td>
    <td class="td_Button">
        <form action="/bannieres/{{$banniere->id}}/edit" method="get">
            @csrf
            <input type="submit" value="Modifier" name="update" class="btn btn-outline-primary">
        </form>
    </td>
    <td>
        <form action="/bannieres/{{ $banniere->id }}" method="post">
            @csrf
            @method('delete')
            <input type="submit" value="Supprimer" name="delete" class="btn btn-outline-danger">
        </form>
    </td>
</tr>

