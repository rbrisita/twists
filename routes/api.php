<?php

use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response as HttpResponse;

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

Route::middleware('auth:api')->get('/user', function (Request $request) {
    return $request->user();
});

Route::get('topics', 'TwistController@topics');
Route::get('topics/{id}', 'TwistController@topicById');
Route::fallback(function () {
    $http_code = HttpResponse::HTTP_NOT_FOUND;
    return response()->json([
        'code' => $http_code,
        'error' => HttpResponse::$statusTexts[$http_code],
        'status' => 'Resource not found'
    ], $http_code);
});
