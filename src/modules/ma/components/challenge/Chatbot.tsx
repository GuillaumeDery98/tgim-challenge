

import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2, BookOpen, Search, Clock, Award, ExternalLink, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useTGIMChatbot, useTGIMChatMessages, useTGIMSessionContext } from '../../hooks/useTGIMChatbot';
import { TGIMChatMessage, DocumentSource, TGIMDocument } from '../../types';

// Composant pour afficher un message avec ses sources
function MessageWithSources({ message }: { message: TGIMChatMessage }) {
  const [showSources, setShowSources] = useState(false);

  const formatMessage = (content: string) => {
    return content
      .split('\n')
      .map((line, index) => {
        if (line.startsWith('**') && line.endsWith('**')) {
          return (
            <div key={index} className="font-semibold text-primary mb-2">
              {line.slice(2, -2)}
            </div>
          );
        }
        if (line.startsWith('• ')) {
          return (
            <div key={index} className="flex items-start gap-2 mb-1">
              <span className="text-primary mt-1">•</span>
              <span>{line.slice(2)}</span>
            </div>
          );
        }
        if (line.trim() === '') {
          return <br key={index} />;
        }
        return (
          <div key={index} className="mb-2">
            {line}
          </div>
        );
      });
  };

  return (
    <div className="space-y-2">
      <div className="text-sm leading-relaxed">
        {formatMessage(message.content)}
      </div>
      
      {/* Sources et métadonnées */}
      {message.sources && message.sources.length > 0 && (
        <div className="mt-3 pt-3 border-t border-muted">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowSources(!showSources)}
            className="text-xs text-muted-foreground hover:text-foreground p-0 h-auto"
          >
            <BookOpen className="w-3 h-3 mr-1" />
            {message.sources.length} source{message.sources.length > 1 ? 's' : ''} TGIM
            {showSources ? <ChevronUp className="w-3 h-3 ml-1" /> : <ChevronDown className="w-3 h-3 ml-1" />}
          </Button>
          
          {showSources && (
            <div className="mt-2 space-y-2">
              {message.sources.map((source, index) => (
                <div key={index} className="text-xs bg-muted/50 rounded-md p-2 border-l-2 border-primary/30">
                  <div className="font-medium text-foreground">{source.document.title}</div>
                  <div className="text-muted-foreground mt-1 line-clamp-2">{source.excerpt}</div>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant="secondary" className="text-xs">
                      {source.document.category}
                    </Badge>
                    <span className="text-muted-foreground">•</span>
                    <span className="text-muted-foreground">
                      Pertinence: {(source.relevance_score * 100).toFixed(0)}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
      
      {/* Questions de suivi */}
      {message.follow_up_questions && message.follow_up_questions.length > 0 && (
        <div className="mt-3 pt-3 border-t border-muted">
          <div className="text-xs text-muted-foreground mb-2">Questions suggérées :</div>
          <div className="flex flex-wrap gap-2">
            {message.follow_up_questions.map((question, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                className="text-xs h-7 px-2"
                onClick={() => {
                  // Cette fonction sera connectée au parent pour envoyer la question
                  const event = new CustomEvent('followUpQuestion', { detail: question });
                  window.dispatchEvent(event);
                }}
              >
                {question}
              </Button>
            ))}
          </div>
        </div>
      )}
      
      {/* Métadonnées */}
      <div className="flex items-center gap-2 text-xs text-muted-foreground mt-2">
        <Clock className="w-3 h-3" />
        {message.timestamp ? new Date(message.timestamp).toLocaleTimeString('fr-FR', { 
          hour: '2-digit', 
          minute: '2-digit' 
        }) : ''}
        {message.confidence_score && (
          <>
            <span>•</span>
            <span>Confiance: {(message.confidence_score * 100).toFixed(0)}%</span>
          </>
        )}
        {message.response_time_ms && (
          <>
            <span>•</span>
            <span>{message.response_time_ms}ms</span>
          </>
        )}
      </div>
    </div>
  );
}

// Composant pour le panel des sources et documents
function KnowledgePanel({ knowledgeStats, recommendedDocuments, searchResults }: {
  knowledgeStats: any;
  recommendedDocuments: TGIMDocument[];
  searchResults?: DocumentSource[];
}) {
  return (
    <div className="w-80 border-l bg-muted/30">
      <div className="p-4 border-b">
        <h3 className="font-semibold flex items-center gap-2">
          <BookOpen className="w-4 h-4" />
          Base de connaissances TGIM
        </h3>
        <p className="text-sm text-muted-foreground mt-1">
          {knowledgeStats?.total_documents || 0} documents disponibles
        </p>
      </div>
      
      <Tabs defaultValue="recommended" className="flex-1">
        <TabsList className="grid w-full grid-cols-2 m-4 mb-2">
          <TabsTrigger value="recommended" className="text-xs">Recommandés</TabsTrigger>
          <TabsTrigger value="search" className="text-xs">Recherche</TabsTrigger>
        </TabsList>
        
        <TabsContent value="recommended" className="px-4 pb-4">
          <ScrollArea className="h-96">
            <div className="space-y-3">
              {recommendedDocuments.map((doc) => (
                <Card key={doc.id} className="p-3 hover:bg-muted/50 transition-colors cursor-pointer">
                  <div className="space-y-2">
                    <div className="flex items-start justify-between">
                      <h4 className="font-medium text-sm line-clamp-2">{doc.title}</h4>
                      <ExternalLink className="w-3 h-3 text-muted-foreground flex-shrink-0" />
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="text-xs">
                        {doc.category}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {doc.difficulty_level}
                      </Badge>
                    </div>
                    
                    <div className="text-xs text-muted-foreground">
                      <Clock className="w-3 h-3 inline mr-1" />
                      {doc.estimated_read_time} min
                    </div>
                    
                    {doc.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {doc.tags.slice(0, 3).map((tag, tagIndex) => (
                          <span key={tagIndex} className="text-xs text-muted-foreground bg-muted rounded px-1">
                            #{tag}
                          </span>
                        ))}
                        {doc.tags.length > 3 && (
                          <span className="text-xs text-muted-foreground">+{doc.tags.length - 3}</span>
                        )}
                      </div>
                    )}
                  </div>
                </Card>
              ))}
              
              {recommendedDocuments.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <BookOpen className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">Aucun document recommandé</p>
                  <p className="text-xs mt-1">Commencez une conversation pour voir des suggestions</p>
                </div>
              )}
            </div>
          </ScrollArea>
        </TabsContent>
        
        <TabsContent value="search" className="px-4 pb-4">
          <ScrollArea className="h-96">
            <div className="space-y-3">
              {searchResults && searchResults.length > 0 ? (
                searchResults.map((result, index) => (
                  <Card key={index} className="p-3 hover:bg-muted/50 transition-colors cursor-pointer">
                    <div className="space-y-2">
                      <div className="flex items-start justify-between">
                        <h4 className="font-medium text-sm line-clamp-2">{result.document.title}</h4>
                        <div className="text-xs text-muted-foreground flex items-center">
                          <Award className="w-3 h-3 mr-1" />
                          {(result.relevance_score * 100).toFixed(0)}%
                        </div>
                      </div>
                      
                      <p className="text-xs text-muted-foreground line-clamp-3">{result.excerpt}</p>
                      
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="text-xs">
                          {result.document.category}
                        </Badge>
                        {result.highlighted_terms.length > 0 && (
                          <div className="flex gap-1">
                            {result.highlighted_terms.slice(0, 2).map((term, termIndex) => (
                              <span key={termIndex} className="text-xs bg-primary/10 text-primary rounded px-1">
                                {term}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </Card>
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Search className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">Aucun résultat de recherche</p>
                  <p className="text-xs mt-1">Les résultats apparaîtront lors de vos conversations</p>
                </div>
              )}
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export function Chatbot() {
  const [inputValue, setInputValue] = useState('');
  const [sessionId] = useState(() => `session-${Date.now()}`);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  // Hooks pour la gestion du chatbot
  const { getMessages, addMessage } = useTGIMChatMessages(sessionId);
  const {
    sendMessage,
    isChatting,
    chatError,
    recommendedDocuments,
    knowledgeStats,
    searchResults
  } = useTGIMChatbot({
    sessionId,
    sessionContext: {
      user_profile: {
        experience_level: 'intermediate',
        areas_of_interest: ['reprise-entreprise', 'négociation', 'financement'],
        current_project_phase: 'prospection'
      },
      conversation_summary: '',
      key_topics_discussed: [],
      documents_referenced: []
    },
    onMessageReceived: (response) => {
      console.log('Nouvelle réponse reçue:', response);
    },
    onError: (error) => {
      console.error('Erreur chatbot:', error);
    }
  });
  
  const messages = getMessages();
  
  // Auto-scroll vers le bas
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  // Focus sur l'input au montage
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);
  
  // Écouter les questions de suivi
  useEffect(() => {
    const handleFollowUpQuestion = (event: CustomEvent) => {
      setInputValue(event.detail);
      if (inputRef.current) {
        inputRef.current.focus();
      }
    };
    
    window.addEventListener('followUpQuestion', handleFollowUpQuestion as EventListener);
    return () => {
      window.removeEventListener('followUpQuestion', handleFollowUpQuestion as EventListener);
    };
  }, []);
  
  const handleSendMessage = async () => {
    if (!inputValue.trim() || isChatting) return;
    
    const userMessage: TGIMChatMessage = {
      id: `msg-${Date.now()}-user`,
      session_id: sessionId,
      role: 'user',
      content: inputValue.trim(),
      timestamp: new Date().toISOString(),
      search_query: inputValue.trim()
    };
    
    // Ajouter le message utilisateur immédiatement
    addMessage(userMessage);
    
    const query = inputValue.trim();
    setInputValue('');
    
    // Envoyer le message au service RAG
    sendMessage(query);
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  
  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* En-tête */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
          Chatbot IA TGIM - Challenge Module 2
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Assistant IA spécialisé dans la reprise d'entreprise. Posez vos questions sur la méthodologie TGIM, 
          les techniques de négociation, la valorisation, la due diligence et plus encore.
        </p>
        <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <BookOpen className="w-4 h-4" />
            <span>{knowledgeStats?.total_documents || 12} documents</span>
          </div>
          <div className="flex items-center gap-1">
            <Award className="w-4 h-4" />
            <span>Méthode TGIM</span>
          </div>
          <div className="flex items-center gap-1">
            <Bot className="w-4 h-4" />
            <span>RAG Langchain</span>
          </div>
        </div>
      </div>
      
      {/* Interface principale */}
      <div className="flex gap-6 h-[700px]">
        {/* Zone de chat */}
        <Card className="flex-1 flex flex-col">
          <CardHeader className="bg-gradient-to-r from-primary/5 to-primary/10 border-b">
            <div className="flex items-center gap-3">
              <Avatar className="h-8 w-8">
                <AvatarImage 
                  src="https://qvvqpirarindpxmxetap.supabase.co/storage/v1/object/public/Logo//TGIM%20900x300%20(1).png"
                  alt="TGIM Assistant"
                />
                <AvatarFallback className="bg-primary text-primary-foreground">
                  <Bot className="h-4 w-4" />
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-semibold">Assistant TGIM</h3>
                <p className="text-sm text-muted-foreground">Expert en reprise d'entreprise</p>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="flex-1 flex flex-col p-0">
            {/* Messages */}
            <ScrollArea className="flex-1 p-6">
              <div className="space-y-6">
                {/* Message de bienvenue */}
                {messages.length === 0 && (
                  <div className="flex gap-4">
                    <Avatar className="h-8 w-8 flex-shrink-0">
                      <AvatarImage 
                        src="https://qvvqpirarindpxmxetap.supabase.co/storage/v1/object/public/Logo//TGIM%20900x300%20(1).png"
                        alt="TGIM Assistant"
                      />
                      <AvatarFallback className="bg-primary/10 text-primary">
                        <Bot className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="bg-muted rounded-lg px-4 py-3 max-w-[80%]">
                      <div className="text-sm leading-relaxed">
                        <div className="font-semibold text-primary mb-2">🎯 Bienvenue dans le Module 2 du Challenge TGIM !</div>
                        <div className="mb-2">
                          Je suis votre assistant IA spécialisé en reprise d'entreprise. Je peux vous aider sur :
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-start gap-2">
                            <span className="text-primary mt-1">•</span>
                            <span>La méthodologie TGIM (Modules M1 à M4)</span>
                          </div>
                          <div className="flex items-start gap-2">
                            <span className="text-primary mt-1">•</span>
                            <span>Les techniques de négociation et valorisation</span>
                          </div>
                          <div className="flex items-start gap-2">
                            <span className="text-primary mt-1">•</span>
                            <span>La due diligence et les audits d'acquisition</span>
                          </div>
                          <div className="flex items-start gap-2">
                            <span className="text-primary mt-1">•</span>
                            <span>Le financement et la structuration d'opérations</span>
                          </div>
                        </div>
                        <div className="mt-3 text-sm text-muted-foreground italic">
                          Posez-moi une question pour commencer ! Par exemple : "Comment évaluer une entreprise ?" ou "Qu'est-ce que la méthode TGIM ?"
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Messages de conversation */}
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex gap-4 ${
                      message.role === 'user' ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    {message.role === 'assistant' && (
                      <Avatar className="h-8 w-8 flex-shrink-0">
                        <AvatarImage 
                          src="https://qvvqpirarindpxmxetap.supabase.co/storage/v1/object/public/Logo//TGIM%20900x300%20(1).png"
                          alt="TGIM Assistant"
                        />
                        <AvatarFallback className="bg-primary/10 text-primary">
                          <Bot className="h-4 w-4" />
                        </AvatarFallback>
                      </Avatar>
                    )}
                    
                    <div
                      className={`max-w-[80%] rounded-lg px-4 py-3 ${
                        message.role === 'user'
                          ? 'bg-primary text-primary-foreground ml-auto'
                          : 'bg-muted'
                      }`}
                    >
                      {message.role === 'assistant' ? (
                        <MessageWithSources message={message} />
                      ) : (
                        <div className="text-sm leading-relaxed">
                          {message.content}
                        </div>
                      )}
                    </div>
                    
                    {message.role === 'user' && (
                      <Avatar className="h-8 w-8 flex-shrink-0">
                        <AvatarFallback className="bg-primary text-primary-foreground">
                          <User className="h-4 w-4" />
                        </AvatarFallback>
                      </Avatar>
                    )}
                  </div>
                ))}
                
                {/* Indicateur de chargement */}
                {isChatting && (
                  <div className="flex gap-4">
                    <Avatar className="h-8 w-8 flex-shrink-0">
                      <AvatarImage 
                        src="https://qvvqpirarindpxmxetap.supabase.co/storage/v1/object/public/Logo//TGIM%20900x300%20(1).png"
                        alt="TGIM Assistant"
                      />
                      <AvatarFallback className="bg-primary/10 text-primary">
                        <Bot className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="bg-muted rounded-lg px-4 py-3">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        L'assistant TGIM analyse votre question...
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Erreur */}
                {chatError && (
                  <div className="flex gap-4">
                    <Avatar className="h-8 w-8 flex-shrink-0">
                      <AvatarFallback className="bg-destructive/10 text-destructive">
                        <Bot className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="bg-destructive/10 text-destructive rounded-lg px-4 py-3 max-w-[80%]">
                      <div className="text-sm">
                        ❌ Une erreur est survenue : {chatError.message}
                      </div>
                    </div>
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>
            
            {/* Zone de saisie */}
            <div className="p-6 border-t bg-muted/30">
              <div className="flex gap-3">
                <Input
                  ref={inputRef}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Posez votre question sur la reprise d'entreprise..."
                  disabled={isChatting}
                  className="flex-1"
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim() || isChatting}
                  className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
                >
                  {isChatting ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </Button>
              </div>
              
              {/* Suggestions rapides */}
              <div className="flex flex-wrap gap-2 mt-3">
                {[
                  "Qu'est-ce que la méthode TGIM ?",
                  "Comment valoriser une entreprise ?",
                  "Conseils pour une due diligence efficace"
                ].map((suggestion, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    className="text-xs"
                    onClick={() => setInputValue(suggestion)}
                    disabled={isChatting}
                  >
                    {suggestion}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Panel de connaissances */}
        <KnowledgePanel 
          knowledgeStats={knowledgeStats}
          recommendedDocuments={recommendedDocuments}
          searchResults={searchResults}
        />
      </div>
    </div>
  );
}

