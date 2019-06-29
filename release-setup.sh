#!/usr/bin/env bash

composer install
php artisan cache:clear
php artisan config:cache
php artisan event:cache
#php artisan route:cache # Produces error with Route::fallback: Unable to prepare route [/] for serialization. Uses Closure.
php artisan view:cache
#php artisan optimize  # Produces error with Route::fallback: Unable to prepare route [/] for serialization. Uses Closure.
