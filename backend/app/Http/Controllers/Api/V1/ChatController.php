<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\ChatMessage;
use App\Models\ChatSession;
use App\Models\RagDocument;
use App\Services\RagService;
use App\Services\LlmService;
use App\Services\PdfTextExtractor;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class ChatController extends Controller
{
    public function __construct(private RagService $rag, private LlmService $llm, private PdfTextExtractor $pdf) {}

    public function ensureSession(Request $request)
    {
        $request->validate([
            'external_id' => 'required|string',
            'title' => 'nullable|string',
            'metadata' => 'array',
        ]);
        $session = ChatSession::firstOrCreate(
            ['external_id' => $request->string('external_id')],
            ['title' => $request->input('title'), 'metadata' => $request->input('metadata', [])]
        );
        return response()->json($session);
    }

    public function messages(Request $request, string $externalId)
    {
        $session = ChatSession::where('external_id', $externalId)->firstOrFail();
        $messages = $session->messages()->orderBy('created_at', 'asc')->get();
        return response()->json($messages);
    }

    public function postMessage(Request $request, string $externalId)
    {
        $request->validate([
            'role' => 'required|in:user,assistant,system',
            'content' => 'required|string',
        ]);
        $session = ChatSession::where('external_id', $externalId)->firstOrFail();

        $message = $session->messages()->create([
            'role' => $request->string('role'),
            'content' => $request->string('content'),
        ]);

        return response()->json($message, 201);
    }

    public function uploadDocument(Request $request)
    {
        // Two modes: multipart file OR raw text content
        $hasFile = $request->hasFile('file');
        $hasContent = $request->filled('content');

        if (!$hasFile && !$hasContent) {
            return response()->json([
                'message' => 'No file or content provided',
                'errors' => ['file' => ['The file failed to upload.']],
            ], 422);
        }

        if ($hasContent) {
            $request->validate([
                'content' => 'required|string',
                'title' => 'required|string',
                'category' => 'nullable|string',
            ]);

            $doc = $this->rag->upsertDocument(
                $request->input('title'),
                $request->input('title') . '.txt',
                'text/plain',
                'inline',
                ['category' => $request->input('category')]
            );
            $this->rag->indexDocumentText($doc, $request->string('content'));
            return response()->json($doc->loadCount('chunks'));
        }

        $request->validate([
            'file' => 'required|file',
            'title' => 'nullable|string',
            'category' => 'nullable|string',
        ]);

        $file = $request->file('file');
        if (!$file->isValid()) {
            return response()->json([
                'message' => 'The file failed to upload.',
                'errors' => ['file' => ['The file failed to upload.']],
            ], 422);
        }

        $path = $file->store('rag', 'public');

        $doc = $this->rag->upsertDocument(
            $request->input('title') ?: pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME),
            $file->getClientOriginalName(),
            $file->getClientMimeType(),
            $path,
            ['category' => $request->input('category')]
        );

        // Simple text extraction depending on mime, now supports PDF
        $content = '';
        if ($file->getClientMimeType() === 'application/pdf') {
            $content = $this->pdf->extract($file->getRealPath());
        } else if (str_starts_with($file->getClientMimeType(), 'text/')) {
            $content = file_get_contents($file->getRealPath());
        } else if (in_array($file->getClientMimeType(), ['application/json'])) {
            $content = json_encode(json_decode(file_get_contents($file->getRealPath()), true));
        } else {
            // Fallback: store only metadata; no text extraction
            $content = '';
        }

        if (trim($content) !== '') {
            $this->rag->indexDocumentText($doc, $content);
        }

        return response()->json($doc->loadCount('chunks'));
    }

    public function documents()
    {
        $docs = RagDocument::withCount('chunks')->latest()->get();
        return response()->json($docs);
    }

    public function query(Request $request)
    {
        $request->validate(['query' => 'required|string']);
        $query = $request->string('query');
        $matches = $this->rag->similaritySearch($query, 5);

        $sources = array_map(function ($row) {
            $chunk = $row['chunk'];
            $doc = $chunk->document;
            return [
                'excerpt' => Str::limit($chunk->content, 300),
                'relevance_score' => $row['score'],
                'highlighted_terms' => [],
                'document' => [
                    'id' => $doc->id,
                    'title' => $doc->title,
                    'category' => $doc->category,
                    'difficulty_level' => $doc->difficulty_level,
                    'estimated_read_time' => $doc->estimated_read_time,
                    'tags' => $doc->tags ?? [],
                ],
            ];
        }, $matches);

        $context = collect($matches)->map(fn($m) => $m['chunk']->content)->implode("\n---\n");
        $system = 'Tu es un assistant spécialisé en reprise d\'entreprise (méthode TGIM). Réponds en français en t\'appuyant uniquement sur le contexte fourni. Si l\'information manque, dis-le clairement.';
        $prompt = "Question:\n" . $query . "\n\nContexte:\n" . $context . "\n\nConsigne: Donne une réponse concise et structurée, puis liste les sources sous forme de puces si pertinent.";
        $answer = $this->llm->chatCompletion($prompt, $system);

        return response()->json([
            'answer' => $answer,
            'sources' => $sources,
            'knowledge_stats' => [
                'total_documents' => RagDocument::count(),
            ],
        ]);
    }

    public function sessions(Request $request)
    {
        $request->validate([
            'page' => 'nullable|integer|min:1',
            'per_page' => 'nullable|integer|min:1|max:100',
            'search' => 'nullable|string|max:255',
        ]);

        $page = $request->input('page', 1);
        $perPage = $request->input('per_page', 20);
        $search = $request->input('search');

        $query = ChatSession::withCount('messages')
            ->with(['messages' => function ($q) {
                $q->latest()->limit(1);
            }])
            ->latest();

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                    ->orWhere('external_id', 'like', "%{$search}%");
            });
        }

        $sessions = $query->paginate($perPage, ['*'], 'page', $page);

        return response()->json([
            'sessions' => $sessions->items(),
            'pagination' => [
                'current_page' => $sessions->currentPage(),
                'last_page' => $sessions->lastPage(),
                'per_page' => $sessions->perPage(),
                'total' => $sessions->total(),
            ],
        ]);
    }

    public function deleteSession(string $externalId)
    {
        $session = ChatSession::where('external_id', $externalId)->firstOrFail();
        $session->delete();

        return response()->json(['message' => 'Session supprimée avec succès']);
    }
}
