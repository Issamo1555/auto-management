# Guide OpenAI - AutoManager

## 🤖 Configuration OpenAI

AutoManager utilise maintenant **OpenAI GPT-4o-mini** pour les recommandations intelligentes.

---

## 📋 Obtenir une Clé API OpenAI

### Étape 1 : Créer un compte OpenAI

1. Aller sur https://platform.openai.com/
2. Cliquer sur "Sign up" (ou "Log in" si vous avez déjà un compte)
3. Créer un compte avec votre email

### Étape 2 : Ajouter un mode de paiement

1. Aller dans "Settings" > "Billing"
2. Cliquer sur "Add payment method"
3. Ajouter votre carte bancaire

**Note :** OpenAI offre $5 de crédit gratuit pour les nouveaux comptes.

### Étape 3 : Créer une clé API

1. Aller dans "API keys" (https://platform.openai.com/api-keys)
2. Cliquer sur "Create new secret key"
3. Donner un nom (ex: "AutoManager")
4. **IMPORTANT :** Copier la clé immédiatement (elle ne sera plus visible après)
5. Format : `sk-proj-...` (commence par sk-)

---

## ⚙️ Configuration dans AutoManager

### Méthode 1 : Via le fichier config.js

Éditer `js/config.js` :

```javascript
window.APP_CONFIG = {
    GOOGLE_MAPS_API_KEY: 'YOUR_GOOGLE_MAPS_API_KEY',
    OPENAI_API_KEY: 'sk-proj-VOTRE_CLE_ICI', // ← Coller votre clé ici
    APP_NAME: 'AutoManager',
    APP_VERSION: '1.5.0'
};
```

### Méthode 2 : Via variables d'environnement

Si vous déployez sur Netlify :

1. Aller dans "Site settings" > "Environment variables"
2. Ajouter : `OPENAI_API_KEY` = `sk-proj-...`

---

## 💰 Coûts OpenAI

### Modèle utilisé : GPT-4o-mini

**Prix (au 1er décembre 2024) :**
- Input : $0.150 / 1M tokens (~750,000 mots)
- Output : $0.600 / 1M tokens (~750,000 mots)

### Estimation pour AutoManager

**Par recommandation de garage :**
- Input : ~500 tokens
- Output : ~150 tokens
- **Coût : ~$0.0001** (0.01 centime)

**Par conseil d'achat :**
- Input : ~300 tokens
- Output : ~200 tokens
- **Coût : ~$0.00015** (0.015 centime)

### Budget mensuel estimé

**Pour 1000 utilisateurs actifs par mois :**
- 1000 recommandations : ~$0.10
- 500 conseils d'achat : ~$0.08
- **Total : ~$0.20/mois** 💰

**Avec le crédit gratuit de $5, vous avez ~25,000 requêtes gratuites !**

---

## 🚀 Fonctionnalités AI dans AutoManager

### 1. Recommandations de Garages

**Utilisation :**
- Module "Fournisseurs" > "Rechercher un garage"
- L'IA analyse les garages disponibles
- Recommande les 3 meilleurs selon vos critères

**Critères pris en compte :**
- Type de service demandé
- Marque du véhicule
- Budget préféré
- Notes et avis
- Spécialisations

**Exemple de réponse :**
```
RECOMMANDATION: cas_001
RAISON: Excellent rapport qualité/prix avec spécialisation 
Renault et service de révision rapide.
```

### 2. Conseiller d'Achat Automobile

**Utilisation :**
- Module "Conseiller d'Achat"
- Remplir le questionnaire
- L'IA donne un conseil personnalisé

**Critères pris en compte :**
- Budget
- Usage (urbain, mixte, autoroute)
- Type (neuf/occasion)
- Kilométrage annuel
- Préférences de marques

**Exemple de réponse :**
```
D'après vos critères (usage urbain, budget 150,000 DH), 
la Dacia Sandero est un excellent choix. Elle offre le 
meilleur compromis consommation/fiabilité pour un usage 
quotidien en ville. En occasion, vérifiez bien l'historique 
d'entretien et l'état de la courroie de distribution.
```

---

## 🔒 Sécurité

### Bonnes Pratiques

1. **Ne jamais commiter la clé API dans Git**
   ```bash
   # Ajouter config.js au .gitignore si nécessaire
   echo "js/config.js" >> .gitignore
   ```

2. **Utiliser des variables d'environnement en production**
   - Sur Netlify : Environment variables
   - Sur Firebase : Firebase Functions config

3. **Limiter l'utilisation**
   - Cache de 30 minutes activé
   - Fallback sans AI si quota dépassé

4. **Monitorer les coûts**
   - Dashboard OpenAI : https://platform.openai.com/usage
   - Configurer des alertes de budget

---

## 🐛 Dépannage

### Problème : "L'assistant IA n'est pas disponible"

**Causes possibles :**
1. Clé API manquante ou invalide
2. Quota dépassé
3. Problème de connexion

**Solutions :**
1. Vérifier la clé dans `config.js`
2. Vérifier le crédit sur platform.openai.com
3. Vérifier la console du navigateur (F12)

### Problème : Réponses en anglais

**Solution :**
Le prompt est en français, GPT-4 devrait répondre en français.
Si ce n'est pas le cas, vérifier que le modèle est bien `gpt-4o-mini`.

### Problème : Coûts trop élevés

**Solutions :**
1. Augmenter la durée du cache (actuellement 30min)
2. Utiliser uniquement le fallback rule-based
3. Limiter le nombre de requêtes par utilisateur

---

## 📊 Monitoring

### Dashboard OpenAI

1. Aller sur https://platform.openai.com/usage
2. Voir l'utilisation en temps réel
3. Configurer des alertes de budget

### Logs dans AutoManager

Ouvrir la console du navigateur (F12) :
```
🤖 AIService: getRecommendations called
🤖 AIService: Trying AI recommendations...
🤖 AIService: AI success
```

---

## 🔄 Fallback sans AI

Si l'API OpenAI n'est pas disponible, AutoManager utilise automatiquement un système de recommandations basé sur des règles :

**Critères du fallback :**
- Filtrage par ville
- Filtrage par type de service
- Filtrage par spécialisation
- Tri par note
- Top 3 résultats

**Avantages :**
- Toujours fonctionnel
- Gratuit
- Rapide
- Pas de dépendance externe

---

## 🎯 Alternatives

Si vous ne voulez pas utiliser OpenAI, vous pouvez :

1. **Désactiver l'AI** : Laisser `OPENAI_API_KEY` vide
   - Le fallback rule-based sera toujours utilisé

2. **Utiliser une autre API** :
   - Anthropic Claude
   - Google Gemini
   - Mistral AI
   - Modifier `js/ai_service.js`

---

## 📞 Support

- **Documentation OpenAI :** https://platform.openai.com/docs
- **Pricing :** https://openai.com/pricing
- **Status :** https://status.openai.com/
- **Support :** https://help.openai.com/

---

**Dernière mise à jour :** Décembre 2024
