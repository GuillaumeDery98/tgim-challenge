<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\V1\TemplateController;
use App\Http\Controllers\Api\V1\CampaignController;
use App\Http\Controllers\Api\V1\ContactController;
use App\Http\Controllers\Api\V1\AnalyticsController;
use App\Http\Controllers\Api\V1\ChatController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

// API V1 Routes - Public (pas d'authentification pour le challenge)
Route::prefix('v1')->group(function () {

    // Templates
    Route::apiResource('templates', TemplateController::class);

    // Campaigns
    Route::apiResource('campaigns', CampaignController::class);
    Route::post('campaigns/{campaign}/send', [CampaignController::class, 'send']);

    // Contacts
    Route::apiResource('contacts', ContactController::class);

    // Analytics
    Route::get('analytics', [AnalyticsController::class, 'index']);
    Route::get('analytics/campaigns/{campaign}', [AnalyticsController::class, 'campaign']);

    // Chat & RAG
    Route::post('chat/session', [ChatController::class, 'ensureSession']);
    Route::get('chat/sessions', [ChatController::class, 'sessions']);
    Route::delete('chat/sessions/{externalId}', [ChatController::class, 'deleteSession']);
    Route::get('chat/{externalId}/messages', [ChatController::class, 'messages']);
    Route::post('chat/{externalId}/messages', [ChatController::class, 'postMessage']);
    Route::post('documents/upload', [ChatController::class, 'uploadDocument']);
    Route::get('documents', [ChatController::class, 'documents']);
    Route::post('chat/query', [ChatController::class, 'query']);

    // Health check
    Route::get('health', function () {
        return response()->json([
            'status' => 'ok',
            'timestamp' => now(),
            'version' => '1.0.0'
        ]);
    });
});
