<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Redis;
use Symfony\Component\HttpFoundation\Response as HttpResponse;

class TwistController extends Controller
{
    private $last_id;
    private $secs_in_day;

    public function __construct()
    {
        $this->secs_in_day = 86400;
        $this->last_id = Cache::remember('last_id', $this->secs_in_day, function () {
            $data = Redis::get('topics');
            $arr = json_decode($data);
            $last_obj = last($arr);
            return $last_obj->id;
        });
    }

    public function topics()
    {
        return Cache::remember('topics', $this->secs_in_day, function () {
            return response()->json([
                'data' => json_decode(Redis::get('topics'))
            ]);
        });
    }

    public function topicById(int $id)
    {
        if ($id < 0 || $id > $this->last_id) {
            $http_code = HttpResponse::HTTP_BAD_REQUEST;
            $response = [
                'code' => $http_code,
                'error' => HttpResponse::$statusTexts[$http_code],
                'status' => 'Id not valid'
            ];
            return response()->json($response, $http_code);
        }

        return Cache::remember('topic_' . $id, $this->secs_in_day, function () use ($id) {
            $response = null;
            $http_code = HttpResponse::HTTP_OK;

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
                    'data' => json_decode($data)
                ];
            }

            return response()->json($response, $http_code);
        });
    }

    public function fallback()
    {
        $http_code = HttpResponse::HTTP_NOT_FOUND;
        return response()->json([
            'code' => $http_code,
            'error' => HttpResponse::$statusTexts[$http_code],
            'status' => 'Resource not found'
        ], $http_code);
    }
}
