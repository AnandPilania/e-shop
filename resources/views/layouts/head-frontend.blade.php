<!DOCTYPE html>
<html lang="en">

<head>
    <title>Vegefoods - Free Bootstrap 4 Template by Colorlib</title>
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


    <!-- Roboto pour Material-UI -->
    <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap" />

    <!-- Font pour Material-UI -->
    <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons" />


    <!-- my css -->
    <link rel="stylesheet" type="text/css" href="{{ asset('frontend/css/nav-frontend.css') }}" />
    <link rel="stylesheet" type="text/css" href="{{ asset('frontend/css/index-front.css') }}" />
    <link rel="stylesheet" type="text/css" href="{{ asset('frontend/css/productSheet.css') }}" />
    <link rel="stylesheet" type="text/css" href="{{ asset('frontend/css/cart.css') }}" />

</head>

<body class="goto-here">

    @include('layouts.nav-frontend')
    @yield('content')