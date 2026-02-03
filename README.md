# 🏨 Écosystème IT Hôtelier - Océane Habonneau

Application interactive React/TypeScript pour visualiser et gérer l'écosystème IT d'un hôtel avec interface moderne utilisant shadcn/ui.

![Version](https://img.shields.io/badge/version-3.1-blue)
![React](https://img.shields.io/badge/React-18-61dafb)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![License](https://img.shields.io/badge/license-MIT-green)

## ✨ Fonctionnalités

### 🎯 Modes d'interaction
- **Mode Administration** : Édition complète avec drag-and-drop
- **Vue Publique** : Visualisation en lecture seule
- **Mode Déplacement** : Repositionner les cartes
- **Mode Liaison** : Créer des connexions entre systèmes
- **Mode Suppression** : Supprimer des connexions en cliquant dessus

### 🎨 Interface moderne
- Design avec shadcn/ui components
- Animations fluides et transitions smooth
- Interface responsive mobile-first
- Thème moderne avec Tailwind CSS

### 📊 Gestion de l'écosystème
- 7 systèmes par défaut (PMS, Channel Manager, OTA, etc.)
- Ajout/suppression de cartes personnalisées
- Édition des libellés
- Création/suppression de connexions
- Repositionnement par drag-and-drop

### 📥 Export
- Export PNG haute qualité
- Export PDF
- Téléchargement direct

### 📧 Contact
- Bouton "Contactez-moi" avec email pré-rempli
- Lien vers profil LinkedIn
- Footer avec copyright

## 🚀 Installation

### Prérequis
- Node.js 20+
- npm ou pnpm

### Installation locale

```bash
# Cloner le repository
git clone https://github.com/oceane-habonneau/EcosT-v2.git
cd EcosT-v2

# Installer les dépendances
npm install

# Lancer le serveur de développement
npm run dev
```

L'application sera accessible sur `http://localhost:5173`

### Build de production

```bash
npm run build
npm run preview
```

## 📁 Structure du projet

```
EcosT-v2/
├── .github/
│   └── workflows/
│       └── deploy.yml          # GitHub Actions
├── src/
│   ├── app/
│   │   ├── components/
│   │   │   ├── ui/             # shadcn/ui components
│   │   │   ├── HotelEcosystem.tsx  # Composant principal
│   │   │   └── ...
│   │   └── App.tsx
│   ├── styles/
│   │   └── index.css           # Styles globaux
│   └── main.tsx
├── guidelines/
│   └── Guidelines.md           # Règles de design
├── index.html
├── package.json
├── tailwind.config.js
├── tsconfig.json
├── vite.config.ts
└── README.md
```

## 🎮 Utilisation

### Mode Administration

1. **Activer le mode Admin**
2. **Mode Déplacement** : Glisser-déposer les cartes
   - Boutons Éditer (crayon bleu) et Supprimer (poubelle rouge) sur chaque carte
3. **Mode Liaison** : Cliquer sur 2 cartes pour créer une connexion
4. **Mode Suppression** : Cliquer sur une ligne pour supprimer la connexion
5. **Ajouter une carte** : Bouton "+" pour ajouter un système
6. **Export** : Bouton téléchargement pour PNG/PDF

### Schéma par défaut

```
PMS (centre)
├── Channel Manager
│   ├── OTA
│   └── Moteur de réservation
│       ├── PSP
│       └── Site Internet
├── CRM
└── POS Restaurant
```

## 🛠️ Technologies

- **React 18** - UI library
- **TypeScript 5** - Typage statique
- **Vite** - Build tool ultra-rapide
- **Tailwind CSS** - Framework CSS utility-first
- **shadcn/ui** - Composants UI modernes
- **Lucide React** - Icônes
- **html2canvas** - Export PNG
- **jsPDF** - Export PDF

## 🌐 Déploiement sur GitHub Pages

Le projet est configuré pour un déploiement automatique sur GitHub Pages via GitHub Actions.

### Configuration

1. **Settings** → **Pages**
2. **Source** : GitHub Actions
3. Push sur `main` → déploiement automatique

### URL
```
https://oceane-habonneau.github.io/EcosT-v2/
```

## 📝 Scripts disponibles

```bash
npm run dev      # Serveur de développement
npm run build    # Build de production
npm run preview  # Prévisualiser le build
npm run lint     # Vérifier le code
```

## 🎨 Personnalisation

### Ajouter un système

Dans `HotelEcosystem.tsx` :

```typescript
const systems: SystemNode[] = [
  {
    id: 'nouveau-systeme',
    name: 'Nouveau Système',
    category: 'management',
    icon: 'Building2',
    x: 50,
    y: 50,
    connections: []
  }
];
```

### Modifier les couleurs

Dans `tailwind.config.js` ou les variables CSS.

## 👤 Auteur

**Océane Habonneau**
- Email: oceane.habonneau@gmail.com
- LinkedIn: [Océane Habonneau](https://www.linkedin.com/in/oc%C3%A9ane-habonneau-5a908212a/)

## 📄 Licence

MIT © 2026 Océane Habonneau

## 🙏 Remerciements

- React Team
- shadcn/ui
- Tailwind CSS
- Lucide Icons
- Vite

---

⭐ **N'oubliez pas de mettre une étoile si ce projet vous plaît !**
