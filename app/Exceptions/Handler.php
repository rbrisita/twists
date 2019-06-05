<?php

namespace App\Exceptions;

use Exception;
use Illuminate\Foundation\Exceptions\Handler as ExceptionHandler;
use Symfony\Component\HttpFoundation\Response as HttpResponse;

class Handler extends ExceptionHandler
{
    /**
     * A list of the exception types that are not reported.
     *
     * @var array
     */
    protected $dontReport = [
        //
    ];

    /**
     * A list of the inputs that are never flashed for validation exceptions.
     *
     * @var array
     */
    protected $dontFlash = [
        'password',
        'password_confirmation',
    ];

    /**
     * Report or log an exception.
     *
     * @param  \Exception  $exception
     * @return void
     */
    public function report(Exception $exception)
    {
        parent::report($exception);
    }

    /**
     * Render an exception into an HTTP response.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Exception  $exception
     * @return \Illuminate\Http\Response
     */
    public function render($request, Exception $exception)
    {
        if ($request->expectsJson()) {
            $optional = config('app.debug') ? [
                'code' => $exception->getCode(),
                'excepiton' => get_class($exception),
                'file' => $exception->getFile(),
                'line' => $exception->getLine(),
                'trace' => $exception->getTraceAsString(),
            ] : [];

            return $this->exceptionResponseJSON(
                $exception,
                HttpResponse::HTTP_INTERNAL_SERVER_ERROR,
                $optional
            );
        }

        return parent::render($request, $exception);
    }

    /**
     * Create a JSON response using the given exception and HTTP code.
     *
     * @param \Exception $e
     * @param integer $http_code
     * @param array $optional
     * @return \Illuminate\Http\Response Respond in JSON format.
     */
    protected function exceptionResponseJSON(Exception $e, int $http_code, array $optional = null)
    {
        // Get status and remove details of URLs.
        $status = $e->getMessage();
        if (!config('app.debug')) {
            $status = preg_replace('/\s\[.*\]$/', '', $status);
        }

        $response = [
            'error' => HttpResponse::$statusTexts[$http_code],
            'status' => $status ?: 'Unknown',
        ];
        if ($optional) {
            $response['data'] = $optional;
        }

        return response()->json($response, $http_code);
    }
}
