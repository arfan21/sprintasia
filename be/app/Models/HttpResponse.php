<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;

class HttpResponse
{
    use HasFactory;

    /**
     * @var string
     */
    private $message;

    /**
     * @var array<string, mixed>
     */
    private $data;

    /**
     * @var array<string, mixed>
     */
    private $errors;

    /**
     * @param string $message
     * @param array<string, mixed> $data
     */
    public function __construct(string $message, mixed $data = [], mixed $errors = [])
    {
        $this->message = $message;
        $this->data = $data;
        $this->errors = $errors;
    }

    /**
     * @return array<string, mixed>
     */
    public function toArray(): array
    {
        $res = [
            'message' => $this->message,
        ];

        $res['data'] = $this->data;

        if (!empty($this->errors)) {
            $res['errors'] = $this->errors;
        }

        return $res;
    }
}
