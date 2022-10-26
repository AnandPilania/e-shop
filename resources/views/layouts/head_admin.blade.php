<!DOCTYPE html>
<html lang="en">

<head>
    <!-- Required meta tags -->
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <title>Back-end</title>

    @vite(['resources/css/app.css', 'resources/js/backEnd.jsx'])

</head>

<body>
    <div class="container-backend">
           @yield('content')
    </div>
</body>

</html>