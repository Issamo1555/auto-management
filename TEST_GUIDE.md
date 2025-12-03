# 📱 Guide de Test - AutoManager
## Assistant Vocal & Scanner QR Code

---

## 🖥️ Configuration de Test sur Mac

### Prérequis
- ✅ macOS (votre système actuel)
- ✅ Google Chrome (recommandé pour toutes les fonctionnalités)
- ✅ Microphone intégré ou externe
- ✅ Webcam (intégrée au Mac)

### Ouvrir l'Application

**Option 1 : Via Navigateur**
```bash
# Ouvrir directement dans Chrome
open -a "Google Chrome" /Users/admin/Desktop/Antigravity/index.html
```

**Option 2 : Serveur Local (Recommandé pour éviter les limitations CORS)**
```bash
# Installer un serveur HTTP simple si pas déjà fait
# npm install -g http-server

# Depuis le dossier de l'app
cd /Users/admin/Desktop/Antigravity
python3 -m http.server 8000

# Puis ouvrir dans Chrome : http://localhost:8000
```

---

## 📱 Simuler un Téléphone sur Mac

### Méthode 1 : Chrome DevTools (Recommandé)

1. **Ouvrir l'application dans Chrome**
2. **Ouvrir DevTools** : `Cmd + Option + I`
3. **Activer le mode responsive** : `Cmd + Shift + M`
4. **Sélectionner un appareil** dans la barre du haut :
   - iPhone 14 Pro Max
   - iPhone SE
   - Samsung Galaxy S20
   - iPad Mini
   - Ou "Responsive" avec dimensions personnalisées

**Simulation avancée :**
- Cliquez sur les trois points `⋮` dans DevTools
- Allez dans "More tools" → "Sensors"
- Vous pouvez simuler :
  - Orientation (portrait/landscape)
  - Localisation GPS
  - Touch screen

### Méthode 2 : Safari Responsive Design Mode

1. Ouvrir Safari
2. Menu "Develop" → "Enter Responsive Design Mode" (`Cmd + Option + R`)
3. Choisir un appareil iOS dans la liste

### Méthode 3 : Tester sur un Vrai iPhone/iPad

Si vous avez un appareil iOS :
1. Assurez-vous que Mac et iPhone sont sur le même réseau Wi-Fi
2. Démarrez un serveur local sur Mac (voir plus haut)
3. Trouvez l'adresse IP de votre Mac : `ifconfig | grep inet`
4. Sur iPhone, ouvrez Safari et allez à : `http://[IP-DE-VOTRE-MAC]:8000`

---

## 🧪 Use Cases de Test Détaillés

---

### Use Case 1 : Test Assistant Vocal - Navigation Simple

**Objectif :** Vérifier que l'assistant vocal peut naviguer dans l'application

**Prérequis :**
- [x] Chrome ouvert avec l'application
- [x] Microphone fonctionnel
- [x] Au moins 1 véhicule dans l'application

**Étapes :**

| # | Action | Résultat Attendu | ✓ |
|---|--------|------------------|---|
| 1 | Cliquer sur le bouton 🎤 en haut à droite | Modale "Assistant Vocal" s'ouvre | ☐ |
| 2 | Observer l'indicateur circulaire | Couleur grise (idle) | ☐ |
| 3 | Cliquer sur "Commencer" | Popup Chrome demande permission micro | ☐ |
| 4 | Cliquer "Autoriser" | Indicateur devient bleu et pulse | ☐ |
| 5 | Dire clairement : "ouvrir véhicules" | - Texte apparaît en temps réel<br>- Indicateur jaune (processing) | ☐ |
| 6 | Attendre 1-2 secondes | - Vue "Véhicules" s'affiche<br>- Indicateur vert (success)<br>- Voix dit "Ouverture des véhicules" | ☐ |
| 7 | Vérifier que la page titre = "Véhicules" | Navigation réussie | ☐ |
| 8 | Dire "arrêter" | Modale se ferme | ☐ |

**Variantes à tester :**
- "Afficher tableau de bord"
- "Ouvrir entretien"
- "Voir les documents"

**Résultat :** ✅ PASS / ❌ FAIL

**Notes :**
```
[Espace pour notes de test]
```

---

### Use Case 2 : Test Assistant Vocal - Informations

**Objectif :** Vérifier que l'assistant peut répondre aux questions sur les données

**Prérequis :**
- [x] Assistant vocal fonctionnel (Use Case 1 réussi)
- [x] Au moins 2 véhicules dans l'app
- [x] Au moins 1 entretien programmé

**Étapes :**

| # | Action | Résultat Attendu | ✓ |
|---|--------|------------------|---|
| 1 | Ouvrir l'assistant vocal 🎤 | Modale ouverte | ☐ |
| 2 | Cliquer "Commencer" | Écoute active | ☐ |
| 3 | Dire : "combien de véhicules" | - Transcription affichée<br>- Traitement | ☐ |
| 4 | Attendre la réponse | - Voix annonce le nombre<br>- Message affiché : "Vous avez X véhicules enregistrés" | ☐ |
| 5 | Cliquer "Commencer" à nouveau | Nouvelle écoute | ☐ |
| 6 | Dire : "prochain entretien" | - Voix annonce la date et le type<br>- Message : "Prochain entretien: [TYPE] le [DATE]" | ☐ |
| 7 | Dire : "aide" | Liste des commandes disponibles s'affiche | ☐ |

**Test Edge Cases :**
- Dire des commandes inconnues → Message "Commande non reconnue"
- Parler trop vite ou avec accent → Doit demander de répéter
- Pas de connexion internet → Message d'erreur réseau

**Résultat :** ✅ PASS / ❌ FAIL

---

### Use Case 3 : Test Scanner QR - Génération

**Objectif :** Générer un QR code pour un véhicule existant

**Prérequis :**
- [x] Application ouverte
- [x] Au moins 1 véhicule créé avec données complètes

**Étapes :**

| # | Action | Résultat Attendu | ✓ |
|---|--------|------------------|---|
| 1 | Cliquer sur le bouton 📱 | Modale "Scanner QR Code" s'ouvre | ☐ |
| 2 | Observer l'interface | Deux onglets : "Scanner" et "Générer" | ☐ |
| 3 | Cliquer sur onglet "Générer" | Vue change, dropdown véhicules visible | ☐ |
| 4 | Ouvrir le dropdown | Liste des véhicules s'affiche | ☐ |
| 5 | Sélectionner un véhicule | Véhicule sélectionné dans dropdown | ☐ |
| 6 | Cliquer "Générer QR Code" | - QR code apparaît (256x256px)<br>- Bouton "Télécharger" visible | ☐ |
| 7 | Cliquer "Télécharger" | - Fichier PNG téléchargé<br>- Nom : qr-code-[timestamp].png | ☐ |
| 8 | Ouvrir le fichier téléchargé | QR code valide visible | ☐ |

**Vérifications supplémentaires :**
- QR code contient les bonnes données (scanner avec smartphone si dispo)
- Thème clair/sombre → QR code reste visible

**Résultat :** ✅ PASS / ❌ FAIL

---

### Use Case 4 : Test Scanner QR - Scan avec Webcam

**Objectif :** Scanner un QR code généré pour importer des données

**Prérequis :**
- [x] Use Case 3 complété (QR code généré)
- [x] Webcam fonctionnelle
- [x] QR code imprimé OU affiché sur autre écran/téléphone

**Étapes :**

| # | Action | Résultat Attendu | ✓ |
|---|--------|------------------|---|
| 1 | Ouvrir modale QR 📱 | Modale ouverte | ☐ |
| 2 | Rester sur onglet "Scanner" | Zone scanner visible | ☐ |
| 3 | Cliquer "Démarrer Scanner" | - Popup permission caméra<br>- Cliquer "Autoriser" | ☐ |
| 4 | Observer la zone de scan | Flux vidéo de la webcam visible | ☐ |
| 5 | Présenter le QR code à la webcam | - Détection automatique<br>- Son "beep"<br>- Scanner s'arrête | ☐ |
| 6 | Observer les résultats | - Message : "Véhicule détecté"<br>- Données affichées : marque, modèle, année, plaque | ☐ |
| 7 | Cliquer "Importer" | - Alert : "Véhicule importé avec succès !"<br>- Navigation vers vue Véhicules | ☐ |
| 8 | Vérifier la liste véhicules | Véhicule ajouté (ou message si déjà existant) | ☐ |

**Tests Edge Cases :**
- QR code flou → Doit redemander de bien positionner
- QR code invalide/texte → Affiche le texte brut avec bouton copier
- Permission caméra refusée → Message d'erreur clair

**Résultat :** ✅ PASS / ❌ FAIL

---

### Use Case 5 : Test Mobile Responsive - iPhone Simulation

**Objectif :** Vérifier que l'UI est adaptée mobile et que les fonctionnalités marchent sur petit écran

**Configuration :**
- Chrome DevTools
- Mode responsive activé
- Device : iPhone 14 Pro (393 x 852)

**Étapes :**

| # | Action | Résultat Attendu | ✓ |
|---|--------|------------------|---|
| 1 | Ouvrir l'app en mode iPhone | Interface s'adapte : sidebar masquée | ☐ |
| 2 | Vérifier la top bar | - Bouton menu ☰ visible<br>- Boutons 🎤 et 📱 visibles<br>- Icônes pas trop petits | ☐ |
| 3 | Cliquer bouton 🎤 | Modale plein écran, bien lisible | ☐ |
| 4 | Observer l'indicateur vocal | Taille réduite (60x60px) mais visible | ☐ |
| 5 | Fermer et ouvrir 📱 | Modale QR adaptée mobile | ☐ |
| 6 | Tester les onglets Scanner/Générer | Boutons accessibles, pas de débordement | ☐ |
| 7 | Rotation landscape (Cmd+R dans DevTools) | - Interface s'adapte<br>- Pas de scroll horizontal | ☐ |
| 8 | Tester sur iPad (820 x 1180) | Layout tablette adapté | ☐ |

**Vérifications UX :**
- [ ] Boutons assez grands pour touch (min 44x44px)
- [ ] Texte lisible (min 14px)
- [ ] Pas de texte coupé
- [ ] Modales ne débordent pas

**Résultat :** ✅ PASS / ❌ FAIL

---

### Use Case 6 : Test Thème Sombre

**Objectif :** Vérifier que les nouvelles fonctionnalités fonctionnent en mode sombre

**Étapes :**

| # | Action | Résultat Attendu | ✓ |
|---|--------|------------------|---|
| 1 | Cliquer sur bouton thème 🌓 | App passe en mode sombre | ☐ |
| 2 | Ouvrir modale assistant vocal | - Fond sombre<br>- Texte clair lisible<br>- Indicateur visible | ☐ |
| 3 | Vérifier les messages de réponse | Fond bleu foncé, pas bleu clair | ☐ |
| 4 | Ouvrir modale QR | Interface sombre cohérente | ☐ |
| 5 | Générer un QR code | QR code visible sur fond sombre | ☐ |
| 6 | Vérifier résultats de scan | Cartes de résultat (success/error) bien contrastées | ☐ |

**Résultat :** ✅ PASS / ❌ FAIL

---

### Use Case 7 : Test Compatibilité Navigateurs

**Objectif :** Vérifier le fonctionnement sur différents navigateurs Mac

#### Test sur Safari

| # | Action | Résultat Attendu | ✓ |
|---|--------|------------------|---|
| 1 | Ouvrir app dans Safari | App charge normalement | ☐ |
| 2 | Vérifier bouton 🎤 | - Visible OU masqué avec message<br>- Pas d'erreur console | ☐ |
| 3 | Tester assistant vocal | - Non supporté = message clair<br>- OU fonctionnel basique | ☐ |
| 4 | Tester QR scanner | Devrait fonctionner normalement | ☐ |

#### Test sur Firefox

| # | Action | Résultat Attendu | ✓ |
|---|--------|------------------|---|
| 1 | Ouvrir app dans Firefox | App charge | ☐ |
| 2 | Vérifier bouton 🎤 | Masqué automatiquement (non supporté) | ☐ |
| 3 | Tester QR scanner | Fonctionnel | ☐ |

#### Test sur Edge

| # | Action | Résultat Attendu | ✓ |
|---|--------|------------------|---|
| 1 | Ouvrir app dans Edge | App charge | ☐ |
| 2 | Tester assistant vocal | Pleinement fonctionnel (basé sur Chromium) | ☐ |
| 3 | Tester QR scanner | Pleinement fonctionnel | ☐ |

**Résultat :** ✅ PASS / ❌ FAIL

---

## 🎯 Checklist Rapide de Test

### Assistant Vocal
- [ ] Bouton visible et accessible
- [ ] Modale s'ouvre/ferme correctement
- [ ] Permission microphone demandée
- [ ] Commandes navigation fonctionnent (5/6)
- [ ] Commandes information fonctionnent (3/3)
- [ ] Feedback visuel (indicateur pulse)
- [ ] Feedback audio (synthèse vocale)
- [ ] Gestion erreurs (commande inconnue, pas de son)
- [ ] Fermeture propre

### Scanner QR
- [ ] Bouton visible et accessible
- [ ] Modale s'ouvre/ferme
- [ ] Onglets Scanner/Générer fonctionnent
- [ ] Permission caméra demandée
- [ ] Génération QR code OK
- [ ] Téléchargement QR code OK
- [ ] Scan QR code détecte
- [ ] Import données fonctionne
- [ ] Gestion erreurs (permission refusée)

### Responsive
- [ ] Interface adaptée mobile (< 768px)
- [ ] Modales plein écran sur mobile
- [ ] Boutons touch-friendly
- [ ] Pas de scroll horizontal
- [ ] Rotation landscape OK

### Thèmes
- [ ] Mode clair : tout visible et lisible
- [ ] Mode sombre : tout visible et lisible
- [ ] Transitions thème sans erreur

---

## 🐛 Problèmes Connus et Solutions

### Problème : Permission microphone refusée
**Solution :** 
1. Chrome → Paramètres → Confidentialité → Paramètres du site → Microphone
2. Autoriser pour `file://` ou `localhost`

### Problème : Permission caméra refusée
**Solution :**
1. Chrome → Paramètres → Confidentialité → Paramètres du site → Caméra
2. Autoriser pour le site

### Problème : HTTPS requis en production
**Solution :**
- En local : utiliser `localhost` avec serveur HTTP
- En production : déployer sur HTTPS (Netlify, Vercel, etc.)

### Problème : Webcam ne démarre pas
**Solution :**
1. Vérifier qu'aucune autre app n'utilise la webcam
2. Redémarrer le navigateur
3. Tester sur un autre navigateur

---

## 📊 Rapport de Test

### Informations Générales
- **Testeur :** _______________
- **Date :** _______________
- **Navigateur :** Chrome / Safari / Firefox / Edge (entourer)
- **Version :** _______________
- **OS :** macOS _______________

### Résultats Globaux

| Use Case | Résultat | Notes |
|----------|----------|-------|
| UC1 - Assistant Vocal Navigation | ☐ PASS ☐ FAIL | |
| UC2 - Assistant Vocal Informations | ☐ PASS ☐ FAIL | |
| UC3 - QR Génération | ☐ PASS ☐ FAIL | |
| UC4 - QR Scan | ☐ PASS ☐ FAIL | |
| UC5 - Mobile Responsive | ☐ PASS ☐ FAIL | |
| UC6 - Thème Sombre | ☐ PASS ☐ FAIL | |
| UC7 - Compatibilité Navigateurs | ☐ PASS ☐ FAIL | |

### Bugs Trouvés

| ID | Sévérité | Description | Étapes de reproduction |
|----|----------|-------------|------------------------|
| 1 | High/Medium/Low | | |
| 2 | High/Medium/Low | | |
| 3 | High/Medium/Low | | |

### Recommandations

```
[Vos recommandations ici]
```

---

## 🎬 Vidéo de Démonstration

Une vidéo de démonstration a été créée lors du lancement initial :
- **Fichier :** `automanager_launch_[timestamp].webp`
- **Localisation :** `.gemini/antigravity/brain/[id]/`

---

## ✅ Critères de Validation Finale

L'implémentation est considérée comme **VALIDE** si :

1. ✅ Assistant vocal fonctionne sur Chrome/Edge (7/10 commandes minimum)
2. ✅ QR Scanner détecte et importe correctement
3. ✅ QR Générateur crée des codes valides
4. ✅ Interface responsive sur mobile (< 768px)
5. ✅ Thème sombre appliqué correctement
6. ✅ Aucun bug bloquant (high severity)
7. ✅ Permissions gérées proprement
8. ✅ Pas d'erreurs console critiques

---

**Bon test ! 🧪**
