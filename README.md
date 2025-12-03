# 🚗 AutoManager - Gestion Intelligente de Véhicules

[![Version](https://img.shields.io/badge/version-1.4.0-blue.svg)](https://github.com/yourusername/automanager)
[![PWA](https://img.shields.io/badge/PWA-ready-success.svg)](https://web.dev/progressive-web-apps/)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)

**AutoManager** est une Progressive Web App (PWA) moderne et complète pour la gestion de vos véhicules. Suivi d'entretien intelligent, recherche de fournisseurs propulsée par l'IA, conseiller d'achat personnalisé, et bien plus encore !

![AutoManager Dashboard](https://via.placeholder.com/800x400/2563eb/ffffff?text=AutoManager+Dashboard)

---

## ✨ Fonctionnalités Principales

### 🔐 Sécurité & Authentification
- Code PIN à 4 chiffres
- Support de l'authentification biométrique (Face ID / Touch ID)
- Données stockées localement et sécurisées

### 📊 Tableau de Bord Intelligent
- Vue d'ensemble complète de tous vos véhicules
- Graphiques interactifs (Chart.js)
- Prédictions d'entretien basées sur l'historique
- Analyse des coûts par véhicule et par type d'intervention

### 🚙 Gestion Multi-Véhicules
- Ajout/modification/suppression de véhicules
- Tracking du kilométrage et de l'historique complet
- Support de tous types : voiture, moto, camion, SUV, van
- Informations détaillées : marque, modèle, année, VIN, carburant

### 🔧 Suivi d'Entretien Automatisé
- Enregistrement de tous types d'interventions
- Alertes automatiques pour entretiens à venir
- Historique chronologique complet
- Calcul des coûts totaux

### 📄 Gestion Documentaire
- Upload et stockage de documents (carte grise, assurance, factures...)
- Alertes d'expiration automatiques
- Prévisualisation en ligne
- Organisation par véhicule

### 🤖 Recherche Intelligente de Fournisseurs
- **Propulsée par l'IA Gemini** pour des recommandations personnalisées
- Recherche par ville, type de service, marque de véhicule
- Base de données locale de fournisseurs marocains
- Intégration Google Maps et Google Places API
- Click-to-call et navigation GPS

### 💡 Conseiller d'Achat Intelligent
- Assistant d'achat en 4 étapes (Budget, Usage, Technologie, Préférences)
- Algorithme de recommandation basé sur vos critères
- Base de données de 200+ véhicules
- Liens directs vers plateformes marocaines (Avito, Moteur.ma, WandaLo, Sarouty)
- Export PDF des recommandations

### ⚖️ Comparateur de Véhicules
- Comparaison jusqu'à 3 véhicules simultanément
- Tableau détaillé : coûts, interventions, historique
- Interface moderne et responsive

### 🎤 Assistant Vocal
- Commandes vocales pour navigation et informations
- Synthèse vocale pour feedback
- Indicateur visuel animé
- Support Chrome/Edge (Web Speech API)

### 📱 Scanner QR Code
- Génération de QR codes pour vos véhicules
- Import/export de données via QR
- Support multi-caméras (front/back)
- Détection automatique

### 🔔 Système de Notifications
- Alertes automatiques pour documents expirés
- Rappels d'entretien à venir
- Panneau de notifications centralisé

---

## 🚀 Démarrage Rapide

### Prérequis

- Un navigateur moderne (Chrome, Edge, Safari, Firefox)
- Python 3 (pour serveur local de développement)

### Installation

1. **Clonez le repository**
   ```bash
   git clone https://github.com/yourusername/automanager.git
   cd automanager
   ```

2. **Lancez un serveur local**
   ```bash
   # Avec Python 3
   python3 -m http.server 8080
   
   # Ou avec Node.js
   npx http-server -p 8080
   ```

3. **Ouvrez dans votre navigateur**
   ```
   http://localhost:8080
   ```

4. **Créez votre code PIN** lors de la première utilisation

---

## 🛠️ Technologies Utilisées

### Frontend
- **HTML5** - Structure sémantique
- **CSS3** - Design moderne avec glassmorphisme
- **JavaScript ES6+** - Logique métier modulaire
- **Chart.js 4.4.0** - Graphiques interactifs
- **jsPDF 2.5.1** - Export PDF
- **html5-qrcode 2.3.8** - Scanner QR
- **qrcodejs 1.0.0** - Génération QR

### APIs & Services
- **Gemini AI API** - Recommandations intelligentes
- **Web Speech API** - Assistant vocal
- **Google Maps API** - Cartes et localisation
- **Google Places API** - Recherche de fournisseurs

### Architecture
- **Pattern MVC** avec modules ES6
- **LocalStorage** pour persistance des données
- **PWA** avec Service Worker
- **Responsive Design** mobile-first

---

## 📁 Structure du Projet

```
automanager/
├── index.html              # Page principale
├── landing.html            # Page d'accueil
├── manifest.json           # PWA manifest
├── service-worker.js       # Service Worker
├── netlify.toml           # Configuration Netlify
├── _redirects             # Redirections Netlify
│
├── css/
│   ├── main.css           # Styles principaux
│   └── comparator.css     # Styles comparateur
│
├── js/
│   ├── app.js             # Point d'entrée
│   ├── auth.js            # Authentification
│   ├── vehicle.js         # Gestion véhicules
│   ├── maintenance.js     # Suivi entretien
│   ├── document.js        # Gestion documents
│   ├── dashboard.js       # Tableau de bord
│   ├── charts.js          # Graphiques
│   ├── provider_*.js      # Module fournisseurs
│   ├── ai_service.js      # Service IA
│   ├── car_advisor.js     # Conseiller achat
│   ├── comparator.js      # Comparateur
│   ├── voice_assistant.js # Assistant vocal
│   ├── qr_scanner.js      # Scanner QR
│   └── ...
│
└── icons/                 # Icônes PWA (72px à 512px)
```

---

## 🎨 Design & UX

- **Design premium moderne** avec glassmorphisme et animations fluides
- **Thème clair/sombre** adaptatif avec transitions élégantes
- **Responsive** : optimisé pour mobile, tablette et desktop
- **Police Inter** de Google Fonts pour une lisibilité maximale
- **Micro-interactions** pour une UX engageante

---

## 🌐 Déploiement

### Netlify (Recommandé)

Le projet est prêt pour le déploiement sur Netlify :

```bash
# Installez Netlify CLI
npm install -g netlify-cli

# Déployez
netlify deploy --prod
```

Le fichier `netlify.toml` est déjà configuré.

### Autres plateformes

- **Vercel** : Compatible out-of-the-box
- **GitHub Pages** : Compatible (nécessite activation HTTPS pour PWA complète)
- **Firebase Hosting** : Compatible

---

## 🔧 Configuration

### API Keys

Pour utiliser toutes les fonctionnalités, configurez vos clés API dans [`js/config.js`](js/config.js) :

```javascript
window.APP_CONFIG = {
    GEMINI_API_KEY: 'votre-clé-gemini',
    GOOGLE_MAPS_API_KEY: 'votre-clé-google-maps'
};
```

### Variables d'environnement

Créez un fichier `.env` (ignoré par Git) :

```env
GEMINI_API_KEY=votre_clé_ici
GOOGLE_MAPS_API_KEY=votre_clé_ici
```

---

## 📱 Progressive Web App

AutoManager est une PWA complète :

- ✅ **Installable** sur mobile et desktop
- ✅ **Mode hors ligne** (Service Worker)
- ✅ **Icônes adaptatives** (72px à 512px)
- ✅ **Splash screen** personnalisé
- ✅ **Thème adaptatif**

---

## 🧪 Tests

Consultez le [Guide de Test](TEST_GUIDE.md) pour des instructions détaillées sur :
- Test de l'assistant vocal
- Test du scanner QR
- Test des fonctionnalités sur mobile
- Tests de compatibilité navigateurs

---

## 📚 Documentation

- [Description de l'application](DESCRIPTION_APP.md)
- [Guide de test complet](TEST_GUIDE.md)
- [Documentation AI Provider](AI_PROVIDER_README.md)
- [Plan Conseiller d'Achat](CONSEILLER_ACHAT_PLAN.md)

---

## 🤝 Contribution

Les contributions sont les bienvenues ! Pour contribuer :

1. Forkez le projet
2. Créez une branche feature (`git checkout -b feature/AmazingFeature`)
3. Committez vos changements (`git commit -m 'Add AmazingFeature'`)
4. Poussez vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrez une Pull Request

---

## 📝 Roadmap

### Court terme
- [ ] Tests automatisés (Jest + Cypress)
- [ ] Support multi-langues (Arabe, Anglais)
- [ ] Analytics et métriques

### Moyen terme
- [ ] Backend pour synchronisation cloud
- [ ] Application mobile native (React Native / Flutter)
- [ ] Partage de profils entre utilisateurs

### Long terme
- [ ] Marketplace de fournisseurs
- [ ] Intégration services externes (assurance, etc.)
- [ ] Communauté utilisateurs

---

## 🐛 Bugs Connus

Consultez les [Issues](https://github.com/yourusername/automanager/issues) pour la liste complète.

---

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier [LICENSE](LICENSE) pour plus de détails.

---

## 👨‍💻 Auteur

**Votre Nom**
- GitHub: [@yourusername](https://github.com/yourusername)
- Email: your.email@example.com

---

## 🙏 Remerciements

- [Chart.js](https://www.chartjs.org/) pour les graphiques
- [Google Gemini](https://ai.google.dev/) pour l'IA
- [html5-qrcode](https://github.com/mebjas/html5-qrcode) pour le scanner QR
- La communauté open source

---

## 📊 Statistiques

- **24 modules** JavaScript
- **~6,000 lignes** de code
- **15 fonctionnalités** principales
- **100%** Production Ready

---

**AutoManager** - *Parce que votre véhicule mérite le meilleur suivi.* 🚗✨

