import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, Mail, Users, TrendingUp, Settings, Plus, Send } from 'lucide-react';
import { brevoService } from './services/brevo-service';
import { useEmailCampaigns, useAllCampaignAnalytics } from './hooks/useEmailCampaigns';
import { useEmailTemplates } from './hooks/useEmailTemplates';
import { useEmailContacts } from './hooks/useEmailContacts';
import { defaultTemplates } from './data/email-templates';
import { EmailAnalyticsDashboard } from './components/EmailAnalyticsDashboard';
import { CampaignManager } from './components/CampaignManager';
import { TemplateManager } from './components/TemplateManager';
import { ContactManager } from './components/ContactManager';
import { WorkflowManager } from './components/WorkflowManager';

export function Email() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isInitialized, setIsInitialized] = useState(false);

  const { data: campaigns = [], isLoading: campaignsLoading } = useEmailCampaigns();
  const { data: templates = [], isLoading: templatesLoading } = useEmailTemplates();
  const { data: contacts = [], isLoading: contactsLoading } = useEmailContacts();
  const { data: analytics = [], isLoading: analyticsLoading } = useAllCampaignAnalytics();

  useEffect(() => {
    const initializeEmailSystem = async () => {
      try {
        // Initialize Brevo service (async)
        await brevoService.initialize({
          apiKey: (import.meta as any).env?.VITE_BREVO_API_KEY || '',
          defaultFromEmail: 'noreply@tgim-challenge.com',
          defaultFromName: 'TGIM Challenge'
        });

        // Load default templates if none exist
        const existingTemplates = await brevoService.getEmailTemplates();
        if (existingTemplates.length === 0) {
          for (const template of defaultTemplates) {
            await brevoService.createEmailTemplate(template);
          }
        }

        setIsInitialized(true);
      } catch (error) {
        console.error('Failed to initialize email system:', error);
      }
    };

    initializeEmailSystem();
  }, []);

  if (!isInitialized) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Initialisation du système d'email marketing...</p>
        </div>
      </div>
    );
  }

  const totalSent = analytics.reduce((sum, a) => sum + a.sent, 0);
  const totalDelivered = analytics.reduce((sum, a) => sum + a.delivered, 0);
  const totalOpened = analytics.reduce((sum, a) => sum + a.opened, 0);
  const avgOpenRate = totalDelivered > 0 ? (totalOpened / totalDelivered) * 100 : 0;

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Email Marketing</h1>
          <p className="text-gray-600 mt-1">
            Système complet d'email marketing avec Brevo - Templates, Campagnes, Analytics & Workflows
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Badge variant="outline" className="flex items-center gap-1">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            Brevo Connecté
          </Badge>
          <Button className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Nouveau
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="dashboard" className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            Dashboard
          </TabsTrigger>
          <TabsTrigger value="campaigns" className="flex items-center gap-2">
            <Send className="w-4 h-4" />
            Campagnes
          </TabsTrigger>
          <TabsTrigger value="templates" className="flex items-center gap-2">
            <Mail className="w-4 h-4" />
            Templates
          </TabsTrigger>
          <TabsTrigger value="contacts" className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            Contacts
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Settings className="w-4 h-4" />
            Workflows
          </TabsTrigger>
        </TabsList>

        {/* Dashboard Overview */}
        <TabsContent value="dashboard" className="space-y-6">
          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Emails Envoyés</CardTitle>
                <Send className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalSent.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">
                  {campaigns.length} campagnes actives
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Taux d'Ouverture</CardTitle>
                <Mail className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{avgOpenRate.toFixed(1)}%</div>
                <p className="text-xs text-muted-foreground">
                  {totalOpened.toLocaleString()} ouvertures
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Templates</CardTitle>
                <Mail className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{templates.length}</div>
                <p className="text-xs text-muted-foreground">
                  {templates.filter(t => t.isActive).length} actifs
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Contacts</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{contacts.length.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">
                  {contacts.filter(c => c.isActive).length} actifs
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Analytics Dashboard */}
          <EmailAnalyticsDashboard />
        </TabsContent>

        {/* Campaigns Management */}
        <TabsContent value="campaigns" className="space-y-6">
          <CampaignManager />
        </TabsContent>

        {/* Templates Management */}
        <TabsContent value="templates" className="space-y-6">
          <TemplateManager />
        </TabsContent>

        {/* Contacts Management */}
        <TabsContent value="contacts" className="space-y-6">
          <ContactManager />
        </TabsContent>

        {/* Workflows & Settings */}
        <TabsContent value="settings" className="space-y-6">
          <WorkflowManager />
        </TabsContent>
      </Tabs>
    </div>
  );
}
