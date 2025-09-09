

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  Send, 
  Lightbulb, 
  TrendingUp, 
  Users, 
  Clock,
  CheckCircle,
  MessageCircle
} from 'lucide-react';
import { 
  mockNegotiationContext, 
  mockNegotiationMessages, 
  negotiationStrategies 
} from '../data/mock-negotiation';
import { NegotiationMessage } from '../types';

export function NegociatorComponent() {
  const [messages, setMessages] = useState<NegotiationMessage[]>(mockNegotiationMessages);
  const [currentMessage, setCurrentMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = () => {
    if (!currentMessage.trim()) return;

    const newUserMessage: NegotiationMessage = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: currentMessage,
      timestamp: new Date().toISOString(),
      sentiment: 'neutral',
      confidence_score: 0.8
    };

    setMessages(prev => [...prev, newUserMessage]);
    setCurrentMessage('');
    setIsTyping(true);

    // Simuler une réponse de l'IA après 2 secondes
    setTimeout(() => {
      const aiResponse: NegotiationMessage = {
        id: `msg-${Date.now()}-ai`,
        role: 'assistant',
        content: `Je comprends votre point. Basé sur le contexte de négociation avec ${mockNegotiationContext.target.name}, voici ma recommandation : Cette approche vous permettra de maintenir une position forte tout en préservant la relation. Voulez-vous que nous simulions cette conversation ?`,
        timestamp: new Date().toISOString(),
        strategy_suggestions: [
          {
            strategy_id: 'strategy-questioning',
            relevance_score: 0.85,
            reasoning: 'Cette stratégie vous aidera à découvrir les motivations cachées'
          }
        ],
        sentiment: 'positive',
        confidence_score: 0.88
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 2000);
  };

  const MessageBubble = ({ message }: { message: NegotiationMessage }) => (
    <div className={`flex gap-3 mb-4 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
      {message.role === 'assistant' && (
        <Avatar className="w-8 h-8">
          <AvatarFallback className="bg-blue-500 text-white text-xs">IA</AvatarFallback>
        </Avatar>
      )}
      
      <div className={`max-w-[70%] ${message.role === 'user' ? 'order-1' : 'order-2'}`}>
        <div className={`p-3 rounded-lg ${
          message.role === 'user' 
            ? 'bg-blue-500 text-white' 
            : 'bg-gray-100 text-gray-900 border'
        }`}>
          <p className="text-sm whitespace-pre-wrap">{message.content}</p>
        </div>
        
        {message.strategy_suggestions && message.strategy_suggestions.length > 0 && (
          <div className="mt-2 space-y-2">
            {message.strategy_suggestions.map((suggestion, idx) => (
              <Card key={idx} className="border-l-4 border-l-yellow-400">
                <CardContent className="p-3">
                  <div className="flex items-start gap-2">
                    <Lightbulb className="w-4 h-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="text-xs font-medium text-gray-900">
                        Stratégie recommandée
                      </p>
                      <p className="text-xs text-gray-600 mt-1">
                        {suggestion.reasoning}
                      </p>
                      <Badge variant="secondary" className="mt-2 text-xs">
                        Pertinence: {Math.round(suggestion.relevance_score * 100)}%
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
        
        <p className="text-xs text-gray-500 mt-1">
          {new Date(message.timestamp).toLocaleTimeString('fr-FR', { 
            hour: '2-digit', 
            minute: '2-digit' 
          })}
        </p>
      </div>
      
      {message.role === 'user' && (
        <Avatar className="w-8 h-8 order-2">
          <AvatarFallback className="bg-gray-500 text-white text-xs">U</AvatarFallback>
        </Avatar>
      )}
    </div>
  );

  return (
    <div className="h-screen flex bg-gray-50">
      {/* Panel de contexte */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b">
          <h2 className="font-semibold text-lg">Contexte de Négociation</h2>
        </div>
        
        <ScrollArea className="flex-1 p-4">
          {/* Informations sur la cible */}
          <Card className="mb-4">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <Users className="w-4 h-4" />
                {mockNegotiationContext.target.name}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-gray-600">Secteur:</span>
                <span className="font-medium">{mockNegotiationContext.target.sector}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-600">CA:</span>
                <span className="font-medium">
                  {(mockNegotiationContext.target.revenue / 1000000).toFixed(1)}M€
                </span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-600">EBITDA:</span>
                <span className="font-medium">
                  {(mockNegotiationContext.target.ebitda / 1000).toFixed(0)}k€
                </span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-600">Prix demandé:</span>
                <span className="font-medium text-red-600">
                  {(mockNegotiationContext.deal.asking_price / 1000000).toFixed(1)}M€
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Phase actuelle */}
          <Card className="mb-4">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Phase Actuelle
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Badge variant="outline" className="w-full justify-center">
                  {mockNegotiationContext.phase.name}
                </Badge>
                <p className="text-xs text-gray-600">
                  {mockNegotiationContext.phase.description}
                </p>
                <Progress value={mockNegotiationContext.metrics.phase_progress} className="h-2" />
                <p className="text-xs text-center text-gray-500">
                  {mockNegotiationContext.metrics.phase_progress}% complété
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Métriques */}
          <Card className="mb-4">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                Métriques de Négociation
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-600">Score Global</span>
                <Badge variant={
                  mockNegotiationContext.metrics.overall_score > 75 ? "default" : 
                  mockNegotiationContext.metrics.overall_score > 50 ? "secondary" : "destructive"
                }>
                  {mockNegotiationContext.metrics.overall_score}/100
                </Badge>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-600">Santé Relation</span>
                <div className="flex items-center gap-1">
                  <CheckCircle className="w-3 h-3 text-green-500" />
                  <span className="text-xs">{mockNegotiationContext.metrics.relationship_health}%</span>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-600">Momentum</span>
                <Badge variant="outline" className={
                  mockNegotiationContext.metrics.momentum === 'positive' ? 'border-green-500 text-green-700' :
                  mockNegotiationContext.metrics.momentum === 'negative' ? 'border-red-500 text-red-700' :
                  'border-gray-500 text-gray-700'
                }>
                  {mockNegotiationContext.metrics.momentum === 'positive' ? 'Positif' :
                   mockNegotiationContext.metrics.momentum === 'negative' ? 'Négatif' : 'Stagnant'}
                </Badge>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-600">Niveau de Risque</span>
                <Badge variant={
                  mockNegotiationContext.metrics.risk_level === 'low' ? "default" : 
                  mockNegotiationContext.metrics.risk_level === 'medium' ? "secondary" : "destructive"
                }>
                  {mockNegotiationContext.metrics.risk_level === 'low' ? 'Faible' :
                   mockNegotiationContext.metrics.risk_level === 'medium' ? 'Moyen' : 'Élevé'}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Stratégies recommandées */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <Lightbulb className="w-4 h-4" />
                Stratégies Disponibles
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {negotiationStrategies.slice(0, 3).map((strategy) => (
                  <div key={strategy.id} className="p-2 border rounded-lg hover:bg-gray-50 cursor-pointer">
                    <p className="text-xs font-medium">{strategy.name}</p>
                    <p className="text-xs text-gray-600 mt-1">{strategy.description}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </ScrollArea>
      </div>

      {/* Zone de chat */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="p-4 bg-white border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-semibold text-lg flex items-center gap-2">
                <MessageCircle className="w-5 h-5" />
                Agent IA de Négociation M&A
              </h1>
              <p className="text-sm text-gray-600">
                Assistant spécialisé pour vos négociations d'acquisition
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="border-green-500 text-green-700">
                En ligne
              </Badge>
            </div>
          </div>
        </div>

        {/* Messages */}
        <ScrollArea ref={scrollAreaRef} className="flex-1 p-4">
          <div className="max-w-4xl mx-auto">
            {messages.map((message) => (
              <MessageBubble key={message.id} message={message} />
            ))}
            
            {isTyping && (
              <div className="flex gap-3 mb-4">
                <Avatar className="w-8 h-8">
                  <AvatarFallback className="bg-blue-500 text-white text-xs">IA</AvatarFallback>
                </Avatar>
                <div className="bg-gray-100 border p-3 rounded-lg">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Zone de saisie */}
        <div className="p-4 bg-white border-t border-gray-200">
          <div className="max-w-4xl mx-auto">
            <div className="flex gap-2">
              <Textarea
                value={currentMessage}
                onChange={(e) => setCurrentMessage(e.target.value)}
                placeholder="Décrivez votre situation de négociation ou posez une question..."
                className="min-h-[44px] resize-none"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    sendMessage();
                  }
                }}
              />
              <Button
                onClick={sendMessage}
                disabled={!currentMessage.trim() || isTyping}
                size="icon"
                className="h-11 w-11 flex-shrink-0"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Appuyez sur Entrée pour envoyer, Maj+Entrée pour une nouvelle ligne
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
