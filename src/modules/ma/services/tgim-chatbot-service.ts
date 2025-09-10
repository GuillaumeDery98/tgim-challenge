import OpenAI from 'openpipe/openai';
import { 
  TGIMDocument, 
  TGIMChatMessage, 
  RAGResponse, 
  DocumentSource, 
  SearchQuery, 
  TGIMSessionContext 
} from '../types';
import { mockTGIMDocuments, mockRAGConversations } from '../data/tgim-knowledge-base';

export class TGIMChatbotService {
  private static instance: TGIMChatbotService;
  private openPipeClient: OpenAI | null = null;
  private isInitialized = false;
  private knowledgeBase: TGIMDocument[] = mockTGIMDocuments;

  private constructor() {}

  public static getInstance(): TGIMChatbotService {
    if (!TGIMChatbotService.instance) {
      TGIMChatbotService.instance = new TGIMChatbotService();
    }
    return TGIMChatbotService.instance;
  }

  public async initialize(): Promise<void> {
    if (this.isInitialized) return;

    try {
      // Configuration OpenPipe - compatible OpenAI
      this.openPipeClient = OpenAI({
        apiKey: import.meta.env.VITE_OPENPIPE_API_KEY || 'mock-key-for-dev',
        baseURL: import.meta.env.VITE_OPENPIPE_BASE_URL || 'https://app.openpipe.ai/api/v1'
      });
      
      this.isInitialized = true;
      console.log('TGIMChatbotService initialisé avec succès');
    } catch (error) {
      console.error('Erreur lors de l\'initialisation du service OpenPipe:', error);
      // En mode développement, on continue sans l'API
      this.isInitialized = true;
    }
  }

  // Recherche sémantique mock dans la base de connaissances
  public async searchKnowledge(query: string, maxResults: number = 3): Promise<DocumentSource[]> {
    const startTime = Date.now();
    
    // Simulation de recherche sémantique avec matching par mots-clés et tags
    const searchTerms = query.toLowerCase().split(' ').filter(term => term.length > 2);
    
    const scoredDocuments = this.knowledgeBase.map(doc => {
      let score = 0;
      
      // Score basé sur le titre
      searchTerms.forEach(term => {
        if (doc.title.toLowerCase().includes(term)) score += 3;
      });
      
      // Score basé sur les tags
      searchTerms.forEach(term => {
        doc.tags.forEach(tag => {
          if (tag.toLowerCase().includes(term)) score += 2;
        });
      });
      
      // Score basé sur le contenu
      searchTerms.forEach(term => {
        if (doc.content.toLowerCase().includes(term)) score += 1;
      });
      
      // Score basé sur la catégorie
      if (query.toLowerCase().includes('formation') && doc.category === 'formation') score += 2;
      if (query.toLowerCase().includes('guide') && doc.category === 'guide') score += 2;
      if (query.toLowerCase().includes('template') && doc.category === 'template') score += 2;
      if (query.toLowerCase().includes('checklist') && doc.category === 'checklist') score += 2;
      
      // Score basé sur les modules M1, M2, M3, M4
      if (query.toLowerCase().includes('m1') && doc.related_modules?.includes('M1')) score += 3;
      if (query.toLowerCase().includes('m2') && doc.related_modules?.includes('M2')) score += 3;
      if (query.toLowerCase().includes('m3') && doc.related_modules?.includes('M3')) score += 3;
      if (query.toLowerCase().includes('m4') && doc.related_modules?.includes('M4')) score += 3;
      
      return { doc, score };
    });

    // Filtrage et tri par pertinence
    const relevantDocuments = scoredDocuments
      .filter(item => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, maxResults);

    // Création des DocumentSource avec extraits pertinents
    const documentSources: DocumentSource[] = relevantDocuments.map(item => ({
      document: item.doc,
      relevance_score: Math.min(0.95, 0.3 + (item.score * 0.1)), // Normalisation entre 0.3 et 0.95
      excerpt: this.extractRelevantExcerpt(item.doc, query),
      highlighted_terms: searchTerms.filter(term => 
        item.doc.title.toLowerCase().includes(term) || 
        item.doc.content.toLowerCase().includes(term)
      ),
      section: this.extractRelevantSection(item.doc, query)
    }));

    return documentSources;
  }

  // Génération de réponse RAG avec OpenPipe
  public async generateRAGResponse(
    query: string,
    sessionContext?: TGIMSessionContext,
    conversationHistory: TGIMChatMessage[] = []
  ): Promise<RAGResponse> {
    await this.initialize();
    const startTime = Date.now();

    // 1. Recherche dans la base de connaissances
    const sources = await this.searchKnowledge(query, 3);

    // Mode mock pour le développement
    if (!import.meta.env.VITE_OPENPIPE_API_KEY || import.meta.env.DEV) {
      return this.generateMockRAGResponse(query, sources, sessionContext);
    }

    try {
      // 2. Construction du prompt avec contexte RAG
      const systemPrompt = this.buildRAGSystemPrompt(sources, sessionContext);
      const conversationPrompt = this.buildConversationHistory(conversationHistory);

      // 3. Appel à OpenPipe
      const completion = await this.openPipeClient!.chat.completions.create({
        model: import.meta.env.VITE_OPENPIPE_MODEL || 'gpt-4o',
        messages: [
          { role: 'system', content: systemPrompt },
          ...conversationPrompt,
          { role: 'user', content: query }
        ],
        metadata: {
          query_type: 'rag_chat',
          knowledge_sources: sources.length,
          user_experience_level: sessionContext?.user_profile.experience_level || 'beginner',
          session_id: 'current-session' // À remplacer par l'ID de session réel
        },
        temperature: 0.7,
        max_tokens: 1500
      });

      const aiResponse = completion.choices[0]?.message?.content || 'Désolé, je n\'ai pas pu générer une réponse.';
      
      // 4. Post-traitement de la réponse
      const followUpQuestions = this.generateFollowUpQuestions(query, sources, aiResponse);
      const relatedTopics = this.extractRelatedTopics(sources);

      const processingTime = Date.now() - startTime;

      return {
        answer: aiResponse,
        sources,
        confidence: this.calculateConfidenceScore(sources, aiResponse),
        search_query: query,
        follow_up_questions: followUpQuestions,
        related_topics: relatedTopics,
        response_metadata: {
          documents_searched: this.knowledgeBase.length,
          processing_time_ms: processingTime,
          model_used: import.meta.env.VITE_OPENPIPE_MODEL || 'gpt-4o',
          search_strategy: 'semantic'
        }
      };

    } catch (error) {
      console.error('Erreur lors de l\'appel à l\'API OpenPipe:', error);
      return this.generateMockRAGResponse(query, sources, sessionContext);
    }
  }

  private buildRAGSystemPrompt(
    sources: DocumentSource[], 
    sessionContext?: TGIMSessionContext
  ): string {
    const contextualInfo = sessionContext ? `
PROFIL UTILISATEUR:
- Niveau d'expérience: ${sessionContext.user_profile.experience_level}
- Centres d'intérêt: ${sessionContext.user_profile.areas_of_interest.join(', ')}
- Phase de projet: ${sessionContext.user_profile.current_project_phase || 'Non spécifiée'}
- Secteur d'intérêt: ${sessionContext.user_profile.industry_focus || 'Généraliste'}

CONTEXTE CONVERSATIONNEL:
- Résumé de la conversation: ${sessionContext.conversation_summary}
- Sujets abordés: ${sessionContext.key_topics_discussed.join(', ')}
` : '';

    const sourcesContext = sources.length > 0 ? `
SOURCES DOCUMENTAIRES PERTINENTES:
${sources.map((source, index) => `
${index + 1}. ${source.document.title} (${source.document.category})
   Pertinence: ${(source.relevance_score * 100).toFixed(0)}%
   Extrait: ${source.excerpt}
   Tags: ${source.document.tags.join(', ')}
`).join('\n')}
` : '';

    return `Tu es l'assistant IA spécialisé TGIM, expert en reprise d'entreprise et formation aux acquisitions M&A. Tu accompagnes les utilisateurs dans leur parcours de reprise d'entreprise avec expertise et pédagogie.

${contextualInfo}

${sourcesContext}

MÉTHODOLOGIE TGIM:
La méthode TGIM structure le parcours de reprise en 4 modules:
- M1: Ciblage et Approche - Construction de la crédibilité et prospection
- M2: Négociation et Valorisation - Techniques de négociation et structuration
- M3: Due Diligence - Audit et identification des risques
- M4: Finalisation - Closing et intégration post-acquisition

INSTRUCTIONS DE RÉPONSE:
1. UTILISE TOUJOURS les sources documentaires pour étayer tes réponses
2. ADAPTE ton niveau de détail au profil utilisateur (débutant/intermédiaire/avancé)
3. STRUCTURE tes réponses avec des sections claires et des points d'action
4. CITE tes sources avec des références précises aux documents TGIM
5. PROPOSE des questions de suivi pertinentes pour approfondir
6. UTILISE un ton professionnel mais accessible et pédagogique
7. FOURNIS des conseils pratiques et actionnables
8. INTÈGRE l'expérience TGIM (5000+ repreneurs accompagnés, 78% de taux de succès)

FORMAT DE RÉPONSE:
- Réponse structurée avec titres et sous-titres
- Citations et références aux documents sources
- Conseils pratiques applicables immédiatement
- Questions de suivi pour approfondir le sujet

Tu dois TOUJOURS répondre en français et maintenir la cohérence avec la méthode TGIM.`;
  }

  private buildConversationHistory(history: TGIMChatMessage[]): Array<{role: 'user' | 'assistant', content: string}> {
    return history.slice(-6).map(msg => ({
      role: msg.role as 'user' | 'assistant',
      content: msg.content
    }));
  }

  private extractRelevantExcerpt(doc: TGIMDocument, query: string): string {
    const content = doc.content;
    const queryTerms = query.toLowerCase().split(' ').filter(term => term.length > 2);
    
    // Trouve la première occurrence d'un terme de recherche
    let bestMatch = '';
    let bestPosition = -1;
    
    queryTerms.forEach(term => {
      const position = content.toLowerCase().indexOf(term);
      if (position !== -1 && (bestPosition === -1 || position < bestPosition)) {
        bestPosition = position;
      }
    });
    
    if (bestPosition !== -1) {
      // Extrait environ 200 caractères autour du terme trouvé
      const start = Math.max(0, bestPosition - 100);
      const end = Math.min(content.length, bestPosition + 200);
      bestMatch = content.substring(start, end);
      
      // Nettoie les phrases coupées
      bestMatch = bestMatch.replace(/^[^.]*\./, '').replace(/\.[^.]*$/, '.');
    } else {
      // Fallback: prend les 200 premiers caractères
      bestMatch = content.substring(0, 200);
    }
    
    return bestMatch.trim() + (bestMatch.length < content.length ? '...' : '');
  }

  private extractRelevantSection(doc: TGIMDocument, query: string): string | undefined {
    const content = doc.content;
    const sections = content.split(/\n## /g);
    
    if (sections.length <= 1) return undefined;
    
    const queryTerms = query.toLowerCase().split(' ').filter(term => term.length > 2);
    
    for (const section of sections) {
      const sectionLower = section.toLowerCase();
      for (const term of queryTerms) {
        if (sectionLower.includes(term)) {
          const sectionTitle = section.split('\n')[0].replace(/^#+ /, '');
          return sectionTitle.substring(0, 100);
        }
      }
    }
    
    return undefined;
  }

  private generateFollowUpQuestions(
    query: string,
    sources: DocumentSource[],
    response: string
  ): string[] {
    const questions = [];
    
    // Questions basées sur les sources trouvées
    if (sources.some(s => s.document.category === 'formation')) {
      questions.push("Quels sont les outils pratiques disponibles pour cette formation ?");
    }
    
    if (sources.some(s => s.document.category === 'template')) {
      questions.push("Comment personnaliser ce template pour mon secteur ?");
    }
    
    if (sources.some(s => s.document.related_modules?.includes('M1'))) {
      questions.push("Quelles sont les étapes suivantes du module M2 ?");
    }
    
    if (query.toLowerCase().includes('valorisation')) {
      questions.push("Comment justifier ma valorisation face au vendeur ?");
      questions.push("Quels multiples utiliser pour mon secteur spécifique ?");
    }
    
    if (query.toLowerCase().includes('négociation')) {
      questions.push("Comment gérer les objections sur le prix ?");
      questions.push("Quelles concessions puis-je accepter ?");
    }
    
    if (query.toLowerCase().includes('due diligence')) {
      questions.push("Combien de temps prévoir pour la due diligence ?");
      questions.push("Comment sélectionner les bons experts ?");
    }
    
    // Limite à 3 questions et ajoute des questions génériques si besoin
    const finalQuestions = questions.slice(0, 3);
    
    if (finalQuestions.length === 0) {
      finalQuestions.push(
        "Pouvez-vous me donner un exemple concret ?",
        "Quels sont les pièges à éviter ?",
        "Quelles ressources complémentaires recommandez-vous ?"
      );
    }
    
    return finalQuestions.slice(0, 3);
  }

  private extractRelatedTopics(sources: DocumentSource[]): string[] {
    const topics = new Set<string>();
    
    sources.forEach(source => {
      source.document.tags.forEach(tag => topics.add(tag));
      if (source.document.related_modules) {
        source.document.related_modules.forEach(module => topics.add(module));
      }
    });
    
    return Array.from(topics).slice(0, 5);
  }

  private calculateConfidenceScore(sources: DocumentSource[], response: string): number {
    if (sources.length === 0) return 0.3;
    
    const avgRelevance = sources.reduce((sum, s) => sum + s.relevance_score, 0) / sources.length;
    const sourceQuality = sources.length >= 2 ? 1.0 : 0.8;
    const responseLength = response.length > 200 ? 1.0 : 0.9;
    
    return Math.min(0.95, avgRelevance * sourceQuality * responseLength);
  }

  private generateMockRAGResponse(
    query: string,
    sources: DocumentSource[],
    sessionContext?: TGIMSessionContext
  ): RAGResponse {
    // Utilise les conversations mock si disponibles
    const mockConversation = mockRAGConversations.find(conv => 
      query.toLowerCase().includes('due diligence') && conv.user.includes('due diligence') ||
      query.toLowerCase().includes('valorisation') && conv.user.includes('valorisation')
    );

    let mockAnswer = '';
    
    if (mockConversation) {
      mockAnswer = mockConversation.assistant;
    } else if (sources.length > 0) {
      const primarySource = sources[0];
      mockAnswer = `D'après ${primarySource.document.title}, voici les points essentiels à retenir :

${primarySource.excerpt}

Cette approche TGIM s'appuie sur l'expérience de plus de 5000 repreneurs accompagnés avec un taux de succès de 78%. 

**Points clés** :
- ${primarySource.document.tags.slice(0, 2).join(' et ')} sont des éléments cruciaux
- La méthodologie ${primarySource.document.category} TGIM offre un cadre structuré
- L'adaptation à votre contexte spécifique est essentielle

**Recommandation** : ${this.getContextualRecommendation(query, sessionContext)}`;
    } else {
      mockAnswer = `Je comprends votre question sur "${query}". Bien que je n'aie pas trouvé de document spécifiquement pertinent dans ma base actuelle, je peux vous orienter selon les principes TGIM :

La méthode TGIM structure votre parcours de reprise en 4 modules complémentaires. Selon votre question, je recommande d'approfondir les aspects suivants pour maximiser vos chances de succès.

Pour obtenir une réponse plus précise, pourriez-vous me dire à quelle phase de votre projet vous vous trouvez actuellement ?`;
    }

    return {
      answer: mockAnswer,
      sources,
      confidence: sources.length > 0 ? 0.85 : 0.65,
      search_query: query,
      follow_up_questions: this.generateFollowUpQuestions(query, sources, mockAnswer),
      related_topics: this.extractRelatedTopics(sources),
      response_metadata: {
        documents_searched: this.knowledgeBase.length,
        processing_time_ms: 800 + Math.random() * 1200, // Simule 0.8-2s
        model_used: 'mock-tgim-rag-model',
        search_strategy: 'semantic'
      }
    };
  }

  private getContextualRecommendation(query: string, sessionContext?: TGIMSessionContext): string {
    if (!sessionContext) {
      return "Consultez les modules TGIM correspondants pour approfondir cette thématique.";
    }

    const { experience_level, current_project_phase } = sessionContext.user_profile;

    if (experience_level === 'beginner') {
      return "En tant que débutant, commencez par les guides fondamentaux avant d'aborder les aspects techniques.";
    }

    if (current_project_phase === 'prospection') {
      return "Dans votre phase de prospection, concentrez-vous sur le Module M1 pour optimiser votre approche.";
    }

    if (current_project_phase === 'negociation') {
      return "En phase de négociation, les techniques du Module M2 seront particulièrement utiles.";
    }

    return "Adaptez cette méthodologie à votre contexte spécifique pour maximiser l'efficacité.";
  }

  // Méthodes utilitaires pour l'interface
  public getKnowledgeBaseStats() {
    return {
      total_documents: this.knowledgeBase.length,
      categories: [...new Set(this.knowledgeBase.map(doc => doc.category))],
      tags: [...new Set(this.knowledgeBase.flatMap(doc => doc.tags))].slice(0, 10)
    };
  }

  public getSupportedModels(): string[] {
    return [
      'gpt-4o',
      'gpt-4-turbo',
      'gpt-3.5-turbo',
      'claude-3-sonnet',
      'claude-3-haiku',
      'gemini-1.5-pro',
      'gemini-1.5-flash',
      'openpipe:tgim-chatbot-model' // Modèle fine-tuné potentiel
    ];
  }

  public async getRecommendedDocuments(userProfile?: TGIMSessionContext['user_profile']): Promise<TGIMDocument[]> {
    if (!userProfile) {
      return this.knowledgeBase.slice(0, 3);
    }

    const { experience_level, current_project_phase, areas_of_interest } = userProfile;

    let filteredDocs = this.knowledgeBase;

    // Filtrage par niveau d'expérience
    if (experience_level === 'beginner') {
      filteredDocs = filteredDocs.filter(doc => 
        doc.difficulty_level === 'beginner' || doc.category === 'guide'
      );
    }

    // Filtrage par phase de projet
    if (current_project_phase) {
      const moduleMapping = {
        'prospection': 'M1',
        'negociation': 'M2', 
        'due_diligence': 'M3',
        'closing': 'M4'
      };
      
      const targetModule = moduleMapping[current_project_phase];
      if (targetModule) {
        filteredDocs = filteredDocs.filter(doc => 
          doc.related_modules?.includes(targetModule as any)
        );
      }
    }

    // Filtrage par centres d'intérêt
    if (areas_of_interest.length > 0) {
      filteredDocs = filteredDocs.filter(doc =>
        areas_of_interest.some(interest => 
          doc.tags.some(tag => tag.toLowerCase().includes(interest.toLowerCase()))
        )
      );
    }

    return filteredDocs.slice(0, 5);
  }
}

// Export de l'instance singleton
export const tgimChatbot = TGIMChatbotService.getInstance();