<nav class="w-full h-auto flex flex-row justify-start items-center bg-indigo-700">

	<ul class="w-full h-28 px-32 flex flex-row justify-center items-center text-lg text-gray-200 border-2 border-green-500" id="nav-frontend">
		@foreach ($categories as $category)
		<li class="categoryNav27112022 w-auto px-3 flex flex-row justify-start items-start"
		>
			<a class="w-auto" href="/{{$category->name}}">
				{{$category->name}}
			</a>
		</li>
		<ul class="dropedMenu27112022 w-full invisible h-96 text-gray-600 text-lg  bg-red-200 border border-gray-200">
				@foreach ($category->collections as $collection)
				<li class="px-2 text-white">
					<a href="/{{$collection->name}}">
						{{$collection->name}}
					</a>
				</li>
				@endforeach
			</ul>
		@endforeach
		<a href="/" class='text-lg text-white'>
			H
		</a>
	</ul>
</nav>

<script>
  let itemsMenu = document.getElementsByClassName("categoryNav27112022");
  let subMenu = document.getElementsByClassName("dropedMenu27112022");

for (let i = 0; i < itemsMenu.length; i++) {
	itemsMenu[i].addEventListener("mouseover", function() {
	subMenu[i].classList.remove("invisible");
	subMenu[i].classList.add("visible");
  });
}

for (let i = 0; i < itemsMenu.length; i++) {
	itemsMenu[i].addEventListener("mouseleave", function() {
	subMenu[i].classList.remove("visible");
	subMenu[i].classList.add("invisible");
  });
}
 

 


</script>
