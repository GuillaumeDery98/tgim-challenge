<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class EmailTemplate extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'subject', 
        'html_content',
        'variables',
        'is_active',
        'brevo_id'
    ];

    protected $casts = [
        'variables' => 'array',
        'is_active' => 'boolean'
    ];

    public function campaigns()
    {
        return $this->hasMany(EmailCampaign::class, 'template_id');
    }
}