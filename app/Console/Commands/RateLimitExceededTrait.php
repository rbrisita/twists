<?php

namespace App\Console\Commands;

use Twitter;

Trait RateLimitExceededTrait
{
    /**
     * Test given code for rate limit exceeded code.
     *
     * @param integer $code Code to test.
     * @return boolean Return true if rate limit was exceeded.
     */
    protected function rateLimitExceeded(int $code) : bool
    {
        return $code == 429;
    }

    /**
     * Wait till timestamp found with given request parameters.
     *
     * @param string $noun Resource to access from Twitter.
     * @param string $verb Action to access in given resource.
     * @return void
     */
    protected function wait(string $noun, string $verb) : void
    {
        $this->warn('Rate limit reached.');

        $rate_limit = Twitter::getAppRateLimit([
            'resources' => $noun
        ]);
        $reset_secs = $rate_limit->resources->users->{'/' . $noun . '/' . $verb}->reset;
        $this->warn('Reset at: ' . date("Y-m-d H:i:s", $reset_secs));

        $wait_secs = $reset_secs - time();
        if ($wait_secs > 0) {
            $this->warn('Waiting for reset in ' . $wait_secs . ' seconds.');
            sleep($wait_secs);
        }
    }

    /**
     * Return true if given array has more than just headers to write.
     *
     * @param array $arr Array with csv data to check.
     * @return boolean Return true if row data exists.
     */
    protected function hasDataToWrite(array $arr) : bool
    {
        return count($arr) > 1;
    }

    /**
     * Escape to ensure correct CSV structure.
     *
     * @param string $str String to escape.
     * @return string Escaped string for CSV use.
     */
    protected function cleanForCSV(string $str) : string
    {
        return '"' . trim($str) . '"';
    }

    /**
     * Return given array as a csv valid string.
     *
     * @param array $arr Given array to convert.
     * @return string Converted array to valid csv string.
     */
    protected function createCSVString(array $arr) : string
    {
        return implode(',', $arr) . PHP_EOL;
    }
}
