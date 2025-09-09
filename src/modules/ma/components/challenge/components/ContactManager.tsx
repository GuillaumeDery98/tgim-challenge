import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Plus, Search, Users, Mail, AlertTriangle, Download, Upload, Filter } from 'lucide-react';
import { useEmailContacts, useCreateContact, useBounces, useCleanupBounces } from '../hooks/useEmailContacts';
import confetti from 'canvas-confetti';

export function ContactManager() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showOnlyActive, setShowOnlyActive] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedContacts, setSelectedContacts] = useState<string[]>([]);
  
  const [newContact, setNewContact] = useState({
    email: '',
    firstName: '',
    lastName: '',
    company: '',
    phone: ''
  });

  const { data: contacts = [], isLoading: contactsLoading } = useEmailContacts();
  const { data: bounces = [] } = useBounces();
  const createContact = useCreateContact();
  const cleanupBounces = useCleanupBounces();

  // Filter contacts
  const filteredContacts = contacts.filter(contact => {
    const matchesSearch = contact.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         contact.firstName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         contact.lastName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         contact.company?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesActive = !showOnlyActive || contact.isActive;
    return matchesSearch && matchesActive;
  });

  const handleCreateContact = async () => {
    try {
      await createContact.mutateAsync({
        email: newContact.email,
        attributes: {
          FIRSTNAME: newContact.firstName,
          LASTNAME: newContact.lastName,
          COMPANY: newContact.company,
          PHONE: newContact.phone
        }
      });
      
      setIsCreateDialogOpen(false);
      setNewContact({
        email: '',
        firstName: '',
        lastName: '',
        company: '',
        phone: ''
      });

      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (error) {
      console.error('Failed to create contact:', error);
    }
  };

  const handleBulkCleanup = async () => {
    const bounceIds = bounces.filter(b => !b.isProcessed).map(b => b.id);
    if (bounceIds.length > 0) {
      try {
        await cleanupBounces.mutateAsync(bounceIds);
      } catch (error) {
        console.error('Failed to cleanup bounces:', error);
      }
    }
  };

  const toggleContactSelection = (contactId: string) => {
    setSelectedContacts(prev => 
      prev.includes(contactId) 
        ? prev.filter(id => id !== contactId)
        : [...prev, contactId]
    );
  };

  const selectAllContacts = () => {
    if (selectedContacts.length === filteredContacts.length) {
      setSelectedContacts([]);
    } else {
      setSelectedContacts(filteredContacts.map(c => c.id));
    }
  };

  const activeContacts = contacts.filter(c => c.isActive).length;
  const bouncedContacts = contacts.filter(c => c.bounced).length;
  const unsubscribedContacts = contacts.filter(c => c.unsubscribed).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Gestion des Contacts</h2>
          <p className="text-gray-600">Gérez votre base de contacts et nettoyez les bounces</p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" className="flex items-center gap-2">
            <Upload className="w-4 h-4" />
            Importer
          </Button>
          <Button variant="outline" className="flex items-center gap-2">
            <Download className="w-4 h-4" />
            Exporter
          </Button>
          
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Nouveau Contact
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Ajouter un Nouveau Contact</DialogTitle>
                <DialogDescription>
                  Créez un nouveau contact dans votre base de données
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="contact-email">Email *</Label>
                  <Input
                    id="contact-email"
                    type="email"
                    value={newContact.email}
                    onChange={(e) => setNewContact({ ...newContact, email: e.target.value })}
                    placeholder="contact@exemple.com"
                    required
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="contact-firstname">Prénom</Label>
                    <Input
                      id="contact-firstname"
                      value={newContact.firstName}
                      onChange={(e) => setNewContact({ ...newContact, firstName: e.target.value })}
                      placeholder="Jean"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="contact-lastname">Nom</Label>
                    <Input
                      id="contact-lastname"
                      value={newContact.lastName}
                      onChange={(e) => setNewContact({ ...newContact, lastName: e.target.value })}
                      placeholder="Dupont"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="contact-company">Entreprise</Label>
                  <Input
                    id="contact-company"
                    value={newContact.company}
                    onChange={(e) => setNewContact({ ...newContact, company: e.target.value })}
                    placeholder="ACME Corp"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="contact-phone">Téléphone</Label>
                  <Input
                    id="contact-phone"
                    value={newContact.phone}
                    onChange={(e) => setNewContact({ ...newContact, phone: e.target.value })}
                    placeholder="+33 1 23 45 67 89"
                  />
                </div>
              </div>
              
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Annuler
                </Button>
                <Button 
                  onClick={handleCreateContact}
                  disabled={!newContact.email || createContact.isPending}
                >
                  {createContact.isPending ? 'Création...' : 'Créer Contact'}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Contacts</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{contacts.length.toLocaleString()}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Actifs</CardTitle>
            <Mail className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{activeContacts.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              {contacts.length > 0 ? ((activeContacts / contacts.length) * 100).toFixed(1) : 0}%
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rebonds</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{bouncedContacts.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              {bounces.filter(b => !b.isProcessed).length} à traiter
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Désabonnés</CardTitle>
            <Mail className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{unsubscribedContacts.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              {contacts.length > 0 ? ((unsubscribedContacts / contacts.length) * 100).toFixed(1) : 0}%
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Bounce Management */}
      {bounces.filter(b => !b.isProcessed).length > 0 && (
        <Card className="border-orange-200 bg-orange-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-orange-800">
              <AlertTriangle className="w-5 h-5" />
              Gestion des Rebonds
            </CardTitle>
            <CardDescription className="text-orange-700">
              {bounces.filter(b => !b.isProcessed).length} rebonds nécessitent une action
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-sm text-orange-800">
                Le nettoyage automatique supprimera les contacts avec des rebonds hard et marquera les rebonds soft pour suivi.
              </div>
              <Button onClick={handleBulkCleanup} variant="outline" className="border-orange-300">
                Nettoyer Automatiquement
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Rechercher un contact..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="active-only"
              checked={showOnlyActive}
              onCheckedChange={setShowOnlyActive}
            />
            <Label htmlFor="active-only" className="text-sm">
              Contacts actifs uniquement
            </Label>
          </div>
          
          <Button variant="outline" className="flex items-center gap-2">
            <Filter className="w-4 h-4" />
            Filtres
          </Button>
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedContacts.length > 0 && (
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="py-3">
            <div className="flex items-center justify-between">
              <div className="text-sm text-blue-800">
                {selectedContacts.length} contact(s) sélectionné(s)
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">Ajouter au segment</Button>
                <Button variant="outline" size="sm">Supprimer</Button>
                <Button variant="outline" size="sm" onClick={() => setSelectedContacts([])}>
                  Désélectionner
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Contacts Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Liste des Contacts</CardTitle>
            <div className="flex items-center gap-2">
              <Checkbox
                checked={selectedContacts.length === filteredContacts.length && filteredContacts.length > 0}
                onCheckedChange={selectAllContacts}
              />
              <span className="text-sm text-gray-600">Tout sélectionner</span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {contactsLoading ? (
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center space-x-4 p-3 animate-pulse">
                  <div className="w-4 h-4 bg-gray-300 rounded"></div>
                  <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
                  <div className="flex-1 space-y-1">
                    <div className="h-4 bg-gray-300 rounded w-1/3"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : filteredContacts.length === 0 ? (
            <div className="text-center py-12">
              <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {searchQuery ? 'Aucun contact trouvé' : 'Aucun contact'}
              </h3>
              <p className="text-gray-600 mb-4">
                {searchQuery 
                  ? 'Essayez de modifier vos critères de recherche'
                  : 'Commencez par ajouter vos premiers contacts'
                }
              </p>
              {!searchQuery && (
                <Button onClick={() => setIsCreateDialogOpen(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Ajouter un Contact
                </Button>
              )}
            </div>
          ) : (
            <div className="divide-y">
              {filteredContacts.map((contact) => (
                <div key={contact.id} className="flex items-center space-x-4 py-3 hover:bg-gray-50 rounded-lg px-2">
                  <Checkbox
                    checked={selectedContacts.includes(contact.id)}
                    onCheckedChange={() => toggleContactSelection(contact.id)}
                  />
                  
                  <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                    <span className="text-gray-600 font-medium text-sm">
                      {(contact.firstName || contact.email).charAt(0).toUpperCase()}
                    </span>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {contact.firstName || contact.lastName 
                          ? `${contact.firstName || ''} ${contact.lastName || ''}`.trim()
                          : contact.email
                        }
                      </p>
                      <div className="flex gap-1">
                        {contact.isActive ? (
                          <Badge variant="secondary" className="bg-green-100 text-green-800">
                            Actif
                          </Badge>
                        ) : (
                          <Badge variant="secondary" className="bg-red-100 text-red-800">
                            Inactif
                          </Badge>
                        )}
                        {contact.bounced && (
                          <Badge variant="secondary" className="bg-orange-100 text-orange-800">
                            Rebond
                          </Badge>
                        )}
                        {contact.unsubscribed && (
                          <Badge variant="secondary" className="bg-gray-100 text-gray-800">
                            Désabonné
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span>{contact.email}</span>
                      {contact.company && <span>{contact.company}</span>}
                    </div>
                  </div>
                  
                  <div className="text-sm text-gray-500">
                    {new Date(contact.createdAt).toLocaleDateString('fr-FR')}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}