import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Search, Send, Calendar, Users, TrendingUp, Pause, Play, MoreHorizontal } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useEmailCampaigns, useCreateCampaign, useCampaignAnalytics } from '../hooks/useEmailCampaigns';
import { useEmailTemplates } from '../hooks/useEmailTemplates';
import confetti from 'canvas-confetti';
import type { EmailCampaign, ContactSegment } from '../types/email.types';

export function CampaignManager() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  
  const [newCampaign, setNewCampaign] = useState({
    name: '',
    description: '',
    templateId: '',
    status: 'draft' as const,
    recipients: [] as ContactSegment[],
    totalRecipients: 0,
    settings: {
      sendImmediate: true,
      trackOpens: true,
      trackClicks: true,
      allowUnsubscribe: true,
      fromName: 'TGIM Challenge',
      fromEmail: 'noreply@tgim-challenge.com'
    }
  });

  const { data: campaigns = [], isLoading } = useEmailCampaigns();
  const { data: templates = [] } = useEmailTemplates();
  const createCampaign = useCreateCampaign();

  // Filter campaigns
  const filteredCampaigns = campaigns.filter(campaign => {
    const matchesSearch = campaign.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         campaign.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || campaign.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const handleCreateCampaign = async () => {
    try {
      await createCampaign.mutateAsync({
        ...newCampaign,
        createdBy: 'current_user'
      });
      
      setIsCreateDialogOpen(false);
      setNewCampaign({
        name: '',
        description: '',
        templateId: '',
        status: 'draft',
        recipients: [],
        totalRecipients: 0,
        settings: {
          sendImmediate: true,
          trackOpens: true,
          trackClicks: true,
          allowUnsubscribe: true,
          fromName: 'TGIM Challenge',
          fromEmail: 'noreply@tgim-challenge.com'
        }
      });

      // Celebration animation
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (error) {
      console.error('Failed to create campaign:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'sending': return 'bg-yellow-100 text-yellow-800';
      case 'sent': return 'bg-green-100 text-green-800';
      case 'paused': return 'bg-orange-100 text-orange-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'draft': return 'Brouillon';
      case 'scheduled': return 'Programmé';
      case 'sending': return 'Envoi en cours';
      case 'sent': return 'Envoyé';
      case 'paused': return 'En pause';
      case 'cancelled': return 'Annulé';
      default: return status;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Gestion des Campagnes</h2>
          <p className="text-gray-600">Créez et gérez vos campagnes d'email marketing</p>
        </div>
        
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Nouvelle Campagne
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Créer une Nouvelle Campagne</DialogTitle>
              <DialogDescription>
                Configurez votre campagne d'email marketing
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="campaign-name">Nom de la Campagne</Label>
                  <Input
                    id="campaign-name"
                    value={newCampaign.name}
                    onChange={(e) => setNewCampaign({ ...newCampaign, name: e.target.value })}
                    placeholder="Ex: Newsletter Octobre 2025"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="campaign-description">Description</Label>
                  <Textarea
                    id="campaign-description"
                    value={newCampaign.description}
                    onChange={(e) => setNewCampaign({ ...newCampaign, description: e.target.value })}
                    placeholder="Description de la campagne..."
                    rows={3}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="template-select">Template</Label>
                  <Select
                    value={newCampaign.templateId}
                    onValueChange={(value) => setNewCampaign({ ...newCampaign, templateId: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionnez un template" />
                    </SelectTrigger>
                    <SelectContent>
                      {templates.map((template) => (
                        <SelectItem key={template.id} value={template.id}>
                          {template.name} ({template.category})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="from-name">Nom expéditeur</Label>
                    <Input
                      id="from-name"
                      value={newCampaign.settings.fromName}
                      onChange={(e) => setNewCampaign({ 
                        ...newCampaign, 
                        settings: { ...newCampaign.settings, fromName: e.target.value }
                      })}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="from-email">Email expéditeur</Label>
                    <Input
                      id="from-email"
                      value={newCampaign.settings.fromEmail}
                      onChange={(e) => setNewCampaign({ 
                        ...newCampaign, 
                        settings: { ...newCampaign.settings, fromEmail: e.target.value }
                      })}
                    />
                  </div>
                </div>
              </div>
              
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">Configuration par défaut</h4>
                <div className="space-y-2 text-sm text-blue-700">
                  <div>✅ Suivi des ouvertures activé</div>
                  <div>✅ Suivi des clics activé</div>
                  <div>✅ Lien de désabonnement inclus</div>
                  <div>📊 Envoi immédiat (peut être programmé plus tard)</div>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Annuler
              </Button>
              <Button 
                onClick={handleCreateCampaign}
                disabled={!newCampaign.name || !newCampaign.templateId || createCampaign.isPending}
              >
                {createCampaign.isPending ? 'Création...' : 'Créer Campagne'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Rechercher une campagne..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Select value={selectedStatus} onValueChange={setSelectedStatus}>
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les statuts</SelectItem>
            <SelectItem value="draft">Brouillon</SelectItem>
            <SelectItem value="scheduled">Programmé</SelectItem>
            <SelectItem value="sending">En cours d'envoi</SelectItem>
            <SelectItem value="sent">Envoyé</SelectItem>
            <SelectItem value="paused">En pause</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Campaigns List */}
      {isLoading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </CardHeader>
              <CardContent>
                <div className="h-20 bg-gray-200 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredCampaigns.map((campaign) => (
            <CampaignCard key={campaign.id} campaign={campaign} />
          ))}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && filteredCampaigns.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Send className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchQuery ? 'Aucune campagne trouvée' : 'Aucune campagne'}
            </h3>
            <p className="text-gray-600 mb-4">
              {searchQuery 
                ? 'Essayez de modifier vos critères de recherche'
                : 'Commencez par créer votre première campagne d\'email'
              }
            </p>
            {!searchQuery && (
              <Button onClick={() => setIsCreateDialogOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Créer une Campagne
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// Sub-component for campaign cards
function CampaignCard({ campaign }: { campaign: EmailCampaign }) {
  const { data: analytics } = useCampaignAnalytics(campaign.id);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'sending': return 'bg-yellow-100 text-yellow-800';
      case 'sent': return 'bg-green-100 text-green-800';
      case 'paused': return 'bg-orange-100 text-orange-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'draft': return 'Brouillon';
      case 'scheduled': return 'Programmé';
      case 'sending': return 'Envoi en cours';
      case 'sent': return 'Envoyé';
      case 'paused': return 'En pause';
      case 'cancelled': return 'Annulé';
      default: return status;
    }
  };

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <CardTitle className="text-xl">{campaign.name}</CardTitle>
              <Badge className={getStatusColor(campaign.status)}>
                {getStatusLabel(campaign.status)}
              </Badge>
            </div>
            <CardDescription className="line-clamp-2">
              {campaign.description || 'Aucune description'}
            </CardDescription>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Modifier</DropdownMenuItem>
              <DropdownMenuItem>Dupliquer</DropdownMenuItem>
              <DropdownMenuItem>Programmer</DropdownMenuItem>
              <DropdownMenuItem className="text-red-600">Supprimer</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          {/* Recipients */}
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {campaign.totalRecipients.toLocaleString()}
            </div>
            <div className="text-xs text-gray-500">Destinataires</div>
          </div>
          
          {/* Sent */}
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {analytics?.sent?.toLocaleString() || '0'}
            </div>
            <div className="text-xs text-gray-500">Envoyés</div>
          </div>
          
          {/* Open Rate */}
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">
              {analytics?.openRate?.toFixed(1) || '0.0'}%
            </div>
            <div className="text-xs text-gray-500">Taux d'ouverture</div>
          </div>
          
          {/* Click Rate */}
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">
              {analytics?.clickRate?.toFixed(1) || '0.0'}%
            </div>
            <div className="text-xs text-gray-500">Taux de clic</div>
          </div>
        </div>
        
        <div className="flex items-center justify-between pt-4 border-t">
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              {new Date(campaign.createdAt).toLocaleDateString('fr-FR')}
            </div>
            <div className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              {campaign.recipients.length} segments
            </div>
          </div>
          
          <div className="flex gap-2">
            {campaign.status === 'draft' && (
              <>
                <Button variant="outline" size="sm">
                  <Calendar className="w-4 h-4 mr-1" />
                  Programmer
                </Button>
                <Button size="sm">
                  <Send className="w-4 h-4 mr-1" />
                  Envoyer
                </Button>
              </>
            )}
            
            {campaign.status === 'sending' && (
              <Button variant="outline" size="sm">
                <Pause className="w-4 h-4 mr-1" />
                Pause
              </Button>
            )}
            
            {campaign.status === 'paused' && (
              <Button size="sm">
                <Play className="w-4 h-4 mr-1" />
                Reprendre
              </Button>
            )}
            
            {campaign.status === 'sent' && (
              <Button variant="outline" size="sm">
                <TrendingUp className="w-4 h-4 mr-1" />
                Analytics
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}