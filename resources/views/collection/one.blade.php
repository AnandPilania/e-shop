<tr>
    <td>{{$collection->id}}</td>
    <td>{{$collection->name}}</td>
    <td>{{$collection->image}}</td>
    <td>{{$collection->alt}}</td>
    <td>{{$collection->category->name}}</td>
    
    <td class="td_Button">
        <form action="/collections/{{$collection->id}}/edit" method="get">
            @csrf
            <input type="submit" value="Modifier" name="update" class="btn btn-outline-primary">
        </form>
    </td>
    <td>
        <form action="/collections/{{ $collection->id }}" method="post">
            @csrf
            @method('delete')
            <input type="submit" value="Supprimer" name="delete" class="btn btn-outline-danger" >
        </form>
    </td>
</tr>

