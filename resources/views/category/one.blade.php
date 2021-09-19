<tr>
    <td>{{$category->id}}</td>
    <td>{{$category->name}}</td>
    <td class="td_Button">
        <form action="/categories/{{$category->id}}/edit" method="get">
            @csrf
            <input type="submit" value="Modifier" name="update" class="btn btn-outline-primary">
        </form>
    </td>
    <td>
        <form action="/categories/{{ $category->id }}" method="post">
            @csrf
            @method('delete')
            <input type="submit" value="Supprimer" name="delete" class="btn btn-outline-danger">
        </form>
    </td>
</tr>