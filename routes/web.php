<?php

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
    return view('welcome');
});

Route::get('/topics', function () {
    return view('topics');
});

Route::get('/lists', function () {
    return view('lists');
});

Route::get('/twists', function () {
    return view('twists');
});

Auth::routes();

Route::get('/home', 'HomeController@index')->name('home');
