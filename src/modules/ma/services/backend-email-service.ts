const API_BASE_URL = 'http://127.0.0.1:8001/api/v1';

export interface EmailTemplate {
  id: number;
  name: string;
  subject: string;
  html_content: string;
  variables: string[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface EmailCampaign {
  id: number;
  name: string;
  template_id: number;
  status: 'draft' | 'scheduled' | 'sending' | 'sent' | 'paused';
  recipients: string[];
  scheduled_at?: string;
  sent_count: number;
  delivered_count: number;
  opened_count: number;
  clicked_count: number;
  bounced_count: number;
  created_at: string;
  updated_at: string;
  template?: EmailTemplate;
}

export interface Contact {
  id: number;
  email: string;
  first_name?: string;
  last_name?: string;
  attributes?: Record<string, any>;
  is_active: boolean;
  subscribed_at?: string;
  unsubscribed_at?: string;
  created_at: string;
  updated_at: string;
}

export interface CampaignAnalytics {
  campaignId: number;
  campaignName: string;
  templateName: string;
  sent: number;
  delivered: number;
  opened: number;
  clicked: number;
  bounced: number;
  openRate: number;
  clickRate: number;
  bounceRate: number;
  status: string;
  createdAt: string;
}

class BackendEmailService {
  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...options?.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  // Templates
  async getEmailTemplates(): Promise<EmailTemplate[]> {
    return this.request<EmailTemplate[]>('/templates');
  }

  async createEmailTemplate(template: Omit<EmailTemplate, 'id' | 'created_at' | 'updated_at'>): Promise<EmailTemplate> {
    return this.request<EmailTemplate>('/templates', {
      method: 'POST',
      body: JSON.stringify(template),
    });
  }

  async updateEmailTemplate(id: number, template: Partial<EmailTemplate>): Promise<EmailTemplate> {
    return this.request<EmailTemplate>(`/templates/${id}`, {
      method: 'PUT',
      body: JSON.stringify(template),
    });
  }

  async deleteEmailTemplate(id: number): Promise<void> {
    await this.request(`/templates/${id}`, {
      method: 'DELETE',
    });
  }

  // Campaigns
  async getCampaigns(): Promise<EmailCampaign[]> {
    return this.request<EmailCampaign[]>('/campaigns');
  }

  async createCampaign(campaign: Omit<EmailCampaign, 'id' | 'created_at' | 'updated_at' | 'sent_count' | 'delivered_count' | 'opened_count' | 'clicked_count' | 'bounced_count'>): Promise<EmailCampaign> {
    return this.request<EmailCampaign>('/campaigns', {
      method: 'POST',
      body: JSON.stringify(campaign),
    });
  }

  async updateCampaign(id: number, campaign: Partial<EmailCampaign>): Promise<EmailCampaign> {
    return this.request<EmailCampaign>(`/campaigns/${id}`, {
      method: 'PUT',
      body: JSON.stringify(campaign),
    });
  }

  async sendCampaign(id: number): Promise<EmailCampaign> {
    return this.request<EmailCampaign>(`/campaigns/${id}/send`, {
      method: 'POST',
    });
  }

  async deleteCampaign(id: number): Promise<void> {
    await this.request(`/campaigns/${id}`, {
      method: 'DELETE',
    });
  }

  // Contacts
  async getContacts(): Promise<{ data: Contact[] }> {
    const result = await this.request<{ data: Contact[] }>('/contacts');
    return result;
  }

  async createContact(contact: Omit<Contact, 'id' | 'created_at' | 'updated_at' | 'subscribed_at'>): Promise<Contact> {
    return this.request<Contact>('/contacts', {
      method: 'POST',
      body: JSON.stringify(contact),
    });
  }

  async updateContact(id: number, contact: Partial<Contact>): Promise<Contact> {
    return this.request<Contact>(`/contacts/${id}`, {
      method: 'PUT',
      body: JSON.stringify(contact),
    });
  }

  async deleteContact(id: number): Promise<void> {
    await this.request(`/contacts/${id}`, {
      method: 'DELETE',
    });
  }

  // Analytics
  async getCampaignAnalytics(): Promise<CampaignAnalytics[]> {
    return this.request<CampaignAnalytics[]>('/analytics');
  }

  async getCampaignAnalytic(campaignId: number): Promise<CampaignAnalytics> {
    return this.request<CampaignAnalytics>(`/analytics/campaigns/${campaignId}`);
  }

  // Health check
  async healthCheck(): Promise<{ status: string; timestamp: string; version: string }> {
    return this.request('/health');
  }
}

export const backendEmailService = new BackendEmailService();