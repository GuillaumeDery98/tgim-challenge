# 🤖 Module 2 : Chatbot IA TGIM - Spécifications Techniques

## 🎯 OBJECTIF

Créer un chatbot IA spécialisé formé sur tout le contenu de la plateforme TGIM pour accompagner les utilisateurs dans leur parcours de reprise d'entreprise avec système RAG (Retrieval Augmented Generation).

## 📋 FONCTIONNALITÉS REQUISES

### ✅ Core Features
- **Formation sur le contenu** : Ingestion de tous les documents, guides et ressources TGIM
- **RAG (Retrieval Augmented Generation)** : Recherche intelligente dans la base de connaissances  
- **Contexte conversationnel** : Mémorisation du contexte de la conversation
- **Sources et citations** : Références précises aux documents sources
- **Personnalisation** : Adaptation aux besoins spécifiques de chaque utilisateur
- **Intégration workflow** : Connexion avec les outils TGIM existants

### 🛠️ Technologies Suggérées (Mode Mock)
- **OpenAI GPT-4** → OpenPipe (réutiliser architecture Module 1)
- **LangChain** → Mock workflow RAG avec patterns similaires
- **Pinecone/Weaviate** → Mock vector database avec fake embeddings
- **Embeddings** → Simulation recherche sémantique

## 🏗️ ARCHITECTURE TECHNIQUE

### Pattern Réutilisé du Module 1
```typescript
// Service RAG basé sur NegotiationAIService
class TGIMChatbotService extends AIService {
  private vectorDB: MockVectorDB;
  private knowledgeBase: TGIMDocument[];
  
  async searchKnowledge(query: string): Promise<RelevantDocument[]>
  async generateRAGResponse(query: string, context: Document[]): Promise<ChatResponse>
}

// Hook TanStack Query 
function useTGIMChatbot(options) {
  const searchMutation = useMutation({ mutationFn: service.searchKnowledge })
  const chatMutation = useMutation({ mutationFn: service.generateRAGResponse })
}
```

### Structure des Fake Data
```typescript
interface TGIMDocument {
  id: string;
  title: string;
  content: string;
  category: 'guide' | 'formation' | 'template' | 'checklist';
  tags: string[];
  embedding?: number[]; // Mock embedding vector
  url?: string;
}

interface RAGResponse {
  answer: string;
  sources: DocumentSource[];
  confidence: number;
  followUpQuestions?: string[];
}

interface DocumentSource {
  document: TGIMDocument;
  relevanceScore: number;
  excerpt: string;
}
```

## 📊 MOCK KNOWLEDGE BASE TGIM

### Documents Types à Simuler
```typescript
export const mockTGIMDocuments: TGIMDocument[] = [
  // Guides de formation
  {
    id: 'guide-001',
    title: 'Guide Complet de la Reprise d\'Entreprise',
    content: 'La reprise d\'entreprise est un processus complexe...',
    category: 'guide',
    tags: ['reprise', 'acquisition', 'débutant']
  },
  
  // Templates pratiques
  {
    id: 'template-001', 
    title: 'Business Plan Type pour Reprise',
    content: 'Modèle de business plan adapté aux reprises...',
    category: 'template',
    tags: ['business-plan', 'financement', 'template']
  },

  // Formations spécialisées
  {
    id: 'formation-001',
    title: 'Module M1: Ciblage et Approche',
    content: 'Techniques pour identifier et approcher les cibles...',
    category: 'formation', 
    tags: ['M1', 'ciblage', 'approche', 'formation']
  },

  // Checklists pratiques
  {
    id: 'checklist-001',
    title: 'Due Diligence : Points de Contrôle',
    content: 'Liste exhaustive des éléments à vérifier...',
    category: 'checklist',
    tags: ['due-diligence', 'controle', 'checklist']
  }
]
```

### Mock Conversations RAG
```typescript
export const mockRAGConversations = [
  {
    user: "Comment faire une due diligence efficace ?",
    assistant: "La due diligence efficace nécessite une approche méthodique en plusieurs étapes...",
    sources: [
      {
        document: mockTGIMDocuments.find(d => d.id === 'checklist-001'),
        relevanceScore: 0.95,
        excerpt: "Liste exhaustive des éléments à vérifier lors d'une acquisition..."
      }
    ],
    followUpQuestions: [
      "Quels sont les points juridiques critiques ?",
      "Comment évaluer les risques financiers ?",
      "Combien de temps prévoir pour la DD ?"
    ]
  }
]
```

## 🎨 INTERFACE UTILISATEUR

### Layout Proposé
```
┌─────────────────────────────────────────────────┐
│ [TGIM Chatbot] [🟢 En ligne] [Paramètres]      │
├─────────────────┬───────────────────────────────┤
│                 │ Chat Messages                 │
│ Knowledge Panel │ ┌─────────────────────────┐   │
│                 │ │ User: Comment faire...  │   │
│ 📚 Sources      │ │ Bot: Selon le guide...  │   │
│ • Guide Reprise │ │ 📖 Sources: [Guide-001] │   │
│ • Template BP   │ │                         │   │
│ • Formation M1  │ └─────────────────────────┘   │
│                 │                               │
│ 🏷️ Tags         │ ┌─────────────────────────────┐ │
│ #reprise        │ │ Votre question...           │ │
│ #financement    │ │                        [↗]  │ │
│ #due-diligence  │ └─────────────────────────────┘ │
└─────────────────┴───────────────────────────────┘
```

### Composants à Créer
- `TGIMChatbot.tsx` : Composant principal
- `KnowledgePanel.tsx` : Panel latéral avec sources
- `MessageWithSources.tsx` : Message avec citations intégrées
- `DocumentPreview.tsx` : Aperçu document référencé
- `SearchInput.tsx` : Input avec suggestions sémantiques

## 🔄 WORKFLOW RAG MOCKÓ

### 1. User Query Processing
```typescript
const handleUserQuery = async (query: string) => {
  // 1. Mock semantic search
  const relevantDocs = await mockSemanticSearch(query);
  
  // 2. Generate RAG response
  const response = await generateMockRAGResponse(query, relevantDocs);
  
  // 3. Update conversation context
  updateConversationContext(query, response);
}
```

### 2. Mock Semantic Search
```typescript
const mockSemanticSearch = (query: string): TGIMDocument[] => {
  // Simulate embedding similarity with keywords matching
  return mockTGIMDocuments
    .filter(doc => hasSemanticMatch(query, doc))
    .sort((a, b) => calculateRelevance(query, b) - calculateRelevance(query, a))
    .slice(0, 3);
}
```

### 3. Mock RAG Generation
```typescript
const generateMockRAGResponse = (query: string, docs: TGIMDocument[]): RAGResponse => {
  const contextualAnswer = buildContextualAnswer(query, docs);
  const sources = docs.map(doc => ({
    document: doc,
    relevanceScore: Math.random() * 0.3 + 0.7, // 0.7-1.0
    excerpt: extractRelevantExcerpt(doc, query)
  }));
  
  return {
    answer: contextualAnswer,
    sources,
    confidence: 0.85,
    followUpQuestions: generateFollowUpQuestions(query, docs)
  };
}
```

## 📍 ROUTE ET NAVIGATION

### Route Proposée
- **URL** : `/tgim-chatbot`
- **Protection** : Tous utilisateurs connectés
- **Menu** : Ajouter dans navigation principale

### Intégration Existante
- Utiliser même pattern de routing que `/negotiator-ai`
- Réutiliser components UI (Card, Badge, ScrollArea, etc.)
- Adapter theme existant avec couleurs spécifiques TGIM

## 🧪 TESTS ET VALIDATION

### Scenarios de Test
1. **Recherche basique** : "Qu'est-ce que TGIM ?"
2. **Question technique** : "Comment valoriser une entreprise ?"
3. **Demande template** : "Je veux un business plan type"
4. **Question contextuelle** : Suite de questions liées
5. **Sources multiples** : Question nécessitant plusieurs documents

### Métriques Mock
- **Temps de réponse** : ~2-3 secondes simulés
- **Pertinence sources** : Score 0.7-1.0 pour mock
- **Satisfaction utilisateur** : Feedback simulé
- **Coverage knowledge base** : % documents utilisés

## 🚀 LIVRABLE ATTENDU

### Architecture Complète
- Service `TGIMChatbotService` avec OpenPipe + mock RAG
- Hook `useTGIMChatbot` avec TanStack Query
- Interface chat avec panel sources et citations
- Mock knowledge base avec ~20 documents TGIM réalistes
- Types TypeScript complets pour RAG system

### Mode Développement
- Fonctionnement offline complet sans APIs
- Mock embeddings et recherche sémantique
- Réponses contextuelle intelligentes
- Citations et sources simulées réalistes

**L'architecture Module 1 est parfaitement réplicable pour ce chatbot RAG !** 🎯