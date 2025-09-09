import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calculator, AlertCircle, Sparkles } from 'lucide-react';
import { AnalystSection } from './challenge/Analyst';

export function ValuatorPage() {
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center gap-2">
        <Calculator className="h-6 w-6 text-primary" />
        <h1 className="text-3xl font-bold">TGIM Valuator</h1>
        <Badge variant="secondary" className="ml-2">
          <Sparkles className="h-3 w-3 mr-1" />
          IA
        </Badge>
      </div>

      {/* Section défi */}
      <Card className="bg-gradient-to-r from-amber-500/5 to-orange-500/5 border-amber-500/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-amber-800 dark:text-amber-200">
            <AlertCircle className="h-5 w-5" />
            Défi TGIM - TGIM Valuator
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-amber-700 dark:text-amber-300">
              <strong>Objectif :</strong> Créer un système d'évaluation d'entreprises alimenté par l'intelligence artificielle 
              pour aider les investisseurs à déterminer la valeur des cibles potentielles.
            </p>
            
            <div>
              <h4 className="font-semibold text-amber-800 dark:text-amber-200 mb-2">Fonctionnalités à implémenter :</h4>
              <ul className="space-y-1 text-sm text-amber-700 dark:text-amber-300">
                <li>• <strong>Analyse DCF automatisée :</strong> Calcul de la valeur actuelle des flux de trésorerie futurs</li>
                <li>• <strong>Comparables sectoriels :</strong> Analyse des multiples du marché en temps réel</li>
                <li>• <strong>Prédiction de croissance :</strong> IA pour estimer les taux de croissance futurs</li>
                <li>• <strong>Analyse de risque :</strong> Évaluation automatique des risques sectoriels et géographiques</li>
                <li>• <strong>Rapport détaillé :</strong> Génération automatique d'un rapport d'évaluation complet</li>
                <li>• <strong>Intégration API :</strong> Connexion aux bases de données financières externes</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-amber-800 dark:text-amber-200 mb-2">Technologies suggérées :</h4>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline" className="bg-amber-500/10 text-amber-600 border-amber-500/20">
                  OpenAI API
                </Badge>
                <Badge variant="outline" className="bg-amber-500/10 text-amber-600 border-amber-500/20">
                  Python/NumPy
                </Badge>
                <Badge variant="outline" className="bg-amber-500/10 text-amber-600 border-amber-500/20">
                  Financial APIs
                </Badge>
                <Badge variant="outline" className="bg-amber-500/10 text-amber-600 border-amber-500/20">
                  Machine Learning
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <AnalystSection />
    </div>
  );
}
