# 🚀 Guide de Déploiement Gratuit - MJ NEXUS

Pour mettre votre application en ligne gratuitement, je vous recommande **Render.com**, qui est idéal pour les applications Node.js/Express comme celle-ci.

## Option 1 : Déploiement sur Render (Recommandé)

1. **Créez un compte** sur [Render.com](https://render.com/).
2. **Connectez votre GitHub** : Poussez votre code sur un dépôt GitHub (public ou privé).
3. **Créez un nouveau "Web Service"** :
   - Sélectionnez votre dépôt GitHub.
   - **Runtime** : `Node`
   - **Build Command** : `npm install && npm run build`
   - **Start Command** : `npm start`
4. **Configurez les Variables d'Environnement** (Bouton "Environment") :
   - `NODE_ENV` : `production`
   - `GEMINI_API_KEY` : AIzaSyAI8UfeUYft-BSnYpO9HdreAbQTesC4dlc
   - `PAYMENT_PROVIDER_SECRET_KEY` : (Votre clé secrète de paiement)

## Option 2 : Déploiement sur Vercel (Frontend uniquement)

Si vous souhaitez uniquement le frontend (sans le serveur Express), vous pouvez utiliser Vercel. Cependant, pour les fonctionnalités de paiement Mobile Money et l'IA, le serveur Express est nécessaire.

## Option 3 : Railway.app

Railway offre un essai gratuit généreux. Il détectera automatiquement votre `Dockerfile` ou votre `package.json`.

---

### 💡 Note Importante
L'application est déjà configurée pour servir les fichiers statiques du dossier `dist/` une fois compilée (`npm run build`). Le fichier `server.ts` gère à la fois l'API et le service des pages.

**Besoin d'aide pour le nom de domaine ?**
Render vous donnera une URL gratuite du type `mj-worldbet.onrender.com`. Vous pourrez ajouter votre propre domaine `.com` ou `.cm` plus tard dans les paramètres.
