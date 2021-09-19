@extends('layouts.default')

@section('content')

<div class="edit">

    <form action="/questions/{{ $question->id }}" method="post">
        @csrf
        @method('put')
        <h3>Modifier une question</h3>
        <label for="quiz_id">Sélectionnez un quiz</label>
        <select name="quiz_id" id="quiz_id">
            <option value="{{ $question->quiz_id }}">{{ $question->quiz->titre }}</option>
            @foreach($quizzes as $quiz)
            <option {{ old('quiz_id') == $quiz->id ? "selected" : "" }} value="{{ $quiz->id }}">{{ $quiz->titre }}</option>
            @endforeach
        </select>
        @error('quiz_id')
        <div class="alert alert-danger">{{ $message }}</div>
        @enderror
        <label for="question">Question</label>
        <input type="text" name="question" id="question" value="{{ $question->question }}">
        @error('question')
        <div class="alert alert-danger">{{ $message }}</div>
        @enderror
        <label for="type">Type de question</label>
        <select name="type" id="type">
            <option value="{{ $question->type }}">{{ $question->type === 'checkbox' ? 'Choix multiple' : 'Choix unique'}}</option>
            <option value="{{ $question->type === 'checkbox' ? 'radio' : 'checkbox'}}">
                {{ $question->type === 'checkbox' ? 'Choix unique' : 'Choix multiple'}}
            </option>
        </select>
        @error('type')
        <div class="alert alert-danger">{{ $message }}</div>
        @enderror
        <input type="hidden" name="ordre" id="ordre" value="{{ $question->ordre }}">
        <input type="submit">
    </form>

</div>


@endsection