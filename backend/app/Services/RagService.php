<?php

namespace App\Services;

use App\Models\RagDocument;
use App\Models\RagDocumentChunk;
use Illuminate\Support\Facades\Log;

class RagService
{
    public function chunkText(string $text, int $chunkSize = 800, int $chunkOverlap = 120): array
    {
        $words = preg_split('/\s+/', trim($text));
        $chunks = [];
        $current = [];
        foreach ($words as $word) {
            $current[] = $word;
            if (mb_strlen(implode(' ', $current)) >= $chunkSize) {
                $chunks[] = implode(' ', $current);
                $overlapWords = [];
                while (!empty($current) && mb_strlen(implode(' ', $overlapWords)) < $chunkOverlap) {
                    array_unshift($overlapWords, array_pop($current));
                }
                $current = $overlapWords;
            }
        }
        if (!empty($current)) {
            $chunks[] = implode(' ', $current);
        }
        return $chunks;
    }

    public function embed(string $text): array
    {
        // Placeholder embedding: hash to deterministic vector for hackathon demo
        $hash = substr(sha1($text), 0, 64);
        $vector = [];
        for ($i = 0; $i < 128; $i++) {
            $pair = substr($hash, ($i % 32) * 2, 2);
            $vector[] = hexdec($pair) / 255.0;
        }
        return $vector;
    }

    public function upsertDocument(string $title, string $originalFilename, string $mimeType, string $storagePath, array $meta = []): RagDocument
    {
        $doc = RagDocument::create([
            'title' => $title,
            'original_filename' => $originalFilename,
            'mime_type' => $mimeType,
            'storage_path' => $storagePath,
            'category' => $meta['category'] ?? null,
            'difficulty_level' => $meta['difficulty_level'] ?? null,
            'estimated_read_time' => $meta['estimated_read_time'] ?? 5,
            'tags' => $meta['tags'] ?? [],
            'metadata' => $meta,
        ]);

        return $doc;
    }

    public function indexDocumentText(RagDocument $document, string $text): void
    {
        $chunks = $this->chunkText($text);
        foreach ($chunks as $index => $content) {
            RagDocumentChunk::create([
                'rag_document_id' => $document->id,
                'chunk_index' => $index,
                'content' => $content,
                'embedding' => $this->embed($content),
            ]);
        }
    }

    public function similaritySearch(string $query, int $limit = 5): array
    {
        $q = $this->embed($query);
        $chunks = RagDocumentChunk::with('document')->get();
        $scored = [];
        foreach ($chunks as $chunk) {
            $score = $this->cosineSimilarity($q, $chunk->embedding ?? []);
            $scored[] = [
                'chunk' => $chunk,
                'score' => $score,
            ];
        }
        usort($scored, fn($a, $b) => $b['score'] <=> $a['score']);
        return array_slice($scored, 0, $limit);
    }

    private function cosineSimilarity(array $a, array $b): float
    {
        $len = min(count($a), count($b));
        if ($len === 0) return 0.0;
        $dot = 0.0; $na = 0.0; $nb = 0.0;
        for ($i = 0; $i < $len; $i++) {
            $dot += $a[$i] * $b[$i];
            $na += $a[$i] * $a[$i];
            $nb += $b[$i] * $b[$i];
        }
        if ($na == 0 || $nb == 0) return 0.0;
        return $dot / (sqrt($na) * sqrt($nb));
    }
}


