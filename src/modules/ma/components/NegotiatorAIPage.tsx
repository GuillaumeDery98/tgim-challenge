import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MessageCircle, Bot, AlertCircle, Sparkles } from 'lucide-react';

export function NegotiatorAIPage() {
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center gap-2">
        <MessageCircle className="h-6 w-6 text-primary" />
        <h1 className="text-3xl font-bold">TGIM Negotiator</h1>
        <Badge variant="secondary" className="ml-2">
          <Bot className="h-3 w-3 mr-1" />
          Agent IA
        </Badge>
      </div>

      {/* Section défi */}
      <Card className="bg-gradient-to-r from-amber-500/5 to-orange-500/5 border-amber-500/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-amber-800 dark:text-amber-200">
            <AlertCircle className="h-5 w-5" />
            🎯 Défi : Agent IA de Négociation M&A
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-amber-50 dark:bg-amber-950/20 p-4 rounded-lg border border-amber-200 dark:border-amber-800">
            <h3 className="font-semibold text-amber-800 dark:text-amber-200 mb-2">
              🎯 Objectif du Défi
            </h3>
            <p className="text-amber-700 dark:text-amber-300 text-sm mb-3">
              Créer un agent IA spécialisé en négociation M&A qui assiste les repreneurs dans leurs négociations d'acquisition.
            </p>
            
            <h4 className="font-semibold text-amber-800 dark:text-amber-200 mb-2">
              🚀 Fonctionnalités à Implémenter
            </h4>
            <ul className="text-amber-700 dark:text-amber-300 text-sm space-y-1 ml-4">
              <li>• <strong>Chat en temps réel</strong> avec l'agent IA de négociation</li>
              <li>• <strong>Analyse contextuelle</strong> des situations de négociation</li>
              <li>• <strong>Stratégies adaptatives</strong> basées sur le profil de l'entreprise</li>
              <li>• <strong>Simulation de négociation</strong> avec différents scénarios</li>
              <li>• <strong>Recommandations personnalisées</strong> en temps réel</li>
              <li>• <strong>Gestion des objections</strong> et contre-arguments</li>
              <li>• <strong>Suivi des progrès</strong> de négociation</li>
            </ul>

            <h4 className="font-semibold text-amber-800 dark:text-amber-200 mb-2 mt-4">
              🛠️ Technologies Suggérées
            </h4>
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                OpenAI GPT-4
              </Badge>
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                LangChain
              </Badge>
              <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                Vector Database
              </Badge>
              <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
                WebSocket
              </Badge>
              <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                React Query
              </Badge>
            </div>

            <h4 className="font-semibold text-amber-800 dark:text-amber-200 mb-2 mt-4">
              📋 Consignes Techniques
            </h4>
            <ul className="text-amber-700 dark:text-amber-300 text-sm space-y-1 ml-4">
              <li>• Intégrer <strong>OpenAI API</strong> pour les réponses intelligentes</li>
              <li>• Utiliser <strong>LangChain</strong> pour la gestion des conversations</li>
              <li>• Implémenter un <strong>système de contexte</strong> persistant</li>
              <li>• Créer des <strong>templates de stratégies</strong> de négociation</li>
              <li>• Ajouter un <strong>système de scoring</strong> des négociations</li>
              <li>• Intégrer des <strong>données de marché</strong> en temps réel</li>
            </ul>

            <h4 className="font-semibold text-amber-800 dark:text-amber-200 mb-2 mt-4">
              🎨 Interface Utilisateur
            </h4>
            <ul className="text-amber-700 dark:text-amber-300 text-sm space-y-1 ml-4">
              <li>• <strong>Chat interface</strong> moderne et intuitive</li>
              <li>• <strong>Contexte de négociation</strong> (entreprise, deal, étape)</li>
              <li>• <strong>Stratégies recommandées</strong> avec explications</li>
              <li>• <strong>Historique des négociations</strong> et analyses</li>
              <li>• <strong>Métriques de performance</strong> en temps réel</li>
            </ul>

            <div className="mt-4 p-3 bg-amber-100 dark:bg-amber-900/30 rounded-lg border border-amber-300 dark:border-amber-700">
              <p className="text-amber-800 dark:text-amber-200 text-sm font-medium">
                💡 <strong>Astuce :</strong> Commencez par créer un système de chat basique, puis ajoutez progressivement l'intelligence contextuelle et les stratégies de négociation.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Section exemples */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            Exemples d'Utilisation
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 border rounded-lg">
              <h4 className="font-semibold mb-2">💬 Conversation Type</h4>
              <div className="space-y-2 text-sm">
                <div className="bg-blue-50 p-2 rounded">
                  <strong>Utilisateur :</strong> "Le vendeur demande 5M€ mais je pense que c'est trop cher"
                </div>
                <div className="bg-green-50 p-2 rounded">
                  <strong>IA :</strong> "Basé sur les multiples du secteur, je recommande de négocier autour de 4.2M€. Voici les arguments..."
                </div>
              </div>
            </div>
            
            <div className="p-4 border rounded-lg">
              <h4 className="font-semibold mb-2">📊 Stratégies Suggérées</h4>
              <ul className="text-sm space-y-1">
                <li>• Approche collaborative</li>
                <li>• Création de valeur</li>
                <li>• Timing stratégique</li>
                <li>• Analyse de risque</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
