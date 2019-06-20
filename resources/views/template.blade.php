<!doctype html>
<html lang="{{ app()->getLocale() }}">

<head>
    <meta charset="utf-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <% for (var css in htmlWebpackPlugin.files.css) { %>
    <link rel="stylesheet" href="<%= htmlWebpackPlugin.files.css[css] %>">
    <% } %>
    <title>Twists</title>
</head>

<body>
    <app-main>
        <main class="grid-container">
            <section class="grid-x">
                <div class="cell">
                    <div class="spinner__bounce">
                        <div class="bounce1"></div>
                        <div class="bounce2"></div>
                        <div class="bounce3"></div>
                    </div>
                </div>
            </section>
        </main>
    </app-main>

    <div id="loader" class="loader" hidden data-reveal data-reset-on-close="true" data-close-on-click="false"
        data-close-on-esc="false" data-animation-in="fade-in" data-animation-out="fade-out">
        <div class="float-center spinner__twist">
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

    <script type="text/javascript" src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>
    <% for (var chunk in htmlWebpackPlugin.files.chunks) { %>
    <script type="text/javascript" src="<%= htmlWebpackPlugin.files.chunks[chunk].entry %>"></script>
    <% } %>
    <script>
        $(function() {
            $(document).foundation();
         });
    </script>
</body>

</html>
