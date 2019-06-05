<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redis;
use Symfony\Component\HttpFoundation\Response as HttpResponse;

class TwistController extends Controller
{
    public function topics()
    {
        return response()->json([
            'data' => Redis::get('topics')
        ]);
    }

    public function topicById(int $id)
    {
        $response = null;
        $http_code = HttpResponse::HTTP_FOUND;

        $data = Redis::get($id);
        if (!$data) {
            $http_code = HttpResponse::HTTP_NOT_FOUND;
            $response = [
                'code' => $http_code,
                'error' => HttpResponse::$statusTexts[$http_code],
                'status' => 'Topic not found'
            ];
        } else {
            $response = [
                'data' => $data
            ];
        }

        return response()->json($response, $http_code);
    }
}
