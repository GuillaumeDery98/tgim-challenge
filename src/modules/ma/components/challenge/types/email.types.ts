export interface TemplateVariable {
  key: string;
  label: string;
  defaultValue: string;
  type: 'text' | 'number' | 'date' | 'url';
  required: boolean;
}

export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  htmlContent: string;
  variables: TemplateVariable[];
  category: 'transactional' | 'marketing' | 'newsletter';
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
}

export interface ContactSegment {
  id: string;
  name: string;
  description: string;
  criteria: SegmentCriteria[];
  contactCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface SegmentCriteria {
  field: string;
  operator: 'equals' | 'contains' | 'greater_than' | 'less_than' | 'in' | 'not_in';
  value: any;
  logicalOperator?: 'AND' | 'OR';
}

export interface EmailCampaign {
  id: string;
  name: string;
  description?: string;
  templateId: string;
  template?: EmailTemplate;
  status: 'draft' | 'scheduled' | 'sending' | 'sent' | 'paused' | 'cancelled';
  recipients: ContactSegment[];
  totalRecipients: number;
  scheduledAt?: Date;
  sentAt?: Date;
  analytics: CampaignAnalytics;
  settings: CampaignSettings;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
}

export interface CampaignSettings {
  sendImmediate: boolean;
  trackOpens: boolean;
  trackClicks: boolean;
  allowUnsubscribe: boolean;
  replyToEmail?: string;
  fromName: string;
  fromEmail: string;
}

export interface CampaignAnalytics {
  sent: number;
  delivered: number;
  opened: number;
  clicked: number;
  bounced: number;
  unsubscribed: number;
  complained: number;
  openRate: number;
  clickRate: number;
  bounceRate: number;
  unsubscribeRate: number;
  conversionRate: number;
  revenue?: number;
}

export interface EmailContact {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  company?: string;
  attributes: Record<string, any>;
  segments: string[];
  isActive: boolean;
  bounced: boolean;
  unsubscribed: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface WorkflowTrigger {
  id: string;
  type: 'user_signup' | 'deal_submission' | 'cart_abandoned' | 'anniversary' | 'inactivity' | 'custom_event';
  name: string;
  description: string;
  conditions: Record<string, any>;
  delay?: number; // minutes
}

export interface WorkflowAction {
  id: string;
  type: 'send_email' | 'add_to_segment' | 'remove_from_segment' | 'wait' | 'condition_branch';
  name: string;
  config: Record<string, any>;
  nextActionId?: string;
  alternateActionId?: string; // for condition branches
}

export interface EmailWorkflow {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
  trigger: WorkflowTrigger;
  actions: WorkflowAction[];
  stats: {
    triggered: number;
    completed: number;
    conversionRate: number;
  };
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
}

export interface BounceRecord {
  id: string;
  email: string;
  campaignId: string;
  bounceType: 'hard' | 'soft';
  bounceReason: string;
  bounceDate: Date;
  attempts: number;
  isProcessed: boolean;
}

export interface EmailEvent {
  id: string;
  type: 'sent' | 'delivered' | 'opened' | 'clicked' | 'bounced' | 'unsubscribed' | 'complained';
  email: string;
  campaignId: string;
  timestamp: Date;
  metadata: Record<string, any>;
}

export interface AnalyticsMetrics {
  totalSent: number;
  totalDelivered: number;
  totalOpened: number;
  totalClicked: number;
  totalBounced: number;
  totalUnsubscribed: number;
  avgOpenRate: number;
  avgClickRate: number;
  avgBounceRate: number;
  revenueGenerated: number;
  topPerformingCampaigns: EmailCampaign[];
  engagementTrends: {
    date: string;
    opens: number;
    clicks: number;
    sends: number;
  }[];
}

export interface EmailBuilderData {
  subject: string;
  preheader: string;
  htmlContent: string;
  textContent: string;
  variables: Record<string, any>;
}

export interface BrevoConfig {
  apiKey: string;
  defaultFromEmail: string;
  defaultFromName: string;
  webhookUrl?: string;
}