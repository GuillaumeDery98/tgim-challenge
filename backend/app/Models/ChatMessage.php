<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ChatMessage extends Model
{
    use HasFactory;

    protected $fillable = [
        'chat_session_id',
        'role',
        'content',
        'sources',
        'follow_up_questions',
        'response_time_ms',
        'confidence_score',
    ];

    protected $casts = [
        'sources' => 'array',
        'follow_up_questions' => 'array',
        'confidence_score' => 'float',
    ];

    public function session(): BelongsTo
    {
        return $this->belongsTo(ChatSession::class, 'chat_session_id');
    }
}


