import { useMutation, useQueryClient } from '@tanstack/react-query';
import { negotiationAI } from '../services/negotiation-ai-service';
import { NegotiationContext, NegotiationMessage } from '../types';

export interface UseNegotiationAIOptions {
  context: NegotiationContext;
  onMessageReceived?: (message: NegotiationMessage) => void;
  onError?: (error: Error) => void;
}

export function useNegotiationAI(options: UseNegotiationAIOptions) {
  const queryClient = useQueryClient();
  const { context, onMessageReceived, onError } = options;

  // Mutation pour envoyer un message à l'IA
  const sendMessageMutation = useMutation({
    mutationFn: async (userMessage: string): Promise<NegotiationMessage> => {
      return await negotiationAI.sendNegotiationMessage(context, userMessage);
    },
    onSuccess: (aiMessage: NegotiationMessage) => {
      // Mettre à jour le cache avec le nouveau message
      queryClient.setQueryData(['negotiation-messages', context.deal.id], (oldMessages: NegotiationMessage[] = []) => {
        return [...oldMessages, aiMessage];
      });
      
      // Callback optionnel
      onMessageReceived?.(aiMessage);
    },
    onError: (error: Error) => {
      console.error('Erreur lors de l\'envoi du message:', error);
      onError?.(error);
    }
  });

  // Mutation pour analyser les progrès de négociation
  const analyzeProgressMutation = useMutation({
    mutationFn: async () => {
      return await negotiationAI.analyzeNegotiationProgress(context);
    },
    onSuccess: (analysis) => {
      // Mettre à jour le cache avec l'analyse
      queryClient.setQueryData(['negotiation-analysis', context.deal.id], analysis);
    }
  });

  return {
    // Actions
    sendMessage: sendMessageMutation.mutate,
    sendMessageAsync: sendMessageMutation.mutateAsync,
    analyzeProgress: analyzeProgressMutation.mutate,
    
    // États
    isSending: sendMessageMutation.isPending,
    isAnalyzing: analyzeProgressMutation.isPending,
    
    // Erreurs
    sendError: sendMessageMutation.error,
    analysisError: analyzeProgressMutation.error,
    
    // Données
    lastResponse: sendMessageMutation.data,
    analysis: analyzeProgressMutation.data,
    
    // Métadonnées
    sendAttempts: sendMessageMutation.failureCount,
    
    // Fonctions utilitaires
    reset: () => {
      sendMessageMutation.reset();
      analyzeProgressMutation.reset();
    }
  };
}

// Hook pour gérer l'historique des messages
export function useNegotiationMessages(dealId: string) {
  const queryClient = useQueryClient();

  const addMessage = (message: NegotiationMessage) => {
    queryClient.setQueryData(['negotiation-messages', dealId], (oldMessages: NegotiationMessage[] = []) => {
      return [...oldMessages, message];
    });
  };

  const getMessages = (): NegotiationMessage[] => {
    return queryClient.getQueryData(['negotiation-messages', dealId]) || [];
  };

  const clearMessages = () => {
    queryClient.setQueryData(['negotiation-messages', dealId], []);
  };

  return {
    addMessage,
    getMessages,
    clearMessages
  };
}

// Hook pour gérer les modèles disponibles
export function useAvailableModels() {
  return {
    models: negotiationAI.getSupportedModels(),
    defaultModel: 'gpt-4o',
    customModels: negotiationAI.getSupportedModels().filter(model => model.startsWith('openpipe:'))
  };
}