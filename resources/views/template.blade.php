<!doctype html>
<html lang="{{ app()->getLocale() }}">

<head prefix="og: http://ogp.me/ns#">
    <meta charset="utf-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport"
        content="width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no, shrink-to-fit=no" />
    <meta name="twitter:widgets:autoload" content="off">
    <meta name="twitter:card" content="summary" />
    <meta name="twitter:site" content="@twists_app" />
    <meta name="twitter:creator" content="@rbrisita" />
    <meta property="og:url" content="https://twists.herokuapp.com" />
    <meta property="og:title" content="Twists: Popular Twitter Lists" />
    <meta property="og:description" content="Consume lists without signing up or signing in." />
    <meta property="og:image" content="https://via.placeholder.com/150" />

    <% for (var css in htmlWebpackPlugin.files.css) { %>
    <link rel="stylesheet" href="<%= htmlWebpackPlugin.files.css[css] %>">
    <% } %>
    <title>Twists</title>
    <!-- Global site tag (gtag.js) - Google Analytics -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=UA-142688054-1"></script>
    <script>
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('set', {
            app_name: 'Twists',
            app_version: '1.0.0.20190625'
        });
        gtag('config', 'UA-142688054-1');
    </script>
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-status-bar-style" content="default">
    <meta name="apple-mobile-web-app-title" content="Twists">
    <link rel="apple-touch-icon" href="apple-touch-icon.png">
    <link rel="apple-touch-icon" sizes="57x57" href="/imgs/ico/apple-icon-57x57.png">
    <link rel="apple-touch-icon" sizes="60x60" href="/imgs/ico/apple-icon-60x60.png">
    <link rel="apple-touch-icon" sizes="72x72" href="/imgs/ico/apple-icon-72x72.png">
    <link rel="apple-touch-icon" sizes="76x76" href="/imgs/ico/apple-icon-76x76.png">
    <link rel="apple-touch-icon" sizes="114x114" href="/imgs/ico/apple-icon-114x114.png">
    <link rel="apple-touch-icon" sizes="120x120" href="/imgs/ico/apple-icon-120x120.png">
    <link rel="apple-touch-icon" sizes="144x144" href="/imgs/ico/apple-icon-144x144.png">
    <link rel="apple-touch-icon" sizes="152x152" href="/imgs/ico/apple-icon-152x152.png">
    <link rel="apple-touch-icon" sizes="180x180" href="/imgs/ico/apple-icon-180x180.png">
    <link rel="icon" type="image/png" sizes="192x192" href="/imgs/ico/android-icon-192x192.png">
    <link rel="icon" type="image/png" sizes="32x32" href="/imgs/ico/favicon-32x32.png">
    <link rel="icon" type="image/png" sizes="96x96" href="/imgs/ico/favicon-96x96.png">
    <link rel="icon" type="image/png" sizes="16x16" href="/imgs/ico/favicon-16x16.png">
    <link rel="manifest" href="/manifest.json">
    <meta name="msapplication-TileColor" content="#ffffff">
    <meta name="msapplication-TileImage" content="/imgs/ico/ms-icon-144x144.png">
    <meta name="theme-color" content="#ffffff">

    {{-- iPhone 5, SE (640px x 1136px) --}}
    <link href="/imgs/splash/iphone5_splash.png"
        media="(device-width: 320px) and (device-height: 568px) and (-webkit-device-pixel-ratio: 2)"
        rel="apple-touch-startup-image" />
    {{-- iPhone 8, 7, 6s, 6 (750px x 1334px) --}}
    <link href="/imgs/splash/iphone6_splash.png"
        media="(device-width: 375px) and (device-height: 667px) and (-webkit-device-pixel-ratio: 2)"
        rel="apple-touch-startup-image" />
    {{-- iPhone 8 Plus, 7 Plus, 6s Plus, 6 Plus (1242px x 2208px) --}}
    <link href="/imgs/splash/iphoneplus_splash.png"
        media="(device-width: 414px) and (device-height: 736px) and (-webkit-device-pixel-ratio: 3)"
        rel="apple-touch-startup-image">
    {{-- iPhone X, Xs (1125px x 2436px) --}}
    <link href="/imgs/splash/iphonex_splash.png"
        media="(device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3)"
        rel="apple-touch-startup-image" />
    {{-- iPhone Xr (828px x 1792px) --}}
    <link href="/imgs/splash/iphonexr_splash.png"
        media="(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 2)"
        rel="apple-touch-startup-image" />
    {{-- iPhone Xs Max (1242px x 2688px) --}}
    <link href="/imgs/splash/iphonexsmax_splash.png"
        media="(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 3)"
        rel="apple-touch-startup-image" />
    {{-- iPad Mini, Air (1536px x 2048px) --}}
    <link href="/imgs/splash/ipad_splash.png"
        media="(device-width: 768px) and (device-height: 1024px) and (-webkit-device-pixel-ratio: 2)"
        rel="apple-touch-startup-image" />
    {{-- iPad Pro 10.5" (1668px x 2224px) --}}
    <link href="/imgs/splash/ipadpro1_splash.png"
        media="(device-width: 834px) and (device-height: 1112px) and (-webkit-device-pixel-ratio: 2)"
        rel="apple-touch-startup-image" />
    {{-- iPad Pro 11” (1668px x 2388px) --}}
    <link href="/imgs/splash/ipadpro3_splash.png"
        media="(device-width: 834px) and (device-height: 1194px) and (-webkit-device-pixel-ratio: 2)"
        rel="apple-touch-startup-image" />
    {{-- iPad Pro 12.9" (2048px x 2732px) --}}
    <link href="/imgs/splash/ipadpro2_splash.png"
        media="(device-width: 1024px) and (device-height: 1366px) and (-webkit-device-pixel-ratio: 2)"
        rel="apple-touch-startup-image" />
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
