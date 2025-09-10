# Guide d'Intégration OpenPipe - Agent IA de Négociation M&A

## Configuration OpenPipe

### Variables d'Environnement

Copiez `.env.example` vers `.env.local` et configurez :

```env
VITE_OPENPIPE_API_KEY=your_openpipe_api_key_here
VITE_OPENPIPE_BASE_URL=https://app.openpipe.ai/api/v1
VITE_OPENPIPE_MODEL=gpt-4o
```

### Modèles Supportés

Le service supporte plusieurs providers via OpenPipe :

- **OpenAI** : `gpt-4o`, `gpt-4-turbo`, `gpt-3.5-turbo`
- **Anthropic** : `claude-3-sonnet`, `claude-3-haiku`
- **Google** : `gemini-1.5-pro`, `gemini-1.5-flash`
- **Modèles fine-tunés** : `openpipe:your-model-id`

## Architecture du Service

### Service Principal : `NegotiationAIService`

- **Pattern Singleton** pour éviter les initialisations multiples
- **Mode Mock** automatique en développement
- **Gestion d'erreurs** avec fallback sur réponses mockées
- **Métadonnées de tracking** pour l'apprentissage

### Hook TanStack Query : `useNegotiationAI`

```typescript
const { sendMessage, isSending, lastResponse } = useNegotiationAI({
  context: negotiationContext,
  onMessageReceived: (message) => console.log(message)
});
```

### Fonctionnalités Clés

#### 1. Chat Contextuel
- Prompt système adaptatif selon la phase de négociation
- Historique de conversation maintenu
- Stratégies suggérées selon le contexte

#### 2. Analyse de Sentiment
- Classification automatique des réponses
- Score de confiance pour chaque message
- Métriques de progression de négociation

#### 3. Recommandations Stratégiques
- Extraction automatique des stratégies applicables
- Score de pertinence pour chaque recommandation
- Justification des suggestions

## Utilisation dans le Composant

### Import et Configuration

```typescript
import { useNegotiationAI } from '../hooks/useNegotiationAI';
import { mockNegotiationContext } from '../data/mock-negotiation';

const { sendMessage, isSending } = useNegotiationAI({
  context: mockNegotiationContext,
  onMessageReceived: (message) => setMessages(prev => [...prev, message])
});
```

### Envoi de Messages

```typescript
const handleSendMessage = () => {
  sendMessage(userInput);
  setIsTyping(true);
};
```

## Mode Développement

### Mock Data Disponibles
- `mockNegotiationContext` : Contexte complet de négociation
- `mockNegotiationMessages` : Historique de conversation
- `negotiationStrategies` : Stratégies disponibles
- `negotiationPhases` : Phases de négociation

### Tests Locaux
Le service fonctionne entièrement en mode mock sans clé API, permettant le développement offline.

## Intégration API Réelle

### Étapes d'Activation

1. **Obtenir une clé API OpenPipe**
   - Créer un compte sur [openpipe.ai](https://openpipe.ai)
   - Générer une clé API
   - Configurer les modèles souhaités

2. **Configuration Variables**
   ```bash
   VITE_OPENPIPE_API_KEY=op-xxx
   VITE_OPENPIPE_MODEL=gpt-4o
   ```

3. **Métadonnées de Tracking**
   Le service envoie automatiquement :
   - `deal_id` : Identifiant de l'affaire
   - `target_name` : Nom de la cible
   - `phase` : Phase de négociation actuelle
   - `user_id` : Identifiant utilisateur

### Fine-Tuning Potentiel

OpenPipe permet de fine-tuner des modèles basés sur vos données de négociation :

1. **Collecte de Données** : Les métadonnées permettent de grouper les conversations
2. **Entraînement** : Utiliser l'interface OpenPipe pour créer des modèles spécialisés
3. **Déploiement** : Utiliser `openpipe:your-model-id` comme modèle

## Optimisations Recommandées

### Performance
- **Cache TanStack Query** : Réutilise les réponses similaires
- **Debouncing** : Évite les appels API excessifs
- **Streaming** : Support natif OpenPipe pour réponses temps réel

### Qualité des Réponses
- **Context Window** : Optimisé pour les conversations longues
- **Temperature** : 0.7 pour équilibrer créativité et cohérence
- **Max Tokens** : 1000 pour réponses détaillées mais concises

### Monitoring
- **Logs de Erreurs** : Automatique avec fallback mock
- **Métriques d'Usage** : Via métadonnées OpenPipe
- **A/B Testing** : Comparaison de modèles facile

## Troubleshooting

### Erreurs Courantes

1. **401 Unauthorized** : Vérifier la clé API
2. **429 Rate Limited** : Implémenter retry logic
3. **Model Not Found** : Vérifier le nom du modèle

### Mode Debug

Activer les logs détaillés :
```typescript
console.log('Service initialized:', negotiationAI.isInitialized);
```

## Prochaines Étapes

1. **Intégration WebSocket** : Pour chat temps réel
2. **Voice Integration** : Support audio/speech-to-text
3. **Document Analysis** : Analyse de documents de négociation
4. **Multi-Language** : Support de négociations internationales

## Ressources

- [Documentation OpenPipe](https://docs.openpipe.ai)
- [TanStack Query Guide](https://tanstack.com/query/latest)
- [shadcn/ui Components](https://ui.shadcn.com)