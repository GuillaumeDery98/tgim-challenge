# Configuration du Défi TGIM - IA

## 🚀 Instructions de Démarrage

### 1. Installation des Dépendances

Ajoutez ces dépendances à votre `package.json` :

```bash
# Dépendances IA
npm install openai langchain @langchain/openai
npm install @pinecone-database/pinecone
npm install @sendgrid/mail

# Dépendances utilitaires
npm install handlebars
npm install date-fns
npm install uuid
```

### 2. Configuration des Variables d'Environnement

Créez un fichier `.env.local` :

```env
# Supabase
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# OpenAI
VITE_OPENAI_API_KEY=your_openai_api_key

# SendGrid
VITE_SENDGRID_API_KEY=your_sendgrid_api_key

# Pinecone (optionnel)
VITE_PINECONE_API_KEY=your_pinecone_api_key
VITE_PINECONE_ENVIRONMENT=your_pinecone_environment
```

### 3. Configuration Supabase

Créez ces tables dans votre base de données Supabase :

```sql
-- Table pour les évaluations
CREATE TABLE valuations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  company_name TEXT NOT NULL,
  sector TEXT NOT NULL,
  revenue DECIMAL,
  ebitda DECIMAL,
  valuation_data JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table pour les conversations de négociation
CREATE TABLE negotiation_conversations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  deal_context JSONB,
  messages JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table pour les templates d'emails
CREATE TABLE email_templates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  subject TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT NOT NULL,
  variables JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table pour les campagnes d'emails
CREATE TABLE email_campaigns (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  template_id UUID REFERENCES email_templates(id),
  recipients JSONB,
  status TEXT DEFAULT 'draft',
  scheduled_at TIMESTAMP WITH TIME ZONE,
  sent_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 4. Configuration des RLS (Row Level Security)

```sql
-- RLS pour les évaluations
ALTER TABLE valuations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own valuations" ON valuations
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own valuations" ON valuations
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS pour les conversations
ALTER TABLE negotiation_conversations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own conversations" ON negotiation_conversations
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own conversations" ON negotiation_conversations
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS pour les templates (admin seulement)
ALTER TABLE email_templates ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can manage templates" ON email_templates
  FOR ALL USING (auth.jwt() ->> 'role' = 'admin');
```

### 5. Configuration OpenAI

Créez un fichier `src/lib/openai.ts` :

```typescript
import OpenAI from 'openai';

export const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true // Pour le développement uniquement
});
```

### 6. Configuration SendGrid

Créez un fichier `src/lib/sendgrid.ts` :

```typescript
import sgMail from '@sendgrid/mail';

sgMail.setApiKey(import.meta.env.VITE_SENDGRID_API_KEY);

export { sgMail };
```

### 7. Configuration Pinecone (optionnel)

Créez un fichier `src/lib/pinecone.ts` :

```typescript
import { Pinecone } from '@pinecone-database/pinecone';

export const pinecone = new Pinecone({
  apiKey: import.meta.env.VITE_PINECONE_API_KEY,
});
```

## 🧪 Tests des Fonctionnalités

### Test TGIM Valuator
1. Naviguez vers `/valuator`
2. Remplissez le formulaire d'évaluation
3. Cliquez sur "Analyser avec l'IA"
4. Vérifiez les résultats et recommandations

### Test TGIM Negotiator AI
1. Naviguez vers `/negotiator-ai`
2. Remplissez le contexte du deal
3. Commencez une conversation avec l'IA
4. Testez les stratégies recommandées

### Test Chatbot IA
1. Naviguez vers `/chatbot`
2. Posez des questions sur les processus M&A
3. Vérifiez les sources et citations
4. Testez les questions rapides

### Test Système d'emailing
1. Naviguez vers `/email-system`
2. Créez un nouveau template
3. Composez un email
4. Testez les workflows automatisés

## 🔧 Développement

### Structure des Hooks IA

Créez ces hooks personnalisés :

```typescript
// src/hooks/useValuation.ts
export const useValuation = () => {
  // Logique d'évaluation IA
};

// src/hooks/useNegotiationAI.ts
export const useNegotiationAI = () => {
  // Logique de négociation IA
};

// src/hooks/useChatbot.ts
export const useChatbot = () => {
  // Logique du chatbot
};

// src/hooks/useEmailSystem.ts
export const useEmailSystem = () => {
  // Logique d'emailing
};
```

### Services API

Créez ces services :

```typescript
// src/services/aiService.ts
export class AIService {
  static async evaluateCompany(data: any) {
    // Appel à l'API OpenAI
  }
  
  static async generateNegotiationStrategy(context: any) {
    // Génération de stratégie
  }
  
  static async chatWithBot(message: string) {
    // Chat avec le bot
  }
}

// src/services/emailService.ts
export class EmailService {
  static async sendEmail(template: any, data: any) {
    // Envoi d'email
  }
  
  static async createCampaign(campaign: any) {
    // Création de campagne
  }
}
```

## 📊 Monitoring et Analytics

### Métriques à Tracker

1. **TGIM Valuator**
   - Nombre d'évaluations par jour
   - Temps de traitement moyen
   - Taux de satisfaction

2. **TGIM Negotiator AI**
   - Nombre de conversations
   - Temps de réponse moyen
   - Taux de succès des stratégies

3. **Chatbot IA**
   - Nombre de questions posées
   - Taux de résolution
   - Satisfaction utilisateur

4. **Système d'emailing**
   - Taux de délivrabilité
   - Taux d'ouverture
   - Taux de clic

## 🚀 Déploiement

### Variables d'Environnement Production

```env
# Production
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_production_anon_key
VITE_OPENAI_API_KEY=your_production_openai_key
VITE_SENDGRID_API_KEY=your_production_sendgrid_key
```

### Build et Déploiement

```bash
# Build de production
npm run build

# Déploiement sur Vercel
vercel --prod

# Ou déploiement sur Netlify
netlify deploy --prod
```

## 🔒 Sécurité

### Bonnes Pratiques

1. **API Keys** : Ne jamais exposer les clés API côté client
2. **RLS** : Utiliser Row Level Security sur toutes les tables
3. **Validation** : Valider toutes les entrées utilisateur
4. **Rate Limiting** : Implémenter des limites de taux
5. **Logging** : Logger toutes les actions sensibles

### Configuration CORS

```typescript
// Dans votre configuration Supabase
const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true
    }
  }
);
```

## 📚 Ressources Utiles

- [Documentation OpenAI](https://platform.openai.com/docs)
- [Documentation LangChain](https://python.langchain.com/)
- [Documentation Supabase](https://supabase.com/docs)
- [Documentation SendGrid](https://docs.sendgrid.com/)
- [Documentation Pinecone](https://docs.pinecone.io/)

## 🆘 Support

En cas de problème :

1. Vérifiez les logs de la console
2. Vérifiez les variables d'environnement
3. Vérifiez la configuration Supabase
4. Consultez la documentation des APIs
5. Contactez l'équipe de développement

---

*Configuration complète pour le défi TGIM - Intelligence Artificielle*
