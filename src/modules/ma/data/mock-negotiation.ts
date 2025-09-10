import { NegotiationPhase, Strategy, NegotiationMessage, NegotiationContext, NegotiationMetrics, Target, Deal } from '../types';

export const mockTarget: Target = {
  id: 'target-001',
  name: 'TechFlow Solutions',
  sector: 'SaaS B2B',
  location: 'Paris, France',
  revenue: 2400000,
  ebitda: 720000,
  employees: 35,
  founded: '2018',
  description: 'Plateforme de gestion de workflow pour PME avec forte croissance récurrente',
  financial_health: 'excellent',
  market_position: 'challenger',
  created_at: '2024-01-15T10:00:00Z'
};

export const mockDeal: Deal = {
  id: 'deal-001',
  target_id: 'target-001',
  perimeter: 100,
  context: 'Acquisition stratégique pour expansion géographique',
  asking_price: 8000000,
  timeline: '6 mois',
  status: 'négociation',
  created_at: '2024-01-15T10:00:00Z'
};

export const negotiationPhases: NegotiationPhase[] = [
  {
    id: 'phase-1',
    name: 'Ouverture & Cadrage',
    description: 'Établir le cadre de négociation et créer la relation',
    objectives: [
      'Établir une relation de confiance',
      'Définir les paramètres de négociation',
      'Comprendre les motivations du vendeur'
    ],
    key_tactics: [
      'Écoute active',
      'Questions ouvertes',
      'Création de rapport'
    ],
    success_metrics: [
      'Qualité de la relation établie',
      'Informations obtenues sur les motivations',
      'Accord sur le processus de négociation'
    ]
  },
  {
    id: 'phase-2',
    name: 'Exploration & Valorisation',
    description: 'Négocier le prix et les conditions principales',
    objectives: [
      'Justifier votre valorisation',
      'Comprendre la flexibilité du vendeur',
      'Négocier les conditions clés'
    ],
    key_tactics: [
      'Ancrage de prix',
      'Justification par comparables',
      'Négociation par blocs'
    ],
    success_metrics: [
      'Écart de valorisation réduit',
      'Conditions favorables obtenues',
      'Maintien de la relation'
    ]
  },
  {
    id: 'phase-3',
    name: 'Structuration & Due Diligence',
    description: 'Finaliser la structure et gérer les découvertes DD',
    objectives: [
      'Structurer l\'opération',
      'Gérer les ajustements de prix',
      'Résoudre les points bloquants'
    ],
    key_tactics: [
      'Négociation conditionnelle',
      'Gestion des risques',
      'Solutions créatives'
    ],
    success_metrics: [
      'Structure optimale négociée',
      'Risques maîtrisés',
      'Ajustements acceptables'
    ]
  },
  {
    id: 'phase-4',
    name: 'Finalisation & Closing',
    description: 'Négocier les derniers points et finaliser l\'accord',
    objectives: [
      'Résoudre les derniers points',
      'Sécuriser les conditions',
      'Préparer le closing'
    ],
    key_tactics: [
      'Package final',
      'Concessions équilibrées',
      'Momentum de closing'
    ],
    success_metrics: [
      'Accord signé',
      'Conditions préservées',
      'Relation maintenue'
    ]
  }
];

export const negotiationStrategies: Strategy[] = [
  {
    id: 'strategy-anchoring',
    name: 'Ancrage de Prix',
    description: 'Établir un point de référence favorable dès le début',
    applicable_phases: ['phase-2'],
    pros: [
      'Influence la perception de valeur',
      'Donne une base de négociation',
      'Peut réduire les attentes du vendeur'
    ],
    cons: [
      'Risque de braquer si trop bas',
      'Peut créer des blocages',
      'Nécessite une justification solide'
    ],
    execution_tips: [
      'Commencer par une valorisation justifiée',
      'Utiliser des comparables du marché',
      'Rester ouvert à la discussion'
    ]
  },
  {
    id: 'strategy-questioning',
    name: 'Questionnement Strategique',
    description: 'Utiliser les questions pour découvrir les motivations et contraintes',
    applicable_phases: ['phase-1', 'phase-2', 'phase-3'],
    pros: [
      'Révèle les vraies motivations',
      'Identifie les points de flexibilité',
      'Maintient le contrôle de la conversation'
    ],
    cons: [
      'Peut paraître intrusif',
      'Demande du temps',
      'Risque de révéler vos propres contraintes'
    ],
    execution_tips: [
      'Préparer des questions ouvertes',
      'Écouter activement les réponses',
      'Creuser les points importants'
    ]
  },
  {
    id: 'strategy-package-deal',
    name: 'Négociation Globale',
    description: 'Négocier tous les éléments comme un ensemble cohérent',
    applicable_phases: ['phase-3', 'phase-4'],
    pros: [
      'Évite les concessions isolées',
      'Permet des compromis créatifs',
      'Facilite les arbitrages'
    ],
    cons: [
      'Plus complexe à gérer',
      'Peut retarder les accords partiels',
      'Nécessite une vision d\'ensemble'
    ],
    execution_tips: [
      'Identifier les éléments négociables',
      'Créer des packages équilibrés',
      'Présenter les bénéfices mutuels'
    ]
  },
  {
    id: 'strategy-contingent',
    name: 'Structuration Conditionnelle',
    description: 'Utiliser des conditions pour partager les risques',
    applicable_phases: ['phase-2', 'phase-3'],
    pros: [
      'Partage les risques',
      'Permet des accords créatifs',
      'Réduit les blocages sur le prix'
    ],
    cons: [
      'Complexité juridique',
      'Risques de disputes futures',
      'Difficile à valoriser'
    ],
    execution_tips: [
      'Identifier les incertitudes clés',
      'Proposer des mécanismes équitables',
      'Prévoir les modalités de résolution'
    ]
  }
];

export const mockNegotiationMessages: NegotiationMessage[] = [
  {
    id: 'msg-1',
    role: 'assistant',
    content: 'Bonjour ! Je suis votre assistant IA spécialisé en négociation M&A. Je vois que nous travaillons sur l\'acquisition de TechFlow Solutions. Pouvez-vous me dire où nous en sommes dans les négociations avec le vendeur ?',
    timestamp: '2024-01-20T09:00:00Z',
    phase_id: 'phase-1',
    sentiment: 'positive',
    confidence_score: 0.95
  },
  {
    id: 'msg-2',
    role: 'user',
    content: 'Nous avons eu une première rencontre la semaine dernière. Le vendeur demande 8M€ mais je pense que c\'est surévalué. Comment aborder la question du prix ?',
    timestamp: '2024-01-20T09:02:00Z',
    phase_id: 'phase-2',
    sentiment: 'neutral',
    confidence_score: 0.8
  },
  {
    id: 'msg-3',
    role: 'assistant',
    content: 'Excellente question ! Avec un EBITDA de 720k€, un prix de 8M€ représente un multiple de 11x, ce qui est effectivement élevé pour ce secteur. Je recommande une approche en 3 étapes :\n\n1. **Ancrage justifié** : Proposer 5,5-6M€ basé sur des comparables secteur (7-8x EBITDA)\n2. **Questionnement** : Explorer ses motivations de vente et urgence\n3. **Structuration** : Proposer une partie variable liée aux performances\n\nVoulez-vous que nous préparions ensemble votre argumentation ?',
    timestamp: '2024-01-20T09:05:00Z',
    phase_id: 'phase-2',
    strategy_suggestions: [
      {
        strategy_id: 'strategy-anchoring',
        relevance_score: 0.9,
        reasoning: 'Le prix demandé est 30% au-dessus du marché, un ancrage justifié est nécessaire'
      },
      {
        strategy_id: 'strategy-questioning',
        relevance_score: 0.8,
        reasoning: 'Comprendre les motivations aidera à identifier la flexibilité sur le prix'
      }
    ],
    sentiment: 'positive',
    confidence_score: 0.92
  },
  {
    id: 'msg-4',
    role: 'user',
    content: 'Oui, aidez-moi à préparer l\'argumentation. J\'ai peur qu\'il se braque si je propose trop bas d\'un coup.',
    timestamp: '2024-01-20T09:07:00Z',
    sentiment: 'neutral',
    confidence_score: 0.7
  },
  {
    id: 'msg-5',
    role: 'assistant',
    content: 'C\'est une préoccupation légitime. Voici une approche diplomatique :\n\n**Ouverture collaborative :** "J\'aimerais qu\'on trouve un terrain d\'entente qui fonctionne pour nous deux."\n\n**Présentation des données :** "En analysant les comparables du secteur SaaS B2B en France, les multiples sont généralement entre 7-8x l\'EBITDA..."\n\n**Ancrage justifié :** "Basé sur ces données et la qualité de votre entreprise, une valorisation de 5,8M€ me semble plus en ligne avec le marché."\n\n**Ouverture au dialogue :** "Qu\'est-ce qui justifie selon vous le premium par rapport au marché ?"\n\nCette approche montre du respect tout en étant ferme sur les faits. Prêt pour la simulation ?',
    timestamp: '2024-01-20T09:10:00Z',
    strategy_suggestions: [
      {
        strategy_id: 'strategy-questioning',
        relevance_score: 0.85,
        reasoning: 'La question finale permet de comprendre sa justification sans attaquer directement'
      }
    ],
    sentiment: 'positive',
    confidence_score: 0.88
  }
];

export const mockNegotiationMetrics: NegotiationMetrics = {
  overall_score: 78,
  phase_progress: 65,
  relationship_health: 82,
  concessions_made: [
    {
      id: 'conc-1',
      description: 'Accepté 6 mois de transition pour le dirigeant',
      value_impact: -50000,
      timestamp: '2024-01-18T14:30:00Z',
      context: 'Demande importante pour assurer la continuité'
    }
  ],
  concessions_gained: [
    {
      id: 'conc-2',
      description: 'Garantie de chiffre d\'affaires 12 mois',
      value_impact: 200000,
      timestamp: '2024-01-19T11:15:00Z',
      context: 'Réduction du risque sur les projections'
    }
  ],
  risk_level: 'medium',
  momentum: 'positive'
};

export const mockNegotiationContext: NegotiationContext = {
  deal: mockDeal,
  target: mockTarget,
  phase: negotiationPhases[1], // Phase 2 - Exploration & Valorisation
  strategies: negotiationStrategies,
  metrics: mockNegotiationMetrics,
  conversation_history: mockNegotiationMessages
};