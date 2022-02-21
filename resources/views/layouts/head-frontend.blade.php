<!DOCTYPE html>
<html lang="en">

<head>
    <title>E-shop</title>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">

    <!-- // csrf // -->
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <!-- <script src="https://unpkg.com/axios/dist/axios.min.js"></script> -->

    <link href="https://fonts.googleapis.com/css?family=Poppins:200,300,400,500,600,700,800&display=swap" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css?family=Lora:400,400i,700,700i&display=swap" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css?family=Amatic+SC:400,700&display=swap" rel="stylesheet">

    {{-- font --}}
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Nunito+Sans:ital,wght@0,200;0,300;0,400;0,600;0,700;0,800;0,900;1,300;1,400&display=swap" rel="stylesheet">

    <!-- fontawesome -->
    <script src="https://kit.fontawesome.com/ef36e77939.js" crossorigin="anonymous"></script>
    
    <!-- Roboto pour Material-UI -->
    <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap" />

    <!-- Font pour Material-UI -->
    <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons" />


    <!-- my css -->
    <link rel="stylesheet" type="text/css" href="{{ asset('frontend/css/nav-frontend.css') }}" />
    <link rel="stylesheet" type="text/css" href="{{ asset('frontend/css/index-front.css') }}" />
    <link rel="stylesheet" type="text/css" href="{{ asset('frontend/css/productSheet.css') }}" />
    <link rel="stylesheet" type="text/css" href="{{ asset('frontend/css/cart.css') }}" />
    <link rel="stylesheet" type="text/css" href="{{ asset('frontend/css/authentification.css') }}" />
    <link rel="stylesheet" type="text/css" href="{{ asset('frontend/css/payment.css') }}" />

    <script src="bundle.js"></script>

    <!-- reCaptch v3 -->
    <!-- IMPORTANT!!! remember CSRF token -->
    <!-- <meta name="csrf-token" content="{{ csrf_token() }}">

    <script type="text/javascript">
        function callbackThen(response) {
            // read HTTP status
            console.log(response.status);

            // read Promise object
            response.json().then(function(data) {
                console.log(data);
            });
        }

        function callbackCatch(error) {
            console.error('Error:', error)
        }
    </script> -->

    <!-- {!! htmlScriptTagJsApi([
    'action' => 'homepage',
    'callback_then' => 'callbackThen',
    'callback_catch' => 'callbackCatch'
    ]) !!} -->


</head>

<body class="goto-here">

    @php
    $categories = App\Models\Category::all()
    @endphp


    @include('layouts.nav-frontend')
    @yield('content')