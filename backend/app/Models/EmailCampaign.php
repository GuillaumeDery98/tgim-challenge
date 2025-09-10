<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class EmailCampaign extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'template_id',
        'status',
        'recipients',
        'scheduled_at',
        'sent_count',
        'delivered_count', 
        'opened_count',
        'clicked_count',
        'bounced_count',
        'brevo_id'
    ];

    protected $casts = [
        'recipients' => 'array',
        'scheduled_at' => 'datetime'
    ];

    public function template()
    {
        return $this->belongsTo(EmailTemplate::class, 'template_id');
    }

    public function analytics()
    {
        return $this->hasMany(CampaignAnalytic::class, 'campaign_id');
    }
}