# TGIM Challenge - Intelligence Artificielle

## 🎯 Vue d'ensemble

Ce projet transforme l'application TGIM en une plateforme d'intelligence artificielle avancée pour l'accompagnement des repreneurs d'entreprises. Le défi consiste à implémenter 4 fonctionnalités clés utilisant l'IA pour révolutionner l'expérience utilisateur.

## 🎯 Défi TGIM - Fonctionnalités à Développer

### 1. TGIM Valuator
**Page :** `/valuator`
- **Objectif :** Créer un système d'évaluation d'entreprises avec IA
- **À implémenter :** Analyse DCF automatisée, comparables sectoriels, prédiction de croissance
- **Technologies :** OpenAI API, Python/NumPy, APIs financières

### 2. TGIM Negotiator
**Page :** `/negotiator-ai`
- **Objectif :** Développer un agent IA spécialisé en négociation M&A
- **À implémenter :** Stratégies adaptatives, simulation de négociation, analyse contextuelle
- **Technologies :** OpenAI GPT-4, LangChain, Vector Database

### 3. Chatbot IA
**Page :** `/chatbot`
- **Objectif :** Créer un assistant formé sur le contenu TGIM
- **À implémenter :** RAG, contexte conversationnel, sources et citations
- **Technologies :** OpenAI GPT-4, LangChain, Pinecone/Weaviate

### 4. Système d'emailing
**Page :** `/email-system`
- **Objectif :** Système d'emailing fonctionnel basé sur les workflows
- **À implémenter :** Templates dynamiques, workflows automatisés, campagnes
- **Technologies :** SendGrid/Mailgun, Handlebars, Queue System

## 🛠️ Technologies Utilisées

- **Frontend :** React 19 + TypeScript + Vite
- **UI :** Radix UI + Tailwind CSS
- **Backend :** Supabase
- **IA :** OpenAI GPT-4 + LangChain
- **Email :** SendGrid/Mailgun
- **Vector DB :** Pinecone/Weaviate

## 📁 Structure du Projet

```
src/
├── modules/
│   ├── ma/
│   │   ├── components/
│   │   │   ├── ValuatorPage.tsx          # TGIM Valuator
│   │   │   └── NegotiatorAIPage.tsx      # TGIM Negotiator AI
│   ├── chatbot/
│   │   └── components/
│   │       └── TGIMChatbot.tsx           # Chatbot IA
│   └── email/
│       └── components/
│           └── EmailSystem.tsx           # Système d'emailing
├── components/ui/                        # Composants UI réutilisables
├── hooks/                               # Hooks personnalisés
└── lib/                                 # Utilitaires et configuration
```

## 🚀 Installation et Démarrage

### Prérequis
- Node.js 20.19.1+
- npm 10.8.2+
- Compte Supabase
- Clé API OpenAI

### Installation
```bash
# Cloner le projet
git clone [url-du-repo]
cd tgim-challenge

# Installer les dépendances
npm install

# Configuration des variables d'environnement
cp .env.example .env.local
# Éditer .env.local avec vos clés API

# Démarrer le serveur de développement
npm run dev
```

### Variables d'environnement
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_OPENAI_API_KEY=your_openai_api_key
VITE_SENDGRID_API_KEY=your_sendgrid_api_key
```

## 📖 Documentation

- [Documentation complète du défi](./DEFI_TGIM_IA.md)
- [Guide de développement](./docs/DEVELOPMENT.md)
- [API Reference](./docs/API.md)

## 🧪 Tests

```bash
# Tests unitaires
npm run test

# Tests e2e
npm run test:e2e

# Linting
npm run lint
```

## 🚀 Déploiement

### Développement
```bash
npm run dev
```

### Build de production
```bash
npm run build
```

### Preview
```bash
npm run preview
```

## 📋 Pages du Défi

### Dashboard (`/`)
- Vue d'ensemble du défi
- Raccourcis vers les pages de consignes
- Navigation vers les défis IA

### TGIM Valuator (`/valuator`)
- **Consignes du défi :** Créer un système d'évaluation d'entreprises avec IA
- **Objectifs :** Analyse DCF, multiples sectoriels, prédiction de croissance
- **Technologies suggérées :** OpenAI API, Python/NumPy, APIs financières

### TGIM Negotiator (`/negotiator-ai`)
- **Consignes du défi :** Développer un agent IA spécialisé en négociation M&A
- **Objectifs :** Stratégies adaptatives, simulation, analyse contextuelle
- **Technologies suggérées :** OpenAI GPT-4, LangChain, Vector Database

### Chatbot IA (`/chatbot`)
- **Consignes du défi :** Créer un assistant formé sur le contenu TGIM
- **Objectifs :** RAG, contexte conversationnel, sources et citations
- **Technologies suggérées :** OpenAI GPT-4, LangChain, Pinecone/Weaviate

### Système d'emailing (`/email-system`)
- **Consignes du défi :** Système d'emailing fonctionnel basé sur les workflows
- **Objectifs :** Templates dynamiques, workflows automatisés, campagnes
- **Technologies suggérées :** SendGrid/Mailgun, Handlebars, Queue System

## 🔧 Configuration IA

### OpenAI
- Modèle : GPT-4
- Temperature : 0.7
- Max tokens : 2000

### LangChain
- Chunk size : 1000
- Chunk overlap : 200
- Embedding model : text-embedding-ada-002

## 📈 Métriques de Performance

- Temps de réponse IA : < 3 secondes
- Taux de succès des évaluations : > 85%
- Satisfaction utilisateur : > 4.5/5
- Taux de délivrabilité email : > 95%

## 🤝 Contribution

1. Fork le projet
2. Créer une branche feature (`git checkout -b feature/nouvelle-fonctionnalite`)
3. Commit les changements (`git commit -m 'Ajouter nouvelle fonctionnalité'`)
4. Push vers la branche (`git push origin feature/nouvelle-fonctionnalite`)
5. Ouvrir une Pull Request

## 📝 Changelog

### v1.0.0 (2024-01-XX)
- 🎯 TGIM Valuator - Consignes du défi d'évaluation IA
- 🎯 TGIM Negotiator - Consignes du défi d'agent IA de négociation
- 🎯 Chatbot IA - Consignes du défi d'assistant IA
- 🎯 Système d'emailing - Consignes du défi d'emailing automatisé

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier [LICENSE](LICENSE) pour plus de détails.

## 📞 Support

Pour toute question ou problème :
- Email : support@tgim.com
- Documentation : [docs.tgim.com](https://docs.tgim.com)
- Issues : [GitHub Issues](https://github.com/tgim/challenge/issues)

---

*Développé avec ❤️ par l'équipe TGIM pour révolutionner l'accompagnement des repreneurs d'entreprises grâce à l'intelligence artificielle.*
