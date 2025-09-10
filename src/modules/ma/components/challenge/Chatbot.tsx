

import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { Send, Bot, User, Loader2, BookOpen, Search, Clock, Award, ExternalLink, ChevronDown, ChevronUp, Plus, Trash2, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TGIMChatMessage, DocumentSource, TGIMDocument } from '../../types';

// Backend API helpers (axios)
function normalizeBaseUrl(input?: string): string {
  const fallback = 'http://127.0.0.1:8001/api';
  if (!input) return fallback;
  let u = input.trim();
  if (u.startsWith('/')) return `${window.location.origin.replace(/\/+$/, '')}${u}`.replace(/\/+$/, '');
  if (!/^https?:\/\//i.test(u)) u = `http://${u}`; // ensure protocol
  return u.replace(/\/+$/, '');
}

const BASE_URL = normalizeBaseUrl((import.meta as any).env?.VITE_BACKEND_URL);
const http = axios.create({ baseURL: BASE_URL });

const api = {
  async ensureSession(externalId: string, metadata?: any) {
    const { data } = await http.post('/v1/chat/session', { external_id: externalId, metadata });
    return data;
  },
  async getMessages(externalId: string) {
    const { data } = await http.get(`/v1/chat/${externalId}/messages`);
    return data;
  },
  async postMessage(externalId: string, role: 'user' | 'assistant' | 'system', content: string) {
    const { data } = await http.post(`/v1/chat/${externalId}/messages`, { role, content });
    return data;
  },
  async query(query: string) {
    const { data } = await http.post('/v1/chat/query', { query });
    return data;
  },
  async listDocuments() {
    const { data } = await http.get('/v1/documents');
    return data;
  },
  async uploadDocument(file: File, meta?: { title?: string; category?: string }) {
    // For text and JSON files, prefer inline content path to avoid multipart issues
    if (file.type.startsWith('text/') || file.type === 'application/json') {
      const content = await file.text();
      const payload: any = {
        title: meta?.title || file.name.replace(/\.[^.]+$/, ''),
        category: meta?.category,
        content,
      };
      const { data } = await http.post('/v1/documents/upload', payload);
      return data;
    }
    const form = new FormData();
    form.append('file', file);
    if (meta?.title) form.append('title', meta.title);
    if (meta?.category) form.append('category', meta.category);
    const { data } = await http.post('/v1/documents/upload', form);
    return data;
  },
  async getSessions(page = 1, search = '') {
    const { data } = await http.get('/v1/chat/sessions', {
      params: { page, search }
    });
    return data;
  },
  async deleteSession(externalId: string) {
    const { data } = await http.delete(`/v1/chat/sessions/${externalId}`);
    return data;
  },
};

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

// Composant pour l'historique des chats
function ChatHistory({ 
  currentSessionId, 
  onSessionSelect, 
  onNewSession 
}: {
  currentSessionId: string;
  onSessionSelect: (sessionId: string) => void;
  onNewSession: () => void;
}) {
  const [sessions, setSessions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const loadSessions = async (pageNum = 1, searchTerm = '') => {
    setLoading(true);
    try {
      const data = await api.getSessions(pageNum, searchTerm);
      if (pageNum === 1) {
        setSessions(data.sessions);
      } else {
        setSessions(prev => [...prev, ...data.sessions]);
      }
      setHasMore(data.pagination.current_page < data.pagination.last_page);
    } catch (error) {
      console.error('Erreur lors du chargement des sessions:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSessions(1, search);
  }, [search]);

  const handleDeleteSession = async (externalId: string) => {
    try {
      await api.deleteSession(externalId);
      setSessions(prev => prev.filter(s => s.external_id !== externalId));
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 24) {
      return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
    } else if (diffInHours < 24 * 7) {
      return date.toLocaleDateString('fr-FR', { weekday: 'short' });
    } else {
      return date.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' });
    }
  };

  return (
    <div className="w-80 border-r bg-muted/30 flex flex-col min-h-0">
      <div className="p-4 border-b">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold flex items-center gap-2">
            <MessageSquare className="w-4 h-4" />
            Historique des chats
          </h3>
          <Button
            size="sm"
            onClick={onNewSession}
            className="h-8 w-8 p-0"
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>
        <Input
          placeholder="Rechercher dans les chats..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="h-8"
        />
      </div>
      
      <ScrollArea className="flex-1">
        <div className="p-2 space-y-1">
          {sessions.map((session) => (
            <div
              key={session.external_id}
              className={`p-3 rounded-lg cursor-pointer transition-colors group ${
                session.external_id === currentSessionId
                  ? 'bg-primary text-primary-foreground'
                  : 'hover:bg-muted/50'
              }`}
              onClick={() => onSessionSelect(session.external_id)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm truncate">
                    {session.title || `Chat ${session.external_id.slice(-8)}`}
                  </div>
                  {session.messages && session.messages.length > 0 && (
                    <div className="text-xs opacity-70 mt-1 line-clamp-2">
                      {session.messages[0].content}
                    </div>
                  )}
                  <div className="flex items-center gap-2 mt-2 text-xs opacity-60">
                    <Clock className="w-3 h-3" />
                    {formatDate(session.created_at)}
                    <span>•</span>
                    <span>{session.messages_count} messages</span>
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteSession(session.external_id);
                  }}
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
            </div>
          ))}
          
          {loading && (
            <div className="flex justify-center p-4">
              <Loader2 className="w-4 h-4 animate-spin" />
            </div>
          )}
          
          {sessions.length === 0 && !loading && (
            <div className="text-center py-8 text-muted-foreground">
              <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">Aucun chat trouvé</p>
              <p className="text-xs mt-1">Commencez une nouvelle conversation</p>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}

// Composant pour le panel des sources et documents
function KnowledgePanel({ knowledgeStats, recommendedDocuments, searchResults, onUploadFiles, isChatting }: {
  knowledgeStats: any;
  recommendedDocuments: TGIMDocument[];
  searchResults?: DocumentSource[];
  onUploadFiles: (files: FileList | null) => Promise<void> | void;
  isChatting: boolean;
}) {
  return (
    <div className="w-80 border-l bg-muted/30 flex flex-col min-h-0">
      <div className="p-4 border-b">
        <h3 className="font-semibold flex items-center gap-2">
          <BookOpen className="w-4 h-4" />
          Base de connaissances TGIM
        </h3>
        <p className="text-sm text-muted-foreground mt-1">
          {knowledgeStats?.total_documents || 0} documents disponibles
        </p>
        <div className="mt-2">
          <input
            type="file"
            className="hidden"
            multiple
            onChange={(e) => onUploadFiles(e.target.files)}
            id="knowledge-upload-input"
          />
          <Button
            variant="outline"
            size="sm"
            disabled={isChatting}
            onClick={() => document.getElementById('knowledge-upload-input')?.click()}
          >
            Uploader des documents
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue="recommended" className="flex-1 min-h-0 flex flex-col">
        
        <TabsContent value="recommended" className="px-4 pb-4 flex-1 min-h-0">
          <ScrollArea className="h-full">
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
        
        <TabsContent value="search" className="px-4 pb-4 flex-1 min-h-0">
          <ScrollArea className="h-full">
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
  const [sessionId, setSessionId] = useState(() => `session-${Date.now()}`);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [messages, setMessages] = useState<TGIMChatMessage[]>([]);
  const [isChatting, setIsChatting] = useState(false);
  const [chatError, setChatError] = useState<Error | null>(null);
  const [recommendedDocuments, setRecommendedDocuments] = useState<TGIMDocument[]>([]);
  const [knowledgeStats, setKnowledgeStats] = useState<any>({ total_documents: 0 });
  const [searchResults, setSearchResults] = useState<DocumentSource[] | undefined>(undefined);
  
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

  // Bootstrap session and load messages + documents
  useEffect(() => {
    (async () => {
      try {
        await api.ensureSession(sessionId, { created_at: new Date().toISOString() });
        const [serverMessages, docs] = await Promise.all([
          api.getMessages(sessionId),
          api.listDocuments(),
        ]);
        setMessages(
          (serverMessages || []).map((m: any) => ({
            id: String(m.id),
            session_id: sessionId,
            role: m.role,
            content: m.content,
            timestamp: m.created_at,
            sources: m.sources || undefined,
            follow_up_questions: m.follow_up_questions || undefined,
            response_time_ms: m.response_time_ms || undefined,
            confidence_score: m.confidence_score || undefined,
          }))
        );
        const formattedDocs: TGIMDocument[] = (docs || []).map((d: any) => ({
          id: String(d.id),
          title: d.title,
          category: d.category || 'Général',
          difficulty_level: d.difficulty_level || 'Tous niveaux',
          estimated_read_time: d.estimated_read_time || 5,
          tags: d.tags || [],
        }));
        setRecommendedDocuments(formattedDocs);
        setKnowledgeStats({ total_documents: formattedDocs.length });
      } catch (e: any) {
        console.error(e);
        setChatError(e);
      }
    })();
  }, [sessionId]);
  
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
    setChatError(null);
    const content = inputValue.trim();
    const userMessage: TGIMChatMessage = {
      id: `msg-${Date.now()}-user`,
      session_id: sessionId,
      role: 'user',
      content,
      timestamp: new Date().toISOString(),
      search_query: content,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsChatting(true);
    try {
      await api.postMessage(sessionId, 'user', content);
      const rag = await api.query(content);
      setSearchResults(rag?.sources || []);
      const assistantMessage: TGIMChatMessage = {
        id: `msg-${Date.now()}-assistant`,
        session_id: sessionId,
        role: 'assistant',
        content: rag?.answer || (rag?.sources?.length ? 'Voici ce que j’ai trouvé dans les documents:' : 'Aucune source pertinente trouvée.'),
        timestamp: new Date().toISOString(),
        sources: rag?.sources || [],
        confidence_score: undefined,
        response_time_ms: undefined,
      };
      setMessages((prev) => [...prev, assistantMessage]);
      await api.postMessage(sessionId, 'assistant', assistantMessage.content);
      // Refresh docs/knowledge stats after each query (optional)
      try {
        const docs = await api.listDocuments();
        const formattedDocs: TGIMDocument[] = (docs || []).map((d: any) => ({
          id: String(d.id),
          title: d.title,
          category: d.category || 'Général',
          difficulty_level: d.difficulty_level || 'Tous niveaux',
          estimated_read_time: d.estimated_read_time || 5,
          tags: d.tags || [],
        }));
        setRecommendedDocuments(formattedDocs);
        setKnowledgeStats({ total_documents: formattedDocs.length });
      } catch {}
    } catch (e: any) {
      console.error(e);
      setChatError(e);
    } finally {
      setIsChatting(false);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFilesSelected = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setIsChatting(true);
    try {
      for (const file of Array.from(files)) {
        await api.uploadDocument(file);
      }
      const docs = await api.listDocuments();
      const formattedDocs: TGIMDocument[] = (docs || []).map((d: any) => ({
        id: String(d.id),
        title: d.title,
        category: d.category || 'Général',
        difficulty_level: d.difficulty_level || 'Tous niveaux',
        estimated_read_time: d.estimated_read_time || 5,
        tags: d.tags || [],
      }));
      setRecommendedDocuments(formattedDocs);
      setKnowledgeStats({ total_documents: formattedDocs.length });
    } catch (e: any) {
      console.error(e);
      setChatError(e);
    } finally {
      setIsChatting(false);
    }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleSessionSelect = async (newSessionId: string) => {
    if (newSessionId === sessionId) return;
    
    setSessionId(newSessionId);
    setMessages([]);
    setSearchResults(undefined);
    setChatError(null);
    
    try {
      const [serverMessages, docs] = await Promise.all([
        api.getMessages(newSessionId),
        api.listDocuments(),
      ]);
      
      setMessages(
        (serverMessages || []).map((m: any) => ({
          id: String(m.id),
          session_id: newSessionId,
          role: m.role,
          content: m.content,
          timestamp: m.created_at,
          sources: m.sources || undefined,
          follow_up_questions: m.follow_up_questions || undefined,
          response_time_ms: m.response_time_ms || undefined,
          confidence_score: m.confidence_score || undefined,
        }))
      );
      
      const formattedDocs: TGIMDocument[] = (docs || []).map((d: any) => ({
        id: String(d.id),
        title: d.title,
        category: d.category || 'Général',
        difficulty_level: d.difficulty_level || 'Tous niveaux',
        estimated_read_time: d.estimated_read_time || 5,
        tags: d.tags || [],
      }));
      setRecommendedDocuments(formattedDocs);
      setKnowledgeStats({ total_documents: formattedDocs.length });
    } catch (e: any) {
      console.error(e);
      setChatError(e);
    }
  };

  const handleNewSession = () => {
    const newSessionId = `session-${Date.now()}`;
    setSessionId(newSessionId);
    setMessages([]);
    setSearchResults(undefined);
    setChatError(null);
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
            <span>RAG</span>
          </div>
        </div>
      </div>
      
      {/* Interface principale */}
      <div className="flex gap-6 h-[700px] min-h-0">
        {/* Historique des chats */}
        <ChatHistory 
          currentSessionId={sessionId}
          onSessionSelect={handleSessionSelect}
          onNewSession={handleNewSession}
        />
        
        {/* Zone de chat */}
        <Card className="flex-1 flex flex-col min-h-0">
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
          
          <CardContent className="flex-1 flex flex-col p-0 min-h-0">
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6">
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
            </div>
            
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
                <input
                  ref={fileInputRef}
                  type="file"
                  className="hidden"
                  multiple
                  onChange={(e) => handleFilesSelected(e.target.files)}
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
          onUploadFiles={handleFilesSelected}
          isChatting={isChatting}
        />
      </div>
    </div>
  );
}

