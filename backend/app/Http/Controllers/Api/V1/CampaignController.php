<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\EmailCampaign;
use App\Services\BrevoService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class CampaignController extends Controller
{
    protected $brevoService;

    public function __construct(BrevoService $brevoService)
    {
        $this->brevoService = $brevoService;
    }

    public function index(): JsonResponse
    {
        $campaigns = EmailCampaign::with('template')
            ->orderBy('created_at', 'desc')
            ->get();
        
        return response()->json($campaigns);
    }

    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'template_id' => 'required|exists:email_templates,id',
            'recipients' => 'nullable|array',
            'scheduled_at' => 'nullable|date'
        ]);

        try {
            $template = EmailTemplate::find($request->template_id);
            $brevoId = null;

            // Mode API-First: créer d'abord dans Brevo
            if ($this->brevoService->isApiKeyValid() && $template) {
                $brevoCampaign = $this->brevoService->createCampaign(
                    $request->name,
                    $template->subject,
                    $template->html_content,
                    $request->recipients ?? []
                );
                
                if (isset($brevoCampaign['id'])) {
                    $brevoId = $brevoCampaign['id'];
                }
            }

            // Créer en DB locale (cache/backup)
            $campaign = EmailCampaign::create([
                ...$request->all(),
                'brevo_id' => $brevoId
            ]);
            $campaign->load('template');

            return response()->json($campaign, 201);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to create campaign: ' . $e->getMessage()], 500);
        }
    }

    public function show(EmailCampaign $campaign): JsonResponse
    {
        $campaign->load('template', 'analytics');
        return response()->json($campaign);
    }

    public function update(Request $request, EmailCampaign $campaign): JsonResponse
    {
        $request->validate([
            'name' => 'sometimes|string|max:255',
            'template_id' => 'sometimes|exists:email_templates,id',
            'status' => 'sometimes|in:draft,scheduled,sending,sent,paused',
            'recipients' => 'nullable|array',
            'scheduled_at' => 'nullable|date'
        ]);

        $campaign->update($request->all());
        $campaign->load('template');

        return response()->json($campaign);
    }

    public function send(EmailCampaign $campaign): JsonResponse
    {
        if ($campaign->status !== 'draft' && $campaign->status !== 'scheduled') {
            return response()->json(['error' => 'Campaign cannot be sent'], 400);
        }

        try {
            $campaign->update(['status' => 'sending']);

            // Mode API-First: envoi réel via Brevo
            if ($campaign->brevo_id && $this->brevoService->isApiKeyValid()) {
                // Envoyer la campagne via Brevo
                $brevoResponse = $this->brevoService->sendCampaign($campaign->brevo_id);
                
                // Récupérer les stats réelles depuis Brevo
                $stats = $this->brevoService->getCampaignStats($campaign->brevo_id);
                
                $campaign->update([
                    'status' => 'sent',
                    'sent_count' => $stats['statistics']['sent'] ?? 0,
                    'delivered_count' => $stats['statistics']['delivered'] ?? 0,
                    'opened_count' => $stats['statistics']['uniqueOpened'] ?? 0,
                    'clicked_count' => $stats['statistics']['clicked'] ?? 0,
                    'bounced_count' => $stats['statistics']['hardBounces'] ?? 0
                ]);
            } else {
                // Fallback: marquer comme envoyé sans stats réelles
                $campaign->update([
                    'status' => 'sent',
                    'sent_count' => count($campaign->recipients ?? [])
                ]);
            }

            return response()->json($campaign);
        } catch (\Exception $e) {
            Log::error('Campaign send failed: ' . $e->getMessage());
            $campaign->update(['status' => 'draft']);
            return response()->json(['error' => 'Failed to send campaign: ' . $e->getMessage()], 500);
        }
    }

    public function destroy(EmailCampaign $campaign): JsonResponse
    {
        $campaign->delete();
        return response()->json(null, 204);
    }
}