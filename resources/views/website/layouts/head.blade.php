<!DOCTYPE html>
<html lang="fr">

<head>
    <title>E-shop</title>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">

    <!-- // csrf // -->
    <meta name="csrf-token" content="{{ csrf_token() }}">

    <!-- my css -->
    <link rel="stylesheet" type="text/css" href="{{ asset('frontend/css/nav-frontend.css') }}" />
    <link rel="stylesheet" type="text/css" href="{{ asset('frontend/css/index-front.css') }}" />
    <link rel="stylesheet" type="text/css" href="{{ asset('frontend/css/productSheet.css') }}" />
    <link rel="stylesheet" type="text/css" href="{{ asset('frontend/css/cart.css') }}" />
    <link rel="stylesheet" type="text/css" href="{{ asset('frontend/css/authentification.css') }}" />
    <link rel="stylesheet" type="text/css" href="{{ asset('frontend/css/payment.css') }}" />

    <link rel="stylesheet" type="text/css" href="{{ asset('css/app.css') }}" />

    <link rel="stylesheet" href="//unpkg.com/grapesjs/dist/css/grapes.min.css">
    <script src="//unpkg.com/grapesjs"></script>

    <style>
        #gjs {
            border: 3px solid #444;
        }

        /* Reset some default styling */
        .gjs-cv-canvas {
            top: 0;
            width: 100%;
            height: 100vh;
        }

        .gjs-block {
            width: auto;
            height: auto;
            min-height: auto;
        }
    </style>

    @vite('resources/js/app.js', 'resources/js/grapejs.js')
</head>

<body class="goto-here">

    @include('website.layouts.nav')
    @yield('content')