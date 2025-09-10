import { backendEmailService, type EmailTemplate as BackendTemplate, type EmailCampaign as BackendCampaign, type Contact as BackendContact, type CampaignAnalytics as BackendAnalytics } from '../../../services/backend-email-service';
import type {
  EmailTemplate,
  EmailCampaign,
  EmailContact,
  CampaignAnalytics,
  BrevoConfig,
  BounceRecord,
  EmailEvent
} from '../types/email.types';

export class SecureBrevoService {
  private static instance: SecureBrevoService;
  private config: BrevoConfig;
  private isInitialized = false;

  private constructor() {
    this.config = {
      apiKey: 'secure-backend',  // La clé est maintenant sécurisée côté backend
      defaultFromEmail: 'noreply@tgim-challenge.com',
      defaultFromName: 'TGIM Challenge'
    };
  }

  static getInstance(): SecureBrevoService {
    if (!SecureBrevoService.instance) {
      SecureBrevoService.instance = new SecureBrevoService();
    }
    return SecureBrevoService.instance;
  }

  async initialize(config?: Partial<BrevoConfig>): Promise<void> {
    if (config) {
      this.config = { ...this.config, ...config };
    }
    
    // Test de connexion au backend
    try {
      await backendEmailService.healthCheck();
      this.isInitialized = true;
    } catch (error) {
      console.error('Failed to connect to backend:', error);
      this.isInitialized = false;
    }
  }

  private convertBackendTemplate(template: BackendTemplate): EmailTemplate {
    return {
      id: template.id,
      name: template.name,
      subject: template.subject,
      htmlContent: template.html_content,
      variables: template.variables || [],
      isActive: template.is_active,
      createdAt: new Date(template.created_at),
      updatedAt: new Date(template.updated_at)
    };
  }

  private convertBackendCampaign(campaign: BackendCampaign): EmailCampaign {
    return {
      id: campaign.id,
      name: campaign.name,
      templateId: campaign.template_id,
      subject: campaign.template?.subject || '',
      status: campaign.status,
      recipients: campaign.recipients || [],
      scheduledAt: campaign.scheduled_at ? new Date(campaign.scheduled_at) : undefined,
      sentCount: campaign.sent_count,
      deliveredCount: campaign.delivered_count,
      openedCount: campaign.opened_count,
      clickedCount: campaign.clicked_count,
      bouncedCount: campaign.bounced_count,
      createdAt: new Date(campaign.created_at),
      updatedAt: new Date(campaign.updated_at)
    };
  }

  private convertBackendContact(contact: BackendContact): EmailContact {
    return {
      id: contact.id.toString(),
      email: contact.email,
      firstName: contact.first_name || contact.attributes?.FIRSTNAME,
      lastName: contact.last_name || contact.attributes?.LASTNAME,
      company: contact.attributes?.COMPANY || contact.attributes?.company,
      attributes: contact.attributes || {},
      segments: [], // À implémenter plus tard avec les listes Brevo
      isActive: contact.is_active,
      bounced: false, // À implémenter avec les données de bounce Brevo
      unsubscribed: !!contact.unsubscribed_at,
      subscribedAt: contact.subscribed_at ? new Date(contact.subscribed_at) : undefined,
      unsubscribedAt: contact.unsubscribed_at ? new Date(contact.unsubscribed_at) : undefined,
      createdAt: new Date(contact.created_at),
      updatedAt: new Date(contact.updated_at)
    };
  }

  private convertBackendAnalytics(analytics: BackendAnalytics): CampaignAnalytics {
    return {
      campaignId: analytics.campaignId,
      campaignName: analytics.campaignName,
      templateName: analytics.templateName,
      sent: analytics.sent,
      delivered: analytics.delivered,
      opened: analytics.opened,
      clicked: analytics.clicked,
      bounced: analytics.bounced,
      openRate: analytics.openRate,
      clickRate: analytics.clickRate,
      bounceRate: analytics.bounceRate,
      status: analytics.status,
      createdAt: new Date(analytics.createdAt)
    };
  }

  // Templates
  async getEmailTemplates(): Promise<EmailTemplate[]> {
    const templates = await backendEmailService.getEmailTemplates();
    return templates.map(template => this.convertBackendTemplate(template));
  }

  async createEmailTemplate(template: Omit<EmailTemplate, 'id' | 'createdAt' | 'updatedAt'>): Promise<EmailTemplate> {
    const backendTemplate = await backendEmailService.createEmailTemplate({
      name: template.name,
      subject: template.subject,
      html_content: template.htmlContent,
      variables: template.variables,
      is_active: template.isActive
    });
    return this.convertBackendTemplate(backendTemplate);
  }

  async updateEmailTemplate(id: number, template: Partial<EmailTemplate>): Promise<EmailTemplate> {
    const updateData: any = {};
    if (template.name !== undefined) updateData.name = template.name;
    if (template.subject !== undefined) updateData.subject = template.subject;
    if (template.htmlContent !== undefined) updateData.html_content = template.htmlContent;
    if (template.variables !== undefined) updateData.variables = template.variables;
    if (template.isActive !== undefined) updateData.is_active = template.isActive;

    const backendTemplate = await backendEmailService.updateEmailTemplate(id, updateData);
    return this.convertBackendTemplate(backendTemplate);
  }

  async deleteEmailTemplate(id: number): Promise<void> {
    await backendEmailService.deleteEmailTemplate(id);
  }

  // Campaigns
  async getCampaigns(): Promise<EmailCampaign[]> {
    const campaigns = await backendEmailService.getCampaigns();
    return campaigns.map(campaign => this.convertBackendCampaign(campaign));
  }

  async createCampaign(campaign: Omit<EmailCampaign, 'id' | 'sentCount' | 'deliveredCount' | 'openedCount' | 'clickedCount' | 'bouncedCount' | 'createdAt' | 'updatedAt'>): Promise<EmailCampaign> {
    const backendCampaign = await backendEmailService.createCampaign({
      name: campaign.name,
      template_id: campaign.templateId,
      status: campaign.status,
      recipients: campaign.recipients,
      scheduled_at: campaign.scheduledAt?.toISOString()
    });
    return this.convertBackendCampaign(backendCampaign);
  }

  async updateCampaign(id: number, campaign: Partial<EmailCampaign>): Promise<EmailCampaign> {
    const updateData: any = {};
    if (campaign.name !== undefined) updateData.name = campaign.name;
    if (campaign.status !== undefined) updateData.status = campaign.status;
    if (campaign.recipients !== undefined) updateData.recipients = campaign.recipients;
    if (campaign.scheduledAt !== undefined) updateData.scheduled_at = campaign.scheduledAt.toISOString();

    const backendCampaign = await backendEmailService.updateCampaign(id, updateData);
    return this.convertBackendCampaign(backendCampaign);
  }

  async sendCampaign(id: number): Promise<EmailCampaign> {
    const backendCampaign = await backendEmailService.sendCampaign(id);
    return this.convertBackendCampaign(backendCampaign);
  }

  async deleteCampaign(id: number): Promise<void> {
    await backendEmailService.deleteCampaign(id);
  }

  // Contacts
  async getContacts(limit?: number, offset?: number): Promise<EmailContact[]> {
    const result = await backendEmailService.getContacts();
    return result.data.map(contact => this.convertBackendContact(contact));
  }

  async createContact(contact: { email: string; attributes?: Record<string, any>; listIds?: number[] }): Promise<EmailContact> {
    const backendContact = await backendEmailService.createContact({
      email: contact.email,
      first_name: contact.attributes?.FIRSTNAME,
      last_name: contact.attributes?.LASTNAME,
      attributes: contact.attributes,
      is_active: true
    });
    return this.convertBackendContact(backendContact);
  }

  async updateContact(id: number, contact: Partial<EmailContact>): Promise<EmailContact> {
    const updateData: any = {};
    if (contact.firstName !== undefined) updateData.first_name = contact.firstName;
    if (contact.lastName !== undefined) updateData.last_name = contact.lastName;
    if (contact.attributes !== undefined) updateData.attributes = contact.attributes;
    if (contact.isActive !== undefined) updateData.is_active = contact.isActive;

    const backendContact = await backendEmailService.updateContact(id, updateData);
    return this.convertBackendContact(backendContact);
  }

  async deleteContact(id: number): Promise<void> {
    await backendEmailService.deleteContact(id);
  }

  // Analytics
  async getCampaignAnalytics(): Promise<CampaignAnalytics[]> {
    const analytics = await backendEmailService.getCampaignAnalytics();
    return analytics.map(analytic => this.convertBackendAnalytics(analytic));
  }

  async getCampaignAnalytic(campaignId: number): Promise<CampaignAnalytics> {
    const analytic = await backendEmailService.getCampaignAnalytic(campaignId);
    return this.convertBackendAnalytics(analytic);
  }

  // Méthodes non implémentées côté backend (pour compatibilité)
  async sendTransactionalEmail(): Promise<any> {
    throw new Error('Transactional emails should be sent via backend API');
  }

  async getBounces(campaignId?: string): Promise<BounceRecord[]> {
    // Pour l'instant, retourner une liste vide
    // TODO: Implémenter avec l'API Brevo pour récupérer les bounces réels
    return [];
  }

  async cleanupBounces(bounceIds: string[]): Promise<void> {
    // Pour l'instant, pas d'implémentation
    // TODO: Implémenter avec l'API Brevo pour nettoyer les bounces
    return Promise.resolve();
  }

  async getBounceRecords(): Promise<BounceRecord[]> {
    return [];
  }

  async processBounces(): Promise<void> {
    // Pas d'implémentation nécessaire, géré côté backend
  }

  async processWebhook(): Promise<void> {
    // Pas d'implémentation nécessaire, géré côté backend
  }
}

// Export de l'instance comme service par défaut
export const brevoService = SecureBrevoService.getInstance();