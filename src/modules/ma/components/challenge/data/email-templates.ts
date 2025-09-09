import type { EmailTemplate, TemplateVariable } from '../types/email.types';

export const defaultVariables: TemplateVariable[] = [
  {
    key: 'user.firstName',
    label: 'Prénom utilisateur',
    defaultValue: 'Utilisateur',
    type: 'text',
    required: false
  },
  {
    key: 'user.lastName',
    label: 'Nom utilisateur',
    defaultValue: '',
    type: 'text',
    required: false
  },
  {
    key: 'user.email',
    label: 'Email utilisateur',
    defaultValue: 'user@example.com',
    type: 'text',
    required: true
  },
  {
    key: 'company.name',
    label: 'Nom de l\'entreprise',
    defaultValue: 'Votre Entreprise',
    type: 'text',
    required: false
  },
  {
    key: 'deal.amount',
    label: 'Montant du deal',
    defaultValue: '0',
    type: 'number',
    required: false
  },
  {
    key: 'currentDate',
    label: 'Date actuelle',
    defaultValue: new Date().toLocaleDateString('fr-FR'),
    type: 'date',
    required: false
  }
];

export const defaultTemplates: Omit<EmailTemplate, 'id' | 'createdAt' | 'updatedAt'>[] = [
  {
    name: 'Email de Bienvenue',
    subject: 'Bienvenue {{user.firstName}} sur TGIM Challenge !',
    category: 'transactional',
    isActive: true,
    createdBy: 'system',
    variables: defaultVariables,
    htmlContent: `
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Bienvenue</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
    <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
        <h1 style="margin: 0; font-size: 28px;">Bienvenue sur TGIM Challenge !</h1>
    </div>
    
    <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px;">
        <p style="font-size: 18px; margin-bottom: 20px;">
            Bonjour <strong>{{user.firstName}}</strong>,
        </p>
        
        <p style="margin-bottom: 20px;">
            Nous sommes ravis de vous accueillir dans notre communauté d'experts en M&A et intelligence artificielle !
        </p>
        
        <p style="margin-bottom: 20px;">
            Votre compte a été créé avec succès pour l'adresse email : <strong>{{user.email}}</strong>
        </p>
        
        <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #667eea;">
            <h3 style="color: #667eea; margin-top: 0;">Prochaines étapes :</h3>
            <ul style="padding-left: 20px;">
                <li>Explorez nos outils d'évaluation financière</li>
                <li>Testez notre négociateur IA</li>
                <li>Participez aux challenges techniques</li>
                <li>Rejoignez notre communauté d'experts</li>
            </ul>
        </div>
        
        <div style="text-align: center; margin: 30px 0;">
            <a href="#" style="background: #667eea; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">
                Commencer maintenant
            </a>
        </div>
        
        <p style="color: #666; font-size: 14px; margin-top: 30px;">
            Besoin d'aide ? Répondez simplement à cet email et notre équipe vous assistera.
        </p>
    </div>
    
    <div style="text-align: center; margin-top: 20px; color: #666; font-size: 12px;">
        <p>TGIM Challenge - Intelligence Artificielle & M&A</p>
        <p>Date : {{currentDate}}</p>
    </div>
</body>
</html>`
  },
  
  {
    name: 'Notification Deal Soumis',
    subject: 'Nouveau deal soumis - {{company.name}} ({{deal.amount}}€)',
    category: 'transactional',
    isActive: true,
    createdBy: 'system',
    variables: defaultVariables,
    htmlContent: `
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Nouveau Deal</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
    <div style="background: #28a745; color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0;">
        <h1 style="margin: 0; font-size: 24px;">🎯 Nouveau Deal Soumis</h1>
    </div>
    
    <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px;">
        <p style="font-size: 16px; margin-bottom: 20px;">
            Bonjour,
        </p>
        
        <p style="margin-bottom: 20px;">
            Un nouveau deal vient d'être soumis sur la plateforme TGIM Challenge.
        </p>
        
        <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
            <h3 style="color: #28a745; margin-top: 0; margin-bottom: 15px;">Détails du Deal</h3>
            <table style="width: 100%; border-collapse: collapse;">
                <tr>
                    <td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Entreprise :</strong></td>
                    <td style="padding: 8px 0; border-bottom: 1px solid #eee;">{{company.name}}</td>
                </tr>
                <tr>
                    <td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Montant :</strong></td>
                    <td style="padding: 8px 0; border-bottom: 1px solid #eee; font-weight: bold; color: #28a745;">{{deal.amount}}€</td>
                </tr>
                <tr>
                    <td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Contact :</strong></td>
                    <td style="padding: 8px 0; border-bottom: 1px solid #eee;">{{user.firstName}} {{user.lastName}}</td>
                </tr>
                <tr>
                    <td style="padding: 8px 0;"><strong>Email :</strong></td>
                    <td style="padding: 8px 0;">{{user.email}}</td>
                </tr>
            </table>
        </div>
        
        <div style="text-align: center; margin: 30px 0;">
            <a href="#" style="background: #28a745; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">
                Examiner le Deal
            </a>
        </div>
        
        <p style="color: #666; font-size: 14px;">
            Ce deal nécessite une évaluation et un suivi dans les 24h.
        </p>
    </div>
    
    <div style="text-align: center; margin-top: 20px; color: #666; font-size: 12px;">
        <p>TGIM Challenge - Notification automatique</p>
        <p>{{currentDate}}</p>
    </div>
</body>
</html>`
  },
  
  {
    name: 'Newsletter Mensuelle',
    subject: 'TGIM Newsletter - Actualités M&A & IA du mois',
    category: 'newsletter',
    isActive: true,
    createdBy: 'system',
    variables: defaultVariables,
    htmlContent: `
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Newsletter TGIM</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
    <div style="background: linear-gradient(135deg, #764ba2 0%, #667eea 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
        <h1 style="margin: 0; font-size: 26px;">📊 TGIM Newsletter</h1>
        <p style="margin: 10px 0 0 0; font-size: 16px;">M&A × Intelligence Artificielle</p>
    </div>
    
    <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px;">
        <p style="font-size: 16px; margin-bottom: 20px;">
            Bonjour {{user.firstName}},
        </p>
        
        <p style="margin-bottom: 30px;">
            Découvrez les dernières actualités et insights de notre plateforme TGIM Challenge.
        </p>
        
        <div style="background: white; padding: 25px; border-radius: 8px; margin: 25px 0; border-left: 4px solid #764ba2;">
            <h3 style="color: #764ba2; margin-top: 0;">🚀 Nouveautés du Mois</h3>
            <ul style="padding-left: 20px; margin-bottom: 20px;">
                <li style="margin-bottom: 10px;">Nouveau système d'évaluation automatisée</li>
                <li style="margin-bottom: 10px;">Interface de négociation IA améliorée</li>
                <li style="margin-bottom: 10px;">Tableaux de bord analytics avancés</li>
                <li>Intégration avec plus de sources de données</li>
            </ul>
        </div>
        
        <div style="background: white; padding: 25px; border-radius: 8px; margin: 25px 0; border-left: 4px solid #28a745;">
            <h3 style="color: #28a745; margin-top: 0;">📈 Statistiques Plateforme</h3>
            <div style="display: flex; justify-content: space-between; flex-wrap: wrap;">
                <div style="text-align: center; margin: 10px;">
                    <div style="font-size: 24px; font-weight: bold; color: #28a745;">1,247</div>
                    <div style="font-size: 12px; color: #666;">Deals Analysés</div>
                </div>
                <div style="text-align: center; margin: 10px;">
                    <div style="font-size: 24px; font-weight: bold; color: #28a745;">€45M</div>
                    <div style="font-size: 12px; color: #666;">Volume Traité</div>
                </div>
                <div style="text-align: center; margin: 10px;">
                    <div style="font-size: 24px; font-weight: bold; color: #28a745;">92%</div>
                    <div style="font-size: 12px; color: #666;">Précision IA</div>
                </div>
            </div>
        </div>
        
        <div style="text-align: center; margin: 30px 0;">
            <a href="#" style="background: #764ba2; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block; margin-right: 10px;">
                Voir les Nouveautés
            </a>
            <a href="#" style="background: #28a745; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">
                Tester les Outils
            </a>
        </div>
        
        <div style="background: #e9ecef; padding: 20px; border-radius: 8px; margin: 25px 0;">
            <p style="margin: 0; font-size: 14px; color: #666; text-align: center;">
                💡 <strong>Astuce du mois :</strong> Utilisez notre API pour intégrer l'évaluation IA directement dans vos workflows existants.
            </p>
        </div>
    </div>
    
    <div style="text-align: center; margin-top: 20px; color: #666; font-size: 12px;">
        <p>TGIM Challenge Newsletter - {{currentDate}}</p>
        <p>
            <a href="#" style="color: #666;">Se désabonner</a> |
            <a href="#" style="color: #666;">Modifier préférences</a>
        </p>
    </div>
</body>
</html>`
  }
];

export const workflowTriggers = [
  {
    type: 'user_signup',
    name: 'Inscription utilisateur',
    description: 'Déclenché quand un nouvel utilisateur s\'inscrit',
    defaultTemplate: 'Email de Bienvenue'
  },
  {
    type: 'deal_submission',
    name: 'Soumission de deal',
    description: 'Déclenché quand un deal est soumis',
    defaultTemplate: 'Notification Deal Soumis'
  },
  {
    type: 'inactivity',
    name: 'Inactivité utilisateur',
    description: 'Déclenché après 30 jours d\'inactivité',
    defaultTemplate: 'Email de réengagement'
  },
  {
    type: 'anniversary',
    name: 'Anniversaire d\'inscription',
    description: 'Déclenché à l\'anniversaire d\'inscription',
    defaultTemplate: 'Email anniversaire'
  }
];