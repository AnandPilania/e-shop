@extends('layouts.head_admin')

@section('content')

<h1>Frequently Asked Questions</h1>
<div class="block">
  <div>
    <input type="radio" name="item" id="item-one" hidden />
    <label for="item-one">Produit</label>
    <div>
      <p>Tous les produits</p>
      <p>Ajouter un produit</p>
      <p>Ajouter une catégorie</p>
      <p>Ajouter une collection</p>
      <p> </p>
    </div>
  </div>
  <div>
    <input type="radio" name="item" id="item-two" hidden />
    <label for="item-two">What Do You Do?</label>
    <div>
      <p>I'm a web developer by day, and a web developer by night. I live a very exciting life.</p>
    </div>
  </div>
  <div>
    <input type="radio" name="item" id="item-three" hidden />
    <label for="item-three">What Is This Sorcery?!</label>
    <div>
      <p>Nothing magical going on here. All we're doing is taking advantage of radio inputs and styling adjacent divs to display when an input is selected.</p>
    </div>
  </div>
  <div>
    <input type="radio" name="item" id="item-four" hidden />
    <label for="item-four">How Long Have You Been Developing For?</label>
    <div>
      <p>I've been developing websites for nearly 10 years, with the majority of those years spent using WordPress.</p>
    </div>
  </div>
</div>

@endsection