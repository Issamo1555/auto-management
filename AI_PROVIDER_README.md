# Configuration de la Recommandation IA de Fournisseurs

## 🔑 Configuration de la Clé API Google Gemini

Pour activer les recommandations IA, vous devez configurer une clé API Google Gemini.

### Étape 1 : Obtenir une Clé API

1. Allez sur [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Connectez-vous avec votre compte Google
3. Cliquez sur "Create API Key"
4. Copiez la clé générée

### Étape 2 : Configurer la Clé dans l'Application

Ouvrez le fichier `js/ai_service.js` et remplacez la clé placeholder à la ligne 9 :

```javascript
this.GEMINI_API_KEY = 'VOTRE_CLE_API_ICI';
```

**⚠️ Important :** 
- La clé API est gratuite avec des limites d'utilisation
- Pour une application en production, stockez la clé sur un backend sécurisé
- Ne commitez jamais votre clé API dans Git

### Étape 3 : Fallback Sans IA

Si vous n'avez pas de clé API, l'application utilisera automatiquement un système de recommandation basé sur des règles :
- Filtrage par ville et type de service
- Tri par note et nombre d'avis
- Correspondance avec les spécialisations

## 📊 Base de Données des Fournisseurs

La base de données actuelle contient **17 garages** répartis dans :
- **Marrakech** : 5 garages
- **Casablanca** : 6 garages
- **Rabat** : 5 garages

### Ajouter de Nouveaux Fournisseurs

Modifiez le fichier `js/provider_data.js` et ajoutez des entrées au tableau `SERVICE_PROVIDERS` :

```javascript
{
    id: "mrk_006",
    name: "Nom du Garage",
    city: "Marrakech",
    address: "Adresse complète",
    phone: "+212 XXX-XXX-XXX",
    services: ["Vidange", "Révision", "Freins"],
    specializations: ["Renault", "Peugeot"],
    priceRange: "$$",  // $, $$, ou $$$
    rating: 4.5,
    reviews: 100,
    coordinates: { lat: 31.6295, lng: -7.9811 }
}
```

## 🚀 Utilisation

1. Allez dans **Entretien**
2. Cliquez sur **Nouvelle Intervention**
3. Sélectionnez le type de service
4. Cliquez sur **🔍 Trouver un Fournisseur**
5. Choisissez votre ville
6. Cliquez sur **🤖 Rechercher avec IA**
7. Consultez les recommandations classées par pertinence

## 🤖 Comment Fonctionne l'IA

L'IA Google Gemini analyse :
- Le type de service demandé
- La marque du véhicule
- Le budget préféré
- Les spécialisations des garages
- Les notes et avis clients
- Le rapport qualité/prix

Elle retourne les 3 meilleurs garages avec une explication de chaque recommandation.

## 📝 Limites et Quotas

**Gemini API (gratuit) :**
- 60 requêtes par minute
- 1500 requêtes par jour
- Mise en cache automatique pendant 30 minutes

## 🔧 Dépannage

**Erreur "API Key Invalid"**
- Vérifiez que vous avez copié la clé complète
- Assurez-vous que l'API Gemini est activée dans votre projet Google Cloud

**Pas de résultats**
- Vérifiez que la ville sélectionnée a des fournisseurs dans la base de données
- Essayez d'élargir les critères de recherche

**Recommandations non pertinentes**
- Le système bascule automatiquement sur le mode règles si l'IA échoue
- Vérifiez que les données des fournisseurs sont à jour
