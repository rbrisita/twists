<?php

namespace App\Console\Commands;

use App\Console\Commands\RateLimitExceededTrait;
use Exeption;
use Illuminate\Console\Command;
use Twitter;

class FindPossibeLists extends Command
{
    use RateLimitExceededTrait;

    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'twitter:list_possible
        {file : Text file in column format without column name}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Output possible lists for valid user';

    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct()
    {
        parent::__construct();
    }

    /**
     * Execute the console command.
     *
     * @return mixed
     */
    public function handle()
    {
        $file = $this->argument('file');

        $this->info('Starting to parse "' . $file . '" file.');

        $filename = pathinfo($file)['filename'];

        // Collect all screen names
        $error_data = [];
        $file_data = file($file, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
        $check_screen_names = $this->getScreenNamesToCheck($file_data, $error_data);
        if (!$check_screen_names) {
            $this->info('No valid data encountered and no file written.');

            if ($this->hasDataToWrite($error_data)) {
                file_put_contents($filename . '_errors.txt', implode(PHP_EOL, $error_data));
                $this->info('Error file "' . $filename . '_errors.txt" written.');
                $this->info(count($error_data) . ' entries.');
            } else {
                $this->info('No errors encountered and no file written.');
            }

            return;
        }

        // Request a lookup on collected screen names.
        $error_data = [];
        while (true) {
            try {
                $valid_users_objs = Twitter::getUsersLookup([
                    'screen_name' => implode(',', $check_screen_names),
                    'include_entities' => false,
                ]);

                $screen_names = $this->getUsers($valid_users_objs);

                break;
            } catch (Exception $e) {
                $code = $e->getCode();
                if ($this->rateLimitExceeded($code)) {
                    $this->wait('users', 'lookup');
                    continue;
                } else {
                    $error_data[] = $this->createCSVString([
                        $code,
                        $this->cleanForCSV($e->getMessage()),
                        $url,
                    ]);
                    $this->error('Request error written to error file.');
                    break;
                }
            }
        }

        if ($this->hasDataToWrite($screen_names)) {
            file_put_contents($filename . '_results.txt', implode(PHP_EOL, $screen_names));
            $this->info('Data file "' . $filename . '_results.txt" written.');
            $this->info(count($screen_names) . ' entries.');
        } else {
            $this->info('No data encountered and no file written.');
        }

        if ($this->hasDataToWrite($error_data)) {
            file_put_contents($filename . '_errors.csv', $error_data);
            $this->info('CSV error file "' . $filename . '_errors.csv" written.');
            $this->info(count($error_data) . ' entries.');
        } else {
            $this->info('No errors encountered and no file written.');
        }

        $this->info('Finished parsing "' . $file . '" file.');
    }

    /**
     * For each item in the given array, parse out the scree name.
     *
     * @param array $arr Array containing Twitter URIs with screen names.
     * @param array $error_data Array to append to with found format errors.
     * @return array An array containing only screen names to check against Twitter.
     */
    private function getScreenNamesToCheck(array $arr, array &$error_data) : array
    {
        $check_screen_names = [];

        foreach ($arr as $url) {
            $url_parts = parse_url($url);
            $path = trim($url_parts['path'], '/');
            $path_parts = explode('/', $path);
            $screen_name = $path_parts[0];

            if (!$screen_name) {
                $error_data[] = $url;
                $this->error('Format error written to error file.');
                continue;
            }

            $check_screen_names[] = $path_parts[0];
        }

        return $check_screen_names;
    }

    /**
     * Parse an array of user objects to get valid screen names.
     *
     * @param array $arr An array of user objects.
     * @return array An array containing valid screen names.
     */
    private function getUsers(array $arr) : array
    {
        $screen_names = [];

        foreach ($arr as $obj) {
            $screen_names[] = $obj->screen_name;
        }

        return $screen_names;
    }
}
