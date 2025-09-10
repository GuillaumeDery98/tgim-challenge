<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\EmailCampaign;
use App\Models\CampaignAnalytic;
use Illuminate\Http\JsonResponse;

class AnalyticsController extends Controller
{
    public function index(): JsonResponse
    {
        $campaigns = EmailCampaign::with('template')->get();
        
        $analytics = $campaigns->map(function ($campaign) {
            return [
                'campaignId' => $campaign->id,
                'campaignName' => $campaign->name,
                'templateName' => $campaign->template->name,
                'sent' => $campaign->sent_count,
                'delivered' => $campaign->delivered_count,
                'opened' => $campaign->opened_count,
                'clicked' => $campaign->clicked_count,
                'bounced' => $campaign->bounced_count,
                'openRate' => $campaign->delivered_count > 0 
                    ? ($campaign->opened_count / $campaign->delivered_count) * 100 
                    : 0,
                'clickRate' => $campaign->opened_count > 0 
                    ? ($campaign->clicked_count / $campaign->opened_count) * 100 
                    : 0,
                'bounceRate' => $campaign->sent_count > 0 
                    ? ($campaign->bounced_count / $campaign->sent_count) * 100 
                    : 0,
                'status' => $campaign->status,
                'createdAt' => $campaign->created_at
            ];
        });

        return response()->json($analytics);
    }

    public function campaign(EmailCampaign $campaign): JsonResponse
    {
        $campaign->load('template', 'analytics');
        
        $analytics = [
            'campaignId' => $campaign->id,
            'campaignName' => $campaign->name,
            'templateName' => $campaign->template->name,
            'sent' => $campaign->sent_count,
            'delivered' => $campaign->delivered_count,
            'opened' => $campaign->opened_count,
            'clicked' => $campaign->clicked_count,
            'bounced' => $campaign->bounced_count,
            'openRate' => $campaign->delivered_count > 0 
                ? ($campaign->opened_count / $campaign->delivered_count) * 100 
                : 0,
            'clickRate' => $campaign->opened_count > 0 
                ? ($campaign->clicked_count / $campaign->opened_count) * 100 
                : 0,
            'bounceRate' => $campaign->sent_count > 0 
                ? ($campaign->bounced_count / $campaign->sent_count) * 100 
                : 0,
            'status' => $campaign->status,
            'createdAt' => $campaign->created_at,
            'events' => $campaign->analytics->groupBy('event_type')->map->count()
        ];

        return response()->json($analytics);
    }
}