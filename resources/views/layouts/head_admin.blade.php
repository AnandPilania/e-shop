<!DOCTYPE html>
<html lang="en">

<head>
    <!-- Required meta tags -->
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <title>Back-end</title>
    
    <!-- css -->
    <link rel="stylesheet" type="text/css" href="{{ asset('css/myapp.css') }}" />
    <link rel="stylesheet" type="text/css" href="{{ asset('css/app.css') }}" />

    <!-- fontawesome -->
    <link rel="stylesheet" type="text/css" href="{{ asset('css/fontawesome.css') }}" />

    <!-- tailwind -->
    <link href="/css/app.css" rel="stylesheet">

    <!-- Roboto Material-UI -->
    <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap" />

    <!-- Font Material-UI -->
    <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons" />

</head>

<body>
    <div class="container-backend">

        <!-- @include('layouts.nav_admin') -->

            @yield('content')
            <!-- @include('layouts.footer_admin') -->

    </div>
</body>

</html>