<?php

namespace App\Services;

use GuzzleHttp\Client;
use Illuminate\Support\Arr;

class LlmService
{
    private Client $http;

    public function __construct()
    {
        $baseUrl = env('OPENAI_BASE_URL', 'https://api.openai.com/v1');
        $this->http = new Client([
            'base_uri' => rtrim($baseUrl, '/') . '/',
            'timeout' => 25,
        ]);
    }

    public function chatCompletion(string $prompt, ?string $system = null): string
    {
        $apiKey = env('OPENAI_API_KEY');
        if (!$apiKey) {
            return '';
        }
        $model = env('OPENAI_MODEL', 'gpt-4o-mini');

        $payload = [
            'model' => $model,
            'messages' => array_values(array_filter([
                $system ? ['role' => 'system', 'content' => $system] : null,
                ['role' => 'user', 'content' => $prompt],
            ])),
            'temperature' => 0.2,
        ];

        $headers = [
            'Authorization' => 'Bearer ' . $apiKey,
            'Content-Type' => 'application/json',
        ];

        $res = $this->http->post('chat/completions', [
            'headers' => $headers,
            'json' => $payload,
        ]);
        $data = json_decode((string) $res->getBody(), true);
        return (string) Arr::get($data, 'choices.0.message.content', '');
    }
}
