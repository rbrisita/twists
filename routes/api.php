<?php

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::get('topics', 'TwistController@topics');
Route::get('topics/{id}', 'TwistController@topicById');
Route::fallback('TwistController@fallback');
