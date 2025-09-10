<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class RagDocument extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'original_filename',
        'mime_type',
        'storage_path',
        'category',
        'difficulty_level',
        'estimated_read_time',
        'tags',
        'metadata',
    ];

    protected $casts = [
        'tags' => 'array',
        'metadata' => 'array',
    ];

    public function chunks(): HasMany
    {
        return $this->hasMany(RagDocumentChunk::class);
    }
}


