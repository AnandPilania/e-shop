<nav class="w-full h-auto">
	<ul class="w-full h-28 px-32 flex flex-row justify-end items-center text-lg text-white bg-indigo-700" id="nav-frontend">
		<!-- @foreach ($categories as $category)
			<li class="menu-deroulant"><a class="font-Comfortaa" href="/{{$category->name}}">{{$category->name}}</a>
			</li>

			<ul class="sous-menu">
				<div class="sous-menu-align">
					@foreach ($category->collections as $collection)
					<li><a class="font-Comfortaa" href="/{{$collection->name}}">{{$collection->name}}</a>
					</li>
					@endforeach
				</div>
			</ul>
			@endforeach -->

		<a href="/" class='flex flex-row justify-start items-center mr-auto'>
			<span class='text-[24px] text-teal-400 font-semibold font-Comfortaa'>
				my
			</span>
			<span class='text-[24px] text-white font-semibold font-Comfortaa'>
				easy
			</span>
			<span class='text-[24px] text-teal-400 font-semibold font-Comfortaa'>
				boutique
			</span>
		</a>



		<li class="mr-10 hover:scale-105 transition ease-in-out duration-75"><a class="font-Comfortaa" href="/">Accueil</a></li>
		<li class="mr-10 hover:scale-105 transition ease-in-out duration-75"><a class="font-Comfortaa" href="/admin">Admin</a></li>
		@if (!auth()->user())
		<li class="mr-10 hover:scale-105 transition ease-in-out duration-75"><a class="font-Comfortaa" href="/login">Login</a></li>
		@endif
		@if (auth()->user())
		<li class="mr-10 hover:scale-105 transition ease-in-out duration-75"><a class="font-Comfortaa" href="/logout">Logout</a></li>
		@endif
		<li class="mr-10 hover:scale-105 transition ease-in-out duration-75"><a class="font-Comfortaa" href="/">Aide</a></li>
		<li class="mr-10 hover:scale-105 transition ease-in-out duration-75"><a class="font-Comfortaa" href="/panier">Cart</a></li>
		@if (auth()->user())
		<li>{{ auth()->user()->first_name }}</li>
		@endif
	</ul>
</nav>