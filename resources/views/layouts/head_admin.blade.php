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

    <!-- Roboto pour Material-UI -->
    <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap" />

    <!-- Font pour Material-UI -->
    <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons" />

    <!-- <link rel="shortcut icon" href="{{ asset('backend/images/logo_2H_tech.png') }}" /> -->
    <script src="https://unpkg.com/axios/dist/axios.min.js"></script>
    
</head>

<body>
    <div class="container-backend">

 
        @include('layouts.nav_admin')
            <div class="content-wrapper">
                @yield('content')
            </div>
        <!-- @include('layouts.footer_admin') -->