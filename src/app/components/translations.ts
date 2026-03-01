// ══════════════════════════════════════════════════════════════════════
// translations.ts — Fichier d'internationalisation FR / EN
// ══════════════════════════════════════════════════════════════════════
// Structure : translations[lang][clé] = string | object
// Langue par défaut : 'fr'
// Pour ajouter une langue : dupliquer le bloc 'en' et renseigner les valeurs.
// ══════════════════════════════════════════════════════════════════════

export type Lang = 'fr' | 'en';

// ─────────────────────────────────────────────
// TYPE DEFINITIONS
// ─────────────────────────────────────────────
export interface DiagnosticLevel {
  label: string;
  desc: string;
}

export interface NodeBenefit {
  title: string;
  benefit: string; // peut contenir du HTML <strong>
}

export interface WizardTool {
  name: string;
}

export interface LogicalPairStrings {
  question: string;
  warning: string;
}

export interface ServiceItem {
  name: string;
  desc: string;
  tags: string[];
}

export interface Translations {
  // ── Navigation ──
  nav: {
    ecosystem: string;
    services: string;
    diagnostic: string;
    auditBtn: string;
    auditBtnShort: string;
    langToggle: string; // label du bouton langue
  };

  // ── Header / Hero ──
  hero: {
    tagline: string;
    subtitle: string;
    brandSub: string; // "Flux & Automatisations"
  };

  // ── Wizard overlay d'accueil ──
  wizardOverlay: {
    title: string;
    subtitle: string;
    startBtn: string;
    skipBtn: string;
  };

  // ── Wizard modal ──
  wizard: {
    step1Label: string;      // "Étape 1 : Inventaire"
    step2Label: string;      // "Étape 2 : Connectivité"
    step1Sub: string;        // "Sélectionnez les outils..."
    step2Sub: string;        // "Indiquez les connexions..."
    nextBtn: string;
    backBtn: string;
    generateBtn: string;
    closeBtn: string;
    noPairs: string;
    noPairsSub: string;
    connectivityLabel: string; // "Connectivité"
    connectedWith: string;     // "est-il connecté avec…"
  };

  // ── Widget santé (score panel) ──
  health: {
    scoreLabel: string;       // "Score"
    showDetails: string;      // "+ Détails"
    hideDetails: string;      // "− Masquer"
    fluxBreaks: string;       // "⚡ Ruptures de flux"
    moreBreaks: string;       // "+X autre(s) rupture(s)" — utiliser {n}
    missingTools: string;     // "Outils indispensables absents"
    missingToolDesc: string;  // "Colonne vertébrale de votre rentabilité."
    addToolBtn: string;       // "Ajouter un outil"
    sevCritique: string;      // "critique"
    sevWarning: string;       // "warning"
    sevInfo: string;          // "info"
  };

  // ── Diagnostic levels (6 niveaux) ──
  diagnostic: {
    critical: DiagnosticLevel;
    weak: DiagnosticLevel;
    fragile: DiagnosticLevel;
    solid: DiagnosticLevel;
    good: DiagnosticLevel;
    excellent: DiagnosticLevel;
  };

  // ── Canvas / modes admin ──
  canvas: {
    modeMove: string;         // "Cliquez et glissez pour déplacer les cartes"
    modeMoveShort: string;    // "Déplacez les cartes"
    modeLinkActive: string;   // "Mode liaison actif — cliquez sur une carte pour commencer"
    modeLinkShort: string;    // "Cliquez sur une carte"
    modeLinkTarget: string;   // "Cliquez sur une autre carte pour créer/supprimer une liaison"
    modeLinkTargetShort: string;
    scoreIndicator: string;   // "Score : {pct}%"
    resetBtn: string;
    addCardBtn: string;
    viewAdmin: string;
    viewPublic: string;
    modeLink: string;
    modeMove: string;
    deleteConfirm: string;
    resetLinks: string;
    resetPositions: string;
  };

  // ── Modal "Ajouter une carte" ──
  addModal: {
    title: string;
    nameLabel: string;
    namePlaceholder: string;
    categoryLabel: string;
    iconLabel: string;
    cancelBtn: string;
    addBtn: string;
  };

  // ── Tooltip "Bénéfice pour vous" ──
  tooltipHeader: string;  // "Bénéfice pour vous"

  // ── Mobile health modal ──
  mobileHealth: {
    title: string;       // "Santé de l'Écosystème"
    closeBtn: string;
  };

  // ── Steps section ──
  steps: {
    title: string;
    subtitle: string;
    scrollHint: string;
    items: Array<{ num: string; title: string; desc: string }>;
  };

  // ── Services section ──
  servicesSection: {
    title: string;
    subtitle: string;
    items: ServiceItem[];
  };

  // ── CTA audit ──
  cta: {
    eyebrow: string;
    title: string;
    subtitle: string;
    btn: string;
  };

  // ── Footer ──
  footer: {
    copyright: string;
    contact: string;     // "Me contacter"
    appointment: string; // "Prendre RDV"
  };

  // ── Légende ──
  legend: {
    title: string;
    subtitle: string;
  };

  // ── Socles ──
  socles: {
    sectionLabel: string;   // "Choisir mon Socle"
    essentiel: { label: string; desc: string };
    performance: { label: string; desc: string };
    signature: { label: string; desc: string };
    currentPrefix: string;  // "Le Socle"
  };

  // ── Node benefits (tooltips par outil) ──
  nodeBenefits: Record<string, NodeBenefit>;

  // ── Noms des outils wizard ──
  wizardTools: Record<string, string>; // id → nom affiché

  // ── Questions & warnings de connectivité (wizard step 2) ──
  // clé = `${a}|${b}`
  logicalPairs: Record<string, LogicalPairStrings>;

  // ── Messages d'alerte du widget santé ──
  // clé = ids triés join ','
  pairWarnMap: Record<string, [string, string]>; // [message, severity]

  // ── Suggestions de cartes (datalist) ──
  cardSuggestions: string[];

  // ── Catégories ──
  categories: Record<string, string>;

  // ── Messages de diagnostic pour les liaisons (calculateScore) ──
  diagnosticRules: {
    // Liaisons OR (VITAL_OR_PATHS)
    vitalOrPaths: {
      beReservation: string;
      pspPayment: string;
      rmsYield: string;
    };
    // Liaisons VITAL_LINKS
    vitalLinks: {
      pmsCmStock: string;
      siteBeBooking: string;
      cmOtaDistribution: string;
      cmGdsDistribution: string;
    };
    // Liaisons INDISPENSABLE_LINKS
    indispensableLinks: {
      pmsPosRestaurant: string;
      pmsSpaSpa: string;
      siteMoteurRestoDirect: string;
      siteExpClientDirect: string;
    };
    // Liaisons ADVISED_LINKS
    advisedLinks: {
      pmsCrmData: string;
      pmsHousekeepingOps: string;
      pmsSerrureAutonomy: string;
      pmsExpClientExperience: string;
      pmsTvComfort: string;
    };
    // Liaisons COMPTA_LINKS
    comptaLinks: {
      comptaPmsAccounting: string;
      comptaPosAccounting: string;
      comptaSpaAccounting: string;
    };
  };

  // ── Messages pour outils manquants par catégorie ──
  missingToolMessages: {
    managementDistribution: string;
    guestSalesWellness: string;
  };
}


// ══════════════════════════════════════════════════════════════════════
// FRANÇAIS (référence)
// ══════════════════════════════════════════════════════════════════════
const fr: Translations = {
  nav: {
    ecosystem: 'Écosystème',
    services: 'Services',
    diagnostic: 'Diagnostic',
    auditBtn: 'Audit Gratuit',
    auditBtnShort: 'RDV',
    langToggle: 'EN',
  },

  hero: {
    tagline: 'Scannez la rentabilité de votre environnement technologique',
    subtitle: 'Identifiez en 2 minutes les ruptures de flux qui saturent vos équipes et freinent vos réservations directes.',
    brandSub: 'Flux & Automatisations',
  },

  wizardOverlay: {
    title: 'Calculer mon score d\'automatisation',
    subtitle: 'Répondez à quelques questions pour obtenir un diagnostic personnalisé de votre infrastructure hôtelière.',
    startBtn: 'Lancer mon diagnostic',
    skipBtn: 'Explorer l\'outil manuellement. Expert',
  },

  wizard: {
    step1Label: 'Étape 1 : Inventaire',
    step2Label: 'Étape 2 : Connectivité',
    step1Sub: 'Sélectionnez les outils présents dans votre hôtel',
    step2Sub: 'Indiquez les connexions actives entre vos outils',
    nextBtn: 'Suivant →',
    backBtn: '← Retour',
    generateBtn: 'Générer mon diagnostic',
    closeBtn: 'Fermer',
    noPairs: 'Aucune connexion possible avec votre sélection.',
    noPairsSub: 'Retournez à l\'étape 1 pour ajouter des outils.',
    connectivityLabel: 'Connectivité',
    connectedWith: 'est-il connecté avec…',
  },

  health: {
    scoreLabel: 'Score',
    showDetails: '+ Détails',
    hideDetails: '− Masquer',
    fluxBreaks: '⚡ Ruptures de flux',
    moreBreaks: '+{n} autre(s) rupture(s)',
    missingTools: 'Outils indispensables absents',
    missingToolDesc: 'Composant vital manquant. Votre distribution est paralysée ou nécessite une gestion manuelle à haut risque.',
    addToolBtn: 'Ajouter un outil',
    sevCritique: 'critique',
    sevWarning: 'warning',
    sevInfo: 'info',
  },

  diagnostic: {
    critical: {
      label: '🚨 Alerte Survie',
      desc: 'Socle vital incomplet. Distribution paralysée.',
    },
    weak: {
      label: '⚠️ Connectivité Partielle',
      desc: 'Liaisons indispensables manquantes. Risque de pertes opérationnelles.',
    },
    fragile: {
      label: '⚠️ Connectivité Partielle',
      desc: 'Liaisons indispensables manquantes. Risque de pertes opérationnelles.',
    },
    solid: {
      label: '✅ Optimisation Requise',
      desc: 'Écosystème robuste mais silos de données (CRM/Compta).',
    },
    good: {
      label: '💪 Très bon écosystème',
      desc: 'Votre infrastructure est bien connectée. Quelques optimisations stratégiques peuvent encore améliorer votre RevPAR.',
    },
    excellent: {
      label: '🚀 Écosystème Haute-Couture',
      desc: 'Infrastructure de haut niveau, entièrement automatisée. Vous opérez comme un hôtel de chaîne avec l\"agilité d\"un indépendant.',
    },
  },

  canvas: {
    modeMove: 'Cliquez et glissez pour déplacer les cartes',
    modeMoveShort: 'Déplacez les cartes',
    modeLinkActive: 'Mode liaison actif — cliquez sur une carte pour commencer',
    modeLinkShort: 'Cliquez sur une carte',
    modeLinkTarget: 'Cliquez sur une autre carte pour créer/supprimer une liaison',
    modeLinkTargetShort: 'Cliquez sur une carte cible',
    scoreIndicator: 'Score : {pct}%',
    resetBtn: 'Réinitialiser',
    addCardBtn: 'Ajouter un outil',
    viewAdmin: 'Admin',
    viewPublic: 'Aperçu',
    modeLink: 'Liaison',
    modeMove: 'Déplacer',
    deleteConfirm: 'Supprimer cette carte ?',
    resetLinks: 'Réinitialiser liaisons',
    resetPositions: 'Réinitialiser positions',
  },

  addModal: {
    title: 'Ajouter une nouvelle carte',
    nameLabel: 'Nom *',
    namePlaceholder: 'Tapez ou sélectionnez…',
    categoryLabel: 'Catégorie',
    iconLabel: 'Icône',
    cancelBtn: 'Annuler',
    addBtn: 'Ajouter',
  },

  tooltipHeader: 'Bénéfice pour vous',

  mobileHealth: {
    title: 'Santé de l\'Écosystème',
    closeBtn: 'Fermer',
  },

  steps: {
    title: 'Comment ça marche ?',
    subtitle: 'Un diagnostic en 3 étapes pour identifier vos priorités.',
    scrollHint: 'Défiler',
    items: [
      {
        num: '01',
        title: 'Diagnostiquez',
        desc: 'Utilisez nos Socles de référence pour situer votre établissement.',
      },
      {
        num: '02',
        title: 'Analysez',
        desc: 'Un socle est cohérent quand les flux sont tracés. Un outil isolé est une source de perte de temps.',
      },
      {
        num: '03',
        title: 'Optimisez',
        desc: 'Visez le score de 100% pour garantir une automatisation totale de votre parcours client.',
      },
      {
        num: '04',
        title: 'Bénéfice pour vous',
        desc: 'Passez la souris sur chaque carte pour comprendre ce qu\'elle change dans votre quotidien opérationnel.',
      },
    ],
  },

  servicesSection: {
    title: 'Mes services',
    subtitle: 'Des accompagnements sur mesure pour hôteliers indépendants.',
    items: [
      {
        name: 'Audit & Stratégie Digitale',
        desc: 'Analyse complète de votre écosystème technologique et identification des leviers de croissance. Je vous livre une feuille de route priorisée, actionnable dès le lendemain.',
        tags: ['Diagnostic complet', 'Roadmap priorisée', 'ROI chiffré'],
      },
      {
        name: 'Intégration & Automatisation',
        desc: 'Mise en place et connexion de vos outils hôteliers (PMS, Channel Manager, Moteur de réservation, CRM…). Je pilote le projet de A à Z pour que vous n\'ayez qu\'à valider.',
        tags: ['Zéro développement', 'Clé en main', 'Formation incluse'],
      },
      {
        name: 'Externalisation de votre pilotage IT',
        desc: 'Je pilote votre écosystème informatique à temps partagé : prestataires, contrats, veille technologique et support quotidien. La sérénité d\'une DSI sans le coût d\'un poste fixe.',
        tags: ['Temps partagé', 'Pilotage fournisseurs', 'Support quotidien'],
      },
    ],
  },

  cta: {
    eyebrow: 'Envie de commencer ?',
    title: 'Un audit gratuit de 30 min pour identifier vos priorités.',
    subtitle: 'Sans jargon. Sans engagement. Avec un plan d\'action concret en sortie.',
    btn: 'Réserver mon audit gratuit',
  },

  footer: {
    copyright: '© 2026 Océane Habonneau – Consultante en Digitalisation Hôtelière – Tous droits réservés',
    contact: 'Me contacter',
    appointment: 'Prendre RDV',
  },

  legend: {
    title: 'Légende & Valeur',
    subtitle: 'Code couleur des catégories',
  },

  socles: {
    sectionLabel: 'Choisir mon Socle',
    essentiel: {
      label: 'Essentiel',
      desc: 'Le minimum vital pour exister et vendre en ligne sans erreur.',
    },
    performance: {
      label: 'Performance',
      desc: "L'automatisation au service de l'efficacité opérationnelle et de la facturation.",
    },
    signature: {
      label: 'Signature',
      desc: "L'excellence technologique pour une expérience client personnalisée et axée sur la donnée.",
    },
    currentPrefix: 'Le Socle',
  },

  nodeBenefits: {
    'pms': {
      title: 'PMS — Property Management System',
      benefit: 'Le <strong>cœur de votre hôtel</strong>. Centralise les réservations, les profils clients et la facturation pour supprimer les erreurs et les oublis.',
    },
    'channel-manager': {
      title: 'Channel Manager',
      benefit: 'Mise à jour automatique de vos stocks sur Booking, Expedia, etc. <strong>Fini le surbooking</strong> et les saisies manuelles fastidieuses.',
    },
    'pos': {
      title: 'POS — Point of Sale Restaurant',
      benefit: 'Envoi direct des notes en chambre et synchronisation des stocks. <strong>Une fluidité totale</strong> entre la salle et la réception.',
    },
    'psp': {
      title: 'PSP — Payment Service Provider',
      benefit: 'Sécurisation des transactions et prélèvements automatiques. <strong>30 min gagnées par jour</strong> à la clôture et moins de litiges bancaires.',
    },
    'crm': {
      title: 'Expérience Client / CRM',
      benefit: 'Automatise l\'envoi des emails pré-séjour/post-séjour. <strong>Fidélise vos clients</strong> sans que vous n\'ayez à y penser.',
    },
    'exp-client': {
      title: 'Expérience Client In-House',
      benefit: 'Personnalisez chaque séjour grâce aux données centralisées. <strong>Augmentez vos avis positifs</strong> et le retour de vos clients fidèles.',
    },
    'compta': {
      title: 'Flux Comptable',
      benefit: 'Export automatique de vos chiffres vers votre comptabilité. <strong>Zéro papier, zéro erreur, zéro retard.</strong>',
    },
    'booking-engine': {
      title: 'Moteur de Réservation',
      benefit: 'Captez les réservations directes sans commission OTA. <strong>Augmentez votre RevPAR</strong> en maîtrisant votre distribution.',
    },
    'ota': {
      title: 'OTA — Online Travel Agency',
      benefit: 'Visibilité maximale sur Booking.com, Expedia & co. <strong>Gérés automatiquement</strong> depuis votre channel manager pour zéro surcharge.',
    },
    'site-internet': {
      title: 'Site Internet',
      benefit: 'Votre vitrine digitale disponible 24h/24. <strong>Réduit votre dépendance aux OTA</strong> et renforce votre image de marque.',
    },
    'spa': {
      title: 'SPA & Wellness',
      benefit: 'Gestion des soins et réservations intégrée au PMS. <strong>Upsell automatique</strong> pour augmenter le panier moyen de vos séjours.',
    },
    'rms': {
      title: 'RMS — Revenue Management System',
      benefit: 'Optimise vos tarifs en temps réel selon la demande. <strong>+10% à +25% de RevPAR</strong> constaté selon les établissements.',
    },
    'gds': {
      title: 'GDS — Global Distribution System',
      benefit: 'Accès aux agences de voyages et clientèle corporate mondiale. <strong>Canal stratégique</strong> pour les hôtels business et MICE.',
    },
    'moteur-resto': {
      title: 'Moteur Réservation Restaurant',
      benefit: 'Gestion des couverts en ligne avec synchronisation cuisine. <strong>Réduisez les no-shows</strong> et optimisez votre taux de remplissage.',
    },
    'site-booking': {
      title: 'Site Web / Boutique',
      benefit: 'Vendez cartes cadeaux et expériences directement en ligne. <strong>Nouvelle source de revenus</strong> sans intermédiaire.',
    },
    'housekeeping': {
      title: 'Housekeeping',
      benefit: 'Synchronisation en temps réel des statuts de chambres avec le PMS. <strong>Réduisez les délais de recouche</strong>, supprimez les allers-retours radio et libérez vos chambres plus vite.',
    },
    'event-management': {
      title: 'Event Management',
      benefit: 'Gestion centralisée des événements, salles et devis. <strong>Maximisez le taux d\'occupation de vos espaces</strong> et automatisez la facturation groupe.',
    },
    'serrure': {
      title: 'Serrure Connectée',
      benefit: 'Check-in autonome et accès sans clé physique. <strong>Libérez votre réception</strong> des contraintes horaires et améliorez l\'expérience d\'arrivée.',
    },
    'telephonie': {
      title: 'Téléphonie',
      benefit: 'Unifiez vos communications et intégrez la téléphonie au PMS. <strong>Tracez chaque appel client</strong> et améliorez la gestion des demandes.',
    },
    'e-reputation': {
      title: 'E-réputation',
      benefit: 'Centralisez la gestion des avis clients sur toutes les plateformes. <strong>Boostez votre note moyenne</strong> et votre visibilité en ligne.',
    },
    'tv': {
      title: 'TV / Chromecast',
      benefit: 'Personnalisez l\'expérience in-room avec du contenu ciblé. <strong>Générez des revenus additionnels</strong> via des services premium.',
    },
    'chatbot': {
      title: 'Chatbot',
      benefit: 'Répondez instantanément aux questions fréquentes 24/7. <strong>Réduisez la charge de la réception</strong> et capturez plus de réservations.',
    },
    'wifi': {
      title: 'WiFi',
      benefit: 'Offrez une connexion stable et sécurisée à vos clients. <strong>Collectez des données marketing</strong> via le portail captif.',
    },
  },

  wizardTools: {
    'pms': 'PMS',
    'channel-manager': 'Channel Manager',
    'booking-engine': 'Moteur de Réservation',
    'site-internet': 'Site Internet',
    'ota': 'OTA',
    'psp': 'PSP (Paiement)',
    'pos': 'POS Restaurant',
    'compta': 'Comptabilité',
    'crm': 'CRM',
    'spa': 'SPA',
    'gds': 'GDS',
    'rms': 'RMS',
    'serrure': 'Serrure Connectée',
    'housekeeping': 'Housekeeping',
    'event-management': 'Event Management',
  },

  logicalPairs: {
    'pms|channel-manager': {
      question: 'Votre PMS est-il connecté au Channel Manager ?',
      warning: 'Risque majeur de surbooking et de disparité tarifaire.',
    },
    'pms|booking-engine': {
      question: 'Votre PMS est-il connecté directement au Moteur de réservation ?',
      warning: 'Disponibilités non synchronisées : risque de sur-vente et perte de réservations directes.',
    },
    'channel-manager|booking-engine': {
      question: 'Le Channel Manager envoie-t-il les tarifs et dispos au Moteur ?',
      warning: 'Tarifs directs non synchronisés : risque de perte de ventes directes.',
    },
    'channel-manager|ota': {
      question: 'Les OTA sont-elles connectées via le Channel Manager ?',
      warning: 'Canaux déconnectés : fermeture forcée des ventes sur Booking/Expedia.',
    },
    'pms|ota': {
      question: 'Votre PMS est-il synchronisé directement avec les OTA ?',
      warning: 'Mises à jour manuelles sur les OTA : surbooking et disparité tarifaire.',
    },
    'booking-engine|psp': {
      question: 'Les paiements en ligne passent-ils par le Moteur vers le PSP ?',
      warning: 'Pas de garantie bancaire en temps réel : risque de no-shows impayés.',
    },
    'pms|psp': {
      question: 'Le PSP est-il connecté directement au PMS pour les paiements ?',
      warning: 'Réconciliation manuelle des paiements : erreurs de caisse et retards.',
    },
    'booking-engine|site-internet': {
      question: 'Le Moteur de réservation est-il intégré au Site Internet ?',
      warning: 'Parcours client rompu : perte de conversion immédiate.',
    },
    'pms|site-internet': {
      question: 'Le Site Internet affiche-t-il les disponibilités du PMS en temps réel ?',
      warning: 'Disponibilités non synchronisées : risque de sur-vente manuelle.',
    },
    'channel-manager|gds': {
      question: 'Les GDS sont-ils reliés au Channel Manager ?',
      warning: 'Canaux corporate non alimentés : manque à gagner sur la clientèle B2B.',
    },
    'pms|gds': {
      question: 'Votre PMS est-il connecté directement aux GDS ?',
      warning: 'Mises à jour manuelles vers les GDS : disparité et perte de commissions.',
    },
    'pms|pos': {
      question: 'Le POS envoie-t-il automatiquement les notes en chambre au PMS ?',
      warning: "Pas de transfert en chambre : oublis de facturation au check-out.",
    },
    'pms|serrure': {
      question: 'Les serrures connectées sont-elles pilotées par le PMS ?',
      warning: 'Saisie manuelle des clés : perte de temps staff et attente client.',
    },
    'pms|spa': {
      question: 'Les réservations SPA sont-elles synchronisées avec le PMS ?',
      warning: "Plannings non synchronisés : erreurs sur la facture globale.",
    },
    'pms|crm': {
      question: 'Le CRM est-il alimenté automatiquement par le PMS ?',
      warning: "Données isolées : impossible de personnaliser l'accueil ou de fidéliser.",
    },
    'pms|compta': {
      question: 'Les écritures comptables sont-elles exportées automatiquement du PMS ?',
      warning: "Saisie manuelle du CA : risque d'erreurs et retard de clôture.",
    },
    'pms|rms': {
      question: 'Le RMS ajuste-t-il les tarifs automatiquement dans le PMS ?',
      warning: 'Tarification statique : manque à gagner sur le RevPAR.',
    },
    'booking-engine|crm': {
      question: 'Le Moteur de réservation alimente-t-il le CRM en données clients ?',
      warning: 'Profils clients incomplets : relances marketing manquées après séjour.',
    },
    'pos|compta': {
      question: 'Le POS exporte-t-il automatiquement ses ventes en comptabilité ?',
      warning: 'Saisie manuelle des recettes F&B : risque de décalage de clôture.',
    },
    'pms|housekeeping': {
      question: 'Le Housekeeping est-il synchronisé avec le PMS ?',
      warning: 'Statuts de chambres mis à jour manuellement : délais de recouche et erreurs de check-in.',
    },
    'pms|event-management': {
      question: "Le système d'Event Management est-il connecté au PMS ?",
      warning: 'Facturation groupe manuelle : risque de pertes et de doublons sur les dossiers événements.',
    },
  },

  pairWarnMap: {
    'channel-manager,pms':           ['Flux Distribution : Risque critique de surréservation. Vos stocks ne sont pas synchronisés.', 'critique'],
    'booking-engine,pms':            ['Flux Réservation : Vos réservations directes ne remontent pas automatiquement vers votre gestion.', 'critique'],
    'booking-engine,channel-manager':['Flux Réservation : Vos réservations directes ne remontent pas automatiquement vers votre gestion.', 'critique'],
    'channel-manager,ota':           ['Distribution : Vos canaux ne sont pas alimentés. Gestion manuelle des stocks obligatoire.', 'critique'],
    'ota,pms':                       ['Mises à jour manuelles sur les OTA : surbooking et disparité tarifaire.', 'critique'],
    'booking-engine,psp':            ['Paiement : Risque d\'impayés ou de saisie manuelle. Pas de garantie bancaire automatique.', 'critique'],
    'pms,psp':                       ['Paiement : Risque d\'impayés ou de saisie manuelle. Pas de garantie bancaire automatique.', 'critique'],
    'booking-engine,site-internet':  ['Tunnel de Vente : Rupture du parcours client. Votre site ne permet pas de réserver.', 'critique'],
    'pms,site-internet':             ['Disponibilités non synchronisées : risque de sur-vente manuelle.', 'critique'],
    'pms,pos':                       ["Pas de transfert chambre : oublis de facturation au check-out.", 'warning'],
    'pms,serrure':                   ["Saisie manuelle des clés : perte de temps staff.", 'warning'],
    'pms,spa':                       ["Plannings non synchronisés : erreurs sur facture globale.", 'warning'],
    'crm,pms':                       ["Données isolées : impossible de fidéliser.", 'warning'],
    'compta,pms':                    ['Comptabilité : Saisie manuelle du CA. Risque d\'erreurs et perte de temps en fin de mois.', 'warning'],
    'pms,rms':                       ["Tarification statique : manque à gagner sur le RevPAR.", 'warning'],
    'booking-engine,crm':            ["Profils clients incomplets : relances marketing manquées.", 'warning'],
    'channel-manager,rms':           ["Yield management non diffusé : optimisations tarifaires locales.", 'warning'],
    'compta,pos':                    ['Comptabilité : Saisie manuelle du CA. Risque d\'erreurs et perte de temps en fin de mois.', 'warning'],
    'channel-manager,gds':           ["Canaux corporate non alimentés : manque à gagner B2B.", 'info'],
    'gds,pms':                       ["Mises à jour manuelles vers les GDS : disparité et perte de commissions.", 'info'],
    'housekeeping,pms':              ["Statuts de chambres manuels : délais de recouche et erreurs de check-in.", 'warning'],
    'event-management,pms':          ["Facturation groupe manuelle : risque de pertes et doublons sur les dossiers.", 'warning'],
  },

  cardSuggestions: [
    'Boutique en ligne / Carte cadeaux',
    'Channel Manager',
    'Chatbot',
    'Comptabilité',
    'CRM',
    'E-réputation',
    'Event Management',
    'GDS',
    'Housekeeping',
    'Moteur de réservation',
    'OTA',
    'PMS',
    'POS',
    'PSP',
    'Serrure',
    'Site internet',
    'Téléphonie',
    'TV',
    'Wifi',
  ],

  categories: {
    management: 'Management',
    booking: 'Réservation',
    sales: 'Distribution',
    customer: 'Client',
    restaurant: 'Restaurant',
    wellness: 'Bien-être',
  },

  diagnosticRules: {
    vitalOrPaths: {
      beReservation: "Flux Réservation : Vos réservations directes ne remontent pas automatiquement vers votre gestion.",
      pspPayment: "Paiement : Risque d\"impayés ou de saisie manuelle. Pas de garantie bancaire automatique.",
      rmsYield: "Yield : Vos décisions tarifaires ne sont pas diffusées en temps réel sur vos canaux.",
    },
    vitalLinks: {
      pmsCmStock: "Liaison PMS/CM : Risque critique de surréservation. Vos stocks ne sont pas synchronisés.",
      siteBeBooking: "Tunnel de Vente : Rupture du parcours client. Votre site ne permet pas de réserver.",
      cmOtaDistribution: "Distribution : Vos canaux ne sont pas alimentés. Gestion manuelle des stocks obligatoire.",
      cmGdsDistribution: "Distribution : Vos canaux ne sont pas alimentés. Gestion manuelle des stocks obligatoire.",
    },
    indispensableLinks: {
      pmsPosRestaurant: "Flux Restauration : Saisie manuelle des factures et risques d\"oublis au check-out.",
      pmsSpaSpa: "Flux SPA : Les consommations SPA ne remontent pas sur la facture du client en chambre.",
      siteMoteurRestoDirect: "Vente Directe : Votre site ne commercialise pas l\"ensemble de vos services (Resto, SPA, Cadeaux).",
      siteExpClientDirect: "Vente Directe : Votre site ne commercialise pas l\"ensemble de vos services (Resto, SPA, Cadeaux).",
    },
    advisedLinks: {
      pmsCrmData: "Data Client : Vos profils sont isolés. Impossible de personnaliser l\"accueil ou de fidéliser.",
      pmsHousekeepingOps: "Opérations : Retards de communication entre la réception et les étages (statut des chambres).",
      pmsSerrureAutonomy: "Autonomie : La création des clés/codes n\"est pas synchronisée avec l\"arrivée du client.",
      pmsExpClientExperience: "Expérience : Le client n\"a pas accès à ses informations de séjour en temps réel.",
      pmsTvComfort: "Confort : Le message de bienvenue ou le check-out sur TV n\"est pas activé.",
    },
    comptaLinks: {
      comptaPmsAccounting: "Comptabilité : Saisie manuelle du CA. Risque d\"erreurs et perte de temps en fin de mois.",
      comptaPosAccounting: "Comptabilité : Saisie manuelle du CA. Risque d\"erreurs et perte de temps en fin de mois.",
      comptaSpaAccounting: "Comptabilité : Saisie manuelle du CA. Risque d\"erreurs et perte de temps en fin de mois.",
    },
  },

  missingToolMessages: {
    managementDistribution: "Composant vital manquant. Votre distribution est paralysée sans cet outil indispensable.",
    guestSalesWellness: "Angle mort stratégique. L\"absence de cet outil empêche la fidélisation et limite vos revenus annexes.",
  },
};

// ══════════════════════════════════════════════════════════════════════
// ENGLISH — TODO: fill all values below
// ══════════════════════════════════════════════════════════════════════
const en: Translations = {
  nav: {
    ecosystem: 'Ecosystem',
    services: 'Services',
    diagnostic: 'Diagnostic',
    auditBtn: 'Free Audit',
    auditBtnShort: 'Book',
    langToggle: 'FR',
  },

  hero: {
    tagline: 'Scan the profitability of your tech stack',
    subtitle: 'Identify in 2 minutes the broken flows that overload your teams and hold back your direct bookings.',
    brandSub: 'Flows & Automations',
  },

  wizardOverlay: {
    title: 'Calculate my automation score',
    subtitle: 'Answer a few questions to get a personalised diagnostic of your hotel infrastructure.',
    startBtn: 'Start my diagnostic',
    skipBtn: 'Explore the tool manually. Expert',
  },

  wizard: {
    step1Label: 'Step 1: Inventory',
    step2Label: 'Step 2: Connectivity',
    step1Sub: 'Select the tools currently used in your hotel',
    step2Sub: 'Indicate the active connections between your tools',
    nextBtn: 'Next →',
    backBtn: '← Back',
    generateBtn: 'Generate my diagnostic',
    closeBtn: 'Close',
    noPairs: 'No connection possible with your selection.',
    noPairsSub: 'Go back to step 1 to add tools.',
    connectivityLabel: 'Connectivity',
    connectedWith: 'is it connected with…',
  },

  health: {
    scoreLabel: 'Score',
    showDetails: '+ Details',
    hideDetails: '− Hide',
    fluxBreaks: '⚡ Flow breaks',
    moreBreaks: '+{n} more break(s)',
    missingTools: 'Essential tools missing',
    missingToolDesc: 'Vital component missing. Your distribution is paralysed or requires high-risk manual management.',
    addToolBtn: 'Add a tool',
    sevCritique: 'critical',
    sevWarning: 'warning',
    sevInfo: 'info',
  },

  diagnostic: {
    critical: {
      label: '🚨 Survival Alert',
      desc: 'Vital foundation incomplete. Distribution paralyzed.',
    },
    weak: {
      label: '⚠️ Partial Connectivity',
      desc: 'Essential connections missing. Risk of operational losses.',
    },
    fragile: {
      label: '⚠️ Partial Connectivity',
      desc: 'Essential connections missing. Risk of operational losses.',
    },
    solid: {
      label: '✅ Optimization Required',
      desc: 'Robust ecosystem but data silos (CRM/Accounting).',
    },
    good: {
      label: '💪 Strong ecosystem',
      desc: 'Your infrastructure is well connected. A few strategic optimizations can further improve your RevPAR.',
    },
    excellent: {
      label: '🚀 Haute-Couture Ecosystem',
      desc: 'Top-tier, fully automated infrastructure. You operate like a chain hotel with the agility of an independent.',
    },
  },

  canvas: {
    modeMove: 'Click and drag to move cards',
    modeMoveShort: 'Move cards',
    modeLinkActive: 'Link mode active — click a card to start',
    modeLinkShort: 'Click a card',
    modeLinkTarget: 'Click another card to create/remove a link',
    modeLinkTargetShort: 'Click a target card',
    scoreIndicator: 'Score: {pct}%',
    resetBtn: 'Reset',
    addCardBtn: 'Add a tool',
    viewAdmin: 'Edit',
    viewPublic: 'Preview',
    modeLink: 'Link',
    modeMove: 'Move',
    deleteConfirm: 'Delete this card?',
    resetLinks: 'Reset links',
    resetPositions: 'Reset positions',
  },

  addModal: {
    title: 'Add a new card',
    nameLabel: 'Name *',
    namePlaceholder: 'Type or select…',
    categoryLabel: 'Category',
    iconLabel: 'Icon',
    cancelBtn: 'Cancel',
    addBtn: 'Add',
  },

  tooltipHeader: 'Benefit for you',

  mobileHealth: {
    title: 'Ecosystem Health',
    closeBtn: 'Close',
  },

  steps: {
    title: 'How does it work?',
    subtitle: 'A 3-step diagnostic to identify your priorities.',
    scrollHint: 'Scroll',
    items: [
      {
        num: '01',
        title: 'Diagnose',
        desc: 'Use our Stack to position your establishment',
      },
      {
        num: '02',
        title: 'Analyze',
        desc: 'A stack is consistent when flows are tracked. An isolated tool is a waste of time.',
      },
      {
        num: '03',
        title: 'Optimize',
        desc: 'Aim for a score of 100% to ensure total automation of your customer journey.',
      },
      {
        num: '04',
        title: 'Benefits for you',
        desc: 'Hover your mouse over each card to understand how it changes your daily operations.',
      },
    ],
  },

  servicesSection: {
    title: 'My services',
    subtitle: 'Tailored support for independent hoteliers.',
    items: [
      {
        name: 'Digital Audit & Strategy',
        desc: 'Full analysis of your tech ecosystem and identification of growth levers. I deliver a prioritised roadmap, actionable from day one.',
        tags: ['Full diagnostic', 'Prioritised roadmap', 'Quantified ROI'],
      },
      {
        name: 'Integration & Automation',
        desc: 'Setup and connection of your hotel tools (PMS, Channel Manager, Booking Engine, CRM…). I manage the project end-to-end so you only need to validate.',
        tags: ['No development', 'Turnkey', 'Training included'],
      },
      {
        name: 'IT Management Outsourcing',
        desc: 'I manage your IT ecosystem on a part-time basis: vendors, contracts, technology watch and daily support. The peace of mind of a CIO without the cost of a full-time role.',
        tags: ['Part-time', 'Vendor management', 'Daily support'],
      },
    ],
  },

  cta: {
    eyebrow: 'Ready to start?',
    title: 'A free 30-min audit to identify your priorities.',
    subtitle: 'No jargon. No commitment. A concrete action plan as output.',
    btn: 'Book my free audit',
  },

  footer: {
    copyright: '© 2026 Océane Habonneau – Hotel Digitalisation Consultant – All rights reserved',
    contact: 'Contact me',
    appointment: 'Book appointment',
  },

  legend: {
    title: 'Legend & Value',
    subtitle: 'Category colour code',
  },

  socles: {
    sectionLabel: 'Choose my Stack',
    essentiel: {
      label: 'Essential',
      desc: 'The vital minimum to exist and sell online without errors.',
    },
    performance: {
      label: 'Performance',
      desc: 'Automation in the service of operational efficiency and billing.',
    },
    signature: {
      label: 'Signature',
      desc: 'Technological excellence for a personalised, data-driven guest experience.',
    },
    currentPrefix: 'The Stack',
  },

  nodeBenefits: {
    'pms': {
      title: 'PMS — Property Management System',
      benefit: 'The <strong>heart of your hotel</strong>. Centralises bookings, guest profiles and billing to eliminate errors and missed charges.',
    },
    'channel-manager': {
      title: 'Channel Manager',
      benefit: 'Automatic inventory updates on Booking, Expedia, etc. <strong>No more overbooking</strong> and tedious manual entries.',
    },
    'pos': {
      title: 'POS — Point of Sale Restaurant',
      benefit: 'Direct room charge posting and stock sync. <strong>Total fluidity</strong> between the restaurant and front desk.',
    },
    'psp': {
      title: 'PSP — Payment Service Provider',
      benefit: 'Secured transactions and automatic charges. <strong>30 min saved per day</strong> at closing and fewer chargebacks.',
    },
    'crm': {
      title: 'Guest Experience / CRM',
      benefit: 'Automates pre- and post-stay emails. <strong>Builds guest loyalty</strong> without any manual effort.',
    },
    'exp-client': {
      title: 'In-House Guest Experience',
      benefit: 'Personalise every stay with centralised data. <strong>Boost your positive reviews</strong> and repeat guest rate.',
    },
    'compta': {
      title: 'Accounting Flow',
      benefit: 'Automatic export of your figures to your accounting system. <strong>Zero paper, zero error, zero delay.</strong>',
    },
    'booking-engine': {
      title: 'Booking Engine',
      benefit: 'Capture direct bookings with no OTA commission. <strong>Grow your RevPAR</strong> by controlling your distribution.',
    },
    'ota': {
      title: 'OTA — Online Travel Agency',
      benefit: 'Maximum visibility on Booking.com, Expedia & co. <strong>Managed automatically</strong> via your channel manager — zero extra workload.',
    },
    'site-internet': {
      title: 'Website',
      benefit: 'Your digital shopfront, available 24/7. <strong>Reduces your OTA dependency</strong> and strengthens your brand.',
    },
    'spa': {
      title: 'SPA & Wellness',
      benefit: 'Treatment and booking management integrated with the PMS. <strong>Automatic upsell</strong> to increase your average spend per stay.',
    },
    'rms': {
      title: 'RMS — Revenue Management System',
      benefit: 'Optimises your rates in real time based on demand. <strong>+10% to +25% RevPAR</strong> observed across properties.',
    },
    'gds': {
      title: 'GDS — Global Distribution System',
      benefit: 'Access to travel agencies and global corporate clients. <strong>Strategic channel</strong> for business and MICE hotels.',
    },
    'moteur-resto': {
      title: 'Restaurant Booking Engine',
      benefit: 'Online cover management synced with the kitchen. <strong>Reduce no-shows</strong> and optimise your occupancy rate.',
    },
    'site-booking': {
      title: 'Website / Shop',
      benefit: 'Sell gift cards and experiences directly online. <strong>New revenue stream</strong> with no intermediary.',
    },
    'housekeeping': {
      title: 'Housekeeping',
      benefit: 'Real-time room status sync with the PMS. <strong>Cut turnaround times</strong>, eliminate radio back-and-forth and release rooms faster.',
    },
    'event-management': {
      title: 'Event Management',
      benefit: 'Centralised management of events, rooms and quotes. <strong>Maximise your space occupancy</strong> and automate group billing.',
    },
    'serrure': {
      title: 'Smart Lock',
      benefit: 'Self check-in and keyless access. <strong>Free your front desk</strong> from time constraints and improve the arrival experience.',
    },
    'telephonie': {
      title: 'Telephony',
      benefit: 'Unify communications and integrate telephony with PMS. <strong>Track every customer call</strong> and improve request management.',
    },
    'e-reputation': {
      title: 'E-reputation',
      benefit: 'Centralise customer review management across all platforms. <strong>Boost your average rating</strong> and online visibility.',
    },
    'tv': {
      title: 'TV / Chromecast',
      benefit: 'Personalise the in-room experience with targeted content. <strong>Generate additional revenue</strong> via premium services.',
    },
    'chatbot': {
      title: 'Chatbot',
      benefit: 'Answer frequently asked questions instantly 24/7. <strong>Reduce front desk load</strong> and capture more bookings.',
    },
    'wifi': {
      title: 'WiFi',
      benefit: 'Provide stable and secure connectivity to your guests. <strong>Collect marketing data</strong> via the captive portal.',
    },
  },

  wizardTools: {
    'pms': 'PMS',
    'channel-manager': 'Channel Manager',
    'booking-engine': 'Booking Engine',
    'site-internet': 'Website',
    'ota': 'OTA',
    'psp': 'PSP (Payment)',
    'pos': 'POS Restaurant',
    'compta': 'Accounting',
    'crm': 'CRM',
    'spa': 'SPA',
    'gds': 'GDS',
    'rms': 'RMS',
    'serrure': 'Smart Lock',
    'housekeeping': 'Housekeeping',
    'event-management': 'Event Management',
  },

  logicalPairs: {
    'pms|channel-manager': {
      question: 'Is your PMS connected to the Channel Manager?',
      warning: 'Major overbooking and rate parity risk.',
    },
    'pms|booking-engine': {
      question: 'Is your PMS directly connected to the Booking Engine?',
      warning: 'Unsynced availability: overbooking and lost direct bookings.',
    },
    'channel-manager|booking-engine': {
      question: 'Does the Channel Manager push rates and availability to the Booking Engine?',
      warning: 'Unsynced direct rates: risk of lost direct sales.',
    },
    'channel-manager|ota': {
      question: 'Are OTAs connected via the Channel Manager?',
      warning: 'Disconnected channels: forced closure on Booking/Expedia.',
    },
    'pms|ota': {
      question: 'Is your PMS synced directly with OTAs?',
      warning: 'Manual OTA updates: overbooking and rate parity risk.',
    },
    'booking-engine|psp': {
      question: 'Do online payments flow through the Booking Engine to the PSP?',
      warning: 'No real-time bank guarantee: risk of unpaid no-shows.',
    },
    'pms|psp': {
      question: 'Is the PSP directly connected to the PMS for payments?',
      warning: 'Manual payment reconciliation: till errors and delays.',
    },
    'booking-engine|site-internet': {
      question: 'Is the Booking Engine integrated into the Website?',
      warning: 'Broken guest journey: immediate conversion loss.',
    },
    'pms|site-internet': {
      question: 'Does the Website display live PMS availability?',
      warning: 'Unsynced availability: manual overselling risk.',
    },
    'channel-manager|gds': {
      question: 'Are GDS channels linked to the Channel Manager?',
      warning: 'Corporate channels unfed: B2B revenue loss.',
    },
    'pms|gds': {
      question: 'Is your PMS directly connected to GDS?',
      warning: 'Manual GDS updates: parity issues and commission loss.',
    },
    'pms|pos': {
      question: 'Does the POS automatically post room charges to the PMS?',
      warning: 'No room charge transfer: missed billing at check-out.',
    },
    'pms|serrure': {
      question: 'Are smart locks controlled by the PMS?',
      warning: 'Manual key entry: staff time lost and guest waiting.',
    },
    'pms|spa': {
      question: 'Are SPA bookings synced with the PMS?',
      warning: 'Unsynced schedules: errors on the final invoice.',
    },
    'pms|crm': {
      question: 'Is the CRM automatically fed by the PMS?',
      warning: 'Siloed data: impossible to personalise or build loyalty.',
    },
    'pms|compta': {
      question: 'Are accounting entries exported automatically from the PMS?',
      warning: 'Manual revenue entry: error risk and delayed closing.',
    },
    'pms|rms': {
      question: 'Does the RMS automatically adjust rates in the PMS?',
      warning: 'Static pricing: RevPAR shortfall.',
    },
    'booking-engine|crm': {
      question: 'Does the Booking Engine feed guest data into the CRM?',
      warning: 'Incomplete guest profiles: missed post-stay marketing.',
    },
    'pos|compta': {
      question: 'Does the POS automatically export sales to accounting?',
      warning: 'Manual F&B revenue entry: closing delay risk.',
    },
    'pms|housekeeping': {
      question: 'Is Housekeeping synced with the PMS?',
      warning: 'Manual room status updates: turnaround delays and check-in errors.',
    },
    'pms|event-management': {
      question: 'Is the Event Management system connected to the PMS?',
      warning: 'Manual group billing: risk of losses and duplicates on event files.',
    },
  },

  pairWarnMap: {
    'channel-manager,pms':           ['Distribution Flow: Critical overbooking risk. Your inventory is not synchronised.', 'critique'],
    'booking-engine,pms':            ['Booking Flow: Direct reservations are not automatically fed into your management system.', 'critique'],
    'booking-engine,channel-manager':['Booking Flow: Direct reservations are not automatically fed into your management system.', 'critique'],
    'channel-manager,ota':           ['Distribution: Your channels are not being fed. Manual inventory management required.', 'critique'],
    'ota,pms':                       ['Manual OTA updates: overbooking and rate parity risk.', 'critique'],
    'booking-engine,psp':            ['Payment: Risk of unpaid bookings or manual entry. No automatic bank guarantee.', 'critique'],
    'pms,psp':                       ['Payment: Risk of unpaid bookings or manual entry. No automatic bank guarantee.', 'critique'],
    'booking-engine,site-internet':  ['Sales Funnel: Guest journey broken. Your website cannot take bookings.', 'critique'],
    'pms,site-internet':             ['Unsynced availability: manual overselling risk.', 'critique'],
    'pms,pos':                       ['No room charge transfer: missed billing at check-out.', 'warning'],
    'pms,serrure':                   ['Manual key entry: staff time lost and guest waiting.', 'warning'],
    'pms,spa':                       ['Unsynced schedules: errors on the final invoice.', 'warning'],
    'crm,pms':                       ['Siloed data: impossible to build loyalty.', 'warning'],
    'compta,pms':                    ['Accounting: Manual revenue entry. Risk of errors and wasted time at month-end.', 'warning'],
    'pms,rms':                       ['Static pricing: RevPAR shortfall.', 'warning'],
    'booking-engine,crm':            ['Incomplete guest profiles: missed post-stay marketing.', 'warning'],
    'channel-manager,rms':           ['Yield management not broadcast: local optimisations only.', 'warning'],
    'compta,pos':                    ['Accounting: Manual revenue entry. Risk of errors and wasted time at month-end.', 'warning'],
    'channel-manager,gds':           ['Corporate channels unfed: B2B revenue loss.', 'info'],
    'gds,pms':                       ['Manual GDS updates: parity issues and commission loss.', 'info'],
    'housekeeping,pms':              ['Manual room status: turnaround delays and check-in errors.', 'warning'],
    'event-management,pms':          ['Manual group billing: risk of losses and duplicates.', 'warning'],
  },

  cardSuggestions: [
    'Accounting',
    'Booking Engine',
    'Chatbot',
    'Channel Manager',
    'CRM',
    'E-reputation',
    'Event Management',
    'GDS',
    'Gift shop / Vouchers',
    'Housekeeping',
    'OTA',
    'PMS',
    'POS',
    'PSP',
    'Smart Lock',
    'Telephony',
    'TV',
    'Website',
    'Wifi',
  ],

  categories: {
    management: 'Management',
    booking: 'Booking',
    sales: 'Distribution',
    customer: 'Guest',
    restaurant: 'Restaurant',
    wellness: 'Wellness',
  },

  diagnosticRules: {
    vitalOrPaths: {
      beReservation: "Booking Flow: Your direct reservations do not automatically sync to your management system.",
      pspPayment: "Payment: Risk of unpaid bookings or manual entry. No automatic bank guarantee.",
      rmsYield: "Yield: Your pricing decisions are not distributed in real-time across your channels.",
    },
    vitalLinks: {
      pmsCmStock: "PMS/CM Link: Critical risk of overbooking. Your inventory is not synchronized.",
      siteBeBooking: "Sales Funnel: Broken customer journey. Your website cannot accept bookings.",
      cmOtaDistribution: "Distribution: Your channels are not fed. Manual inventory management required.",
      cmGdsDistribution: "Distribution: Your channels are not fed. Manual inventory management required.",
    },
    indispensableLinks: {
      pmsPosRestaurant: "Restaurant Flow: Manual invoice entry and risk of forgotten charges at check-out.",
      pmsSpaSpa: "SPA Flow: SPA charges do not appear on the guest's room bill.",
      siteMoteurRestoDirect: "Direct Sales: Your website does not sell all your services (Restaurant, SPA, Gift Cards).",
      siteExpClientDirect: "Direct Sales: Your website does not sell all your services (Restaurant, SPA, Gift Cards).",
    },
    advisedLinks: {
      pmsCrmData: "Guest Data: Your profiles are isolated. Cannot personalize service or build loyalty.",
      pmsHousekeepingOps: "Operations: Delayed communication between front desk and housekeeping (room status).",
      pmsSerrureAutonomy: "Autonomy: Key/code creation is not synchronized with guest arrival.",
      pmsExpClientExperience: "Experience: Guest does not have real-time access to stay information.",
      pmsTvComfort: "Comfort: Welcome message or TV check-out is not activated.",
    },
    comptaLinks: {
      comptaPmsAccounting: "Accounting: Manual revenue entry. Risk of errors and wasted time at month-end.",
      comptaPosAccounting: "Accounting: Manual revenue entry. Risk of errors and wasted time at month-end.",
      comptaSpaAccounting: "Accounting: Manual revenue entry. Risk of errors and wasted time at month-end.",
    },
  },

  missingToolMessages: {
    managementDistribution: "Vital component missing. Your distribution is paralyzed without this essential tool.",
    guestSalesWellness: "Strategic blind spot. The absence of this tool prevents loyalty and limits ancillary revenue.",
  },
};

// ══════════════════════════════════════════════════════════════════════
// EXPORT
// ══════════════════════════════════════════════════════════════════════
export const translations: Record<Lang, Translations> = { fr, en };
