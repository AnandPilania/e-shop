<nav class="w-full h-auto flex flex-row justify-start items-center bg-indigo-700">

	<ul class="w-full relative h-28 px-32 flex flex-row justify-center items-center text-lg text-gray-200" id="nav-frontend">
		@foreach ($categories as $category)
		<div class="">
			<li class="categoryNav27112022 w-auto mx-3 peer/itemsMenu">
				<a class="w-auto" href="/{{$category->name}}">
					{{$category->name}}
				</a>
			</li>
			<ul class="subMenu27112022 w-full absolute top-28 left-0 h-64 px-28 py-7 transition-all duration-300 ease-out invisible peer-hover/itemsMenu:visible hover:visible text-gray-400 text-lg bg-gray-50 border-b border-gray-200">
				@foreach ($category->collections as $collection)
				<li class="">
					<a href="/{{$collection->name}}">
						{{$collection->name}}
					</a>
				</li>
				@endforeach
			</ul>
		</div>
		@endforeach
		<a href="/" class='text-lg text-white'>
			H
		</a>
	</ul>
</nav>

