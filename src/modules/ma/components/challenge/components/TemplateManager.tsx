import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Search, Mail, Edit, Trash2, Copy, Eye, Calendar } from 'lucide-react';
import { useEmailTemplates, useCreateTemplate, useUpdateTemplate, useDeleteTemplate } from '../hooks/useEmailTemplates';
import { brevoService } from '../services/secure-brevo-service';
import confetti from 'canvas-confetti';
import type { EmailTemplate } from '../types/email.types';

export function TemplateManager() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<EmailTemplate | null>(null);
  const [previewTemplate, setPreviewTemplate] = useState<EmailTemplate | null>(null);

  const [newTemplate, setNewTemplate] = useState({
    name: '',
    subject: '',
    category: 'marketing' as const,
    htmlContent: '',
    variables: []
  });

  const { data: templates = [], isLoading } = useEmailTemplates();
  const createTemplate = useCreateTemplate();
  const updateTemplate = useUpdateTemplate();
  const deleteTemplate = useDeleteTemplate();

  // Filter templates
  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.subject.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleCreateTemplate = async () => {
    try {
      await createTemplate.mutateAsync({
        ...newTemplate,
        isActive: true,
        createdBy: 'current_user'
      });
      
      setIsCreateDialogOpen(false);
      setNewTemplate({
        name: '',
        subject: '',
        category: 'marketing',
        htmlContent: '',
        variables: []
      });

      // Celebration animation
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (error) {
      console.error('Failed to create template:', error);
    }
  };

  const handleDeleteTemplate = async (id: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce template ?')) {
      try {
        await deleteTemplate.mutateAsync(id);
      } catch (error) {
        console.error('Failed to delete template:', error);
      }
    }
  };

  const handleDuplicateTemplate = async (template: EmailTemplate) => {
    try {
      await createTemplate.mutateAsync({
        ...template,
        name: `${template.name} (Copie)`,
        isActive: true,
        createdBy: 'current_user'
      });
    } catch (error) {
      console.error('Failed to duplicate template:', error);
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'transactional': return 'bg-blue-100 text-blue-800';
      case 'marketing': return 'bg-green-100 text-green-800';
      case 'newsletter': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'transactional': return 'Transactionnel';
      case 'marketing': return 'Marketing';
      case 'newsletter': return 'Newsletter';
      default: return category;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Gestion des Templates</h2>
          <p className="text-gray-600">Créez et gérez vos templates d'email personnalisés</p>
        </div>
        
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Nouveau Template
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Créer un Nouveau Template</DialogTitle>
              <DialogDescription>
                Créez un template d'email personnalisé avec variables dynamiques
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="template-name">Nom du Template</Label>
                  <Input
                    id="template-name"
                    value={newTemplate.name}
                    onChange={(e) => setNewTemplate({ ...newTemplate, name: e.target.value })}
                    placeholder="Ex: Email de bienvenue"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="template-category">Catégorie</Label>
                  <Select
                    value={newTemplate.category}
                    onValueChange={(value: any) => setNewTemplate({ ...newTemplate, category: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="transactional">Transactionnel</SelectItem>
                      <SelectItem value="marketing">Marketing</SelectItem>
                      <SelectItem value="newsletter">Newsletter</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="template-subject">Sujet de l'Email</Label>
                <Input
                  id="template-subject"
                  value={newTemplate.subject}
                  onChange={(e) => setNewTemplate({ ...newTemplate, subject: e.target.value })}
                  placeholder="Ex: Bienvenue {{user.firstName}} !"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="template-content">Contenu HTML</Label>
                <Textarea
                  id="template-content"
                  value={newTemplate.htmlContent}
                  onChange={(e) => setNewTemplate({ ...newTemplate, htmlContent: e.target.value })}
                  placeholder="Contenu HTML de votre email..."
                  rows={10}
                  className="font-mono text-sm"
                />
              </div>
              
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">Variables Disponibles</h4>
                <div className="grid grid-cols-2 gap-2 text-sm text-blue-700">
                  <code>{'{{user.firstName}}'}</code>
                  <code>{'{{user.lastName}}'}</code>
                  <code>{'{{user.email}}'}</code>
                  <code>{'{{company.name}}'}</code>
                  <code>{'{{deal.amount}}'}</code>
                  <code>{'{{currentDate}}'}</code>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Annuler
              </Button>
              <Button 
                onClick={handleCreateTemplate}
                disabled={!newTemplate.name || !newTemplate.subject || createTemplate.isPending}
              >
                {createTemplate.isPending ? 'Création...' : 'Créer Template'}
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
            placeholder="Rechercher un template..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Toutes les catégories</SelectItem>
            <SelectItem value="transactional">Transactionnel</SelectItem>
            <SelectItem value="marketing">Marketing</SelectItem>
            <SelectItem value="newsletter">Newsletter</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Templates Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTemplates.map((template) => (
            <Card key={template.id} className="group hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg line-clamp-1">{template.name}</CardTitle>
                    <CardDescription className="line-clamp-2 mt-1">
                      {template.subject}
                    </CardDescription>
                  </div>
                  <Badge className={getCategoryColor(template.category)}>
                    {getCategoryLabel(template.category)}
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent className="pt-0">
                <div className="space-y-3">
                  {/* Preview */}
                  <div 
                    className="bg-gray-50 p-3 rounded border min-h-[80px] text-xs text-gray-700 line-clamp-4 cursor-pointer hover:bg-gray-100"
                    onClick={() => setPreviewTemplate(template)}
                  >
                    <div dangerouslySetInnerHTML={{ 
                      __html: (template.htmlContent || '').replace(/{{([^}]+)}}/g, '<span class="bg-yellow-200 px-1 rounded">$1</span>')
                    }} />
                  </div>
                  
                  {/* Metadata */}
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(template.updatedAt).toLocaleDateString('fr-FR')}
                    </div>
                    <div className="flex items-center gap-1">
                      <div className={`w-2 h-2 rounded-full ${template.isActive ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                      {template.isActive ? 'Actif' : 'Inactif'}
                    </div>
                  </div>
                  
                  {/* Actions */}
                  <div className="flex justify-between pt-2 border-t">
                    <div className="flex gap-1">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => setPreviewTemplate(template)}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleDuplicateTemplate(template)}
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                    
                    <div className="flex gap-1">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => setEditingTemplate(template)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleDeleteTemplate(template.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && filteredTemplates.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Mail className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchQuery ? 'Aucun template trouvé' : 'Aucun template'}
            </h3>
            <p className="text-gray-600 mb-4">
              {searchQuery 
                ? 'Essayez de modifier vos critères de recherche'
                : 'Commencez par créer votre premier template d\'email'
              }
            </p>
            {!searchQuery && (
              <Button onClick={() => setIsCreateDialogOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Créer un Template
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {/* Preview Dialog */}
      {previewTemplate && (
        <Dialog open={!!previewTemplate} onOpenChange={() => setPreviewTemplate(null)}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{previewTemplate.name}</DialogTitle>
              <DialogDescription>
                Prévisualisation du template • {getCategoryLabel(previewTemplate.category)}
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium">Sujet:</Label>
                <div className="mt-1 p-2 bg-gray-50 rounded text-sm">
                  {previewTemplate.subject || ''}
                </div>
              </div>
              
              <div>
                <Label className="text-sm font-medium">Contenu:</Label>
                <div className="mt-1 border rounded-lg overflow-hidden">
                  <iframe
                    srcDoc={previewTemplate.htmlContent || ''}
                    className="w-full h-96"
                    title="Template Preview"
                  />
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}