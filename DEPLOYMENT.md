# Guide de Déploiement - AutoManager

## 🚀 Déploiement sur Firebase

### Prérequis
- Compte Google/Firebase
- Node.js et npm installés
- Firebase CLI installé (`npm install -g firebase-tools`)

### Étape 1 : Configuration Firebase

1. **Créer un projet Firebase**
   ```bash
   # Se connecter à Firebase
   firebase login
   
   # Initialiser le projet
   firebase init
   ```

2. **Sélectionner les services**
   - ✅ Firestore
   - ✅ Hosting
   - ✅ Authentication

3. **Configuration Firestore**
   - Choisir le mode "production"
   - Utiliser `firestore.rules` existant
   - Utiliser `firestore.indexes.json` existant

4. **Configuration Hosting**
   - Public directory: `.` (racine)
   - Single-page app: `Yes`
   - Automatic builds: `No`

### Étape 2 : Configuration des Clés API

#### Firebase Config (`js/firebase-config.js`)
Remplacer les valeurs dans le fichier :
```javascript
const firebaseConfig = {
    apiKey: "VOTRE_API_KEY",
    authDomain: "votre-projet.firebaseapp.com",
    projectId: "votre-projet",
    storageBucket: "votre-projet.appspot.com",
    messagingSenderId: "123456789",
    appId: "1:123456789:web:abcdef"
};
```

#### Google Maps API (`js/config.js`)
```javascript
window.APP_CONFIG = {
    GOOGLE_MAPS_API_KEY: 'VOTRE_CLE_GOOGLE_MAPS',
    GEMINI_API_KEY: 'VOTRE_CLE_GEMINI'
};
```

### Étape 3 : Activer l'Authentification Firebase

1. Dans la console Firebase, aller dans **Authentication**
2. Activer **Email/Password**
3. (Optionnel) Configurer les templates d'emails

### Étape 4 : Déployer les Security Rules

```bash
firebase deploy --only firestore:rules
```

### Étape 5 : Créer le Premier Admin

**Option A : Via Firebase Console**
1. Aller dans Firestore Database
2. Créer une collection `users`
3. Ajouter un document avec l'UID de votre compte
4. Définir `role: "admin"`

**Option B : Via Script**
Créer un fichier `create-admin.js` :
```javascript
const admin = require('firebase-admin');
admin.initializeApp();

const db = admin.firestore();

async function createAdmin(email) {
  const user = await admin.auth().getUserByEmail(email);
  await db.collection('users').doc(user.uid).set({
    uid: user.uid,
    email: email,
    role: 'admin',
    isActive: true,
    createdAt: admin.firestore.FieldValue.serverTimestamp()
  });
  console.log('Admin créé avec succès');
}

createAdmin('votre@email.com');
```

### Étape 6 : Déployer l'Application

```bash
# Déployer tout
firebase deploy

# Ou déployer uniquement le hosting
firebase deploy --only hosting
```

### Étape 7 : Vérifier le Déploiement

1. Ouvrir l'URL fournie (ex: `https://votre-projet.web.app`)
2. Tester la connexion
3. Vérifier l'accès admin (`https://votre-projet.web.app/admin.html`)

---

## 🌐 Déploiement sur Netlify (Alternative)

### Étape 1 : Préparer le Projet

1. Créer un fichier `_redirects` à la racine :
   ```
   /*    /index.html   200
   ```

2. S'assurer que `netlify.toml` existe

### Étape 2 : Déployer

**Option A : Via Netlify CLI**
```bash
npm install -g netlify-cli
netlify login
netlify deploy --prod
```

**Option B : Via GitHub**
1. Pusher le code sur GitHub
2. Connecter le repo à Netlify
3. Configurer les variables d'environnement

### Étape 3 : Variables d'Environnement

Dans Netlify Dashboard > Site settings > Environment variables :
- `GOOGLE_MAPS_API_KEY`
- `GEMINI_API_KEY`

---

## 🔑 Configuration Google Maps API

### Activer les APIs Nécessaires

1. Aller sur [Google Cloud Console](https://console.cloud.google.com/)
2. Créer un projet ou sélectionner un projet existant
3. Activer les APIs suivantes :
   - **Maps JavaScript API**
   - **Directions API**
   - **Places API**

### Créer une Clé API

1. Aller dans **APIs & Services** > **Credentials**
2. Créer une clé API
3. Restreindre la clé :
   - **Application restrictions** : HTTP referrers
   - Ajouter votre domaine (ex: `https://votre-projet.web.app/*`)
   - **API restrictions** : Limiter aux 3 APIs ci-dessus

### Configurer la Facturation

⚠️ Les APIs Google Maps nécessitent un compte de facturation actif, même si vous restez dans les quotas gratuits.

**Quotas gratuits mensuels :**
- Maps JavaScript API : Illimité
- Directions API : $200 de crédit gratuit (~40,000 requêtes)
- Places API : $200 de crédit gratuit (~17,000 requêtes)

---

## 📊 Monitoring & Maintenance

### Firebase Console

**Authentification**
- Surveiller les nouvelles inscriptions
- Gérer les utilisateurs
- Voir les statistiques de connexion

**Firestore**
- Monitorer l'utilisation
- Vérifier les quotas
- Optimiser les requêtes

**Hosting**
- Voir les statistiques de trafic
- Gérer les versions déployées
- Configurer un domaine personnalisé

### Google Cloud Console

**APIs & Services**
- Surveiller l'utilisation des APIs
- Vérifier les quotas
- Analyser les coûts

---

## 🔒 Sécurité

### Bonnes Pratiques

1. **Ne jamais commiter les clés API dans Git**
   - Utiliser des variables d'environnement
   - Ajouter `js/config.js` au `.gitignore` si nécessaire

2. **Restreindre les clés API**
   - Limiter par domaine
   - Limiter aux APIs utilisées

3. **Firestore Rules**
   - Toujours tester les rules
   - Utiliser l'émulateur Firebase pour les tests

4. **Monitoring**
   - Configurer des alertes de quota
   - Surveiller les coûts
   - Activer les logs d'audit

---

## 🐛 Dépannage

### Problème : Firebase non initialisé

**Erreur** : `Firebase not available`

**Solution** :
1. Vérifier que les scripts Firebase sont chargés
2. Vérifier la configuration dans `firebase-config.js`
3. Vérifier la console du navigateur

### Problème : Google Maps ne s'affiche pas

**Erreur** : Carte grise ou erreur API

**Solution** :
1. Vérifier que la clé API est correcte
2. Vérifier que les APIs sont activées
3. Vérifier les restrictions de domaine
4. Vérifier la console du navigateur

### Problème : Accès refusé Firestore

**Erreur** : `Permission denied`

**Solution** :
1. Vérifier que l'utilisateur est connecté
2. Vérifier les Firestore Rules
3. Vérifier le rôle de l'utilisateur
4. Redéployer les rules si modifiées

---

## 📱 PWA (Progressive Web App)

### Activer le Service Worker

En production, décommenter dans `index.html` :
```javascript
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/service-worker.js');
}
```

### Tester le PWA

1. Ouvrir l'application en HTTPS
2. Ouvrir DevTools > Application > Service Workers
3. Vérifier que le SW est enregistré
4. Tester l'installation (bouton "Installer l'app")

---

## 📞 Support

Pour toute question :
- Documentation Firebase : https://firebase.google.com/docs
- Documentation Google Maps : https://developers.google.com/maps
- Issues GitHub : (votre repo)

---

**Dernière mise à jour** : Décembre 2024
