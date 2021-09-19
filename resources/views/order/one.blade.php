<tr>
    <td>
        {{$question->question}}
    </td>
    <td>
        {{$question->type == 'radio' ? 'Choix unique' : 'Choix multiple'}}
    </td>
    <td>
        {{$question->quiz->titre}}
    </td>

    @if(Auth::check())
    <td class="td_Button">
        <form action="/questions/{{ $question->id }}" method="post">
            @csrf
            @method('delete')
            <input type="submit" value="Supprimer" name="delete" class="supp">
        </form>
    </td>
    <td class="td_Button">
        <form action="/questions/{{ $question->id }}/edit" method="get">
            @csrf
            <input type="submit" value="Modifier" name="update" class="modif">
        </form>
    </td>
    @endif
</tr>