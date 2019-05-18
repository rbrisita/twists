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

    <app-main>
        <main class="grid-containter">
            <section class="grid-x">
                <div class="cell">
                    <div class="spinner--bounce">
                        <div class="bounce1"></div>
                        <div class="bounce2"></div>
                        <div class="bounce3"></div>
                    </div>
                </div>
            </section>
        </main>
    </app-main>

    <div class="loader" id="loader" hidden data-reveal data-reset-on-close="true" data-close-on-click="false" data-close-on-esc="false" data-animation-in="fade-in" data-animation-out="fade-out">
        <div class="float-center spinner">
            <div class="float-center rect1"></div>
            <div class="float-center rect2"></div>
            <div class="float-center rect3"></div>
            <div class="float-center rect4"></div>
            <div class="float-center rect5"></div>
            <div class="float-center rect6"></div>
            <div class="float-center rect7"></div>
            <div class="float-center rect8"></div>
            <div class="float-center rect9"></div>
            <div class="float-center rect10"></div>
            <div class="float-center rect11"></div>
        </div>
    </div>

    <script async type="text/javascript" src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>
    <script type="text/javascript" src="{{ mix('js/vendor.js') }}"></script>
    <script type="text/javascript" src="{{ mix('js/app.js') }}"></script>
    <script>
        $(document).foundation();
    </script>
</body>

</html>
