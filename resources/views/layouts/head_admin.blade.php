<!DOCTYPE html>
<html lang="en">

<head>
    <!-- Required meta tags -->
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <title>Dashboard</title>
    <!-- plugins:css -->
    <link rel="stylesheet" type="text/css" href="{{ asset('css/getTypeDetailsProduct_JS.css') }}">
    <link rel="stylesheet" type="text/css" href="{{ asset('backend/css/back-end.css') }}" />
    <link rel="stylesheet" type="text/css" href="{{ asset('backend/css/menu_accordion.css') }}" />
    <link rel="stylesheet" type="text/css" href="{{ asset('backend/css/collections_component.css') }}" />
    <link rel="stylesheet" type="text/css" href="{{ asset('css/fontawesome.css') }}" />


    <!-- Poppins font -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap" rel="stylesheet">

    <!-- Source sans 3 -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Source+Sans+3:ital,wght@0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap" rel="stylesheet">
    
    <!-- Roboto Material-UI -->
    <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap" />

    <!-- Font Material-UI -->
    <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons" />

    <!-- <link rel="shortcut icon" href="{{ asset('backend/images/logo_2H_tech.png') }}" /> -->
    <!-- <script src="https://unpkg.com/axios/dist/axios.min.js"></script> -->

</head>

<body>
    <div class="container-backend">

        @include('layouts.nav_admin')
        <div class="content-wrapper">
            @yield('content')
            <!-- @include('layouts.footer_admin') -->
        </div>
    </div>
</body>

</html>