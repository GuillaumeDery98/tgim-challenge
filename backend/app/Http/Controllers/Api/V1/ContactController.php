<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Contact;
use App\Services\BrevoService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class ContactController extends Controller
{
    protected $brevoService;

    public function __construct(BrevoService $brevoService)
    {
        $this->brevoService = $brevoService;
    }

    public function index(): JsonResponse
    {
        try {
            // Synchroniser d'abord avec Brevo pour obtenir les derniers contacts
            $brevoContacts = $this->brevoService->getContacts();
            $this->syncBrevoContactsToLocal($brevoContacts['contacts']);
            
            // Retourner les contacts locaux (maintenant synchronisés)
            $contacts = Contact::orderBy('created_at', 'desc')
                ->paginate(50);
                
            return response()->json($contacts);
        } catch (\Exception $e) {
            // En cas d'erreur API Brevo, utiliser les contacts locaux comme fallback
            \Log::warning('Brevo sync failed, using local contacts: ' . $e->getMessage());
            
            $contacts = Contact::orderBy('created_at', 'desc')
                ->paginate(50);
                
            return response()->json($contacts);
        }
    }

    /**
     * Synchronise les contacts Brevo vers la base locale
     */
    private function syncBrevoContactsToLocal(array $brevoContacts): void
    {
        foreach ($brevoContacts as $brevoContact) {
            if (!$brevoContact['email'] || $brevoContact['emailBlacklisted']) {
                continue; // Ignorer les contacts sans email ou blacklistés
            }

            // Mettre à jour ou créer le contact local
            Contact::updateOrCreate(
                ['email' => $brevoContact['email']],
                [
                    'first_name' => $brevoContact['attributes']['FIRSTNAME'] ?? null,
                    'last_name' => $brevoContact['attributes']['LASTNAME'] ?? null,
                    'attributes' => $brevoContact['attributes'] ?? [],
                    'is_active' => !$brevoContact['emailBlacklisted'],
                    'subscribed_at' => $brevoContact['createdAt'] 
                        ? \Carbon\Carbon::parse($brevoContact['createdAt'])->utc() 
                        : now(),
                    'updated_at' => $brevoContact['modifiedAt']
                        ? \Carbon\Carbon::parse($brevoContact['modifiedAt'])->utc()
                        : now()
                ]
            );
        }
    }

    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'email' => 'required|email|unique:contacts,email',
            'first_name' => 'nullable|string|max:255',
            'last_name' => 'nullable|string|max:255',
            'attributes' => 'nullable|array'
        ]);

        try {
            // Préparer les attributs pour Brevo
            $brevoAttributes = array_merge($request->get('attributes', []), [
                'FIRSTNAME' => $request->get('first_name'),
                'LASTNAME' => $request->get('last_name')
            ]);

            // D'abord créer dans Brevo (priorité à l'API externe)
            $brevoResult = $this->brevoService->createContact(
                $request->get('email'),
                $brevoAttributes
            );

            \Log::info('Brevo contact created successfully', $brevoResult);

            // Ensuite créer en base locale
            $contact = Contact::create([
                'email' => $request->get('email'),
                'first_name' => $request->get('first_name'),
                'last_name' => $request->get('last_name'),
                'attributes' => $brevoAttributes,
                'is_active' => true,
                'subscribed_at' => now()
            ]);

            return response()->json($contact, 201);

        } catch (\Exception $e) {
            \Log::error('Contact creation failed: ' . $e->getMessage());
            
            // Analyser l'erreur pour donner un message plus précis
            if (strpos($e->getMessage(), 'duplicate_parameter') !== false) {
                return response()->json([
                    'error' => 'Contact already exists in email service',
                    'details' => 'This email is already registered in Brevo'
                ], 409);
            }
            
            if (strpos($e->getMessage(), '401') !== false) {
                return response()->json([
                    'error' => 'Email service authentication failed',
                    'details' => 'Check Brevo API configuration'
                ], 500);
            }

            return response()->json([
                'error' => 'Failed to create contact',
                'details' => 'Contact creation failed in email service'
            ], 500);
        }
    }

    public function show(Contact $contact): JsonResponse
    {
        return response()->json($contact);
    }

    public function update(Request $request, Contact $contact): JsonResponse
    {
        $request->validate([
            'first_name' => 'nullable|string|max:255',
            'last_name' => 'nullable|string|max:255',
            'attributes' => 'nullable|array',
            'is_active' => 'sometimes|boolean'
        ]);

        try {
            // Préparer les attributs pour Brevo
            $brevoAttributes = array_merge(
                $contact->attributes ?? [],
                $request->get('attributes', []),
                [
                    'FIRSTNAME' => $request->get('first_name', $contact->first_name),
                    'LASTNAME' => $request->get('last_name', $contact->last_name)
                ]
            );

            // Mettre à jour dans Brevo d'abord
            $this->brevoService->updateContact($contact->email, $brevoAttributes);
            \Log::info('Brevo contact updated successfully', ['email' => $contact->email]);

            // Puis mettre à jour localement
            $contact->update([
                'first_name' => $request->get('first_name', $contact->first_name),
                'last_name' => $request->get('last_name', $contact->last_name),
                'attributes' => $brevoAttributes,
                'is_active' => $request->get('is_active', $contact->is_active)
            ]);

            return response()->json($contact);

        } catch (\Exception $e) {
            \Log::error('Contact update failed: ' . $e->getMessage());
            
            // En cas d'erreur Brevo, mettre à jour quand même localement
            $contact->update($request->only(['first_name', 'last_name', 'attributes', 'is_active']));
            
            return response()->json([
                'contact' => $contact,
                'warning' => 'Contact updated locally but sync to email service failed'
            ], 200);
        }
    }

    public function destroy(Contact $contact): JsonResponse
    {
        try {
            // Supprimer de Brevo d'abord
            $this->brevoService->deleteContact($contact->email);
            \Log::info('Brevo contact deleted successfully', ['email' => $contact->email]);

            // Puis supprimer localement
            $contact->delete();
            
            return response()->json(null, 204);

        } catch (\Exception $e) {
            \Log::error('Contact deletion failed: ' . $e->getMessage());
            
            // En cas d'erreur Brevo, supprimer quand même localement
            $contact->delete();
            
            return response()->json([
                'warning' => 'Contact deleted locally but removal from email service failed'
            ], 200);
        }
    }
}