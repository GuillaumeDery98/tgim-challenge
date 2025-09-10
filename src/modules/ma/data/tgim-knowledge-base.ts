import { TGIMDocument, KnowledgeBaseStats } from '../types';

export const mockTGIMDocuments: TGIMDocument[] = [
  // Guides fondamentaux
  {
    id: 'guide-001',
    title: 'Guide Complet de la Reprise d\'Entreprise TGIM',
    content: `La reprise d'entreprise est un processus complexe qui nécessite une préparation méthodique et une approche structurée. Ce guide présente les étapes essentielles pour réussir votre projet de reprise.

## Les 4 phases essentielles

### Phase 1: Préparation et ciblage (Module M1)
- Définition de votre profil acquéreur
- Identification des critères de recherche
- Construction de votre crédibilité
- Élaboration de votre pitch

### Phase 2: Négociation et valorisation (Module M2)
- Techniques de valorisation d'entreprise
- Stratégies de négociation
- Structuration de l'offre
- Gestion des concessions

### Phase 3: Due Diligence (Module M3)
- Audit financier, juridique et opérationnel
- Identification des risques
- Stratégies de mitigation
- Renégociation post-audit

### Phase 4: Finalisation (Module M4)
- Négociation des points finaux
- Préparation du closing
- Gestion de la transition
- Intégration post-acquisition

La méthode TGIM a été développée pour accompagner plus de 5000 repreneurs et affiche un taux de succès de 78% sur les projets accompagnés.`,
    category: 'guide',
    tags: ['reprise', 'méthodologie', 'TGIM', 'processus', 'débutant'],
    author: 'Équipe TGIM',
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-08-20T14:30:00Z',
    difficulty_level: 'beginner',
    estimated_read_time: 15,
    related_modules: ['M1', 'M2', 'M3', 'M4'],
  },

  // Module M1 - Formation
  {
    id: 'formation-m1-001',
    title: 'Module M1: Maîtriser le Ciblage et l\'Approche',
    content: `Le Module M1 est la fondation de votre réussite en reprise d'entreprise. Il vous permet de construire une approche professionnelle et crédible.

## Objectifs du Module M1

### 1. Définir votre profil acquéreur
- Analyse de vos compétences et expérience
- Identification de vos secteurs de prédilection
- Définition de vos critères financiers
- Construction de votre story-telling

### 2. Techniques de sourcing
- Méthodes de prospection directe
- Utilisation des réseaux professionnels
- Exploitation des bases de données
- Approche des intermédiaires

### 3. Construction de la crédibilité
- Élaboration du dossier acquéreur
- Préparation des références
- Validation de la capacité financière
- Témoignages et recommandations

### 4. L'art de l'approche
- Scripts d'approche téléphonique
- Emails de première prise de contact
- Préparation des rendez-vous
- Gestion des objections

## Outils fournis
- Template de dossier acquéreur
- Scripts d'approche personnalisables
- Grille d'évaluation des cibles
- Planning de prospection

L'expérience montre que les repreneurs qui maîtrisent le M1 multiplient leurs chances de succès par 3.`,
    category: 'formation',
    tags: ['M1', 'ciblage', 'approche', 'prospection', 'crédibilité'],
    author: 'Expert TGIM M1',
    created_at: '2024-02-10T09:00:00Z',
    updated_at: '2024-08-15T16:45:00Z',
    difficulty_level: 'intermediate',
    estimated_read_time: 25,
    related_modules: ['M1'],
  },

  // Template Business Plan
  {
    id: 'template-001',
    title: 'Business Plan Type pour Reprise d\'Entreprise',
    content: `Ce template de business plan est spécialement conçu pour les projets de reprise d'entreprise. Il intègre les spécificités du financement de reprise et les attentes des investisseurs.

## Structure du Business Plan de Reprise

### 1. Executive Summary
- Présentation du repreneur
- Synthèse de la cible
- Stratégie de développement
- Besoins de financement
- Retour sur investissement attendu

### 2. Le Repreneur
- Parcours professionnel
- Compétences clés
- Motivations
- Vision stratégique
- Équipe managériale

### 3. L'Entreprise Cible
- Présentation générale
- Positionnement concurrentiel
- Analyse financière
- Forces et faiblesses
- Potentiel de développement

### 4. Stratégie de Développement
- Axes de croissance identifiés
- Plans d'action opérationnels
- Investissements prévus
- Timeline de déploiement
- Synergies attendues

### 5. Projections Financières
- Comptes de résultat prévisionnels 5 ans
- Plans de trésorerie
- Bilans prévisionnels
- Calcul de la rentabilité
- Analyse de sensibilité

### 6. Financement
- Structure de financement proposée
- Apport personnel
- Financement bancaire
- Investisseurs potentiels
- Garanties offertes

## Conseils de rédaction
- Soyez factuel et précis dans vos analyses
- Documentez toutes vos hypothèses
- Préparez plusieurs scenarii
- Adaptez le contenu à votre audience
- Faites relire par des experts

Un business plan bien construit augmente vos chances d'obtenir un financement de 65%.`,
    category: 'template',
    tags: ['business-plan', 'financement', 'template', 'reprise', 'investisseurs'],
    author: 'Expert Financement TGIM',
    created_at: '2024-01-25T11:30:00Z',
    updated_at: '2024-09-01T13:20:00Z',
    difficulty_level: 'intermediate',
    estimated_read_time: 30,
    related_modules: ['M1', 'M2'],
  },

  // Checklist Due Diligence
  {
    id: 'checklist-001',
    title: 'Due Diligence: Checklist Complète des Points de Contrôle',
    content: `Cette checklist exhaustive vous guide à travers tous les aspects de la due diligence d'acquisition. Elle est le fruit de plus de 500 opérations accompagnées par TGIM.

## Due Diligence Financière

### Analyse des Comptes
□ Comptes sociaux des 3 dernières années
□ Liasses fiscales et annexes
□ Rapports des commissaires aux comptes
□ États de rapprochement bancaire
□ Détail des créances et dettes
□ Inventaire et évaluation des stocks
□ Analyse du BFR et de sa saisonnalité

### Analyse de la Performance
□ Évolution du CA par produit/service
□ Analyse de la marge brute
□ Décomposition des charges fixes/variables
□ Capacité d'autofinancement
□ Investissements et amortissements
□ Éléments exceptionnels récurrents

## Due Diligence Juridique

### Structure Juridique
□ Statuts et pactes d'actionnaires
□ PV d'assemblées et de conseils
□ Registre des mouvements de titres
□ Conventions réglementées
□ Pouvoirs et délégations
□ Assurances de la société

### Contrats et Engagements
□ Contrats clients significatifs
□ Contrats fournisseurs stratégiques
□ Baux commerciaux et industriels
□ Contrats de travail cadres
□ Accords de partenariat
□ Litiges en cours

## Due Diligence Opérationnelle

### Organisation
□ Organigramme et effectifs
□ Politiques RH et rémunération
□ Processus opérationnels clés
□ Système d'information
□ Contrôle de gestion
□ Indicateurs de performance

### Commercial et Marketing
□ Base de données clients
□ Analyse de la concurrence
□ Positionnement produits/services
□ Canaux de distribution
□ Force commerciale
□ Pipeline commercial

## Points d'Attention Critiques

### Red Flags Financiers
- Dégradation récente de la rentabilité
- Augmentation anormale du BFR
- Créances douteuses non provisionnées
- Endettement caché ou hors bilan
- Dépendance excessive à un client

### Red Flags Opérationnels
- Départ récent de dirigeants clés
- Perte de contrats importants
- Obsolescence technologique
- Problèmes de qualité récurrents
- Climat social dégradé

Cette checklist doit être adaptée selon le secteur et la taille de l'entreprise cible.`,
    category: 'checklist',
    tags: ['due-diligence', 'audit', 'M3', 'contrôle', 'risques'],
    author: 'Expert DD TGIM',
    created_at: '2024-03-05T14:15:00Z',
    updated_at: '2024-08-30T10:30:00Z',
    difficulty_level: 'advanced',
    estimated_read_time: 40,
    related_modules: ['M3'],
  },

  // Valorisation d'entreprise
  {
    id: 'guide-valorisation-001',
    title: 'Méthodes de Valorisation d\'Entreprise: Guide Pratique',
    content: `La valorisation est l'un des enjeux majeurs de toute opération de reprise. Ce guide présente les principales méthodes utilisées par les professionnels et leurs conditions d'application.

## Méthodes Patrimoniales

### Actif Net Comptable (ANC)
L'ANC représente la différence entre l'actif total et les dettes. Simple à calculer mais ne reflète pas toujours la valeur réelle.

**Formule**: ANC = Capitaux Propres

**Avantages**:
- Simplicité de calcul
- Basé sur des données objectives
- Utile pour les entreprises en difficulté

**Inconvénients**:
- Ne tient pas compte de la rentabilité
- Valeurs comptables ≠ valeurs de marché
- Ignore les actifs incorporels

### Actif Net Comptable Réévalué (ANCR)
Correction de l'ANC en réévaluant certains postes à leur valeur de marché.

**Retraitements courants**:
- Immobilisations à la valeur vénale
- Stocks à la valeur de réalisation
- Créances à la valeur recouvrable
- Provisions pour risques réels

## Méthodes Comparatives

### Multiples de Résultats
Application de multiples observés sur des transactions comparables.

**Multiples usuels**:
- Prix/CA: 0,5 à 3x selon le secteur
- Prix/EBITDA: 4 à 12x selon la croissance
- Prix/Résultat Net: 8 à 20x selon la qualité

**Conditions d'utilisation**:
- Entreprises comparables disponibles
- Multiples récents et pertinents
- Ajustements pour les spécificités

### Multiples d'Actifs
Pour les entreprises capitalistiques ou détenant des actifs spécifiques.

## Méthodes de Rendement

### Discounted Cash Flow (DCF)
Méthode la plus rigoureuse économiquement.

**Étapes**:
1. Projection des flux de trésorerie libres
2. Calcul du coût moyen pondéré du capital (WACC)
3. Actualisation des flux futurs
4. Calcul de la valeur terminale
5. Sommation et ajustements

**Formule**: Valeur = Σ(FCF / (1+WACC)^n) + VT/(1+WACC)^n

### Méthode des Dividendes
Pour les participations minoritaires ou les entreprises matures.

## Approche Multicritères

En pratique, utilisez toujours plusieurs méthodes:
- Méthode patrimoniale: plancher de valorisation
- Méthodes comparatives: fourchette de marché  
- DCF: valeur économique théorique

**Conseils pratiques**:
- Documentez toutes vos hypothèses
- Réalisez des analyses de sensibilité
- Confrontez vos résultats au marché
- Préparez plusieurs scenarios
- Faites valider par un expert

La valorisation n'est pas une science exacte mais un art qui se nourrit d'expérience et de méthode.`,
    category: 'guide',
    tags: ['valorisation', 'M2', 'DCF', 'multiples', 'évaluation'],
    author: 'Expert Évaluation TGIM',
    created_at: '2024-02-20T16:00:00Z',
    updated_at: '2024-08-25T12:15:00Z',
    difficulty_level: 'advanced',
    estimated_read_time: 35,
    related_modules: ['M2'],
  },

  // Négociation - Techniques avancées
  {
    id: 'formation-negociation-001',
    title: 'Techniques de Négociation Avancées en M&A',
    content: `La négociation en M&A nécessite des techniques spécifiques. Ce module vous enseigne les stratégies des meilleurs négociateurs en acquisition.

## Préparation de la Négociation

### Analyse de la Position de Force
**Vos atouts**:
- Qualité de votre dossier acquéreur
- Solidité de votre financement
- Timing favorable pour le vendeur
- Synergies identifiées
- Absence de concurrence

**Points de vigilance**:
- Motivation réelle du vendeur
- Autres acquéreurs potentiels
- Urgence de votre côté
- Dépendances particulières
- Contraintes temporelles

### Définition des Objectifs
**Impératif**: ce qui est non-négociable
**Souhaitable**: ce que vous aimeriez obtenir
**Possible**: ce que vous pourriez accepter

## Stratégies de Négociation

### La Négociation Distributive
Somme nulle - gain de l'un = perte de l'autre

**Techniques**:
- Ancrage initial ambitieux mais justifié
- Concessions graduelles et conditionnelles
- Création de la pression temporelle
- Alternative crédible (BATNA)

### La Négociation Intégrative  
Recherche de solutions win-win

**Approches**:
- Élargissement du périmètre de négociation
- Structuration créative de l'opération
- Échelonnement des paiements
- Partage des risques
- Earn-out et compléments de prix

## Points Clés de Négociation

### Le Prix
**Techniques de justification**:
- Méthodes de valorisation multiples
- Benchmarks sectoriels
- Impact des ajustements identifiés
- Partage des synergies
- Prise en compte des risques

### Les Garanties
**Négociation des warranties**:
- Périmètre des garanties données
- Seuils de déclenchement
- Plafonds d'indemnisation
- Durée des garanties
- Modalités de mise en œuvre

### Le Financement Vendeur
**Avantages pour le vendeur**:
- Prix de cession plus élevé
- Fiscalité optimisée
- Maintien d'un lien
- Étalement des risques

**Structuration possible**:
- Crédit-vendeur classique
- Obligations convertibles
- Actions de préférence
- Earn-out

## Gestion des Objections

### Objections sur le Prix
- "C'est trop bas par rapport à mes attentes"
- "D'autres sont prêts à payer plus"
- "La valorisation ne reflète pas le potentiel"

**Réponses types**:
- Recentrer sur la méthode de valorisation
- Questionner sur les autres offres concrètes
- Proposer des mécanismes d'intéressement au futur

### Objections sur les Conditions
- "Les garanties demandées sont trop étendues"
- "Le délai de closing est trop long"
- "Les conditions suspensives sont trop nombreuses"

**Stratégies de réponse**:
- Expliquer la logique des demandes
- Proposer des contreparties
- Graduer les exigences
- Accepter des concessions mineures

## Techniques Psychologiques

### Création de l'Engagement
- Faire verbaliser l'accord par le vendeur
- Obtenir des concessions graduelles
- Utiliser la réciprocité
- S'appuyer sur la cohérence

### Gestion des Émotions
- Rester factuel et professionnel
- Ne jamais prendre les attaques personnellement
- Savoir faire des pauses
- Distinguer les personnes du problème

La négociation est un marathon, pas un sprint. La patience et la préparation sont vos meilleurs alliés.`,
    category: 'formation',
    tags: ['négociation', 'M2', 'stratégie', 'psychologie', 'techniques'],
    author: 'Expert Négociation TGIM',
    created_at: '2024-03-15T13:45:00Z',
    updated_at: '2024-08-18T15:30:00Z',
    difficulty_level: 'advanced',
    estimated_read_time: 45,
    related_modules: ['M2'],
  },

  // Cas d'étude
  {
    id: 'case-study-001',
    title: 'Cas d\'étude: Reprise de TechFlow Solutions',
    content: `Cette étude de cas détaille la reprise réussie de TechFlow Solutions, une PME informatique de 25 salariés, par un cadre dirigeant en reconversion.

## Contexte de l'Opération

### Le Repreneur: Marc DURAND
**Profil**:
- 42 ans, ingénieur commercial
- 15 ans d'expérience dans l'IT
- Directeur régional dans une multinationale
- Apport personnel: 200 K€
- Motivation: créer sa propre structure

### La Cible: TechFlow Solutions
**Activité**: Intégration de solutions IT pour PME/ETI
**Création**: 2018
**Effectif**: 25 salariés
**CA 2023**: 3,2 M€
**EBITDA 2023**: 380 K€
**Dirigeant**: Fondateur souhaitant se retirer

## Déroulement de l'Opération

### Phase M1: Identification et Approche (3 mois)
**Actions menées**:
- Sourcing via réseau professionnel IT
- Construction du dossier acquéreur
- Première approche via introduction commune
- 3 rendez-vous préparatoires

**Difficultés rencontrées**:
- Méfiance initiale du dirigeant
- Concurrence d'un fonds d'investissement
- Questionnement sur la capacité de financement

**Solutions apportées**:
- Démonstration de l'expertise sectorielle
- Présentation d'un projet industriel cohérent
- Attestation bancaire de préfinancement

### Phase M2: Négociation (2 mois)
**Points négociés**:

**Prix**: 
- Demande initiale vendeur: 1,8 M€ (4,7x EBITDA)
- Offre initiale acheteur: 1,3 M€ (3,4x EBITDA)
- Prix final: 1,5 M€ (3,9x EBITDA)

**Structure**:
- Cash au closing: 1,2 M€
- Crédit vendeur: 300 K€ sur 3 ans
- Earn-out: 10% sur la croissance du CA > 5%

**Garanties**:
- Garantie de passif: 18 mois, plafond 300 K€
- Seuil de déclenchement: 15 K€
- Séquestre: 150 K€ chez le notaire

### Phase M3: Due Diligence (6 semaines)
**Audits menés**:
- Financier: cabinet expertise-comptable
- Juridique: avocat spécialisé M&A  
- IT: expert technique indépendant
- Social: cabinet RH

**Points d'attention identifiés**:
- Dépendance client: 35% du CA sur 2 clients
- Obsolescence partielle du matériel
- Accord de partenariat à renégocier
- Provisions congés payés insuffisantes

**Ajustements négociés**:
- Réduction de prix: 80 K€
- Investissement matériel pris en charge
- Clause de non-débauchage renforcée

### Phase M4: Finalisation (3 semaines)
**Closing conditions**:
- Financement bancaire confirmé
- Accords sociaux signés
- Nouveaux contrats clients sécurisés
- Transfert des agréments

**Structure finale de financement**:
- Apport personnel: 200 K€
- Prêt bancaire: 950 K€
- Crédit vendeur: 300 K€
- Financement matériel: 50 K€

## Résultats Post-Acquisition

### Performances 18 mois post-closing
**Croissance**:
- CA 2024: 4,1 M€ (+28%)
- EBITDA 2024: 520 K€ (+37%)
- Effectif: 32 salariés

**Actions mises en œuvre**:
- Diversification client réussie
- 2 nouveaux partenariats signés
- Refonte de l'offre commerciale
- Digitalisation des processus

### ROI Repreneur
**Valorisation estimée 2024**: 2,1 M€
**ROI sur apport initial**: 26% annualisé
**Earn-out déclenché**: 35 K€ en 2024

## Facteurs Clés de Succès

### Préparation du Repreneur
- Excellente connaissance sectorielle
- Projet industriel documenté
- Financement sécurisé avant approche
- Accompagnement par des experts

### Qualité de la Relation
- Confiance établie avec le cédant
- Transparence sur les difficultés
- Respect des engagements temporels
- Maintien de l'équipe dirigeante

### Post-Acquisition
- Implication personnelle forte
- Respect de la culture d'entreprise
- Investissements stratégiques rapides
- Communication transparente aux équipes

## Leçons Apprises

### Points Positifs
- L'expertise sectorielle est déterminante
- La préparation financière rassure
- La due diligence a évité des écueils
- L'accompagnement expert est rentable

### Points d'Amélioration
- Négociation du crédit vendeur trop favorable
- Due diligence commerciale insuffisante
- Clause de non-concurrence à préciser
- Plan d'intégration à structurer davantage

Cette opération illustre parfaitement l'efficacité de la méthode TGIM appliquée avec rigueur.`,
    category: 'case_study',
    tags: ['étude-de-cas', 'réussite', 'IT', 'PME', 'financement'],
    author: 'Équipe TGIM',
    created_at: '2024-04-10T09:30:00Z',
    updated_at: '2024-09-05T11:45:00Z',
    difficulty_level: 'intermediate',
    estimated_read_time: 50,
    related_modules: ['M1', 'M2', 'M3', 'M4'],
  },

  // Outil - Calculateur de valorisation
  {
    id: 'tool-001',
    title: 'Calculateur de Valorisation Automatisé TGIM',
    content: `Cet outil vous permet de calculer rapidement une fourchette de valorisation pour votre cible d'acquisition en utilisant plusieurs méthodes simultanément.

## Utilisation du Calculateur

### Données Requises
**Informations Financières**:
- Chiffre d'affaires des 3 dernières années
- EBITDA des 3 dernières années
- Résultat net des 3 dernières années
- Capitaux propres
- Dettes financières nettes

**Informations Sectorielles**:
- Secteur d'activité principal
- Taille de l'entreprise (TPE/PME/ETI)
- Zone géographique
- Croissance du marché

### Méthodes Intégrées

**1. Méthode des Multiples**
Le calculateur applique automatiquement les multiples moyens par secteur:
- Commerce: 2-4x EBITDA
- Industrie: 4-7x EBITDA  
- Services: 5-8x EBITDA
- Tech/Digital: 6-12x EBITDA

**2. DCF Simplifié**
Basé sur une projection automatique:
- Croissance CA: moyenne 3 ans ou secteur
- Évolution marge: stabilité ou amélioration
- Investissements: % CA historique
- WACC: calculé selon taille et secteur

**3. Valeur Patrimoniale**
- Actif net comptable
- Ajustements standards
- Valeur de liquidation estimée

## Fonctionnalités Avancées

### Analyse de Sensibilité
Le calculateur teste automatiquement:
- Variations de multiples ±20%
- Scénarios de croissance optimiste/pessimiste
- Impact des ajustements de prix

### Benchmarking Sectoriel
Comparaison avec:
- Transactions récentes similaires
- Moyennes sectorielles
- Ratios de rentabilité

### Export des Résultats
- Synthèse valorisation PDF
- Tableaux détaillés Excel
- Graphiques de sensibilité
- Note de synthèse argumentée

## Mode d'Emploi

### Étape 1: Saisie des Données
Remplissez le formulaire avec les informations de l'entreprise cible. Le calculateur détecte automatiquement les incohérences.

### Étape 2: Paramétrage
Ajustez si nécessaire:
- Taux de croissance prévisionnels
- Multiples sectoriels spécifiques
- Hypothèses de synergies

### Étape 3: Génération
Le système calcule instantanément:
- Fourchette de valorisation
- Méthode dominante recommandée
- Points d'attention identifiés

### Étape 4: Analyse
Étudiez les résultats:
- Cohérence entre méthodes
- Écarts et explications
- Recommandations d'approfondissement

## Cas d'Usage Types

### Évaluation Préliminaire
Pour une première approche rapide avant négociation détaillée.

### Validation d'Offre
Pour vérifier la cohérence d'un prix proposé avec les standards du marché.

### Préparation de Financement
Pour argumenter une demande de prêt avec des valorisations documentées.

### Négociation
Pour disposer de fourchettes objectives lors des discussions.

## Limites de l'Outil

**Attention**: Ce calculateur fournit une estimation basée sur des moyennes sectorielles. Il ne remplace pas:
- Une due diligence approfondie
- L'expertise d'un évaluateur professionnel
- L'analyse des spécificités de l'entreprise
- La prise en compte du contexte concurrentiel

**Recommandations**:
- Utilisez-le comme point de départ
- Confrontez avec d'autres sources
- Ajustez selon vos analyses qualitatives
- Faites valider par un expert pour les enjeux importants

L'outil est mis à jour trimestriellement avec les dernières données de marché.`,
    category: 'tool',
    tags: ['valorisation', 'calculateur', 'outil', 'automatisé', 'M2'],
    author: 'Équipe Tech TGIM',
    created_at: '2024-05-01T08:00:00Z',
    updated_at: '2024-09-01T10:15:00Z',
    difficulty_level: 'beginner',
    estimated_read_time: 20,
    related_modules: ['M2'],
  },

  // Formation M3
  {
    id: 'formation-m3-001',
    title: 'Module M3: Maîtriser la Due Diligence d\'Acquisition',
    content: `Le Module M3 vous forme à conduire une due diligence d'acquisition efficace et à identifier les risques cachés qui pourraient compromettre votre investissement.

## Objectifs Pédagogiques

### Compétences Visées
- Structurer et planifier une due diligence
- Identifier les risques critiques par domaine
- Analyser et interpréter les findings
- Négocier les ajustements de prix et garanties
- Prendre une décision go/no-go éclairée

## Programme Détaillé

### Module 3.1: Préparation de la DD
**Durée**: 2h

**Contenu**:
- Définition du périmètre d'audit
- Sélection des experts spécialisés
- Préparation des demandes documentaires
- Planning et budget de DD
- Négociation des conditions d'accès

**Livrables**:
- Checklist personnalisée par secteur
- Templates de demande d'information
- Grille de sélection des experts

### Module 3.2: DD Financière Approfondie
**Durée**: 4h

**Contenu**:
- Analyse des comptes retraités
- Quality of Earnings (QoE)
- Analyse prédictive et projections
- Identification des ajustements de BFR
- Évaluation des contingences

**Cas pratique**: Audit financier sur cas réel anonymisé

### Module 3.3: DD Juridique et Fiscale  
**Durée**: 3h

**Contenu**:
- Audit des structures et participations
- Revue des contrats significatifs
- Identification des passifs cachés
- Optimisation fiscale post-acquisition
- Stratégies de limitation des risques

**Focus**: Négociation des garanties d'actif et de passif

### Module 3.4: DD Opérationnelle
**Durée**: 3h

**Contenu**:
- Audit des processus clés
- Évaluation des équipes et compétences
- Analyse concurrentielle approfondie
- Identification des synergies opérationnelles
- Plan de transformation post-acquisition

**Outils**: Matrices d'analyse opérationnelle

### Module 3.5: DD Spécialisée
**Durée**: 2h

**Contenu**:
- DD Environnementale et RSE
- DD IT et cybersécurité
- DD Propriété intellectuelle
- DD Social et RH
- Adaptation selon le secteur

### Module 3.6: Synthèse et Décision
**Durée**: 2h

**Contenu**:
- Consolidation des findings
- Évaluation de l'impact sur la valorisation
- Stratégies de mitigation des risques
- Préparation de la renégociation
- Matrice de décision go/no-go

## Méthodologie TGIM

### Approche Systémique
La DD ne doit pas être une simple vérification mais une vraie compréhension du business model et de ses facteurs clés de succès.

### Focus Risques
Identification précoce des deal-breakers potentiels pour optimiser le temps et les coûts.

### Vision 360°
Intégration de tous les aspects: financier, juridique, opérationnel, humain, environnemental.

## Outils et Templates

### Checklist Sectorielles
- Commerce/Distribution
- Industrie/Manufacturing  
- Services aux entreprises
- Technologies/Digital
- Santé/Médico-social

### Tableaux d'Analyse
- Grille de scoring des risques
- Matrice impact/probabilité
- Calculateur d'ajustements de prix
- Synthèse executive pour comité d'engagement

### Documents Types
- Letter of Intent avec clauses de DD
- Confidentiality Agreement
- Management Presentation
- Vendor Due Diligence review

## Certification M3

### Évaluation Pratique
- Étude de cas complète en 6h
- Présentation orale des conclusions
- Négociation simulée des ajustements

### Critères de Réussite
- Identification exhaustive des risques majeurs
- Calcul précis des impacts financiers
- Stratégie de renégociation cohérente
- Recommendation go/no-go argumentée

## Statistiques de Performance

### Retour d'Expérience
- 89% des participants détectent plus de risques après formation
- Réduction moyenne de 15% des surprises post-closing
- Amélioration de 23% de la négociation des garanties
- ROI formation: 1 euro investi = 8 euros économisés

La DD est votre dernière chance de découvrir les problèmes avant qu'ils ne deviennent les vôtres. Ne la sous-estimez jamais.`,
    category: 'formation',
    tags: ['M3', 'due-diligence', 'audit', 'risques', 'formation'],
    author: 'Expert DD TGIM',
    created_at: '2024-04-20T14:30:00Z',
    updated_at: '2024-08-28T16:20:00Z',
    difficulty_level: 'advanced',
    estimated_read_time: 35,
    related_modules: ['M3'],
  },

  // Template - Lettre d'intention
  {
    id: 'template-loi-001',
    title: 'Template: Lettre d\'Intention (LOI) pour Acquisition',
    content: `Ce template de Lettre d'Intention est conçu pour encadrer vos négociations d'acquisition tout en préservant vos intérêts et votre flexibilité.

## Structure de la LOI

### En-tête et Parties
**[VOTRE SOCIÉTÉ]**
[Adresse complète]
Représentée par [Nom, Qualité]

**À l'attention de**
**[SOCIÉTÉ CIBLE]**  
[Adresse complète]
Représentée par [Nom, Qualité]

**Objet**: Lettre d'Intention - Acquisition de [XX]% de [SOCIÉTÉ CIBLE]

### Article 1: Objet de l'Opération
Nous avons l'honneur de vous faire part de notre intérêt pour l'acquisition de [XX]% du capital de [SOCIÉTÉ CIBLE] (ci-après "la Société") selon les modalités décrites ci-après.

Cette lettre d'intention n'a pas de valeur contractuelle et ne nous engage définitivement que sur les points expressément mentionnés comme engageants.

### Article 2: Prix et Modalités de Paiement

#### 2.1 Prix Proposé
Sur la base des éléments financiers communiqués, nous proposons un prix de [MONTANT] € pour [XX]% du capital, soit une valorisation de [MONTANT TOTAL] € pour 100% de la société.

#### 2.2 Modalités de Règlement
**Au closing**:
- Cash: [MONTANT] € ([XX]%)
- Crédit vendeur: [MONTANT] € ([XX]%)

**Crédit vendeur**:
- Durée: [X] ans
- Taux: [X]% l'an
- Garanties: [À préciser]

#### 2.3 Ajustements de Prix
Le prix pourra être ajusté en fonction:
- De l'évolution du BFR par rapport à la moyenne des [X] derniers mois
- Des résultats de la due diligence
- De l'obtention des autorisations nécessaires

### Article 3: Conditions Suspensives

#### 3.1 Due Diligence
La finalisation de l'opération est conditionnée à la réalisation d'une due diligence satisfaisante portant sur les aspects:
- Financier et comptable
- Juridique et fiscal  
- Commercial et opérationnel
- Social et environnemental

**Durée**: [X] semaines à compter de la signature de la présente

#### 3.2 Financement
L'opération est conditionnée à l'obtention d'un financement bancaire de [MONTANT] € selon les conditions de marché usuelles.

#### 3.3 Autorisations
Obtention de toutes les autorisations administratives, professionnelles ou autres nécessaires à la réalisation de l'opération.

#### 3.4 Situation Sociale
Absence de conflit social majeur et maintien des équipes clés jusqu'au closing.

### Article 4: Garanties et Indemnités

#### 4.1 Garantie de Passif
Le vendeur consent une garantie de passif selon les modalités suivantes:
- **Durée**: [X] mois à compter du closing
- **Plafond**: [XX]% du prix de cession
- **Franchise**: [MONTANT] € par sinistre
- **Seuil**: [MONTANT] € de sinistres cumulés

#### 4.2 Séquestre
Un séquestre de [XX]% du prix sera constitué chez [NOTAIRE/BANQUE] pour garantir les obligations du vendeur.

#### 4.3 Garanties Spécifiques
- Exactitude des comptes et états financiers
- Régularité des déclarations fiscales et sociales
- Validité des contrats commerciaux
- Absence de litigation significatif

### Article 5: Conditions d'Exclusivité

#### 5.1 Engagement du Vendeur
Le vendeur s'engage pendant [X] semaines à ne pas:
- Négocier avec d'autres acquéreurs potentiels
- Communiquer sur le projet de cession
- Modifier significativement l'exploitation

#### 5.2 Information Réciproque
Chaque partie s'engage à informer immédiatement l'autre de tout élément susceptible de remettre en cause l'opération.

### Article 6: Confidentialité
Les parties s'engagent à préserver la confidentialité absolue des informations échangées et de l'existence du présent projet.

Cette obligation perdure [X] ans après l'abandon éventuel du projet.

### Article 7: Gouvernance Transitoire
Jusqu'au closing, la société continuera d'être gérée dans le cours normal des affaires. Les décisions suivantes nécessiteront notre accord préalable:
- Investissements > [MONTANT] €
- Embauches cadres
- Nouveaux emprunts
- Distributions exceptionnelles

### Article 8: Planning Prévisionnel
- **Signature LOI**: [DATE]
- **Due diligence**: [X] semaines
- **Négociation finale**: [X] semaines  
- **Closing visé**: [DATE]

### Article 9: Frais
Chaque partie supporte ses propres frais de conseil et d'expertise.

En cas d'abandon du projet du fait de l'acquéreur sans motif légitime, ce dernier prendra en charge les frais d'expertise engagés par le vendeur dans la limite de [MONTANT] €.

### Article 10: Droit Applicable
La présente lettre d'intention est régie par le droit français. Tout litige sera porté devant les tribunaux de [VILLE].

## Points d'Attention

### Clauses à Personnaliser
- Ajustements sectoriels spécifiques
- Garanties adaptées aux risques identifiés
- Conditions suspensives selon le contexte
- Modalités de paiement optimisées

### Négociation Courante
- Durée d'exclusivité: 4-8 semaines
- Plafond de garantie: 10-30% du prix
- Durée de garantie: 12-18 mois
- Franchise: 0,5-2% du prix

Cette LOI doit impérativement être revue par votre conseil juridique avant signature.`,
    category: 'template',
    tags: ['LOI', 'lettre-intention', 'M2', 'juridique', 'négociation'],
    author: 'Expert Juridique TGIM',
    created_at: '2024-05-15T11:00:00Z',
    updated_at: '2024-08-20T14:45:00Z',
    difficulty_level: 'intermediate',
    estimated_read_time: 25,
    related_modules: ['M2'],
  },

  // Guide financement
  {
    id: 'guide-financement-001',
    title: 'Guide Complet du Financement d\'Acquisition',
    content: `Le financement est souvent le point critique d'un projet de reprise. Ce guide vous présente toutes les solutions disponibles et leurs conditions d'accès.

## Vue d'Ensemble du Financement

### Structure Type d'une Acquisition
**Montant d'acquisition**: 1 000 K€

**Répartition classique**:
- Apport personnel: 200 K€ (20%)
- Prêt bancaire: 600 K€ (60%)  
- Crédit vendeur: 150 K€ (15%)
- Financement alternatif: 50 K€ (5%)

## Sources de Financement

### 1. L'Apport Personnel

#### Composition Possible
**Apport liquide**:
- Épargne personnelle
- Épargne salariale (PEE, PERCO)
- Rachat d'assurance-vie
- Cession de valeurs mobilières

**Apport immobilier**:
- Hypothèque sur résidence principale
- Mise en location d'un bien
- SCI familiale

**Apport familial**:
- Don familial (100 K€ par parent)
- Prêt familial documenté
- Caution solidaire des proches

#### Optimisation Fiscale
- Étalement de l'imposition des plus-values
- Utilisation des dispositifs d'épargne
- Ingénierie patrimoniale préalable

### 2. Le Crédit Bancaire

#### Prêt Acquisition Classique
**Caractéristiques**:
- Durée: 7-10 ans généralement
- Taux: Euribor + marge (2-4%)
- Remboursement: annuités constantes
- Garanties: sur les titres + cautions personnelles

#### Prêt Backed by Cash-Flow
**Principe**: Remboursement sur les flux de l'entreprise
**Avantage**: Préservation de l'endettement personnel
**Inconvénient**: Covenants financiers stricts

#### Credit Acquisition Financing (CAF)
**Spécificité**: Financement 100% dédié acquisition
**Garanties**: Nantissement des titres uniquement
**Public**: Repreneurs expérimentés

### 3. Le Crédit Vendeur

#### Mécanisme
Le vendeur accepte de différer une partie du prix de cession et devient créancier de l'acquéreur.

#### Avantages Vendeur
- Prix de cession plus élevé
- Étalement de la fiscalité
- Sécurisation sur la transition
- Maintien d'un lien avec l'entreprise

#### Avantages Acquéreur
- Réduction du financement externe
- Négociation de conditions préférentielles
- Signal de confiance du vendeur
- Flexibilité de remboursement

#### Structuration
**Durée**: 3-5 ans typiquement
**Taux**: 3-6% selon le contexte
**Garanties**: 
- Nantissement des titres en 2ème rang
- Clause de retour à meilleure fortune
- Garantie personnelle limitée

### 4. Financements Alternatifs

#### Crowdfunding/Financement Participatif
**Plateformes spécialisées**:
- WiSEED Business
- Credit.fr
- Lendosphere

**Conditions**:
- Ticket minimum: 50-100 K€
- Taux: 5-8%
- Durée: 3-7 ans

#### Fonds de Financement Spécialisés
**Cibles**: Reprises PME/ETI
**Apport**: 100-500 K€
**Contrepartie**: Participation au capital (minoritaire)

#### BPI France
**Prêt Transmission**: Jusqu'à 650 K€
**Conditions**:
- PME de moins de 5000 salariés
- Maintien de l'emploi
- Taux préférentiel

### 5. Financement par l'Entreprise

#### Distribution Exceptionnelle
Utilisation de la trésorerie de l'entreprise pour financer partiellement son propre rachat.

**Mécanisme**:
1. Signature promesse de vente
2. Distribution par l'entreprise
3. Utilisation pour le financement
4. Réalisation de la vente

**Optimisation fiscale**: Flat tax de 30% vs IR + PS

#### LBO (Leveraged Buy-Out)
**Principe**: L'entreprise finance son propre rachat par l'endettement.

**Structure**:
- Création d'une holding d'acquisition
- Emprunt par la holding
- Remontée de dividendes de la cible
- Remboursement de la dette

## Montage Financier Optimisé

### Étape 1: Évaluation de Capacité
**Analyse de l'acquéreur**:
- Patrimoine et revenus
- Capacité d'endettement personnel
- Expérience professionnelle
- Projet de développement

**Analyse de la cible**:
- Capacité de remboursement
- Qualité des flux de trésorerie  
- Garanties disponibles
- Perspectives de développement

### Étape 2: Structuration
**Mix financier optimal**:
- Minimisation du coût global
- Préservation de la flexibilité
- Optimisation fiscale
- Sécurisation juridique

### Étape 3: Négociation
**Points clés à négocier**:
- Taux et conditions bancaires
- Modalités du crédit vendeur
- Garanties exigées
- Covenants financiers

## Dossier de Financement

### Pièces Essentielles
**Documents personnels**:
- CV et parcours détaillé
- Situation patrimoniale complète
- Projet professionnel argumenté
- Références et recommandations

**Dossier entreprise**:
- 3 derniers bilans et comptes
- Business plan 5 ans
- Audits et expertises
- Étude de marché sectorielle

**Documents juridiques**:
- Promesse de vente ou LOI
- Pacte d'associés prévu
- Garanties proposées
- Montage fiscal

### Présentation Bancaire
**Durée**: 45 minutes à 1h
**Participants**: Décideur crédit + analyste
**Support**: Présentation PowerPoint 15-20 slides

**Structure recommandée**:
1. Présentation repreneur (5 min)
2. Présentation cible (10 min)
3. Projet de développement (10 min)
4. Demande de financement (5 min)
5. Questions/réponses (15 min)

## Conseils Pratiques

### Préparation Amont
- Commencer les démarches 6 mois avant
- Consulter plusieurs banques
- Préparer des scenarii de financement
- Anticiper les garanties à donner

### Négociation
- Faire jouer la concurrence
- Négocier les frais de dossier
- Sécuriser les conditions de remboursement
- Prévoir des flexibilités

### Post-Signature
- Respecter scrupuleusement les covenants
- Communiquer régulièrement avec la banque
- Anticiper les remboursements
- Optimiser la structure au fur et à mesure

Le financement d'acquisition est un art qui combine technique, relationnel et négociation. Une bonne préparation est la clé du succès.`,
    category: 'guide',
    tags: ['financement', 'banque', 'crédit', 'LBO', 'structuration'],
    author: 'Expert Financement TGIM',
    created_at: '2024-06-01T10:30:00Z',
    updated_at: '2024-09-10T12:00:00Z',
    difficulty_level: 'advanced',
    estimated_read_time: 40,
    related_modules: ['M1', 'M2'],
  }
];

// Statistiques de la base de connaissances
export const knowledgeBaseStats: KnowledgeBaseStats = {
  total_documents: mockTGIMDocuments.length,
  documents_by_category: {
    guide: mockTGIMDocuments.filter(doc => doc.category === 'guide').length,
    formation: mockTGIMDocuments.filter(doc => doc.category === 'formation').length,
    template: mockTGIMDocuments.filter(doc => doc.category === 'template').length,
    checklist: mockTGIMDocuments.filter(doc => doc.category === 'checklist').length,
    case_study: mockTGIMDocuments.filter(doc => doc.category === 'case_study').length,
    tool: mockTGIMDocuments.filter(doc => doc.category === 'tool').length,
  },
  total_content_length: mockTGIMDocuments.reduce((acc, doc) => acc + doc.content.length, 0),
  avg_document_length: mockTGIMDocuments.reduce((acc, doc) => acc + doc.content.length, 0) / mockTGIMDocuments.length,
  most_popular_tags: [
    { tag: 'M1', count: mockTGIMDocuments.filter(doc => doc.tags.includes('M1')).length },
    { tag: 'M2', count: mockTGIMDocuments.filter(doc => doc.tags.includes('M2')).length },
    { tag: 'M3', count: mockTGIMDocuments.filter(doc => doc.tags.includes('M3')).length },
    { tag: 'négociation', count: mockTGIMDocuments.filter(doc => doc.tags.includes('négociation')).length },
    { tag: 'valorisation', count: mockTGIMDocuments.filter(doc => doc.tags.includes('valorisation')).length },
    { tag: 'financement', count: mockTGIMDocuments.filter(doc => doc.tags.includes('financement')).length },
    { tag: 'due-diligence', count: mockTGIMDocuments.filter(doc => doc.tags.includes('due-diligence')).length },
  ].sort((a, b) => b.count - a.count).slice(0, 7),
  last_updated: '2024-09-10T12:00:00Z',
};

// Conversations RAG exemples pour les tests
export const mockRAGConversations = [
  {
    user: "Comment faire une due diligence efficace ?",
    assistant: "La due diligence efficace nécessite une approche méthodique en plusieurs étapes. D'après notre guide complet, voici les points essentiels :\n\n**1. Préparation structurée**\n- Définir le périmètre d'audit selon votre secteur\n- Sélectionner les experts spécialisés appropriés\n- Préparer les demandes documentaires détaillées\n\n**2. Audit multi-dimensionnel**\n- **Financier** : analyse des comptes, quality of earnings, projections\n- **Juridique** : contrats, passifs cachés, garanties\n- **Opérationnel** : processus, équipes, concurrence\n- **Spécialisé** : IT, environnemental, social selon les besoins\n\n**3. Points d'attention critiques**\nNotre checklist identifie plusieurs red flags majeurs :\n- Dégradation récente de rentabilité\n- Dépendance client excessive (>30% du CA)\n- Départs de dirigeants clés\n- Provisions insuffisantes\n\nLa formation M3 TGIM montre que 89% des participants détectent plus de risques après apprentissage de ces méthodes.",
    sources: [
      {
        document_id: 'checklist-001',
        relevance_score: 0.95,
        excerpt: "Cette checklist exhaustive vous guide à travers tous les aspects de la due diligence d'acquisition..."
      },
      {
        document_id: 'formation-m3-001',
        relevance_score: 0.88,
        excerpt: "Le Module M3 vous forme à conduire une due diligence d'acquisition efficace..."
      }
    ],
    follow_up_questions: [
      "Quels sont les points juridiques critiques à vérifier ?",
      "Comment évaluer les risques financiers cachés ?",
      "Combien de temps prévoir pour une DD complète ?"
    ]
  },
  {
    user: "Quelles sont les méthodes de valorisation d'entreprise ?",
    assistant: "Il existe trois grandes familles de méthodes de valorisation, chacune avec ses avantages et conditions d'application :\n\n**1. Méthodes Patrimoniales**\n- **Actif Net Comptable (ANC)** : Simple mais limitée\n- **ANC Réévalué** : Ajustements aux valeurs de marché\n- Utilisation : Plancher de valorisation, entreprises en difficulté\n\n**2. Méthodes Comparatives (Multiples)**\n- **Multiples de résultats** : Prix/CA, Prix/EBITDA, Prix/RN\n- **Multiples sectoriels moyens** :\n  - Commerce: 2-4x EBITDA\n  - Industrie: 4-7x EBITDA\n  - Services: 5-8x EBITDA\n  - Tech: 6-12x EBITDA\n\n**3. Méthodes de Rendement**\n- **DCF (Discounted Cash Flow)** : Méthode la plus rigoureuse\n- **Dividendes actualisés** : Pour participations minoritaires\n\n**Approche recommandée TGIM :**\nUtilisez toujours plusieurs méthodes simultanément :\n- Patrimoniale = plancher\n- Multiples = fourchette de marché\n- DCF = valeur économique théorique\n\nNotre calculateur automatisé TGIM applique ces trois approches et génère une synthèse comparative avec analyse de sensibilité.",
    sources: [
      {
        document_id: 'guide-valorisation-001',
        relevance_score: 0.98,
        excerpt: "La valorisation est l'un des enjeux majeurs de toute opération de reprise. Ce guide présente les principales méthodes..."
      },
      {
        document_id: 'tool-001',
        relevance_score: 0.82,
        excerpt: "Cet outil vous permet de calculer rapidement une fourchette de valorisation pour votre cible..."
      }
    ],
    follow_up_questions: [
      "Comment calculer le DCF étape par étape ?",
      "Quels multiples utiliser pour mon secteur ?",
      "Comment justifier ma valorisation en négociation ?"
    ]
  }
];