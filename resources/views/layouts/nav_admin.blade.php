<div class="navAdmin">
  <ul>
    <a href="/dashboard">
      <li class="{{ 'dashboard' == request()->path() ? 'activeAdmin' : '' }}">
        <i class="fas fa-user"></i>
        Dashboard
      </li>
    </a>
    <a href="/users">
      <li class="{{ 'users' == request()->path() ? 'activeAdmin' : '' }}">
        <i class="fas fa-chalkboard-teacher"></i>
        Users
      </li>
    </a>
    <a href="/categories">
      <li class="{{ 'categories' == request()->path() ? 'activeAdmin' : '' }}">
        <i class="fas fa-book"></i>
        Category
      </li>
    </a>
    <a href="/collectionsBackEnd">
      <li class="{{ 'collectionsBackEnd' == request()->path() ? 'activeAdmin' : '' }}">
        <i class="fas fa-book-reader"></i>
        Collections
      </li>
    </a>
    <a href="/products">
      <li class="{{ 'products' == request()->path() ? 'activeAdmin' : '' }}">
        <i class="fas fa-list"></i>
        Products
      </li>
    </a>
    <a href="/orders">
      <li class="{{ 'orders' == request()->path() ? 'activeAdmin' : '' }}">
        <i class="fas fa-list"></i>
        Orders
      </li>
    </a>
    <a href="/type_detail_products">
      <li class="{{ 'type_detail_products' == request()->path() ? 'activeAdmin' : '' }}">
        <i class="far fa-question-circle"></i>
        Type details
      </li>
    </a>
    <a href="/jumbos">
      <li class="{{ 'jumbos' == request()->path() ? 'activeAdmin' : '' }}">
        <i class="fas fa-check"></i>
        Jumbo
      </li>
    </a>
    </a>
    <a href="/bannieres">
      <li class="{{ 'bannieres' == request()->path() ? 'activeAdmin' : '' }}">
        <i class="fas fa-info"></i>
        Banners
      </li>
    </a>
    <a href="/taxes">
      <li class="{{ 'taxes' == request()->path() ? 'activeAdmin' : '' }}">
        <i class="fas fa-chart-line"></i>
        Taxes
      </li>
    </a>
    <a href="/reviews">
      <li class="{{ 'reviews' == request()->path() ? 'activeAdmin' : '' }}">
        <i class="fas fa-chart-line"></i>
        Rewiews
      </li>
    </a>
    <a href="/carts">
      <li class="{{ 'carts' == request()->path() ? 'activeAdmin' : '' }}">
        <i class="fas fa-chart-line"></i>
        Carts
      </li>
    </a>
    <a href="/aliProductImport">
      <li class="{{ 'aliProductImport' == request()->path() ? 'activeAdmin' : '' }}">
        <i class="fas fa-chart-line"></i>
        Ali Import Product
      </li>
    </a>
    <a href="/">
      <li class="{{ '/' == request()->path() ? 'activeAdmin' : '' }}">
        <i class="fas fa-home"></i>
        Home
      </li>
    </a>
  </ul>
</div>