import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { tgimChatbot } from '../services/tgim-chatbot-service';
import { 
  TGIMChatMessage, 
  RAGResponse, 
  TGIMSessionContext, 
  DocumentSource,
  TGIMDocument 
} from '../types';

export interface UseTGIMChatbotOptions {
  sessionId: string;
  sessionContext?: TGIMSessionContext;
  onMessageReceived?: (response: RAGResponse) => void;
  onError?: (error: Error) => void;
  autoSave?: boolean;
}

export function useTGIMChatbot(options: UseTGIMChatbotOptions) {
  const queryClient = useQueryClient();
  const { sessionId, sessionContext, onMessageReceived, onError, autoSave = true } = options;

  // Mutation pour envoyer une question et recevoir une réponse RAG
  const chatMutation = useMutation({
    mutationFn: async (query: string): Promise<RAGResponse> => {
      // Récupérer l'historique existant pour le contexte
      const existingMessages = queryClient.getQueryData<TGIMChatMessage[]>(['tgim-chat-messages', sessionId]) || [];
      
      return await tgimChatbot.generateRAGResponse(query, sessionContext, existingMessages);
    },
    onSuccess: (ragResponse: RAGResponse, query: string) => {
      if (autoSave) {
        // Ajouter le message utilisateur
        const userMessage: TGIMChatMessage = {
          id: `msg-${Date.now()}-user`,
          session_id: sessionId,
          role: 'user',
          content: query,
          timestamp: new Date().toISOString(),
          search_query: query
        };

        // Ajouter la réponse de l'assistant
        const assistantMessage: TGIMChatMessage = {
          id: `msg-${Date.now()}-assistant`,
          session_id: sessionId,
          role: 'assistant',
          content: ragResponse.answer,
          timestamp: new Date().toISOString(),
          sources: ragResponse.sources,
          confidence_score: ragResponse.confidence,
          follow_up_questions: ragResponse.follow_up_questions,
          search_query: query,
          response_time_ms: ragResponse.response_metadata.processing_time_ms
        };

        // Mettre à jour le cache des messages
        queryClient.setQueryData<TGIMChatMessage[]>(['tgim-chat-messages', sessionId], (oldMessages = []) => {
          return [...oldMessages, userMessage, assistantMessage];
        });

        // Mettre à jour le contexte de session si fourni
        if (sessionContext) {
          const updatedContext: TGIMSessionContext = {
            ...sessionContext,
            key_topics_discussed: [
              ...sessionContext.key_topics_discussed,
              ...ragResponse.related_topics
            ].slice(0, 10), // Limite à 10 topics récents
            documents_referenced: [
              ...sessionContext.documents_referenced,
              ...ragResponse.sources.map(s => s.document.id)
            ].filter((id, index, arr) => arr.indexOf(id) === index), // Dédoublonnage
          };
          
          queryClient.setQueryData(['tgim-session-context', sessionId], updatedContext);
        }
      }
      
      // Callback optionnel
      onMessageReceived?.(ragResponse);
    },
    onError: (error: Error) => {
      console.error('Erreur lors de l\'envoi du message au chatbot:', error);
      onError?.(error);
    }
  });

  // Mutation pour rechercher dans la base de connaissances
  const searchMutation = useMutation({
    mutationFn: async ({ query, maxResults = 5 }: { query: string; maxResults?: number }): Promise<DocumentSource[]> => {
      return await tgimChatbot.searchKnowledge(query, maxResults);
    },
    onSuccess: (results, variables) => {
      // Cache les résultats de recherche
      queryClient.setQueryData(['tgim-search-results', variables.query], results);
    }
  });

  // Query pour les recommandations de documents personnalisées
  const recommendedDocumentsQuery = useQuery({
    queryKey: ['tgim-recommended-docs', sessionContext?.user_profile],
    queryFn: async (): Promise<TGIMDocument[]> => {
      return await tgimChatbot.getRecommendedDocuments(sessionContext?.user_profile);
    },
    enabled: !!sessionContext?.user_profile,
    staleTime: 1000 * 60 * 10, // 10 minutes
    refetchOnWindowFocus: false
  });

  // Query pour les statistiques de la base de connaissances
  const knowledgeStatsQuery = useQuery({
    queryKey: ['tgim-knowledge-stats'],
    queryFn: () => tgimChatbot.getKnowledgeBaseStats(),
    staleTime: 1000 * 60 * 30, // 30 minutes
    refetchOnWindowFocus: false
  });

  return {
    // Actions principales
    sendMessage: chatMutation.mutate,
    sendMessageAsync: chatMutation.mutateAsync,
    searchKnowledge: searchMutation.mutate,
    searchKnowledgeAsync: searchMutation.mutateAsync,
    
    // États de chargement
    isChatting: chatMutation.isPending,
    isSearching: searchMutation.isPending,
    isLoadingRecommendations: recommendedDocumentsQuery.isLoading,
    
    // Erreurs
    chatError: chatMutation.error,
    searchError: searchMutation.error,
    recommendationsError: recommendedDocumentsQuery.error,
    
    // Données
    lastResponse: chatMutation.data,
    searchResults: searchMutation.data,
    recommendedDocuments: recommendedDocumentsQuery.data || [],
    knowledgeStats: knowledgeStatsQuery.data,
    
    // Métadonnées
    chatAttempts: chatMutation.failureCount,
    searchAttempts: searchMutation.failureCount,
    
    // Fonctions utilitaires
    reset: () => {
      chatMutation.reset();
      searchMutation.reset();
    },
    
    // Refetch des recommandations (utile après mise à jour du profil)
    refetchRecommendations: recommendedDocumentsQuery.refetch
  };
}

// Hook pour gérer l'historique des messages de chat
export function useTGIMChatMessages(sessionId: string) {
  const queryClient = useQueryClient();

  const addMessage = (message: TGIMChatMessage) => {
    queryClient.setQueryData<TGIMChatMessage[]>(['tgim-chat-messages', sessionId], (oldMessages = []) => {
      return [...oldMessages, message];
    });
  };

  const getMessages = (): TGIMChatMessage[] => {
    return queryClient.getQueryData(['tgim-chat-messages', sessionId]) || [];
  };

  const clearMessages = () => {
    queryClient.setQueryData(['tgim-chat-messages', sessionId], []);
  };

  const deleteMessage = (messageId: string) => {
    queryClient.setQueryData<TGIMChatMessage[]>(['tgim-chat-messages', sessionId], (oldMessages = []) => {
      return oldMessages.filter(msg => msg.id !== messageId);
    });
  };

  const updateMessage = (messageId: string, updates: Partial<TGIMChatMessage>) => {
    queryClient.setQueryData<TGIMChatMessage[]>(['tgim-chat-messages', sessionId], (oldMessages = []) => {
      return oldMessages.map(msg => 
        msg.id === messageId ? { ...msg, ...updates } : msg
      );
    });
  };

  return {
    addMessage,
    getMessages,
    clearMessages,
    deleteMessage,
    updateMessage,
    messageCount: getMessages().length
  };
}

// Hook pour gérer le contexte de session
export function useTGIMSessionContext(sessionId: string) {
  const queryClient = useQueryClient();

  const getContext = (): TGIMSessionContext | undefined => {
    return queryClient.getQueryData(['tgim-session-context', sessionId]);
  };

  const updateContext = (updates: Partial<TGIMSessionContext>) => {
    queryClient.setQueryData<TGIMSessionContext>(['tgim-session-context', sessionId], (oldContext) => {
      if (!oldContext) {
        // Créer un contexte par défaut si inexistant
        return {
          user_profile: {
            experience_level: 'beginner',
            areas_of_interest: [],
          },
          conversation_summary: '',
          key_topics_discussed: [],
          documents_referenced: [],
          ...updates
        };
      }
      return { ...oldContext, ...updates };
    });
  };

  const updateUserProfile = (profileUpdates: Partial<TGIMSessionContext['user_profile']>) => {
    const currentContext = getContext();
    if (currentContext) {
      updateContext({
        user_profile: { ...currentContext.user_profile, ...profileUpdates }
      });
    }
  };

  const addTopicDiscussed = (topic: string) => {
    const currentContext = getContext();
    if (currentContext) {
      const updatedTopics = [...currentContext.key_topics_discussed, topic]
        .filter((t, index, arr) => arr.indexOf(t) === index) // Dédoublonnage
        .slice(-10); // Garde les 10 derniers
      
      updateContext({ key_topics_discussed: updatedTopics });
    }
  };

  return {
    getContext,
    updateContext,
    updateUserProfile,
    addTopicDiscussed
  };
}

// Hook pour les modèles et configuration disponibles
export function useTGIMChatbotConfig() {
  return {
    models: tgimChatbot.getSupportedModels(),
    defaultModel: 'gpt-4o',
    customModels: tgimChatbot.getSupportedModels().filter(model => model.startsWith('openpipe:')),
    maxMessagesHistory: 50,
    maxSearchResults: 10,
    confidenceThreshold: 0.7,
    supportedLanguages: ['fr'],
    features: {
      sourcesCitation: true,
      followUpQuestions: true,
      personalizedRecommendations: true,
      conversationHistory: true,
      documentSearch: true,
      offlineMode: true
    }
  };
}

// Hook pour les métriques et analytics
export function useTGIMChatbotMetrics(sessionId: string) {
  const queryClient = useQueryClient();

  const getSessionMetrics = () => {
    const messages = queryClient.getQueryData<TGIMChatMessage[]>(['tgim-chat-messages', sessionId]) || [];
    const assistantMessages = messages.filter(msg => msg.role === 'assistant');
    
    const avgConfidenceScore = assistantMessages.reduce((sum, msg) => 
      sum + (msg.confidence_score || 0), 0) / (assistantMessages.length || 1);
    
    const totalResponseTime = assistantMessages.reduce((sum, msg) => 
      sum + (msg.response_time_ms || 0), 0);
    
    const documentsConsulted = new Set(
      assistantMessages.flatMap(msg => msg.sources?.map(s => s.document.id) || [])
    ).size;

    const topicsDiscussed = new Set(
      assistantMessages.flatMap(msg => 
        msg.sources?.flatMap(s => s.document.tags) || []
      )
    ).size;

    return {
      messageCount: messages.length,
      assistantResponses: assistantMessages.length,
      avgConfidenceScore,
      totalResponseTime,
      avgResponseTime: totalResponseTime / (assistantMessages.length || 1),
      documentsConsulted,
      topicsDiscussed,
      sessionDuration: messages.length > 0 ? 
        new Date(messages[messages.length - 1].timestamp).getTime() - 
        new Date(messages[0].timestamp).getTime() : 0
    };
  };

  return {
    getSessionMetrics,
    metrics: getSessionMetrics()
  };
}