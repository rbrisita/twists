<!doctype html>
<html lang="en">
    <head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>Laravel and Angular: Automated</title>
    </head>
    <body style="text-align: center;">
        <h1>Laravel v{{ App::VERSION() }}</h1>
        <app-main>Loading...</app-main>
        <h1>Automated</h1>
        <script type="text/javascript" src="{{ mix('js/vendor.js') }}"></script>
        <script type="text/javascript" src="{{ mix('js/app-component.js') }}"></script>
    </body>
</html>
