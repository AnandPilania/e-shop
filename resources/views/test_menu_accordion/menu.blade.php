@extends('layouts.head_admin')

@section('content')

<button class="accordion"><img class="barcodeIcon" src="{{ asset('images\icons\icons8-label-128.png') }}">Produit</button>
<div class="panel">
  <div class="panel_elements">
    <span>Tous les produits</span>
    <span>Ajouter un produit</span>
    <span>Ajouter une catégorie</span>
  </div>
</div>

<button class="accordion"><img class="barcodeIcon" src="{{ asset('images\icons\icons8-label-128.png') }}">Section 2</button>
<div class="panel">
  <div class="panel_elements">
    <span>Tous les produits</span>
    <span>Ajouter un produit</span>
    <span>Ajouter une catégorie</span>
  </div>
</div>

<button class="accordion"><img class="barcodeIcon" src="{{ asset('images\icons\icons8-label-128.png') }}">Section 3</button>
<div class="panel">
  <div class="panel_elements">
    <span>Tous les produits</span>
    <span>Ajouter un produit</span>
    <span>Ajouter une catégorie</span>
  </div>
</div>

<script>
  var acc = document.getElementsByClassName("accordion");
  var i;

  for (i = 0; i < acc.length; i++) {
    acc[i].addEventListener("click", function() {
      this.classList.toggle("active");
      var panel = this.nextElementSibling;
      if (panel.style.maxHeight) {
        panel.style.maxHeight = null;
      } else {
        panel.style.maxHeight = panel.scrollHeight + "px";
      }
    });
  }
</script>

@endsection