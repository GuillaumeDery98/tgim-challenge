<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class RagDocumentChunk extends Model
{
    use HasFactory;

    protected $fillable = [
        'rag_document_id',
        'chunk_index',
        'content',
        'embedding',
    ];

    protected $casts = [
        'embedding' => 'array',
    ];

    public function document(): BelongsTo
    {
        return $this->belongsTo(RagDocument::class, 'rag_document_id');
    }
}


