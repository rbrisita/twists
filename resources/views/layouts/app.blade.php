<!doctype html>
<html lang="{{ app()->getLocale() }}">

<head>
    <meta charset="utf-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="stylesheet" href="{{ mix('css/app.css') }}">
    <title>Twists</title>
</head>

<body>
    <header id="header" data-sticky-container>
        <nav data-sticky data-margin-top="0" data-sticky-on="small">
            <div class="top-bar">
                <div class="top-bar-left">
                    <ul class="menu">
                        <li><a href="#">Topics</a></li>
                        <li><a href="#">Lists</a></li>
                        <li><a href="#">Colophon</a></li>
                    </ul>
                </div>
            </div>
        </nav>
    </header>

    {{-- <app-main>Loading...</app-main> --}}

    @yield('content')

    <footer>Twists Demo</footer>

    <script async type="text/javascript" src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>
    <script type="text/javascript" src="{{ mix('js/vendor.js') }}"></script>
    <script type="text/javascript" src="{{ mix('js/app.js') }}"></script>
    <script>
        $(document).foundation();
    </script>
</body>

</html>
