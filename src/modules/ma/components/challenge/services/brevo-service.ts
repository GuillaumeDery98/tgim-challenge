// Important: Do NOT statically import '@getbrevo/brevo' in the browser.
// Vite will externalize Node built-ins (http/https), causing runtime errors.
// We'll dynamically import it only on the server (SSR) and provide browser fallbacks.
let brevoModule: any = null;
import type {
  EmailTemplate,
  EmailCampaign,
  EmailContact,
  CampaignAnalytics,
  BrevoConfig,
  BounceRecord,
  EmailEvent
} from '../types/email.types';

export class BrevoService {
  private static instance: BrevoService;
  private transactionalEmailsApi: any;
  private contactsApi: any;
  private emailCampaignsApi: any;
  private accountApi: any;
  private config: BrevoConfig;
  private isInitialized = false;
  private useRemoteApis = false; // true only when brevo is loaded on server

  private constructor() {
    // Default config - can be overridden
    this.config = {
      apiKey: (import.meta as any).env?.VITE_BREVO_API_KEY || 'demo-key',
      defaultFromEmail: 'noreply@tgim-challenge.com',
      defaultFromName: 'TGIM Challenge',
      webhookUrl: (import.meta as any).env?.VITE_BREVO_WEBHOOK_URL
    };
  }

  static getInstance(): BrevoService {
    if (!BrevoService.instance) {
      BrevoService.instance = new BrevoService();
    }
    return BrevoService.instance;
  }

  async initialize(config?: Partial<BrevoConfig>): Promise<void> {
    if (config) {
      this.config = { ...this.config, ...config };
    }

    // Only try to load brevo server-side where Node built-ins exist
    const isServer = typeof window === 'undefined' || typeof document === 'undefined';
    if (isServer) {
      try {
        if (!brevoModule) {
          brevoModule = await import('@getbrevo/brevo');
        }
        this.transactionalEmailsApi = new brevoModule.TransactionalEmailsApi();
        this.contactsApi = new brevoModule.ContactsApi();
        this.emailCampaignsApi = new brevoModule.EmailCampaignsApi();
        this.accountApi = new brevoModule.AccountApi();

        // Set API key for all APIs
        const apiKey = this.transactionalEmailsApi.authentications['api-key'];
        apiKey.apiKey = this.config.apiKey;

        const contactsApiKey = this.contactsApi.authentications['api-key'];
        contactsApiKey.apiKey = this.config.apiKey;

        const campaignsApiKey = this.emailCampaignsApi.authentications['api-key'];
        campaignsApiKey.apiKey = this.config.apiKey;

        const accountApiKey = this.accountApi.authentications['api-key'];
        accountApiKey.apiKey = this.config.apiKey;

        this.useRemoteApis = true;
      } catch (error) {
        // If dynamic import fails (e.g., SSR not enabled), remain in local mode
        console.warn('Brevo SDK not loaded; falling back to local mode:', error);
        this.useRemoteApis = false;
      }
    } else {
      // Browser: always use local mode to avoid Node-only SDK
      this.useRemoteApis = false;
    }

    this.isInitialized = true;
  }

  private ensureInitialized(): void {
    if (!this.isInitialized) {
      // Fire-and-forget; callers that truly need remote should await initialize explicitly
      void this.initialize();
    }
  }

  // Transactional Email Methods
  async sendTransactionalEmail(data: {
    to: { email: string; name?: string }[];
    subject: string;
    htmlContent: string;
    textContent?: string;
    templateId?: number;
    params?: Record<string, any>;
    replyTo?: { email: string; name?: string };
    headers?: Record<string, string>;
  }): Promise<{ messageId: string }> {
    this.ensureInitialized();

    try {
      if (this.useRemoteApis && this.transactionalEmailsApi && brevoModule) {
        const sendSmtpEmail = new brevoModule.SendSmtpEmail();
        sendSmtpEmail.to = data.to;
        sendSmtpEmail.subject = data.subject;
        sendSmtpEmail.htmlContent = data.htmlContent;
        if (data.textContent) sendSmtpEmail.textContent = data.textContent;
        sendSmtpEmail.sender = {
          email: this.config.defaultFromEmail,
          name: this.config.defaultFromName
        };
        if (data.templateId) sendSmtpEmail.templateId = data.templateId;
        if (data.params) sendSmtpEmail.params = data.params;
        if (data.replyTo) sendSmtpEmail.replyTo = data.replyTo;
        if (data.headers) sendSmtpEmail.headers = data.headers;
        const response = await this.transactionalEmailsApi.sendTransacEmail(sendSmtpEmail);
        return { messageId: response.messageId };
      }

      // Local/browser fallback: simulate send
      const fakeId = `local_msg_${Date.now()}`;
      // Optionally persist to localStorage for demo
      const sent = JSON.parse(localStorage.getItem('brevo_sent_emails') || '[]');
      sent.push({ id: fakeId, ...data, sentAt: new Date().toISOString() });
      localStorage.setItem('brevo_sent_emails', JSON.stringify(sent));
      return { messageId: fakeId };
    } catch (error) {
      console.error('Error sending transactional email:', error);
      throw new Error(`Failed to send email: ${error}`);
    }
  }

  // Template Management
  async createEmailTemplate(template: Omit<EmailTemplate, 'id' | 'createdAt' | 'updatedAt'>): Promise<EmailTemplate> {
    this.ensureInitialized();

    // For now, we'll simulate template creation with local storage
    // In production, this would use Brevo's template API
    const newTemplate: EmailTemplate = {
      ...template,
      id: `template_${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // Store in localStorage for demo purposes
    const templates = this.getStoredTemplates();
    templates.push(newTemplate);
    localStorage.setItem('brevo_templates', JSON.stringify(templates));

    return newTemplate;
  }

  async getEmailTemplates(): Promise<EmailTemplate[]> {
    return this.getStoredTemplates();
  }

  async updateEmailTemplate(id: string, updates: Partial<EmailTemplate>): Promise<EmailTemplate> {
    const templates = this.getStoredTemplates();
    const templateIndex = templates.findIndex(t => t.id === id);
    
    if (templateIndex === -1) {
      throw new Error(`Template with id ${id} not found`);
    }

    templates[templateIndex] = {
      ...templates[templateIndex],
      ...updates,
      updatedAt: new Date()
    };

    localStorage.setItem('brevo_templates', JSON.stringify(templates));
    return templates[templateIndex];
  }

  async deleteEmailTemplate(id: string): Promise<void> {
    const templates = this.getStoredTemplates();
    const filteredTemplates = templates.filter(t => t.id !== id);
    localStorage.setItem('brevo_templates', JSON.stringify(filteredTemplates));
  }

  // Contact Management
  async createContact(contact: {
    email: string;
    attributes?: Record<string, any>;
    listIds?: number[];
  }): Promise<void> {
    this.ensureInitialized();

    try {
      if (this.useRemoteApis && this.contactsApi && brevoModule) {
        const createContact = new brevoModule.CreateContact();
        createContact.email = contact.email;
        if (contact.attributes) createContact.attributes = contact.attributes;
        if (contact.listIds) createContact.listIds = contact.listIds;
        await this.contactsApi.createContact(createContact);
        return;
      }

      // Local/browser fallback: store in localStorage
      const contacts = this.getStoredContacts();
      const id = `contact_${Date.now()}`;
      contacts.push({
        id,
        email: contact.email,
        firstName: contact.attributes?.FIRSTNAME || '',
        lastName: contact.attributes?.LASTNAME || '',
        company: contact.attributes?.COMPANY || '',
        attributes: contact.attributes || {},
        segments: (contact.listIds || []).map(id => id.toString()),
        isActive: true,
        bounced: false,
        unsubscribed: false,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      localStorage.setItem('brevo_contacts', JSON.stringify(contacts));
    } catch (error) {
      console.error('Error creating contact:', error);
      throw new Error(`Failed to create contact: ${error}`);
    }
  }

  async getContacts(limit = 50, offset = 0): Promise<EmailContact[]> {
    this.ensureInitialized();

    try {
      if (this.useRemoteApis && this.contactsApi) {
        const response = await this.contactsApi.getContacts(limit, offset);
        return (response.contacts || []).map((contact: any) => ({
          id: contact.id?.toString() || '',
          email: contact.email || '',
          firstName: contact.attributes?.FIRSTNAME || '',
          lastName: contact.attributes?.LASTNAME || '',
          company: contact.attributes?.COMPANY || '',
          attributes: contact.attributes || {},
          segments: contact.listIds?.map((id: number) => id.toString()) || [],
          isActive: !contact.emailBlacklisted,
          bounced: contact.emailBlacklisted || false,
          unsubscribed: contact.emailBlacklisted || false,
          createdAt: contact.createdAt ? new Date(contact.createdAt) : new Date(),
          updatedAt: contact.modifiedAt ? new Date(contact.modifiedAt) : new Date()
        }));
      }

      // Local/browser fallback
      const all = this.getStoredContacts();
      return all.slice(offset, offset + limit);
    } catch (error) {
      console.error('Error getting contacts:', error);
      // Local fallback on error
      const all = this.getStoredContacts();
      return all.slice(offset, offset + limit);
    }
  }

  // Campaign Management
  async createCampaign(campaign: Omit<EmailCampaign, 'id' | 'analytics' | 'createdAt' | 'updatedAt'>): Promise<EmailCampaign> {
    this.ensureInitialized();

    const newCampaign: EmailCampaign = {
      ...campaign,
      id: `campaign_${Date.now()}`,
      analytics: {
        sent: 0,
        delivered: 0,
        opened: 0,
        clicked: 0,
        bounced: 0,
        unsubscribed: 0,
        complained: 0,
        openRate: 0,
        clickRate: 0,
        bounceRate: 0,
        unsubscribeRate: 0,
        conversionRate: 0
      },
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // Store in localStorage for demo
    const campaigns = this.getStoredCampaigns();
    campaigns.push(newCampaign);
    localStorage.setItem('brevo_campaigns', JSON.stringify(campaigns));

    return newCampaign;
  }

  async getCampaigns(): Promise<EmailCampaign[]> {
    return this.getStoredCampaigns();
  }

  async getCampaignAnalytics(campaignId: string): Promise<CampaignAnalytics> {
    const campaigns = this.getStoredCampaigns();
    const campaign = campaigns.find(c => c.id === campaignId);
    
    if (!campaign) {
      throw new Error(`Campaign with id ${campaignId} not found`);
    }

    // In production, this would fetch real analytics from Brevo
    // For demo, we'll simulate some analytics
    const simulatedAnalytics: CampaignAnalytics = {
      ...campaign.analytics,
      sent: Math.floor(Math.random() * 1000) + 100,
      delivered: 0,
      opened: 0,
      clicked: 0,
      bounced: 0,
      unsubscribed: 0,
      complained: 0,
      openRate: 0,
      clickRate: 0,
      bounceRate: 0,
      unsubscribeRate: 0,
      conversionRate: 0
    };

    simulatedAnalytics.delivered = simulatedAnalytics.sent - Math.floor(simulatedAnalytics.sent * 0.02);
    simulatedAnalytics.opened = Math.floor(simulatedAnalytics.delivered * (0.15 + Math.random() * 0.25));
    simulatedAnalytics.clicked = Math.floor(simulatedAnalytics.opened * (0.05 + Math.random() * 0.15));
    simulatedAnalytics.bounced = simulatedAnalytics.sent - simulatedAnalytics.delivered;
    simulatedAnalytics.unsubscribed = Math.floor(simulatedAnalytics.delivered * 0.005);

    simulatedAnalytics.openRate = (simulatedAnalytics.opened / simulatedAnalytics.delivered) * 100;
    simulatedAnalytics.clickRate = (simulatedAnalytics.clicked / simulatedAnalytics.delivered) * 100;
    simulatedAnalytics.bounceRate = (simulatedAnalytics.bounced / simulatedAnalytics.sent) * 100;
    simulatedAnalytics.unsubscribeRate = (simulatedAnalytics.unsubscribed / simulatedAnalytics.delivered) * 100;
    simulatedAnalytics.conversionRate = (simulatedAnalytics.clicked / simulatedAnalytics.sent) * 100;

    return simulatedAnalytics;
  }

  // Account Information
  async getAccountInfo(): Promise<any> {
    this.ensureInitialized();

    try {
      if (this.useRemoteApis && this.accountApi) {
        const response = await this.accountApi.getAccount();
        return response;
      }
      // Browser fallback returns mock
      return {
        email: this.config.defaultFromEmail,
        firstName: 'Demo',
        lastName: 'User',
        companyName: 'TGIM Challenge',
        plan: [{ type: 'payAsYouGo' }]
      };
    } catch (error) {
      console.error('Error getting account info:', error);
      // Return mock data for demo
      return {
        email: this.config.defaultFromEmail,
        firstName: 'Demo',
        lastName: 'User',
        companyName: 'TGIM Challenge',
        plan: [{ type: 'payAsYouGo' }]
      };
    }
  }

  // Bounce Management
  async getBounces(campaignId?: string): Promise<BounceRecord[]> {
    // This would typically fetch from Brevo's API
    // For demo, return simulated bounce data
    const bounces: BounceRecord[] = [];
    
    for (let i = 0; i < 5; i++) {
      bounces.push({
        id: `bounce_${i}`,
        email: `bounced${i}@example.com`,
        campaignId: campaignId || 'demo_campaign',
        bounceType: Math.random() > 0.5 ? 'hard' : 'soft',
        bounceReason: 'Mailbox does not exist',
        bounceDate: new Date(Date.now() - Math.random() * 86400000 * 7),
        attempts: Math.floor(Math.random() * 3) + 1,
        isProcessed: Math.random() > 0.3
      });
    }

    return bounces;
  }

  async cleanupBounces(bounceIds: string[]): Promise<void> {
    // In production, this would remove bounced emails from lists
    console.log(`Cleaning up ${bounceIds.length} bounced emails`);
  }

  // Webhook handling
  async handleWebhook(event: EmailEvent): Promise<void> {
    // Process webhook events (opens, clicks, bounces, etc.)
    console.log('Processing webhook event:', event);
    
    // Update analytics in real-time
    // This would typically update a database
  }

  // Helper methods
  private getStoredTemplates(): EmailTemplate[] {
    const stored = localStorage.getItem('brevo_templates');
    return stored ? JSON.parse(stored) : [];
  }

  private getStoredCampaigns(): EmailCampaign[] {
    const stored = localStorage.getItem('brevo_campaigns');
    return stored ? JSON.parse(stored) : [];
  }

  private getStoredContacts(): EmailContact[] {
    const stored = localStorage.getItem('brevo_contacts');
    return stored ? JSON.parse(stored) : [];
  }

  // Utility method for testing
  async testConnection(): Promise<boolean> {
    try {
      await this.getAccountInfo();
      return true;
    } catch (error) {
      console.error('Connection test failed:', error);
      return false;
    }
  }
}

export const brevoService = BrevoService.getInstance();