# 🚀 Guide de création du nouveau repository GitHub

## 📦 Contenu du package

Vous avez maintenant un projet **complet et prêt à déployer** avec :

✅ Code source React/TypeScript moderne
✅ shadcn/ui components intégrés
✅ Workflow GitHub Actions configuré
✅ Tous les fichiers de configuration
✅ README.md complet
✅ Structure propre et organisée

## 🆕 Étape 1 : Créer le nouveau repository sur GitHub

### Via l'interface web GitHub :

1. **Aller sur** https://github.com/new

2. **Remplir les informations** :
   - Repository name: `EcosT-v2` (ou `ecosysteme-hotelier`)
   - Description: `Écosystème IT Hôtelier - Application interactive React/TypeScript`
   - Public ou Private : **Public** (pour GitHub Pages gratuit)
   - ⚠️ **NE PAS** cocher "Add a README file"
   - ⚠️ **NE PAS** ajouter .gitignore ou license

3. **Cliquer sur "Create repository"**

## 📤 Étape 2 : Uploader les fichiers

### Méthode 1 : Via l'interface GitHub (plus simple)

1. **Sur la page du nouveau repo**, cliquer sur **"uploading an existing file"**

2. **Télécharger tous les fichiers** du dossier `new-ecost` que je vous ai préparé

3. **Glisser-déposer** tous les fichiers ET dossiers :
   ```
   .github/
   src/
   guidelines/
   .gitignore
   .nojekyll
   ATTRIBUTIONS.md
   components.json
   index.html
   package.json
   postcss.config.mjs
   README.md
   tailwind.config.js
   tsconfig.json
   tsconfig.node.json
   vite.config.ts
   ```

4. **Commit message** : `"🎉 Initial commit - EcosT v2.0"`

5. **Cliquer "Commit changes"**

### Méthode 2 : Via Git en ligne de commande

```bash
# Dans le dossier new-ecost
cd /chemin/vers/new-ecost

# Initialiser git
git init

# Ajouter tous les fichiers
git add .

# Premier commit
git commit -m "🎉 Initial commit - EcosT v2.0"

# Ajouter le remote (remplacer par votre URL)
git remote add origin https://github.com/oceane-habonneau/EcosT-v2.git

# Push
git branch -M main
git push -u origin main
```

## ⚙️ Étape 3 : Configurer GitHub Pages

1. **Aller dans le repo** → **Settings**

2. **Dans le menu gauche** → **Pages**

3. **Source** : Sélectionner **"GitHub Actions"**

4. **Save**

C'est tout ! Le workflow se lancera automatiquement.

## 🔍 Étape 4 : Vérifier le déploiement

1. **Aller dans** → **Actions** (onglet en haut)

2. **Vous verrez** le workflow "Deploy to GitHub Pages" en cours (🟡 jaune)

3. **Attendre 2-3 minutes** jusqu'à ce qu'il devienne ✅ vert

4. **Tester le site** :
   ```
   https://oceane-habonneau.github.io/EcosT-v2/
   ```

## 🐛 En cas de problème

### Le build échoue

1. Aller dans **Actions** → Cliquer sur le workflow rouge
2. Voir les logs d'erreur
3. Généralement : problème de dépendances

**Solution** :
```bash
# Localement, vérifier que ça compile
cd new-ecost
npm install
npm run build

# Si ça marche localement, regénérer package-lock.json
rm package-lock.json
npm install
git add package-lock.json
git commit -m "🔧 Fix: Package lock"
git push
```

### Le site ne se charge pas

1. **Vider le cache** : Ctrl+Shift+R (Cmd+Shift+R sur Mac)
2. **Navigation privée** : Tester dans une fenêtre privée
3. **Vérifier le vite.config.ts** : base doit être `/EcosT-v2/`

### Les assets ne chargent pas

Le `vite.config.ts` doit avoir :
```typescript
export default defineConfig({
  plugins: [react()],
  base: '/EcosT-v2/',  // Nom de votre repo
  ...
})
```

## 📝 Étape 5 : Premier test local (recommandé)

Avant de push, testez en local :

```bash
cd new-ecost

# Installer
npm install

# Tester
npm run dev
```

Ouvrir http://localhost:5173 et vérifier que tout fonctionne.

## 🎯 Checklist complète

- [ ] Nouveau repo créé sur GitHub
- [ ] Tous les fichiers uploadés
- [ ] GitHub Pages configuré (Source: GitHub Actions)
- [ ] Workflow Actions lancé
- [ ] Build ✅ vert dans Actions
- [ ] Site accessible sur https://oceane-habonneau.github.io/EcosT-v2/
- [ ] Test local effectué (npm run dev)
- [ ] Toutes les fonctionnalités testées :
  - [ ] Mode Administration
  - [ ] Mode Déplacement (drag-and-drop)
  - [ ] Mode Liaison (créer connexion)
  - [ ] Mode Suppression (clic sur ligne)
  - [ ] Éditer une carte (bouton crayon)
  - [ ] Supprimer une carte (bouton poubelle)
  - [ ] Ajouter une carte (bouton +)
  - [ ] Export PNG
  - [ ] Export PDF
  - [ ] Bouton "Contactez-moi" (email)
  - [ ] Lien LinkedIn (footer)
  - [ ] Responsive mobile

## 🆚 Différences avec l'ancien repo

| Ancien (EcosT) | Nouveau (EcosT-v2) |
|----------------|---------------------|
| Composants custom | shadcn/ui |
| Simple | Interface moderne |
| Basique | Animations fluides |
| - | Export PNG/PDF |
| - | Modal avancés |
| - | Meilleure UX |

## 🔄 Migration depuis l'ancien repo (optionnel)

Si vous voulez garder l'historique :

```bash
# Cloner l'ancien
git clone https://github.com/oceane-habonneau/EcosT.git old-ecost

# Créer une branche v1
cd old-ecost
git checkout -b v1-legacy
git push origin v1-legacy

# Maintenant vous pouvez créer le nouveau repo séparément
```

## ✅ Vous êtes prête !

Une fois toutes les étapes terminées, vous aurez :
- ✅ Un nouveau repo GitHub propre
- ✅ Code moderne et maintenable
- ✅ Interface professionnelle
- ✅ Déploiement automatique
- ✅ Toutes les fonctionnalités demandées

**URL finale :**
```
https://oceane-habonneau.github.io/EcosT-v2/
```

---

**Besoin d'aide ? Envoyez-moi les logs d'erreur si quelque chose ne fonctionne pas ! 🚀**
