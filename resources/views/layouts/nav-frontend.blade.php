<nav class="nav-frontend" id="nav-frontend">
	<ul>
			@foreach ($categories as $category)
			<li class="menu-deroulant"><a href="/{{$category->name}}">{{$category->name}}</a>
			</li>

			<ul class="sous-menu">
				<div class="sous-menu-align">
					@foreach ($category->collections as $collection)
					<li><a href="/{{$collection->name}}">{{$collection->name}}</a>
					</li>
					@endforeach
				</div>
			</ul>


			@endforeach
			<li><a href="/">Home</a></li>
			<li><a href="/dashboard">Admin</a></li>
			<li><a href="/login">login</a></li>
			<li><a href="/logout">logout</a></li>
	</ul>
</nav>