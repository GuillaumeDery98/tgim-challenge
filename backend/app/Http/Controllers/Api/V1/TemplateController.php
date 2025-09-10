<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\EmailTemplate;
use App\Services\BrevoService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Log;

class TemplateController extends Controller
{
    protected $brevoService;

    public function __construct(BrevoService $brevoService)
    {
        $this->brevoService = $brevoService;
    }

    public function index(): JsonResponse
    {
        try {
            // Mode API-First: récupérer d'abord depuis Brevo
            if ($this->brevoService->isApiKeyValid()) {
                $brevoTemplates = $this->brevoService->getEmailTemplates();
                
                if (isset($brevoTemplates['templates']) && !empty($brevoTemplates['templates'])) {
                    // Synchroniser avec DB locale (cache)
                    foreach ($brevoTemplates['templates'] as $brevoTemplate) {
                        EmailTemplate::updateOrCreate(
                            ['brevo_id' => $brevoTemplate['id']],
                            [
                                'name' => $brevoTemplate['name'],
                                'subject' => $brevoTemplate['subject'] ?? '',
                                'html_content' => $brevoTemplate['htmlContent'] ?? '',
                                'is_active' => $brevoTemplate['isActive'] ?? true,
                            ]
                        );
                    }
                    
                    // Retourner les templates depuis Brevo (source principale)
                    return response()->json($brevoTemplates['templates']);
                }
            }
            
            // Fallback: utiliser DB locale si API Brevo indisponible
            $templates = EmailTemplate::orderBy('created_at', 'desc')->get();
            return response()->json($templates);
            
        } catch (\Exception $e) {
            // Fallback en cas d'erreur : utiliser DB locale
            Log::error('Templates API-First failed: ' . $e->getMessage());
            $templates = EmailTemplate::orderBy('created_at', 'desc')->get();
            return response()->json($templates);
        }
    }

    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'subject' => 'required|string|max:255',
            'html_content' => 'required|string',
            'variables' => 'nullable|array'
        ]);

        try {
            $brevoId = null;
            
            // Mode API-First: créer d'abord dans Brevo
            if ($this->brevoService->isApiKeyValid()) {
                try {
                    $brevoTemplate = $this->brevoService->createEmailTemplate(
                        $request->name,
                        $request->subject, 
                        $request->html_content
                    );
                    
                    if (isset($brevoTemplate['id'])) {
                        $brevoId = $brevoTemplate['id'];
                    }
                } catch (\Exception $brevoException) {
                    // Log l'erreur Brevo mais continue avec fallback
                    Log::warning('Brevo template creation failed, using fallback: ' . $brevoException->getMessage());
                }
            }
            
            // Créer en DB locale (cache/backup) - toujours exécuté
            $template = EmailTemplate::create([
                ...$request->all(),
                'brevo_id' => $brevoId
            ]);

            return response()->json($template, 201);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to create template: ' . $e->getMessage()], 500);
        }
    }

    public function show(EmailTemplate $template): JsonResponse
    {
        return response()->json($template);
    }

    public function update(Request $request, EmailTemplate $template): JsonResponse
    {
        $request->validate([
            'name' => 'sometimes|string|max:255',
            'subject' => 'sometimes|string|max:255', 
            'html_content' => 'sometimes|string',
            'variables' => 'nullable|array',
            'is_active' => 'sometimes|boolean'
        ]);

        try {
            // Mode API-First: mettre à jour d'abord dans Brevo
            if ($template->brevo_id && $this->brevoService->isApiKeyValid()) {
                $this->brevoService->updateEmailTemplate(
                    $template->brevo_id,
                    $request->get('name', $template->name),
                    $request->get('subject', $template->subject),
                    $request->get('html_content', $template->html_content)
                );
            }

            // Mettre à jour en DB locale (cache/backup)
            $template->update($request->all());

            return response()->json($template);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to update template: ' . $e->getMessage()], 500);
        }
    }

    public function destroy(EmailTemplate $template): JsonResponse
    {
        try {
            // Mode API-First: supprimer d'abord dans Brevo
            if ($template->brevo_id && $this->brevoService->isApiKeyValid()) {
                $this->brevoService->deleteEmailTemplate($template->brevo_id);
            }

            // Supprimer en DB locale (cache/backup)
            $template->delete();
            
            return response()->json(null, 204);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to delete template: ' . $e->getMessage()], 500);
        }
    }
}