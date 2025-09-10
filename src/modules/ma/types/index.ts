export interface Target {
  id: string;
  name: string;
  sector: string;
  location: string;
  revenue: number;
  ebitda: number;
  employees: number;
  founded: string;
  description: string;
  financial_health?: 'excellent' | 'good' | 'average' | 'challenging';
  market_position?: 'leader' | 'challenger' | 'niche' | 'emerging';
  created_at: string;
}

export interface Deal {
  id: string;
  target_id: string;
  perimeter: number;
  context: string;
  asking_price: number;
  timeline: string;
  status: string;
  created_at: string;
}

export interface DealModule {
  id: string;
  deal_id: string;
  code: 'M1' | 'M2' | 'M3' | 'M4';
  title: string;
  description: string;
  state: 'locked' | 'in_progress' | 'done';
  progress: number;
  created_at: string;
}

export interface Message {
  id: string;
  deal_module_id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  metadata: Record<string, any>;
  created_at: string;
}

export interface Artifact {
  id: string;
  deal_module_id: string;
  type: 'checklist' | 'template' | 'matrix' | 'document' | 'plan';
  title: string;
  content: Record<string, any>;
  created_at: string;
}

export interface Task {
  id: string;
  deal_module_id: string;
  title: string;
  description: string;
  status: 'pending' | 'in_progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  due_date?: string;
  assigned_to?: string;
  created_at: string;
}

// Types spécifiques aux modules
export interface M1Context {
  credibility_score: number;
  pitch_profile: string;
  strategic_angle: string;
  funding_proof: string;
  agenda: string;
  contact_templates: {
    first_contact: string;
    follow_up: string;
  };
}

export interface M2Context {
  valuation: number;
  price_per_share: number;
  earn_out_terms: string;
  warranties: string[];
  timeline: string;
  term_sheet: string;
  concessions: string[];
  give_get_matrix: Record<string, any>;
}

export interface M3Context {
  dd_financial: boolean;
  dd_legal: boolean;
  dd_social: boolean;
  dd_it: boolean;
  issues: Array<{
    description: string;
    impact: 'low' | 'medium' | 'high';
    probability: 'low' | 'medium' | 'high';
    mitigation: string;
  }>;
  renegotiation_strategy: string;
  price_adjustments: number;
}

export interface M4Context {
  final_points: Array<{
    description: string;
    position_a: string;
    position_b: string;
    compromise: string;
  }>;
  closing_checklist: string[];
  deal_summary: string;
  concessions_log: Array<{
    date: string;
    description: string;
    value: string;
  }>;
}

// Types pour l'agent de négociation
export interface NegotiationContext {
  deal: Deal;
  target: Target;
  phase: NegotiationPhase;
  strategies: Strategy[];
  metrics: NegotiationMetrics;
  conversation_history: NegotiationMessage[];
}

export interface NegotiationPhase {
  id: string;
  name: string;
  description: string;
  objectives: string[];
  key_tactics: string[];
  success_metrics: string[];
}

export interface Strategy {
  id: string;
  name: string;
  description: string;
  applicable_phases: string[];
  pros: string[];
  cons: string[];
  execution_tips: string[];
}

export interface NegotiationMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  phase_id?: string;
  strategy_suggestions?: StrategyRecommendation[];
  sentiment?: 'positive' | 'neutral' | 'negative';
  confidence_score?: number;
}

export interface StrategyRecommendation {
  strategy_id: string;
  relevance_score: number;
  reasoning: string;
  suggested_response?: string;
}

export interface NegotiationMetrics {
  overall_score: number;
  phase_progress: number;
  relationship_health: number;
  concessions_made: ConcessionItem[];
  concessions_gained: ConcessionItem[];
  risk_level: 'low' | 'medium' | 'high';
  momentum: 'positive' | 'stagnant' | 'negative';
}

export interface ConcessionItem {
  id: string;
  description: string;
  value_impact: number;
  timestamp: string;
  context: string;
}

export interface NegotiationSession {
  id: string;
  deal_id: string;
  started_at: string;
  ended_at?: string;
  status: 'active' | 'paused' | 'completed';
  messages: NegotiationMessage[];
  context: NegotiationContext;
  outcomes: SessionOutcome[];
}

export interface SessionOutcome {
  id: string;
  type: 'agreement' | 'objection' | 'concession' | 'milestone';
  description: string;
  impact_score: number;
  timestamp: string;
}

// Types pour le Chatbot TGIM avec RAG
export interface TGIMDocument {
  id: string;
  title: string;
  content: string;
  category: 'guide' | 'formation' | 'template' | 'checklist' | 'case_study' | 'tool';
  tags: string[];
  embedding?: number[];
  url?: string;
  author?: string;
  created_at: string;
  updated_at: string;
  difficulty_level: 'beginner' | 'intermediate' | 'advanced';
  estimated_read_time: number;
  related_modules?: ('M1' | 'M2' | 'M3' | 'M4')[];
}

export interface TGIMChatMessage {
  id: string;
  session_id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  sources?: DocumentSource[];
  confidence_score?: number;
  follow_up_questions?: string[];
  search_query?: string;
  response_time_ms?: number;
}

export interface RAGResponse {
  answer: string;
  sources: DocumentSource[];
  confidence: number;
  search_query: string;
  follow_up_questions: string[];
  related_topics: string[];
  response_metadata: {
    documents_searched: number;
    processing_time_ms: number;
    model_used: string;
    search_strategy: 'semantic' | 'keyword' | 'hybrid';
  };
}

export interface DocumentSource {
  document: TGIMDocument;
  relevance_score: number;
  excerpt: string;
  highlighted_terms: string[];
  section?: string;
  page_number?: number;
}

export interface TGIMChatSession {
  id: string;
  user_id: string;
  started_at: string;
  ended_at?: string;
  status: 'active' | 'paused' | 'completed';
  messages: TGIMChatMessage[];
  context: TGIMSessionContext;
  stats: SessionStats;
}

export interface TGIMSessionContext {
  user_profile: {
    experience_level: 'beginner' | 'intermediate' | 'advanced';
    areas_of_interest: string[];
    current_project_phase?: 'prospection' | 'negociation' | 'due_diligence' | 'closing';
    industry_focus?: string;
  };
  conversation_summary: string;
  key_topics_discussed: string[];
  documents_referenced: string[];
  learning_objectives?: string[];
}

export interface SessionStats {
  message_count: number;
  documents_consulted: number;
  topics_covered: string[];
  avg_confidence_score: number;
  total_response_time_ms: number;
  user_satisfaction?: number;
}

export interface SearchQuery {
  query: string;
  filters?: {
    categories?: TGIMDocument['category'][];
    tags?: string[];
    difficulty_level?: TGIMDocument['difficulty_level'][];
    modules?: ('M1' | 'M2' | 'M3' | 'M4')[];
  };
  search_options: {
    max_results: number;
    min_relevance_score: number;
    strategy: 'semantic' | 'keyword' | 'hybrid';
  };
}

export interface KnowledgeBaseStats {
  total_documents: number;
  documents_by_category: Record<TGIMDocument['category'], number>;
  total_content_length: number;
  avg_document_length: number;
  most_popular_tags: Array<{ tag: string; count: number }>;
  last_updated: string;
}



