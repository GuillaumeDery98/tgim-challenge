import OpenAI from 'openpipe/openai';
import { NegotiationContext, NegotiationMessage, StrategyRecommendation } from '../types';

export class NegotiationAIService {
  private static instance: NegotiationAIService;
  private openPipeClient: OpenAI | null = null;
  private isInitialized = false;

  private constructor() {}

  public static getInstance(): NegotiationAIService {
    if (!NegotiationAIService.instance) {
      NegotiationAIService.instance = new NegotiationAIService();
    }
    return NegotiationAIService.instance;
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
      console.log('NegotiationAIService initialisé avec succès');
    } catch (error) {
      console.error('Erreur lors de l\'initialisation du service OpenPipe:', error);
      // En mode développement, on continue sans l'API
      this.isInitialized = true;
    }
  }

  public async sendNegotiationMessage(
    context: NegotiationContext,
    userMessage: string
  ): Promise<NegotiationMessage> {
    await this.initialize();

    // Mode mock pour le développement
    if (!import.meta.env.VITE_OPENPIPE_API_KEY || import.meta.env.DEV) {
      return this.generateMockResponse(context, userMessage);
    }

    try {
      const systemPrompt = this.buildNegotiationSystemPrompt(context);
      const conversationHistory = this.buildConversationHistory(context);

      const completion = await this.openPipeClient!.chat.completions.create({
        model: import.meta.env.VITE_OPENPIPE_MODEL || 'gpt-4o',
        messages: [
          { role: 'system', content: systemPrompt },
          ...conversationHistory,
          { role: 'user', content: userMessage }
        ],
        metadata: {
          deal_id: context.deal.id,
          target_name: context.target.name,
          phase: context.phase.name,
          user_id: 'current-user' // À remplacer par l'ID utilisateur réel
        },
        temperature: 0.7,
        max_tokens: 1000
      });

      const aiResponse = completion.choices[0]?.message?.content || 'Désolé, je n\'ai pas pu générer une réponse.';
      const strategies = this.extractStrategySuggestions(aiResponse, context);

      return {
        id: `msg-${Date.now()}-ai`,
        role: 'assistant',
        content: aiResponse,
        timestamp: new Date().toISOString(),
        phase_id: context.phase.id,
        strategy_suggestions: strategies,
        sentiment: this.analyzeSentiment(aiResponse),
        confidence_score: 0.85
      };
    } catch (error) {
      console.error('Erreur lors de l\'appel à l\'API OpenPipe:', error);
      return this.generateMockResponse(context, userMessage);
    }
  }

  private buildNegotiationSystemPrompt(context: NegotiationContext): string {
    return `Tu es un expert en négociation M&A qui assiste un acheteur dans ses négociations d'acquisition. 

CONTEXTE DE LA NÉGOCIATION:
- Cible: ${context.target.name} (${context.target.sector})
- Chiffre d'affaires: ${(context.target.revenue / 1000000).toFixed(1)}M€
- EBITDA: ${(context.target.ebitda / 1000).toFixed(0)}k€
- Prix demandé: ${(context.deal.asking_price / 1000000).toFixed(1)}M€
- Phase actuelle: ${context.phase.name} - ${context.phase.description}
- Contexte du deal: ${context.deal.context}

OBJECTIFS DE LA PHASE ACTUELLE:
${context.phase.objectives.map(obj => `- ${obj}`).join('\n')}

STRATÉGIES DISPONIBLES:
${context.strategies.map(strategy => `- ${strategy.name}: ${strategy.description}`).join('\n')}

MÉTRIQUES ACTUELLES:
- Score global: ${context.metrics.overall_score}/100
- Santé de la relation: ${context.metrics.relationship_health}%
- Momentum: ${context.metrics.momentum}
- Niveau de risque: ${context.metrics.risk_level}

INSTRUCTIONS:
1. Analyse la situation avec expertise M&A
2. Fournis des conseils stratégiques spécifiques et actionnables
3. Propose des tactiques concrètes de négociation
4. Anticipe les objections et propose des contre-arguments
5. Maintiens un ton professionnel mais accessible
6. Suggère des stratégies adaptées à la phase actuelle
7. Si pertinent, propose des simulations de dialogue
8. Tiens compte des métriques pour ajuster tes recommandations

Tu dois toujours répondre en français et être orienté action.`;
  }

  private buildConversationHistory(context: NegotiationContext) {
    return context.conversation_history.slice(-10).map(msg => ({
      role: msg.role as 'user' | 'assistant',
      content: msg.content
    }));
  }

  private extractStrategySuggestions(
    response: string, 
    context: NegotiationContext
  ): StrategyRecommendation[] {
    // Logique d'extraction des stratégies basée sur le contenu de la réponse
    // Pour le développement, on retourne des suggestions pertinentes
    const suggestions: StrategyRecommendation[] = [];

    // Analyse du contenu pour identifier les stratégies mentionnées
    context.strategies.forEach(strategy => {
      if (response.toLowerCase().includes(strategy.name.toLowerCase()) ||
          response.toLowerCase().includes('question') && strategy.id === 'strategy-questioning' ||
          response.toLowerCase().includes('prix') && strategy.id === 'strategy-anchoring') {
        
        suggestions.push({
          strategy_id: strategy.id,
          relevance_score: Math.random() * 0.3 + 0.7, // Score entre 0.7 et 1
          reasoning: `Cette stratégie est recommandée pour la situation actuelle dans la phase ${context.phase.name}`
        });
      }
    });

    return suggestions.slice(0, 2); // Max 2 suggestions par réponse
  }

  private analyzeSentiment(response: string): 'positive' | 'neutral' | 'negative' {
    const positiveWords = ['succès', 'opportunité', 'excellent', 'optimal', 'réussite'];
    const negativeWords = ['risque', 'problème', 'difficile', 'blocage', 'échec'];
    
    const positiveCount = positiveWords.filter(word => 
      response.toLowerCase().includes(word)
    ).length;
    
    const negativeCount = negativeWords.filter(word => 
      response.toLowerCase().includes(word)
    ).length;

    if (positiveCount > negativeCount) return 'positive';
    if (negativeCount > positiveCount) return 'negative';
    return 'neutral';
  }

  private generateMockResponse(
    context: NegotiationContext, 
    userMessage: string
  ): NegotiationMessage {
    const mockResponses = [
      `Excellente question ! Concernant ${context.target.name}, je recommande une approche en 3 étapes basée sur votre position actuelle dans la phase "${context.phase.name}". Cette stratégie vous permettra de maximiser vos chances de succès tout en préservant la relation.`,
      
      `Analysons cette situation. Avec un EBITDA de ${(context.target.ebitda / 1000).toFixed(0)}k€ et un prix demandé de ${(context.deal.asking_price / 1000000).toFixed(1)}M€, nous avons plusieurs leviers de négociation. Voici mon approche recommandée...`,
      
      `Je comprends votre préoccupation. Dans ce type de négociation M&A, il est crucial de maintenir l'équilibre entre fermeté sur les points essentiels et flexibilité sur les aspects secondaires. Voici une tactique éprouvée...`,
      
      `Basé sur les métriques actuelles (score global: ${context.metrics.overall_score}/100), cette approche devrait vous permettre d'améliorer votre position. Concentrons-nous sur les objectifs clés de cette phase.`
    ];

    const randomResponse = mockResponses[Math.floor(Math.random() * mockResponses.length)];

    return {
      id: `msg-${Date.now()}-mock`,
      role: 'assistant',
      content: randomResponse,
      timestamp: new Date().toISOString(),
      phase_id: context.phase.id,
      strategy_suggestions: [
        {
          strategy_id: context.strategies[0]?.id || 'strategy-questioning',
          relevance_score: 0.82,
          reasoning: 'Cette stratégie est particulièrement adaptée à votre situation actuelle'
        }
      ],
      sentiment: 'positive',
      confidence_score: 0.88
    };
  }

  public async analyzeNegotiationProgress(context: NegotiationContext) {
    // Analyse des métriques et recommandations d'amélioration
    return {
      overall_assessment: 'positive',
      key_insights: [
        'La relation avec le vendeur est saine',
        'Le momentum est favorable',
        'Attention aux concessions asymétriques'
      ],
      next_actions: [
        'Préparer la prochaine session de négociation',
        'Analyser les comparables du marché',
        'Définir les points non-négociables'
      ]
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
      'openpipe:custom-negotiation-model' // Modèle fine-tuné potentiel
    ];
  }
}

// Export de l'instance singleton
export const negotiationAI = NegotiationAIService.getInstance();