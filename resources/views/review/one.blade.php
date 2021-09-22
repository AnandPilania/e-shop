<tr>
    <td>{{$review->product->name}}</td>
    <td>
        @isset($review->product->images_products->first()->path)
        <img src="{{  $review->product->images_products->first()->path }}">
        @endisset
    </td>
    <td>{{$review->user->name}}</td>
    <td>{{$review->title}}</td>
    <td>{{$review->review}}</td>
    <td>{{$review->stars}}</td>


    <td class="td_Button">
        <form action="/reviews/{{$review->id}}/edit" method="get">
            @csrf
            <input type="submit" value="Modifier" name="update" class="btn btn-outline-primary">
        </form>
    </td>
    <td>
        <form action="/reviews/{{ $review->id }}" method="post">
            @csrf
            @method('delete')
            <input type="submit" value="Supprimer" name="delete" class="btn btn-outline-danger">
        </form>
    </td>
</tr>