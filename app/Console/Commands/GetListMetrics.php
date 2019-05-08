<?php

namespace App\Console\Commands;

use App\Console\Commands\RateLimitExceededTrait;
use Exception;
use Illuminate\Console\Command;
use Twitter;

/**
 * Request given list and parse out specific metrics.
 */
class GetListMetrics extends Command
{
    use RateLimitExceededTrait;

    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'twitter:list_metrics
        {file : Text file in column format without column name}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Get and calculate list metrics, such as total members in list and total subscribers';

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

        // CSV data with header.
        $csv_data = [];
        $csv_data[] = $this->createCSVString([
            'id_str',
            'screen_name',
            'name',
            'description',
            'uri',
            'subscriber_count',
            'member_count',
            'ratio',
        ]);

        // CSV error data with header.
        $error_data = [];
        $error_data[] = $this->createCSVString([
            'code',
            'message',
            'url',
        ]);

        $file_parts = pathinfo($file);
        $filename = $file_parts['filename'];
        $ext = '.csv';
        $file_data = file($file, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);

        // Create file data
        foreach ($file_data as $url) {
            $url_parts = parse_url($url);
            $path = trim($url_parts['path'], '/');
            $path_parts = explode('/', $path);

            if (count($path_parts) !== 3) {
                $error_data[] = $this->createCSVString([
                    1,
                    'URL in list not formatted correctly.',
                    $url,
                ]);
                $this->error('Format error written to error file.');
                continue;
            }
            $screen_name = $path_parts[0];
            $slug = $path_parts[2];

            // Attempt to request list for valid user.
            while (true) {
                try {
                    $list = Twitter::getList([
                        'owner_screen_name' => $screen_name,
                        'slug' => $slug,
                    ]);

                    // Save data
                    $csv_data[] = $this->createCSVString([
                        (string) $list->id_str,
                        $screen_name,
                        $this->cleanForCSV($list->name),
                        $this->cleanForCSV($list->description),
                        $list->uri,
                        $list->subscriber_count,
                        $list->member_count,
                        $list->subscriber_count / $list->member_count,
                    ]);
                    break;
                } catch (Exception $e) {
                    $code = $e->getCode();
                    if ($this->rateLimitExceeded($code)) {
                        $this->wait('lists', 'show');
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
        }

        if ($this->hasDataToWrite($csv_data)) {
            file_put_contents($filename . $ext, $csv_data);
            $this->info('CSV data file "' . $filename . $ext . '" written.');
            $this->info(count($csv_data) . ' entries.');
        } else {
            $this->info('No data encountered and no file written.');
        }

        if ($this->hasDataToWrite($error_data)) {
            file_put_contents($filename . '_errors' . $ext, $error_data);
            $this->info('CSV error file "' . $filename . '_errors' . $ext . '" written.');
            $this->info(count($error_data) . ' entries.');
        } else {
            $this->info('No errors encountered and no file written.');
        }

        $this->info('Finished parsing "' . $file . '" file.');
    }
}
