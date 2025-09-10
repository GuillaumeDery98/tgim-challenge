<?php

namespace App\Services;

use Brevo\Client\Configuration;
use Brevo\Client\Api\TransactionalEmailsApi;
use Brevo\Client\Api\EmailCampaignsApi;
use Brevo\Client\Api\ContactsApi;
use Brevo\Client\Api\AccountApi;
use Brevo\Client\Model\SendSmtpEmail;
use Brevo\Client\Model\CreateEmailCampaign;
use Brevo\Client\Model\CreateContact;
use Brevo\Client\Model\UpdateContact;
use Brevo\Client\Model\CreateSmtpTemplate;
use Brevo\Client\Model\UpdateSmtpTemplate;
use GuzzleHttp\Client;
use Illuminate\Support\Facades\Log;

class BrevoService
{
    protected $config;
    protected $transactionalEmailsApi;
    protected $emailCampaignsApi;
    protected $contactsApi;
    protected $accountApi;
    protected $apiKey;
    protected static $apiKeyValidCache = null;
    protected static $cacheExpiry = null;

    public function __construct()
    {
        $this->apiKey = env('BREVO_API_KEY');
        $this->config = Configuration::getDefaultConfiguration()->setApiKey('api-key', $this->apiKey);
        
        $client = new Client();
        $this->transactionalEmailsApi = new TransactionalEmailsApi($client, $this->config);
        $this->emailCampaignsApi = new EmailCampaignsApi($client, $this->config);
        $this->contactsApi = new ContactsApi($client, $this->config);
        $this->accountApi = new AccountApi($client, $this->config);
    }

    public function sendTransactionalEmail($templateId, $to, $templateData = [])
    {
        try {
            $sendSmtpEmail = new SendSmtpEmail();
            $sendSmtpEmail->setTemplateId($templateId);
            $sendSmtpEmail->setTo(is_array($to) ? $to : [['email' => $to]]);
            $sendSmtpEmail->setParams($templateData);

            $result = $this->transactionalEmailsApi->sendTransacEmail($sendSmtpEmail);
            return ['messageId' => $result->getMessageId()];
        } catch (\Exception $e) {
            Log::error('Brevo send email failed: ' . $e->getMessage());
            throw $e;
        }
    }

    public function createEmailTemplate($name, $subject, $htmlContent)
    {
        try {
            $template = new CreateSmtpTemplate();
            $template->setTemplateName($name);
            $template->setSubject($subject);
            $template->setHtmlContent($htmlContent);
            $template->setIsActive(true);
            
            // Ajouter les détails du sender requis par l'API Brevo
            $sender = new \Brevo\Client\Model\CreateSmtpTemplateSender();
            $sender->setName('TGIM Challenge');
            $sender->setEmail('gamingfrenezy@gmail.com');
            $template->setSender($sender);

            $result = $this->transactionalEmailsApi->createSmtpTemplate($template);
            return ['id' => $result->getId()];
        } catch (\Exception $e) {
            Log::error('Brevo create template failed: ' . $e->getMessage());
            throw $e;
        }
    }

    public function getEmailTemplates()
    {
        try {
            $result = $this->transactionalEmailsApi->getSmtpTemplates();
            $templates = [];
            
            foreach ($result->getTemplates() as $template) {
                $templates[] = [
                    'id' => $template->getId(),
                    'name' => $template->getName(),
                    'subject' => $template->getSubject(),
                    'htmlContent' => $template->getHtmlContent(),
                    'isActive' => $template->getIsActive(),
                    'createdAt' => $template->getCreatedAt(),
                    'modifiedAt' => $template->getModifiedAt()
                ];
            }
            
            return ['templates' => $templates];
        } catch (\Exception $e) {
            Log::error('Brevo get templates failed: ' . $e->getMessage());
            return ['templates' => []];
        }
    }

    public function createContact($email, $attributes = [])
    {
        try {
            $contact = new CreateContact();
            $contact->setEmail($email);
            $contact->setAttributes($attributes);
            $contact->setUpdateEnabled(true);

            $result = $this->contactsApi->createContact($contact);
            return ['id' => $result->getId()];
        } catch (\Exception $e) {
            Log::error('Brevo create contact failed: ' . $e->getMessage());
            throw $e;
        }
    }

    public function getContacts($limit = 50, $offset = 0)
    {
        try {
            $result = $this->contactsApi->getContacts($limit, $offset);
            $contacts = [];
            
            foreach ($result->getContacts() as $contact) {
                $contacts[] = [
                    'id' => $contact->getId(),
                    'email' => $contact->getEmail(),
                    'attributes' => $contact->getAttributes(),
                    'emailBlacklisted' => $contact->getEmailBlacklisted(),
                    'smsBlacklisted' => $contact->getSmsBlacklisted(),
                    'createdAt' => $contact->getCreatedAt(),
                    'modifiedAt' => $contact->getModifiedAt()
                ];
            }
            
            return [
                'contacts' => $contacts,
                'count' => $result->getCount()
            ];
        } catch (\Exception $e) {
            Log::error('Brevo get contacts failed: ' . $e->getMessage());
            return ['contacts' => [], 'count' => 0];
        }
    }

    public function createCampaign($name, $subject, $htmlContent, $recipients = [])
    {
        try {
            $campaign = new CreateEmailCampaign();
            $campaign->setName($name);
            $campaign->setSubject($subject);
            $campaign->setHtmlContent($htmlContent);
            
            $recipientsObj = new \Brevo\Client\Model\CreateEmailCampaignRecipients();
            $recipientsObj->setListIds($recipients);
            $campaign->setRecipients($recipientsObj);

            $result = $this->emailCampaignsApi->createEmailCampaign($campaign);
            return ['id' => $result->getId()];
        } catch (\Exception $e) {
            Log::error('Brevo create campaign failed: ' . $e->getMessage());
            throw $e;
        }
    }

    public function sendCampaign($campaignId)
    {
        try {
            $this->emailCampaignsApi->sendEmailCampaignNow($campaignId);
            return ['success' => true];
        } catch (\Exception $e) {
            Log::error('Brevo send campaign failed: ' . $e->getMessage());
            throw $e;
        }
    }

    public function getCampaignStats($campaignId)
    {
        try {
            $result = $this->emailCampaignsApi->getEmailCampaign($campaignId);
            $stats = $result->getStatistics();
            
            return [
                'id' => $result->getId(),
                'name' => $result->getName(),
                'subject' => $result->getSubject(),
                'status' => $result->getStatus(),
                'statistics' => [
                    'sent' => $stats ? $stats->getGlobalStats()->getSent() : 0,
                    'delivered' => $stats ? $stats->getGlobalStats()->getDelivered() : 0,
                    'hardBounces' => $stats ? $stats->getGlobalStats()->getHardBounces() : 0,
                    'softBounces' => $stats ? $stats->getGlobalStats()->getSoftBounces() : 0,
                    'complaints' => $stats ? $stats->getGlobalStats()->getComplaints() : 0,
                    'unsubscriptions' => $stats ? $stats->getGlobalStats()->getUnsubscriptions() : 0,
                    'opened' => $stats ? $stats->getGlobalStats()->getOpened() : 0,
                    'clicked' => $stats ? $stats->getGlobalStats()->getClicked() : 0,
                    'uniqueOpened' => $stats ? $stats->getGlobalStats()->getUniqueOpened() : 0,
                    'uniqueClicked' => $stats ? $stats->getGlobalStats()->getUniqueClicked() : 0
                ]
            ];
        } catch (\Exception $e) {
            Log::error('Brevo get campaign stats failed: ' . $e->getMessage());
            return [];
        }
    }

    public function updateEmailTemplate($templateId, $name, $subject, $htmlContent)
    {
        try {
            $template = new UpdateSmtpTemplate();
            $template->setTemplateName($name);
            $template->setSubject($subject);
            $template->setHtmlContent($htmlContent);
            $template->setIsActive(true);
            
            // Ajouter les détails du sender requis par l'API Brevo
            $sender = new \Brevo\Client\Model\UpdateSmtpTemplateSender();
            $sender->setName('TGIM Challenge');
            $sender->setEmail('gamingfrenezy@gmail.com');
            $template->setSender($sender);

            $this->transactionalEmailsApi->updateSmtpTemplate($templateId, $template);
            return ['success' => true];
        } catch (\Exception $e) {
            Log::error('Brevo update template failed: ' . $e->getMessage());
            throw $e;
        }
    }

    public function deleteEmailTemplate($templateId)
    {
        try {
            $this->transactionalEmailsApi->deleteSmtpTemplate($templateId);
            return true;
        } catch (\Exception $e) {
            Log::error('Brevo delete template failed: ' . $e->getMessage());
            throw $e;
        }
    }

    public function getEmailTemplate($templateId)
    {
        try {
            $result = $this->transactionalEmailsApi->getSmtpTemplate($templateId);
            
            return [
                'id' => $result->getId(),
                'name' => $result->getName(),
                'subject' => $result->getSubject(),
                'htmlContent' => $result->getHtmlContent(),
                'textContent' => $result->getTextContent(),
                'isActive' => $result->getIsActive(),
                'createdAt' => $result->getCreatedAt(),
                'modifiedAt' => $result->getModifiedAt()
            ];
        } catch (\Exception $e) {
            Log::error('Brevo get template failed: ' . $e->getMessage());
            return null;
        }
    }

    public function updateContact($email, $attributes = [])
    {
        try {
            $contact = new UpdateContact();
            $contact->setAttributes($attributes);

            $this->contactsApi->updateContact($email, $contact);
            return ['success' => true];
        } catch (\Exception $e) {
            Log::error('Brevo update contact failed: ' . $e->getMessage());
            throw $e;
        }
    }

    public function deleteContact($email)
    {
        try {
            $this->contactsApi->deleteContact($email);
            return true;
        } catch (\Exception $e) {
            Log::error('Brevo delete contact failed: ' . $e->getMessage());
            throw $e;
        }
    }

    public function getCampaigns($type = 'classic', $status = null)
    {
        try {
            $result = $this->emailCampaignsApi->getEmailCampaigns($type, $status);
            $campaigns = [];
            
            foreach ($result->getCampaigns() as $campaign) {
                $campaigns[] = [
                    'id' => $campaign->getId(),
                    'name' => $campaign->getName(),
                    'subject' => $campaign->getSubject(),
                    'type' => $campaign->getType(),
                    'status' => $campaign->getStatus(),
                    'scheduledAt' => $campaign->getScheduledAt(),
                    'createdAt' => $campaign->getCreatedAt(),
                    'modifiedAt' => $campaign->getModifiedAt()
                ];
            }
            
            return [
                'campaigns' => $campaigns,
                'count' => $result->getCount()
            ];
        } catch (\Exception $e) {
            Log::error('Brevo get campaigns failed: ' . $e->getMessage());
            return ['campaigns' => [], 'count' => 0];
        }
    }

    public function getCampaign($campaignId)
    {
        try {
            $result = $this->emailCampaignsApi->getEmailCampaign($campaignId);
            
            return [
                'id' => $result->getId(),
                'name' => $result->getName(),
                'subject' => $result->getSubject(),
                'type' => $result->getType(),
                'status' => $result->getStatus(),
                'htmlContent' => $result->getHtmlContent(),
                'textContent' => $result->getTextContent(),
                'scheduledAt' => $result->getScheduledAt(),
                'createdAt' => $result->getCreatedAt(),
                'modifiedAt' => $result->getModifiedAt(),
                'statistics' => $result->getStatistics()
            ];
        } catch (\Exception $e) {
            Log::error('Brevo get campaign failed: ' . $e->getMessage());
            return null;
        }
    }

    public function updateCampaign($campaignId, $name, $subject, $htmlContent)
    {
        try {
            $campaign = new \Brevo\Client\Model\UpdateEmailCampaign();
            $campaign->setName($name);
            $campaign->setSubject($subject);
            $campaign->setHtmlContent($htmlContent);

            $this->emailCampaignsApi->updateEmailCampaign($campaignId, $campaign);
            return ['success' => true];
        } catch (\Exception $e) {
            Log::error('Brevo update campaign failed: ' . $e->getMessage());
            throw $e;
        }
    }

    public function deleteCampaign($campaignId)
    {
        try {
            $this->emailCampaignsApi->deleteEmailCampaign($campaignId);
            return true;
        } catch (\Exception $e) {
            Log::error('Brevo delete campaign failed: ' . $e->getMessage());
            throw $e;
        }
    }

    public function getCampaignReport($campaignId)
    {
        try {
            $result = $this->emailCampaignsApi->getEmailCampaignReport($campaignId);
            
            return [
                'campaignId' => $result->getCampaignId(),
                'stats' => $result->getStats(),
                'recipients' => $result->getRecipients()
            ];
        } catch (\Exception $e) {
            Log::error('Brevo get campaign report failed: ' . $e->getMessage());
            return null;
        }
    }

    public function isApiKeyValid()
    {
        // Vérifier le cache (valide pendant 5 minutes)
        if (self::$apiKeyValidCache !== null && self::$cacheExpiry && time() < self::$cacheExpiry) {
            return self::$apiKeyValidCache;
        }

        try {
            $result = $this->accountApi->getAccount();
            $isValid = $result !== null;
            
            // Mettre en cache le résultat
            self::$apiKeyValidCache = $isValid;
            self::$cacheExpiry = time() + 300; // 5 minutes
            
            return $isValid;
        } catch (\Exception $e) {
            $errorMessage = $e->getMessage();
            
            // Log différent selon le type d'erreur
            if (strpos($errorMessage, '401') !== false && strpos($errorMessage, 'unrecognised IP') !== false) {
                Log::warning('Brevo API: IP address not whitelisted for API key. Using fallback mode.');
            } else {
                Log::error('Brevo API key validation failed: ' . $errorMessage);
            }
            
            // Mettre en cache l'échec pour éviter des appels répétés
            self::$apiKeyValidCache = false;
            self::$cacheExpiry = time() + 300; // 5 minutes
            
            return false;
        }
    }
}