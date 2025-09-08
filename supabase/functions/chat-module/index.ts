// Chat-module Edge Function (Deno) for Supabase - TGIM Guild Branded
// Expects JSON: { message: string, context: object }
// Returns: { response: string }

// Headers CORS
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

// deno-lint-ignore no-explicit-any
type ChatContext = {
  user_profile?: any;
  user_achievements?: any[];
  user_deals?: any[];
  user_calendar?: any[];
  announcements?: any[];
  members?: any[];
  intervenants?: any[];
  context_type: string;
  timestamp: string;
};

// Configuration TGIM - Branding officiel
const TGIM_CONFIG = {
  name: "TGIM Guild",
  tagline: "Votre assistant communautaire",
  logo: "https://qvvqpirarindpxmxetap.supabase.co/storage/v1/object/public/Logo//TGIM%20900x300%20(1).png",
  colors: {
    primary: "#5b2c2c",        // Marron/rouge foncé TGIM
    secondary: "#7c3a3a",      // Marron plus clair TGIM
    accent: "#10b981",         // Vert émeraude TGIM
    warning: "#f59e0b",        // Orange ambre TGIM
    info: "#3b82f6",           // Bleu TGIM
    background: "#f8fafc",     // Background TGIM
    foreground: "#1f2937"      // Texte principal TGIM
  },
  typography: {
    fontFamily: "Inter, system-ui, -apple-system, sans-serif",
    fontSize: {
      base: "16px",
      lg: "18px", 
      xl: "24px",
      "2xl": "28px"
    },
    fontWeight: {
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700
    }
  },
  design: {
    borderRadius: "12px",      // Radius TGIM
    boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
    gradient: "linear-gradient(135deg, #5b2c2c 0%, #7c3a3a 100%)"
  },
  features: [
    "📚 Bibliothèque exclusive",
    "🤝 Communauté active", 
    "📅 Événements premium",
    "💡 Intelligence collective",
    "🎯 Opportunités M&A"
  ]
};

// Base de connaissances TGIM - Toute la plateforme
const TGIM_KNOWLEDGE_BASE = {
  platform: {
    name: "TGIM Guild",
    description: "Plateforme communautaire pour entrepreneurs et investisseurs",
    mission: "Accompagner les entrepreneurs dans leur parcours et faciliter les opportunités M&A",
    target_audience: "Entrepreneurs, investisseurs, dirigeants d'entreprise",
    url: "https://qg.thewomensclub.fr",
    logo: "https://qvvqpirarindpxmxetap.supabase.co/storage/v1/object/public/Logo//TGIM%20900x300%20(1).png"
  },
  features: {
    deals: {
      name: "Marketplace M&A",
      description: "Plateforme de cession et acquisition d'entreprises",
      process: "Soumission de dossiers, évaluation, mise en relation",
      benefits: "Accès à des opportunités exclusives, accompagnement personnalisé",
      workflow: "10 étapes de collecte d'informations, auto-sauvegarde, validation par étape",
      contact_time: "Contact sous 48h après soumission"
    },
    library: {
      name: "Bibliothèque exclusive",
      description: "Ressources et outils pour entrepreneurs",
      content: "Articles, guides, templates, études de cas, replays de formations",
      access: "Réservé aux membres TGIM",
      categories: "Business, Finance, Marketing, Juridique, RH"
    },
    community: {
      name: "Communauté active",
      description: "Réseau de professionnels et entrepreneurs",
      benefits: "Networking, partage d'expériences, conseils entre pairs",
      events: "Formations, rencontres, événements exclusifs",
      messaging: "Système de messagerie intégré"
    },
    calendar: {
      name: "Calendrier événements",
      description: "Formations et événements premium",
      types: "Formations, webinaires, rencontres networking, conférences",
      exclusivity: "Événements réservés aux membres TGIM",
      replay: "Système de replay avec contrôle d'accès"
    },
    achievements: {
      name: "Système de gamification",
      description: "Suivi des progrès et récompenses",
      elements: "Badges, points, niveaux, défis communautaires",
      tracking: "Suivi d'activité et détection d'activité en arrière-plan"
    },
    prompts: {
      name: "AI Playground",
      description: "Bibliothèque de prompts IA pour entrepreneurs",
      content: "Prompts pour business plan, pitch, analyse financière, etc.",
      access: "Ressource partagée par la communauté"
    },
    hub: {
      name: "Hub d'information",
      description: "Centre d'information et d'actualités",
      content: "Annonces, mises à jour, nouvelles fonctionnalités",
      types: "Nouvelles fonctionnalités, améliorations, corrections de bugs"
    },
    updates: {
      name: "Mises à jour",
      description: "Suivi des évolutions de la plateforme",
      types: "Feature, improvement, bugfix",
      feedback: "Système de signalement et suggestions intégré"
    }
  },
  user_roles: {
    user: "Membre standard de la communauté",
    coach: "Coach/Formateur avec accès étendu",
    admin: "Administrateur de la plateforme",
    negotiator: "Négociateur M&A (accès TGIM Negotiator)"
  },
  ma_modules: {
    m1: {
      name: "Module 1 - Première approche",
      objectives: ["Être accepté comme acheteur crédible", "Démontrer la valeur ajoutée", "Établir la confiance"],
      deliverables: ["Pitch profil validé", "Templates de communication", "Score de readiness"]
    },
    m2: {
      name: "Module 2 - Négociation",
      objectives: ["Cadrer la valuation", "Négocier les termes", "Préparer la LOI"],
      deliverables: ["Draft LOI", "Term sheet", "Matrice Give/Get"]
    },
    m3: {
      name: "Module 3 - Due Diligence",
      objectives: ["Conduire les DD", "Identifier les points durs", "Transformer en leviers"],
      deliverables: ["Issue log priorisé", "Demande d'ajustement", "Plan d'actions"]
    },
    m4: {
      name: "Module 4 - Closing",
      objectives: ["Finaliser la transaction", "Gérer la transition", "Assurer le suivi"],
      deliverables: ["Contrat final", "Plan de transition", "Suivi post-acquisition"]
    }
  },
  tools: {
    valuator: {
      name: "TGIM Valuator",
      description: "Outil d'évaluation d'entreprises",
      status: "À venir",
      features: "Calcul de valorisation, analyse comparative, rapports détaillés"
    },
    negotiator: {
      name: "TGIM Negotiator",
      description: "Plateforme de négociation M&A",
      access: "Réservé aux admins et négociateurs",
      features: "Chat sécurisé, partage de documents, suivi des négociations"
    },
    connector: {
      name: "TGIM Connector",
      description: "Outil de mise en relation",
      status: "À venir",
      features: "Matching automatique, recommandations, networking"
    },
    deal_analyzer: {
      name: "Deal Analyzer",
      description: "Analyseur de deals M&A",
      status: "À venir",
      features: "Analyse de risque, scoring, recommandations"
    }
  },
  processes: {
    deal_submission: {
      steps: 10,
      fields: ["Identité cédant", "Profil entreprise", "Performance financière", "Activité & marché", "Ressources & actifs", "Juridique & réglementaire", "Modalités cession", "Documents", "Validation", "Confirmation"],
      auto_save: true,
      validation: "Par étape avec feedback en temps réel"
    },
    user_onboarding: {
      steps: ["Inscription", "Vérification email", "Complétion profil", "Première connexion", "Découverte fonctionnalités"],
      gamification: "Badges de progression, points d'expérience"
    },
    support: {
      channels: ["Chat intégré", "Email", "Formulaire de contact", "Système de signalement"],
      response_time: "Sous 24h en moyenne",
      escalation: "Support technique → Équipe TGIM"
    }
  },
  integrations: {
    notion: {
      name: "Digital Roadmap Notion",
      purpose: "Synchronisation des bugs, fonctionnalités et améliorations",
      sync: "Automatique vers base Notion avec statut 'A dev'"
    },
    email: {
      provider: "Resend",
      templates: ["Bienvenue", "Rappel profil", "Notification événement", "Confirmation cession"],
      workflows: "Automatisés avec triggers personnalisés"
    },
    storage: {
      provider: "Supabase Storage",
      content: "Logos, documents, images, fichiers utilisateur"
    }
  },
  security: {
    authentication: "Supabase Auth avec RLS",
    data_protection: "Chiffrement des données sensibles",
    access_control: "Politiques RLS par rôle utilisateur",
    privacy: "Conformité RGPD"
  },
  support: {
    contact: "Équipe support TGIM Guild",
    channels: "Chat, email, formulaire de contact",
    response_time: "Sous 24h en moyenne",
    documentation: "Guides utilisateur, FAQ, tutoriels"
  }
};

export const handler = async (req: Request): Promise<Response> => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    if (req.method !== 'POST') {
      return new Response('Method Not Allowed', { 
        status: 405, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      });
    }

    const { message, context } = await req.json();
    
    if (!message || typeof message !== 'string') {
      return new Response(
        JSON.stringify({ error: 'Message requis' }), 
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Analyse du contexte pour personnaliser la réponse
    const chatContext = context as ChatContext;
    let response = '';

    // Logique de traitement avec branding TGIM et base de connaissances
    const lowerMessage = message.toLowerCase();
    
    // Salutations et présentation
    if (lowerMessage.includes('bonjour') || lowerMessage.includes('salut') || lowerMessage.includes('hello')) {
      response = `🎉 Bonjour ! Je suis votre assistant TGIM Guild. Je suis là pour vous accompagner dans votre parcours entrepreneurial et vous aider à naviguer dans notre communauté. Comment puis-je vous aider aujourd'hui ?`;
    }
    // Profil utilisateur
    else if (lowerMessage.includes('profil') || lowerMessage.includes('compte') || lowerMessage.includes('mon profil')) {
      response = "👤 **Votre profil TGIM Guild :**\n\nPour accéder à vos informations de profil, assurez-vous d'être connecté à votre compte TGIM Guild.\n\n💡 *Conseil :* Complétez votre profil pour débloquer toutes les fonctionnalités de la communauté !";
    } 
    // Deals et opportunités M&A
    else if (lowerMessage.includes('deal') || lowerMessage.includes('affaire') || lowerMessage.includes('m&a') || lowerMessage.includes('cession')) {
      response = `🎯 **Opportunités M&A :**\n\nExplorez notre marketplace M&A pour découvrir des opportunités d'acquisition intéressantes !\n\n**Notre marketplace M&A :**\n• ${TGIM_KNOWLEDGE_BASE.features.deals.description}\n• ${TGIM_KNOWLEDGE_BASE.features.deals.benefits}\n\n🚀 *Suggestion :* Consultez notre section 'Deals' pour voir les entreprises disponibles à la cession.`;
    }
    // Calendrier et événements
    else if (lowerMessage.includes('calendrier') || lowerMessage.includes('événement') || lowerMessage.includes('event') || lowerMessage.includes('formation')) {
      response = `📅 **Votre calendrier :**\n\n**Nos événements premium :**\n• ${TGIM_KNOWLEDGE_BASE.features.calendar.types}\n• ${TGIM_KNOWLEDGE_BASE.features.calendar.exclusivity}\n\n🚀 *Suggestion :* Découvrez nos prochains événements et formations dans la section 'Calendrier' pour enrichir votre parcours entrepreneurial !`;
    }
    // Annonces communautaires
    else if (lowerMessage.includes('annonce') || lowerMessage.includes('nouvelle') || lowerMessage.includes('actualité')) {
      response = "📢 **Actualités :**\n\n💡 *Conseil :* Revenez régulièrement pour découvrir les dernières actualités de la communauté TGIM !";
    }
    // Communauté et membres
    else if (lowerMessage.includes('membre') || lowerMessage.includes('utilisateur') || lowerMessage.includes('communauté') || lowerMessage.includes('réseau')) {
      response = `🤝 **Communauté TGIM Guild :**\n\n**Notre communauté :**\n• ${TGIM_KNOWLEDGE_BASE.features.community.description}\n• ${TGIM_KNOWLEDGE_BASE.features.community.benefits}\n\n🌟 *Rejoignez la conversation :* Notre communauté d'entrepreneurs et d'investisseurs est là pour vous accompagner dans vos projets !`;
    }
    // Intervenants et experts
    else if (lowerMessage.includes('intervenant') || lowerMessage.includes('expert') || lowerMessage.includes('mentor')) {
      response = "👨‍💼 **Intervenants :**\n\n💡 *À venir :* Notre équipe d'experts sera bientôt disponible pour vous accompagner !";
    }
    // Bibliothèque et ressources
    else if (lowerMessage.includes('bibliothèque') || lowerMessage.includes('ressource') || lowerMessage.includes('document') || lowerMessage.includes('article')) {
      response = `📚 **Bibliothèque TGIM Guild :**\n\nDécouvrez notre collection exclusive de ressources pour entrepreneurs :\n\n**Contenu disponible :**\n• ${TGIM_KNOWLEDGE_BASE.features.library.content}\n• ${TGIM_KNOWLEDGE_BASE.features.library.access}\n\n🚀 *Accès exclusif :* En tant que membre TGIM, vous avez accès à du contenu premium !`;
    }
    // Système de gamification
    else if (lowerMessage.includes('badge') || lowerMessage.includes('point') || lowerMessage.includes('niveau') || lowerMessage.includes('achievement')) {
      response = `🏆 **Système de gamification :**\n\n**Découvrez nos défis communautaires :**\n• ${TGIM_KNOWLEDGE_BASE.features.achievements.elements}\n• ${TGIM_KNOWLEDGE_BASE.features.achievements.description}\n\n🚀 *Commencez votre parcours :* Participez aux activités de la communauté pour gagner vos premiers badges !`;
    }
    // Aide et support
    else if (lowerMessage.includes('aide') || lowerMessage.includes('help') || lowerMessage.includes('support') || lowerMessage.includes('comment')) {
      response = `🤖 **Comment puis-je vous aider ?**\n\nJe suis votre assistant TGIM Guild et je peux vous aider avec :\n\n• 👤 **Votre profil** - Gestion de votre compte\n• 🎯 **Deals M&A** - Opportunités d'acquisition\n• 📅 **Calendrier** - Événements et formations\n• 📢 **Annonces** - Actualités de la communauté\n• 🤝 **Membres** - Réseau et contacts\n• 👨‍💼 **Intervenants** - Experts et mentors\n• 📚 **Bibliothèque** - Ressources exclusives\n• 🏆 **Gamification** - Badges et défis\n• 🐛 **Support** - Signaler un problème\n\n💡 *Astuce :* Posez-moi une question spécifique pour une réponse personnalisée !`;
    }
    // Signalement de problèmes
    else if (lowerMessage.includes('bug') || lowerMessage.includes('problème') || lowerMessage.includes('erreur') || lowerMessage.includes('signaler')) {
      response = `🐛 **Signaler un problème :**\n\nJe comprends que vous rencontrez une difficulté. Voici comment procéder :\n\n1. **Via l'interface :** Cliquez sur "Signaler" dans le header\n2. **Décrivez le problème** de manière détaillée\n3. **Notre équipe technique** traitera votre demande\n\n**Support TGIM :**\n• ${TGIM_KNOWLEDGE_BASE.support.contact}\n• ${TGIM_KNOWLEDGE_BASE.support.channels}\n• ${TGIM_KNOWLEDGE_BASE.support.response_time}\n\n⚡ *Rappel :* Votre feedback nous aide à améliorer TGIM Guild pour tous les membres !`;
    }
    // Fonctionnalités et suggestions
    else if (lowerMessage.includes('fonctionnalité') || lowerMessage.includes('suggestion') || lowerMessage.includes('amélioration') || lowerMessage.includes('idée')) {
      response = `💡 **Suggérer une amélioration :**\n\nExcellente idée ! Nous sommes toujours à l'écoute de nos membres :\n\n1. **Via l'interface :** Cliquez sur "Signaler" → "Suggérer une fonctionnalité"\n2. **Décrivez votre idée** en détail\n3. **Notre équipe** étudiera votre proposition\n\n🚀 *Innovation :* Vos suggestions contribuent à faire évoluer TGIM Guild !`;
    }
    // Questions sur la plateforme
    else if (lowerMessage.includes('tgim') || lowerMessage.includes('plateforme') || lowerMessage.includes('qu\'est-ce que') || lowerMessage.includes('c\'est quoi')) {
      response = `🌟 **TGIM Guild - Votre plateforme communautaire :**\n\n**${TGIM_KNOWLEDGE_BASE.platform.description}**\n\n**Notre mission :** ${TGIM_KNOWLEDGE_BASE.platform.mission}\n\n**Pour qui :** ${TGIM_KNOWLEDGE_BASE.platform.target_audience}\n\n**Nos fonctionnalités principales :**\n• 🎯 ${TGIM_KNOWLEDGE_BASE.features.deals.name}\n• 📚 ${TGIM_KNOWLEDGE_BASE.features.library.name}\n• 🤝 ${TGIM_KNOWLEDGE_BASE.features.community.name}\n• 📅 ${TGIM_KNOWLEDGE_BASE.features.calendar.name}\n• 🏆 ${TGIM_KNOWLEDGE_BASE.features.achievements.name}\n• 🤖 ${TGIM_KNOWLEDGE_BASE.features.prompts.name}\n• 📢 ${TGIM_KNOWLEDGE_BASE.features.hub.name}\n\n💡 *Découvrez tout ce que TGIM Guild peut vous offrir !*`;
    }
    // Questions sur les outils M&A
    else if (lowerMessage.includes('valuator') || lowerMessage.includes('évaluation') || lowerMessage.includes('valorisation')) {
      response = `🧮 **TGIM Valuator :**\n\n**${TGIM_KNOWLEDGE_BASE.tools.valuator.description}**\n\n**Statut :** ${TGIM_KNOWLEDGE_BASE.tools.valuator.status}\n\n**Fonctionnalités prévues :**\n• ${TGIM_KNOWLEDGE_BASE.tools.valuator.features}\n\n🚀 *Cet outil sera bientôt disponible pour vous aider dans vos évaluations d'entreprises !*`;
    }
    else if (lowerMessage.includes('negotiator') || lowerMessage.includes('négociation')) {
      const profile = chatContext?.user_profile;
      const hasAccess = profile?.role === 'admin' || profile?.role === 'negotiator';
      response = hasAccess 
        ? `💬 **TGIM Negotiator :**\n\n**${TGIM_KNOWLEDGE_BASE.tools.negotiator.description}**\n\n**Fonctionnalités :**\n• ${TGIM_KNOWLEDGE_BASE.tools.negotiator.features}\n\n🎯 *Vous avez accès à cet outil en tant que ${profile.role} !*`
        : `💬 **TGIM Negotiator :**\n\n**${TGIM_KNOWLEDGE_BASE.tools.negotiator.description}**\n\n**Accès :** ${TGIM_KNOWLEDGE_BASE.tools.negotiator.access}\n\n🔒 *Cet outil est réservé aux administrateurs et négociateurs M&A.*`;
    }
    else if (lowerMessage.includes('connector') || lowerMessage.includes('mise en relation')) {
      response = `🤝 **TGIM Connector :**\n\n**${TGIM_KNOWLEDGE_BASE.tools.connector.description}**\n\n**Statut :** ${TGIM_KNOWLEDGE_BASE.tools.connector.status}\n\n**Fonctionnalités prévues :**\n• ${TGIM_KNOWLEDGE_BASE.tools.connector.features}\n\n🚀 *Cet outil de networking intelligent sera bientôt disponible !*`;
    }
    // Questions sur les modules M&A
    else if (lowerMessage.includes('module') || lowerMessage.includes('m&a') || lowerMessage.includes('acquisition')) {
      response = `📚 **Modules M&A TGIM :**\n\n**${TGIM_KNOWLEDGE_BASE.ma_modules.m1.name}**\n• Objectifs : ${TGIM_KNOWLEDGE_BASE.ma_modules.m1.objectives.join(', ')}\n\n**${TGIM_KNOWLEDGE_BASE.ma_modules.m2.name}**\n• Objectifs : ${TGIM_KNOWLEDGE_BASE.ma_modules.m2.objectives.join(', ')}\n\n**${TGIM_KNOWLEDGE_BASE.ma_modules.m3.name}**\n• Objectifs : ${TGIM_KNOWLEDGE_BASE.ma_modules.m3.objectives.join(', ')}\n\n**${TGIM_KNOWLEDGE_BASE.ma_modules.m4.name}**\n• Objectifs : ${TGIM_KNOWLEDGE_BASE.ma_modules.m4.objectives.join(', ')}\n\n🎯 *Chaque module vous accompagne dans une étape clé du processus M&A !*`;
    }
    // Questions sur les processus
    else if (lowerMessage.includes('processus') || lowerMessage.includes('workflow') || lowerMessage.includes('étapes')) {
      response = `⚙️ **Processus TGIM :**\n\n**Soumission de deal :**\n• ${TGIM_KNOWLEDGE_BASE.processes.deal_submission.steps} étapes\n• ${TGIM_KNOWLEDGE_BASE.processes.deal_submission.auto_save ? 'Auto-sauvegarde' : 'Sauvegarde manuelle'}\n• ${TGIM_KNOWLEDGE_BASE.processes.deal_submission.validation}\n\n**Onboarding utilisateur :**\n• Étapes : ${TGIM_KNOWLEDGE_BASE.processes.user_onboarding.steps.join(' → ')}\n• ${TGIM_KNOWLEDGE_BASE.processes.user_onboarding.gamification}\n\n**Support :**\n• Canaux : ${TGIM_KNOWLEDGE_BASE.processes.support.channels.join(', ')}\n• ${TGIM_KNOWLEDGE_BASE.processes.support.response_time}\n\n💡 *Tous nos processus sont conçus pour vous accompagner efficacement !*`;
    }
    // Questions sur les intégrations
    else if (lowerMessage.includes('intégration') || lowerMessage.includes('notion') || lowerMessage.includes('email')) {
      response = `🔗 **Intégrations TGIM :**\n\n**${TGIM_KNOWLEDGE_BASE.integrations.notion.name} :**\n• ${TGIM_KNOWLEDGE_BASE.integrations.notion.purpose}\n• ${TGIM_KNOWLEDGE_BASE.integrations.notion.sync}\n\n**Système Email :**\n• Provider : ${TGIM_KNOWLEDGE_BASE.integrations.email.provider}\n• Templates : ${TGIM_KNOWLEDGE_BASE.integrations.email.templates.join(', ')}\n• ${TGIM_KNOWLEDGE_BASE.integrations.email.workflows}\n\n**Storage :**\n• ${TGIM_KNOWLEDGE_BASE.integrations.storage.provider}\n• Contenu : ${TGIM_KNOWLEDGE_BASE.integrations.storage.content}\n\n🚀 *Nos intégrations optimisent votre expérience utilisateur !*`;
    }
    // Questions sur la sécurité
    else if (lowerMessage.includes('sécurité') || lowerMessage.includes('confidentialité') || lowerMessage.includes('données')) {
      response = `🔒 **Sécurité TGIM :**\n\n**Authentification :** ${TGIM_KNOWLEDGE_BASE.security.authentication}\n\n**Protection des données :**\n• ${TGIM_KNOWLEDGE_BASE.security.data_protection}\n• ${TGIM_KNOWLEDGE_BASE.security.access_control}\n• ${TGIM_KNOWLEDGE_BASE.security.privacy}\n\n🛡️ *Vos données sont protégées selon les plus hauts standards de sécurité !*`;
    }
    // Questions sur les rôles
    else if (lowerMessage.includes('rôle') || lowerMessage.includes('permission') || lowerMessage.includes('accès')) {
      response = `👥 **Rôles TGIM :**\n\n**${TGIM_KNOWLEDGE_BASE.user_roles.user}**\n• Accès standard à la communauté\n\n**${TGIM_KNOWLEDGE_BASE.user_roles.coach}**\n• Accès aux outils de formation\n\n**${TGIM_KNOWLEDGE_BASE.user_roles.admin}**\n• Accès complet à la plateforme\n\n**${TGIM_KNOWLEDGE_BASE.user_roles.negotiator}**\n• Accès aux outils de négociation M&A\n\n🎯 *Chaque rôle est conçu pour optimiser votre expérience selon vos besoins !*`;
    }
    // Réponse générique avec branding TGIM
    else {
      response = `🤖 **Assistant TGIM Guild**\n\nJe comprends votre question "${message}". En tant qu'assistant de la communauté TGIM Guild, je suis là pour vous accompagner dans votre parcours entrepreneurial.\n\n🎯 **Que puis-je faire pour vous ?**\n• Vous aider avec vos données personnelles\n• Vous orienter vers nos fonctionnalités\n• Vous informer sur la communauté\n• Vous assister dans vos démarches M&A\n• Vous expliquer le fonctionnement de la plateforme\n\n💡 *Conseil :* Soyez plus spécifique sur ce que vous recherchez pour une réponse optimale !`;
    }

    return new Response(
      JSON.stringify({ 
        response,
        metadata: {
          bot_name: TGIM_CONFIG.name,
          bot_tagline: TGIM_CONFIG.tagline,
          timestamp: new Date().toISOString(),
          context_used: chatContext?.context_type || 'general'
        }
      }), 
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Erreur inconnue';
    console.error('Chat module error:', msg);
    
    return new Response(
      JSON.stringify({ 
        error: msg,
        bot_name: TGIM_CONFIG.name,
        support_message: "En cas de problème persistant, contactez notre équipe support TGIM Guild."
      }), 
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
};

// For local testing with supabase functions serve
export default handler;
