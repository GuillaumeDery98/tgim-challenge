import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Play, Pause, Settings, Zap, Users, Mail, Calendar, TrendingUp } from 'lucide-react';
// Triggers génériques sans fake data spécifique
const workflowTriggers = [
  {
    type: 'contact_created',
    name: 'Nouveau contact',
    description: 'Déclenché quand un nouveau contact est créé'
  },
  {
    type: 'campaign_sent',
    name: 'Campagne envoyée',
    description: 'Déclenché après envoi d\'une campagne'
  },
  {
    type: 'email_opened',
    name: 'Email ouvert',
    description: 'Déclenché quand un email est ouvert'
  },
  {
    type: 'link_clicked',
    name: 'Lien cliqué',
    description: 'Déclenché quand un lien est cliqué'
  }
];
import { useEmailTemplates } from '../hooks/useEmailTemplates';
import confetti from 'canvas-confetti';
import type { EmailWorkflow } from '../types/email.types';

export function WorkflowManager() {
  const [workflows, setWorkflows] = useState<EmailWorkflow[]>([]);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const { data: templates = [] } = useEmailTemplates();
  
  const [newWorkflow, setNewWorkflow] = useState({
    name: '',
    description: '',
    triggerType: '',
    templateId: '',
    delay: 0
  });

  const handleCreateWorkflow = () => {
    const workflow: EmailWorkflow = {
      id: `workflow_${Date.now()}`,
      name: newWorkflow.name,
      description: newWorkflow.description,
      isActive: true,
      trigger: {
        id: `trigger_${Date.now()}`,
        type: newWorkflow.triggerType as any,
        name: workflowTriggers.find(t => t.type === newWorkflow.triggerType)?.name || '',
        description: workflowTriggers.find(t => t.type === newWorkflow.triggerType)?.description || '',
        conditions: {},
        delay: newWorkflow.delay
      },
      actions: [{
        id: `action_${Date.now()}`,
        type: 'send_email',
        name: 'Envoyer Email',
        config: {
          templateId: newWorkflow.templateId
        }
      }],
      stats: {
        triggered: 0,
        completed: 0,
        conversionRate: 0
      },
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: 'current_user'
    };

    setWorkflows(prev => [...prev, workflow]);
    setIsCreateDialogOpen(false);
    setNewWorkflow({
      name: '',
      description: '',
      triggerType: '',
      templateId: '',
      delay: 0
    });

    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  const toggleWorkflow = (id: string) => {
    setWorkflows(prev => prev.map(w => 
      w.id === id ? { ...w, isActive: !w.isActive } : w
    ));
  };

  const getTriggerIcon = (type: string) => {
    switch (type) {
      case 'user_signup': return <Users className="w-4 h-4" />;
      case 'deal_submission': return <TrendingUp className="w-4 h-4" />;
      case 'inactivity': return <Calendar className="w-4 h-4" />;
      case 'anniversary': return <Calendar className="w-4 h-4" />;
      default: return <Zap className="w-4 h-4" />;
    }
  };

  const getTriggerLabel = (type: string) => {
    const trigger = workflowTriggers.find(t => t.type === type);
    return trigger?.name || type;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Workflows Automatisés</h2>
          <p className="text-gray-600">Automatisez vos campagnes d'email basées sur les événements</p>
        </div>
        
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Nouveau Workflow
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Créer un Nouveau Workflow</DialogTitle>
              <DialogDescription>
                Configurez un workflow automatisé déclenché par les événements utilisateur
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="workflow-name">Nom du Workflow</Label>
                <Input
                  id="workflow-name"
                  value={newWorkflow.name}
                  onChange={(e) => setNewWorkflow({ ...newWorkflow, name: e.target.value })}
                  placeholder="Ex: Email de bienvenue automatique"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="workflow-description">Description</Label>
                <Textarea
                  id="workflow-description"
                  value={newWorkflow.description}
                  onChange={(e) => setNewWorkflow({ ...newWorkflow, description: e.target.value })}
                  placeholder="Description du workflow..."
                  rows={3}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="trigger-type">Déclencheur</Label>
                  <Select
                    value={newWorkflow.triggerType}
                    onValueChange={(value) => setNewWorkflow({ ...newWorkflow, triggerType: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionnez un déclencheur" />
                    </SelectTrigger>
                    <SelectContent>
                      {workflowTriggers.map((trigger) => (
                        <SelectItem key={trigger.type} value={trigger.type}>
                          {trigger.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="delay">Délai (minutes)</Label>
                  <Input
                    id="delay"
                    type="number"
                    value={newWorkflow.delay}
                    onChange={(e) => setNewWorkflow({ ...newWorkflow, delay: parseInt(e.target.value) || 0 })}
                    placeholder="0"
                    min="0"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="template-select">Template à Envoyer</Label>
                <Select
                  value={newWorkflow.templateId}
                  onValueChange={(value) => setNewWorkflow({ ...newWorkflow, templateId: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionnez un template" />
                  </SelectTrigger>
                  <SelectContent>
                    {templates.map((template) => (
                      <SelectItem key={template.id} value={template.id}>
                        {template.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              {newWorkflow.triggerType && (
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-2">Détails du Déclencheur</h4>
                  <p className="text-sm text-blue-700">
                    {workflowTriggers.find(t => t.type === newWorkflow.triggerType)?.description}
                  </p>
                </div>
              )}
            </div>
            
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Annuler
              </Button>
              <Button 
                onClick={handleCreateWorkflow}
                disabled={!newWorkflow.name || !newWorkflow.triggerType || !newWorkflow.templateId}
              >
                Créer Workflow
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Workflows List */}
      {workflows.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <Zap className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun Workflow</h3>
            <p className="text-gray-600 mb-4">
              Créez votre premier workflow automatisé pour améliorer l'engagement
            </p>
            <Button onClick={() => setIsCreateDialogOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Créer un Workflow
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {workflows.map((workflow) => (
            <Card key={workflow.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <CardTitle className="text-lg">{workflow.name}</CardTitle>
                      <Badge variant={workflow.isActive ? "default" : "secondary"}>
                        {workflow.isActive ? 'Actif' : 'Inactif'}
                      </Badge>
                    </div>
                    <CardDescription className="line-clamp-2">
                      {workflow.description}
                    </CardDescription>
                  </div>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleWorkflow(workflow.id)}
                  >
                    {workflow.isActive ? 
                      <Pause className="w-4 h-4 text-orange-600" /> : 
                      <Play className="w-4 h-4 text-green-600" />
                    }
                  </Button>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-4">
                  {/* Trigger Info */}
                  <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                    {getTriggerIcon(workflow.trigger.type)}
                    <div className="flex-1">
                      <div className="font-medium text-sm text-blue-900">
                        {getTriggerLabel(workflow.trigger.type)}
                      </div>
                      <div className="text-xs text-blue-700">
                        {workflow.trigger.delay > 0 && `Délai: ${workflow.trigger.delay}min`}
                      </div>
                    </div>
                  </div>
                  
                  {/* Actions */}
                  <div className="space-y-2">
                    <div className="text-sm font-medium text-gray-700">Actions:</div>
                    {workflow.actions.map((action) => (
                      <div key={action.id} className="flex items-center gap-2 text-sm text-gray-600">
                        <Mail className="w-3 h-3" />
                        {action.name}
                      </div>
                    ))}
                  </div>
                  
                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-4 pt-4 border-t">
                    <div className="text-center">
                      <div className="text-lg font-bold text-blue-600">
                        {workflow.stats.triggered}
                      </div>
                      <div className="text-xs text-gray-500">Déclenchés</div>
                    </div>
                    
                    <div className="text-center">
                      <div className="text-lg font-bold text-green-600">
                        {workflow.stats.completed}
                      </div>
                      <div className="text-xs text-gray-500">Complétés</div>
                    </div>
                    
                    <div className="text-center">
                      <div className="text-lg font-bold text-purple-600">
                        {workflow.stats.conversionRate.toFixed(1)}%
                      </div>
                      <div className="text-xs text-gray-500">Conversion</div>
                    </div>
                  </div>
                  
                  <div className="flex justify-end pt-2">
                    <Button variant="outline" size="sm">
                      <Settings className="w-4 h-4 mr-1" />
                      Configurer
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}