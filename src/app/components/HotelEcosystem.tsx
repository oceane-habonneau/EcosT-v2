import { useState, useRef, useCallback, useEffect } from 'react';
import { 
  Users, 
  Star, 
  Home, 
  Calculator, 
  Bed, 
  CreditCard, 
  Globe, 
  ShoppingBag, 
  MessageCircle, 
  UtensilsCrossed, 
  Calendar, 
  Sparkles, 
  Share2, 
  DollarSign,
  RotateCcw,
  Move,
  Link2,
  Unlink,
  Eye,
  Settings,
  Edit2,
  Trash2,
  Plus,
  X,
  Mail,
  Building2,
  Linkedin,
  TrendingUp,
  Menu,
  ChevronDown,
  ChevronUp,
  Search,
  Wrench,
  Radio,
  Layers,
  AlertCircle,
  ChevronUp as ChevronUpIcon
} from 'lucide-react';

interface SystemNode {
  id: string;
  name: string;
  category: 'management' | 'booking' | 'sales' | 'customer' | 'restaurant' | 'wellness';
  icon: string;
  x: number; // Position X in percentage
  y: number; // Position Y in percentage
  connections?: string[];
}

// 💡 Infobulles bénéfices par système
const nodeBenefits: Record<string, { title: string; benefit: string }> = {
  'pms': {
    title: 'PMS — Property Management System',
    benefit: 'Le <strong>cœur de votre hôtel</strong>. Centralise les réservations, les profils clients et la facturation pour supprimer les erreurs et les oublis.'
  },
  'channel-manager': {
    title: 'Channel Manager',
    benefit: 'Mise à jour automatique de vos stocks sur Booking, Expedia, etc. <strong>Fini le surbooking</strong> et les saisies manuelles fastidieuses.'
  },
  'pos': {
    title: 'POS — Point of Sale Restaurant',
    benefit: 'Envoi direct des notes en chambre et synchronisation des stocks. <strong>Une fluidité totale</strong> entre la salle et la réception.'
  },
  'psp': {
    title: 'PSP — Payment Service Provider',
    benefit: 'Sécurisation des transactions et prélèvements automatiques. <strong>30 min gagnées par jour</strong> à la clôture et moins de litiges bancaires.'
  },
  'crm': {
    title: 'Expérience Client / CRM',
    benefit: 'Automatise l\'envoi des emails pré-séjour/post-séjour. <strong>Fidélise vos clients</strong> sans que vous n\'ayez à y penser.'
  },
  'exp-client': {
    title: 'Expérience Client In-House',
    benefit: 'Personnalisez chaque séjour grâce aux données centralisées. <strong>Augmentez vos avis positifs</strong> et le retour de vos clients fidèles.'
  },
  'compta': {
    title: 'Flux Comptable',
    benefit: 'Export automatique de vos chiffres vers votre comptabilité. <strong>Zéro papier, zéro erreur, zéro retard.</strong>'
  },
  'booking-engine': {
    title: 'Moteur de Réservation',
    benefit: 'Captez les réservations directes sans commission OTA. <strong>Augmentez votre RevPAR</strong> en maîtrisant votre distribution.'
  },
  'ota': {
    title: 'OTA — Online Travel Agency',
    benefit: 'Visibilité maximale sur Booking.com, Expedia & co. <strong>Gérés automatiquement</strong> depuis votre channel manager pour zéro surcharge.'
  },
  'site-internet': {
    title: 'Site Internet',
    benefit: 'Votre vitrine digitale disponible 24h/24. <strong>Réduit votre dépendance aux OTA</strong> et renforce votre image de marque.'
  },
  'spa': {
    title: 'SPA & Wellness',
    benefit: 'Gestion des soins et réservations intégrée au PMS. <strong>Upsell automatique</strong> pour augmenter le panier moyen de vos séjours.'
  },
  'rms': {
    title: 'RMS — Revenue Management System',
    benefit: 'Optimise vos tarifs en temps réel selon la demande. <strong>+10% à +25% de RevPAR</strong> constaté selon les établissements.'
  },
  'gds': {
    title: 'GDS — Global Distribution System',
    benefit: 'Accès aux agences de voyages et clientèle corporate mondiale. <strong>Canal stratégique</strong> pour les hôtels business et MICE.'
  },
  'moteur-resto': {
    title: 'Moteur Réservation Restaurant',
    benefit: 'Gestion des couverts en ligne avec synchronisation cuisine. <strong>Réduisez les no-shows</strong> et optimisez votre taux de remplissage.'
  },
  'site-booking': {
    title: 'Site Web / Boutique',
    benefit: 'Vendez cartes cadeaux et expériences directement en ligne. <strong>Nouvelle source de revenus</strong> sans intermédiaire.'
  }
};

// 📋 Liste des suggestions de cartes (triées alphabétiquement)
const cardSuggestions = [
  'Boutique en ligne / Carte cadeaux',
  'Channel Manager',
  'Chatbot',
  'Comptabilité',
  'CRM',
  'E-réputation',
  'GDS',
  'Moteur de réservation',
  'OTA',
  'PMS',
  'POS',
  'PSP',
  'Serrure',
  'Site internet',
  'Téléphonie',
  'TV',
  'Wifi'
].sort();

// 🟢 Socle 1 - Essentiel (par défaut)
const socle1Essentiel: SystemNode[] = [
  { id: 'pms',            name: 'PMS',                  category: 'management', icon: 'Bed',             x: 51, y: 59, connections: ['channel-manager', 'pos'] },
  { id: 'channel-manager',name: 'Channel Manager',       category: 'sales',      icon: 'Share2',          x: 31, y: 38, connections: ['ota', 'booking-engine'] },
  { id: 'ota',            name: 'OTA',                   category: 'sales',      icon: 'Building2',       x: 13, y: 17, connections: [] },
  { id: 'booking-engine', name: 'Moteur de réservation', category: 'booking',    icon: 'Calendar',        x: 51, y: 17, connections: ['site-internet', 'psp'] },
  { id: 'site-internet',  name: 'Site internet',         category: 'sales',      icon: 'Globe',           x: 74, y: 17, connections: [] },
  { id: 'psp',            name: 'PSP',                   category: 'customer',   icon: 'CreditCard',      x: 74, y: 59, connections: [] },
  { id: 'pos',            name: 'POS restaurant',        category: 'restaurant', icon: 'UtensilsCrossed', x: 33, y: 78, connections: [] }
];

// 🟠 Socle 2 - Performance
const socle2Performance: SystemNode[] = [
  { id: 'pms',            name: 'PMS',                  category: 'management', icon: 'Bed',             x: 47, y: 55, connections: ['channel-manager', 'pos', 'compta', 'crm'] },
  { id: 'channel-manager',name: 'Channel Manager',       category: 'sales',      icon: 'Share2',          x: 36, y: 36, connections: ['ota', 'booking-engine'] },
  { id: 'ota',            name: 'OTA',                   category: 'sales',      icon: 'Building2',       x: 26, y: 14, connections: [] },
  { id: 'booking-engine', name: 'Moteur de réservation', category: 'booking',    icon: 'Calendar',        x: 49, y: 14, connections: ['site-internet', 'psp'] },
  { id: 'site-internet',  name: 'Site internet',         category: 'sales',      icon: 'Globe',           x: 70, y: 14, connections: [] },
  { id: 'psp',            name: 'PSP',                   category: 'customer',   icon: 'CreditCard',      x: 59, y: 34, connections: [] },
  { id: 'pos',            name: 'POS restaurant',        category: 'restaurant', icon: 'UtensilsCrossed', x: 31, y: 77, connections: [] },
  { id: 'compta',         name: 'Comptabilité',          category: 'management', icon: 'Calculator',      x: 67, y: 53, connections: [] },
  { id: 'crm',            name: 'CRM',                   category: 'management', icon: 'Users',           x: 63, y: 73, connections: [] },
];

// 🔵 Socle 3 - Signature
const socle3Signature: SystemNode[] = [
  { id: 'pms',            name: 'PMS',                  category: 'management', icon: 'Bed',             x: 47, y: 52, connections: ['channel-manager', 'pos', 'compta', 'crm', 'spa', 'exp-client', 'rms'] },
  { id: 'channel-manager',name: 'Channel Manager',       category: 'sales',      icon: 'Share2',          x: 36, y: 36, connections: ['ota', 'booking-engine', 'gds'] },
  { id: 'gds',            name: 'GDS',                   category: 'sales',      icon: 'Globe',           x: 9,  y: 14, connections: [] },
  { id: 'ota',            name: 'OTA',                   category: 'sales',      icon: 'Building2',       x: 32, y: 14, connections: [] },
  { id: 'booking-engine', name: 'Moteur de réservation', category: 'booking',    icon: 'Calendar',        x: 49, y: 14, connections: ['site-internet', 'psp'] },
  { id: 'site-internet',  name: 'Site internet',         category: 'sales',      icon: 'Globe',           x: 63, y: 14, connections: ['moteur-resto'] },
  { id: 'moteur-resto',   name: 'Moteur résa resto',     category: 'restaurant', icon: 'UtensilsCrossed', x: 77, y: 14, connections: [] },
  { id: 'psp',            name: 'PSP',                   category: 'customer',   icon: 'CreditCard',      x: 57, y: 34, connections: [] },
  { id: 'compta',         name: 'Comptabilité',          category: 'management', icon: 'Calculator',      x: 70, y: 34, connections: [] },
  { id: 'crm',            name: 'CRM',                   category: 'management', icon: 'Users',           x: 77, y: 52, connections: [] },
  { id: 'pos',            name: 'POS restaurant',        category: 'restaurant', icon: 'UtensilsCrossed', x: 23, y: 67, connections: [] },
  { id: 'rms',            name: 'RMS',                   category: 'management', icon: 'TrendingUp',      x: 37, y: 77, connections: [] },
  { id: 'spa',            name: 'SPA',                   category: 'wellness',   icon: 'Sparkles',        x: 57, y: 77, connections: [] },
  { id: 'exp-client',     name: 'Exp client in-house',   category: 'customer',   icon: 'Star',            x: 71, y: 77, connections: [] },
];

const SOCLE_DESCRIPTIONS: Record<string, string> = {
  essentiel: 'Le minimum vital pour exister et vendre en ligne sans erreur.',
  performance: 'L\'automatisation au service de l\'efficacité opérationnelle et de la facturation.',
  signature: 'L\'excellence technologique pour une expérience client personnalisée et data-driven.',
};

const categoryConfig = {
  management: { 
    label: 'Gestion & Opérations', 
    color: '#10b981',
  },
  booking: { 
    label: 'Réservations', 
    color: '#3b82f6',
  },
  sales: { 
    label: 'Distribution & Ventes', 
    color: '#f59e0b',
  },
  customer: { 
    label: 'Expérience Client', 
    color: '#14b8a6',
  },
  restaurant: { 
    label: 'Restauration', 
    color: '#f43f5e',
  },
  wellness: { 
    label: 'Bien-être', 
    color: '#a855f7',
  }
};

const iconMap: Record<string, any> = {
  Bed, Users, Star, Home, Calculator, CreditCard, Globe, ShoppingBag,
  MessageCircle, UtensilsCrossed, Calendar, Sparkles, Share2, DollarSign,
  Building2, TrendingUp
};

// ══════════ WIZARD TOOLS CATALOG ══════════
const WIZARD_TOOLS = [
  { id: 'pms', name: 'PMS', icon: 'Bed', category: 'management' as const },
  { id: 'channel-manager', name: 'Channel Manager', icon: 'Share2', category: 'sales' as const },
  { id: 'booking-engine', name: 'Moteur de Réservation', icon: 'Calendar', category: 'booking' as const },
  { id: 'site-internet', name: 'Site Internet', icon: 'Globe', category: 'sales' as const },
  { id: 'ota', name: 'OTA', icon: 'Building2', category: 'sales' as const },
  { id: 'psp', name: 'PSP (Paiement)', icon: 'CreditCard', category: 'customer' as const },
  { id: 'pos', name: 'POS Restaurant', icon: 'UtensilsCrossed', category: 'restaurant' as const },
  { id: 'compta', name: 'Comptabilité', icon: 'Calculator', category: 'management' as const },
  { id: 'crm', name: 'CRM', icon: 'Users', category: 'management' as const },
  { id: 'spa', name: 'SPA', icon: 'Sparkles', category: 'wellness' as const },
  { id: 'gds', name: 'GDS', icon: 'Globe', category: 'sales' as const },
  { id: 'rms', name: 'RMS', icon: 'TrendingUp', category: 'management' as const },
  { id: 'serrure', name: 'Serrure Connectée', icon: 'Home', category: 'customer' as const },
];

// Paires de connexions logiques possibles selon les outils sélectionnés
// Sévérité d'une rupture de flux
type Severity = 'critique' | 'warning' | 'info';

interface LogicalPair {
  a: string;
  b: string;
  question: string;
  warning: string;
  severity: Severity;
}

function getLogicalPairs(tools: Set<string>): LogicalPair[] {
  // Règle identique au scoring : toute paire dont les DEUX outils
  // sont présents est affichée — sans condition sur un tiers.
  // L'utilisateur peut avoir PMS↔Moteur ET CM↔Moteur simultanément,
  // exactement comme dans les VITAL_PATHS du scoring (chemins OR).

  const ALL_PAIRS: LogicalPair[] = [
    // ── Distribution / critiques ──
    { a: 'pms',             b: 'channel-manager',
      question: 'Votre PMS est-il connecté au Channel Manager ?',
      warning: 'Risque majeur de surbooking et de disparité tarifaire.',
      severity: 'critique' },
    { a: 'pms',             b: 'booking-engine',
      question: 'Votre PMS est-il connecté directement au Moteur de réservation ?',
      warning: 'Disponibilités non synchronisées : risque de sur-vente et perte de réservations directes.',
      severity: 'critique' },
    { a: 'channel-manager', b: 'booking-engine',
      question: 'Le Channel Manager envoie-t-il les tarifs et dispos au Moteur ?',
      warning: 'Tarifs directs non synchronisés : risque de perte de ventes directes.',
      severity: 'critique' },
    { a: 'channel-manager', b: 'ota',
      question: 'Les OTA sont-elles connectées via le Channel Manager ?',
      warning: 'Canaux déconnectés : fermeture forcée des ventes sur Booking/Expedia.',
      severity: 'critique' },
    { a: 'pms',             b: 'ota',
      question: 'Votre PMS est-il synchronisé directement avec les OTA ?',
      warning: 'Mises à jour manuelles sur les OTA : surbooking et disparité tarifaire.',
      severity: 'critique' },
    { a: 'booking-engine',  b: 'psp',
      question: 'Les paiements en ligne passent-ils par le Moteur vers le PSP ?',
      warning: 'Pas de garantie bancaire en temps réel : risque de no-shows impayés.',
      severity: 'critique' },
    { a: 'pms',             b: 'psp',
      question: 'Le PSP est-il connecté directement au PMS pour les paiements ?',
      warning: 'Réconciliation manuelle des paiements : erreurs de caisse et retards.',
      severity: 'critique' },
    { a: 'booking-engine',  b: 'site-internet',
      question: 'Le Moteur de réservation est-il intégré au Site Internet ?',
      warning: 'Parcours client rompu : perte de conversion immédiate.',
      severity: 'critique' },
    { a: 'pms',             b: 'site-internet',
      question: 'Le Site Internet affiche-t-il les disponibilités du PMS en temps réel ?',
      warning: 'Disponibilités non synchronisées : risque de sur-vente manuelle.',
      severity: 'critique' },
    { a: 'channel-manager', b: 'gds',
      question: 'Les GDS sont-ils reliés au Channel Manager ?',
      warning: 'Canaux corporate non alimentés : manque à gagner sur la clientèle B2B.',
      severity: 'info' },
    { a: 'pms',             b: 'gds',
      question: 'Votre PMS est-il connecté directement aux GDS ?',
      warning: 'Mises à jour manuelles vers les GDS : disparité et perte de commissions.',
      severity: 'info' },
    // ── Opérationnels ──
    { a: 'pms',             b: 'pos',
      question: 'Le POS envoie-t-il automatiquement les notes en chambre au PMS ?',
      warning: "Pas de transfert en chambre : oublis de facturation au check-out.",
      severity: 'warning' },
    { a: 'pms',             b: 'serrure',
      question: 'Les serrures connectées sont-elles pilotées par le PMS ?',
      warning: 'Saisie manuelle des clés : perte de temps staff et attente client.',
      severity: 'warning' },
    { a: 'pms',             b: 'spa',
      question: 'Les réservations SPA sont-elles synchronisées avec le PMS ?',
      warning: "Plannings non synchronisés : erreurs sur la facture globale.",
      severity: 'warning' },
    { a: 'pms',             b: 'crm',
      question: 'Le CRM est-il alimenté automatiquement par le PMS ?',
      warning: "Données isolées : impossible de personnaliser l'accueil ou de fidéliser.",
      severity: 'warning' },
    { a: 'pms',             b: 'compta',
      question: 'Les écritures comptables sont-elles exportées automatiquement du PMS ?',
      warning: "Saisie manuelle du CA : risque d'erreurs et retard de clôture.",
      severity: 'warning' },
    { a: 'pms',             b: 'rms',
      question: 'Le RMS ajuste-t-il les tarifs automatiquement dans le PMS ?',
      warning: 'Tarification statique : manque à gagner sur le RevPAR.',
      severity: 'warning' },
    { a: 'rms',             b: 'channel-manager',
      question: 'Le RMS pousse-t-il ses tarifs dynamiques vers le Channel Manager ?',
      warning: 'Yield management non diffusé : optimisations tarifaires non publiées.',
      severity: 'warning' },
    { a: 'booking-engine',  b: 'crm',
      question: 'Le Moteur de réservation alimente-t-il le CRM en données clients ?',
      warning: 'Profils clients incomplets : relances marketing manquées après séjour.',
      severity: 'warning' },
    { a: 'site-internet',   b: 'crm',
      question: 'Le Site Internet capture-t-il les visiteurs vers le CRM ?',
      warning: 'Leads non qualifiés : pas de suivi des prospects web.',
      severity: 'info' },
    { a: 'pos',             b: 'compta',
      question: 'Le POS exporte-t-il automatiquement ses ventes en comptabilité ?',
      warning: 'Saisie manuelle des recettes F&B : risque de décalage de clôture.',
      severity: 'warning' },
  ];

  // Même logique que le scoring : afficher toute paire dont les deux outils sont présents
  return ALL_PAIRS.filter(p => tools.has(p.a) && tools.has(p.b));
}

// ══════════ SCORING MATRIX V3 — Intelligence Métier ══════════
type ScoreLink = { a: string; b: string; points: number };
type AlternativePath = { paths: Array<{ a: string; b: string }>; points: number; label: string };

// Malus d'absence pour outils vitaux
const ABSENCE_PENALTIES: Record<string, number> = {
  'booking-engine': -30,
  'channel-manager': -20,
  'pms': -30,
  'site-internet': -20,
  'ota': -10,
};

// Flux vitaux avec chemins alternatifs (logique OR)
const VITAL_PATHS: AlternativePath[] = [
  {
    label: 'Flux Résa Directe',
    points: 20,
    paths: [
      { a: 'pms', b: 'booking-engine' },
      { a: 'channel-manager', b: 'booking-engine' },
    ],
  },
  {
    label: 'Flux Paiement',
    points: 20,
    paths: [
      { a: 'booking-engine', b: 'psp' },
      { a: 'pms', b: 'psp' },
    ],
  },
  {
    label: 'Flux Visibilité',
    points: 20,
    paths: [
      { a: 'site-internet', b: 'booking-engine' },
      { a: 'site-internet', b: 'pms' },
    ],
  },
];

// Liens vitaux simples (pas de chemins alternatifs)
const VITAL_LINKS: ScoreLink[] = [
  { a: 'pms',             b: 'channel-manager',  points: 20 },
  { a: 'channel-manager', b: 'ota',              points: 20 },
  { a: 'channel-manager', b: 'gds',              points: 20 },
];

const OPERATIONAL_LINKS: ScoreLink[] = [
  { a: 'pms',            b: 'pos',              points: 10 },
  { a: 'pms',            b: 'compta',           points: 10 },
  { a: 'pms',            b: 'serrure',          points: 10 },
  { a: 'pms',            b: 'spa',              points: 10 },
  { a: 'moteur-resto',   b: 'site-internet',    points: 10 },
  { a: 'site-booking',   b: 'site-internet',    points: 10 },
];

const STRATEGIC_LINKS: ScoreLink[] = [
  { a: 'pms', b: 'crm',        points: 5 },
  { a: 'pms', b: 'rms',        points: 5 },
  { a: 'pms', b: 'exp-client', points: 5 },
  { a: 'pms', b: 'tv',         points: 5 },
];

// Map des messages d'impact par paire (clé = ids triés join ',')
// Couvre toutes les paires possibles — indépendamment de l'existence d'un tiers
const PAIR_WARN_MAP: Record<string, [string, string]> = {
  // Critiques — flux de distribution
  'channel-manager,pms':           ['Risque majeur de surbooking et de disparité tarifaire.', 'critique'],
  'booking-engine,pms':            ['Disponibilités non synchronisées : risque de sur-vente et perte de réservations directes.', 'critique'],
  'booking-engine,channel-manager':['Tarifs directs non synchronisés : perte de ventes directes.', 'critique'],
  'channel-manager,ota':           ['Canaux déconnectés : fermeture forcée sur Booking/Expedia.', 'critique'],
  'ota,pms':                       ['Mises à jour manuelles sur les OTA : risque de surbooking et disparité tarifaire.', 'critique'],
  'booking-engine,psp':            ['Pas de garantie bancaire : risque de no-shows impayés.', 'critique'],
  'pms,psp':                       ['Réconciliation manuelle des paiements : erreurs de caisse et retards.', 'critique'],
  'booking-engine,site-internet':  ['Parcours client rompu : perte de conversion immédiate.', 'critique'],
  'pms,site-internet':             ['Disponibilités non synchronisées : risque de sur-vente manuelle.', 'critique'],
  // Opérationnels — warning
  'pms,pos':                       ["Pas de transfert chambre : oublis de facturation au check-out.", 'warning'],
  'pms,serrure':                   ["Saisie manuelle des clés : perte de temps staff.", 'warning'],
  'pms,spa':                       ["Plannings non synchronisés : erreurs sur facture globale.", 'warning'],
  'crm,pms':                       ["Données isolées : impossible de fidéliser.", 'warning'],
  'compta,pms':                    ["Saisie manuelle du CA : retard de clôture.", 'warning'],
  'pms,rms':                       ["Tarification statique : manque à gagner sur le RevPAR.", 'warning'],
  'booking-engine,crm':            ["Profils clients incomplets : relances marketing manquées.", 'warning'],
  'channel-manager,rms':           ["Yield management non diffusé : optimisations tarifaires locales.", 'warning'],
  'compta,pos':                    ["Saisie manuelle des recettes F&B : décalage de clôture.", 'warning'],
  // Info
  'channel-manager,gds':           ["Canaux corporate non alimentés : manque à gagner B2B.", 'info'],
  'gds,pms':                       ["Mises à jour manuelles vers les GDS : disparité et perte de commissions.", 'info'],
  'crm,site-internet':             ["Leads non qualifiés : pas de suivi des prospects web.", 'info'],
};

// Vérifie si un lien est actif (bidirectionnel)
function isLinkActive(
  a: string, b: string,
  connections: Record<string, string[]>
): boolean {
  return (connections[a]?.includes(b)) || (connections[b]?.includes(a));
}

// Vérifie si un lien est "pertinent" = les deux cartes sont sur le canvas
function isLinkRelevant(a: string, b: string, presentIds: Set<string>): boolean {
  return presentIds.has(a) && presentIds.has(b);
}

// Vérifie si AU MOINS UN chemin d'une alternative est tracé
function isAlternativePathActive(
  altPath: AlternativePath,
  connections: Record<string, string[]>,
  presentIds: Set<string>
): boolean {
  return altPath.paths.some(({ a, b }) =>
    isLinkRelevant(a, b, presentIds) && isLinkActive(a, b, connections)
  );
}

// Vérifie si AU MOINS UN chemin d'une alternative est PERTINENT (cartes présentes)
function isAlternativePathRelevant(
  altPath: AlternativePath,
  presentIds: Set<string>
): boolean {
  return altPath.paths.some(({ a, b }) => isLinkRelevant(a, b, presentIds));
}

function computeScore(
  connections: Record<string, string[]>,
  allSystems: { id: string }[]
): {
  score: number;
  maxScore: number;
  pct: number;
  alertPairs: { a: string; b: string; warning?: string; severity?: Severity }[];
  missingVitalTools: string[];
  penalty: number;
} {
  const presentIds = new Set(allSystems.map(s => s.id));
  let score = 0;
  let maxScore = 0;
  let penalty = 0;
  const alertPairs: { a: string; b: string; warning?: string; severity?: Severity }[] = [];
  const missingVitalTools: string[] = [];

  // 1️⃣ Calculer les malus d'absence
  for (const [toolId, malusPoints] of Object.entries(ABSENCE_PENALTIES)) {
    if (!presentIds.has(toolId)) {
      penalty += malusPoints;
      missingVitalTools.push(toolId);
    }
  }

  // 2️⃣ Flux vitaux avec chemins alternatifs
  for (const altPath of VITAL_PATHS) {
    if (!isAlternativePathRelevant(altPath, presentIds)) continue;
    maxScore += altPath.points;
    if (isAlternativePathActive(altPath, connections, presentIds)) {
      score += altPath.points;
    } else {
      // Badge d'alerte : au moins un chemin est pertinent mais aucun n'est tracé
      for (const { a, b } of altPath.paths) {
        if (isLinkRelevant(a, b, presentIds)) {
          const key = [a, b].sort().join(',') as keyof typeof PAIR_WARN_MAP;
          const w = PAIR_WARN_MAP[[a,b].sort().join(',')];
          alertPairs.push({ a, b, warning: w?.[0], severity: w?.[1] as Severity | undefined });
        }
      }
    }
  }

  // 3️⃣ Liens vitaux simples
  const seen = new Set<string>();
  for (const link of VITAL_LINKS) {
    const key = [link.a, link.b].sort().join('|');
    if (seen.has(key)) continue;
    if (!isLinkRelevant(link.a, link.b, presentIds)) continue;
    seen.add(key);
    maxScore += link.points;
    if (isLinkActive(link.a, link.b, connections)) {
      score += link.points;
    } else {
      { const w = PAIR_WARN_MAP[[link.a,link.b].sort().join(',')]; alertPairs.push({ a: link.a, b: link.b, warning: w?.[0], severity: w?.[1] as Severity | undefined }); }
    }
  }

  // 4️⃣ Liens opérationnels
  for (const link of OPERATIONAL_LINKS) {
    const key = [link.a, link.b].sort().join('|');
    if (seen.has(key)) continue;
    if (!isLinkRelevant(link.a, link.b, presentIds)) continue;
    seen.add(key);
    maxScore += link.points;
    if (isLinkActive(link.a, link.b, connections)) {
      score += link.points;
    } else {
      const w = PAIR_WARN_MAP[[link.a, link.b].sort().join(',')];
      alertPairs.push({ a: link.a, b: link.b, warning: w?.[0], severity: (w?.[1] as Severity) ?? 'warning' });
    }
  }

  // 5️⃣ Liens stratégiques
  for (const link of STRATEGIC_LINKS) {
    const key = [link.a, link.b].sort().join('|');
    if (seen.has(key)) continue;
    if (!isLinkRelevant(link.a, link.b, presentIds)) continue;
    seen.add(key);
    maxScore += link.points;
    if (isLinkActive(link.a, link.b, connections)) {
      score += link.points;
    } else {
      const w = PAIR_WARN_MAP[[link.a, link.b].sort().join(',')];
      alertPairs.push({ a: link.a, b: link.b, warning: w?.[0], severity: (w?.[1] as Severity) ?? 'info' });
    }
  }

  // 6️⃣ Score final avec malus (ne peut pas descendre sous 0)
  const finalScore = Math.max(0, score + penalty);
  const pct = maxScore === 0 ? 0 : Math.round((finalScore / maxScore) * 100);

  return { score: finalScore, maxScore, pct, alertPairs, missingVitalTools, penalty };
}

function getDiagnostic(pct: number, hasMissingVitalTools: boolean): {
  label: string;
  desc: string;
  color: string;
  barColor: string;
} {
  if (hasMissingVitalTools) return {
    label: '⚠️ Outil vital manquant',
    desc: 'Votre distribution repose sur des outils absents. Impossible d\'évaluer correctement votre écosystème.',
    color: 'text-red-700',
    barColor: '#dc2626',
  };
  if (pct <= 35) return {
    label: '⚠️ Écosystème en péril',
    desc: 'Votre gestion repose sur des processus manuels. Risque de surréservation et perte de CA direct.',
    color: 'text-red-600',
    barColor: '#ef4444',
  };
  if (pct <= 70) return {
    label: '⚙️ Gestion sous tension',
    desc: 'Le socle est là, mais vos outils travaillent en silos. La double saisie fragilise vos opérations.',
    color: 'text-orange-500',
    barColor: '#f97316',
  };
  if (pct <= 95) return {
    label: '✅ Performance activée',
    desc: 'Écosystème sain. Vous avez une base solide pour automatiser votre stratégie.',
    color: 'text-emerald-600',
    barColor: '#10b981',
  };
  return {
    label: '🚀 Écosystème Haute-Couture',
    desc: 'Intégration totale. Vos données travaillent pour vous.',
    color: 'text-emerald-700',
    barColor: '#059669',
  };
}

export function HotelEcosystem() {
  const [allSystems, setAllSystems] = useState<SystemNode[]>(socle1Essentiel);
  const [nodePositions, setNodePositions] = useState<Record<string, { x: number; y: number }>>(() =>
    socle1Essentiel.reduce((acc, system) => {
      acc[system.id] = { x: system.x, y: system.y };
      return acc;
    }, {} as Record<string, { x: number; y: number }>)
  );
  const [connections, setConnections] = useState<Record<string, string[]>>(() =>
    socle1Essentiel.reduce((acc, system) => {
      acc[system.id] = system.connections || [];
      return acc;
    }, {} as Record<string, string[]>)
  );
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [mode, setMode] = useState<'move' | 'link'>('move');
  const [selectedForLink, setSelectedForLink] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'admin' | 'public'>('admin');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState<string>('');
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [hoveredConnection, setHoveredConnection] = useState<string | null>(null);
  const [newCard, setNewCard] = useState({
    name: '',
    category: 'management' as const,
    icon: 'Bed'
  });
  
  // 💡 État tooltip
  const [tooltip, setTooltip] = useState<{ visible: boolean; x: number; y: number; title: string; benefit: string }>({
    visible: false, x: 0, y: 0, title: '', benefit: ''
  });

  // 📱 États pour le mobile
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isStackMenuOpen, setIsStackMenuOpen] = useState(false);
  const [isActionsMenuOpen, setIsActionsMenuOpen] = useState(false);
  
  // 📊 Widget scoring — sidebar panel dépliant (ouvert uniquement sur Socle Essentiel par défaut)
  const [scorePanelOpen, setScorePanelOpen] = useState(true);
  
  // 🎯 Socle actuel (pour afficher le descriptif)
  const [currentSocle, setCurrentSocle] = useState<'essentiel' | 'performance' | 'signature'>('essentiel');

  // 🧙‍♂️ Wizard de diagnostic
  const [showWizardOverlay, setShowWizardOverlay] = useState(true);
  const [showWizardModal, setShowWizardModal] = useState(false);
  const [wizardStep, setWizardStep] = useState<1 | 2>(1);
  const [selectedTools, setSelectedTools] = useState<Set<string>>(new Set());
  const [selectedConnections, setSelectedConnections] = useState<Set<string>>(new Set());

  // 📱 Mobile: drawer et modal santé plein écran
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [mobileHealthModalOpen, setMobileHealthModalOpen] = useState(false);
  const [healthDetailsExpanded, setHealthDetailsExpanded] = useState(false);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const diagramRef = useRef<HTMLDivElement>(null);

  // Gestion du drag tactile ET souris
  const handleMouseDown = (id: string, e: React.MouseEvent | React.TouchEvent) => {
    if (mode !== 'move' || viewMode !== 'admin') return;
    
    e.preventDefault();
    setDraggingId(id);
  };

  const handleCardClick = (id: string, e: React.MouseEvent) => {
    if (mode === 'link' && viewMode === 'admin') {
      e.stopPropagation();
      if (!selectedForLink) {
        setSelectedForLink(id);
      } else if (selectedForLink === id) {
        setSelectedForLink(null);
      } else {
        const hasConnection = connections[selectedForLink]?.includes(id);
        
        setConnections(prev => {
          const newConnections = { ...prev };
          if (hasConnection) {
            newConnections[selectedForLink] = newConnections[selectedForLink].filter(c => c !== id);
          } else {
            newConnections[selectedForLink] = [...(newConnections[selectedForLink] || []), id];
          }
          return newConnections;
        });
        
        setSelectedForLink(null);
      }
    }
  };

  const handleMouseMove = useCallback((e: MouseEvent | TouchEvent) => {
    if (!draggingId || !containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    
    const x = ((clientX - rect.left) / rect.width) * 100;
    const y = ((clientY - rect.top) / rect.height) * 100;

    const clampedX = Math.max(5, Math.min(95, x));
    const clampedY = Math.max(5, Math.min(95, y));

    setNodePositions(prev => ({
      ...prev,
      [draggingId]: { x: clampedX, y: clampedY }
    }));
  }, [draggingId]);

  const handleMouseUp = useCallback(() => {
    setDraggingId(null);
  }, []);

  useEffect(() => {
    if (draggingId) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      window.addEventListener('touchmove', handleMouseMove);
      window.addEventListener('touchend', handleMouseUp);
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
        window.removeEventListener('touchmove', handleMouseMove);
        window.removeEventListener('touchend', handleMouseUp);
      };
    }
  }, [draggingId, handleMouseMove, handleMouseUp]);

  const resetPositions = () => {
    setNodePositions(
      allSystems.reduce((acc, system) => {
        const original = socle1Essentiel.find(s => s.id === system.id) || 
                        socle2Performance.find(s => s.id === system.id) ||
                        socle3Signature.find(s => s.id === system.id);
        acc[system.id] = original ? { x: original.x, y: original.y } : { x: 50, y: 50 };
        return acc;
      }, {} as Record<string, { x: number; y: number }>)
    );
  };

  const resetConnections = () => {
    setConnections(
      allSystems.reduce((acc, system) => {
        acc[system.id] = system.connections || [];
        return acc;
      }, {} as Record<string, string[]>)
    );
    setSelectedForLink(null);
  };

  const startEditing = (id: string) => {
    const system = allSystems.find(s => s.id === id);
    if (system) {
      setEditingId(id);
      setEditingName(system.name);
    }
  };

  const saveEdit = () => {
    if (editingId && editingName) {
      setAllSystems(prev => prev.map(system => 
        system.id === editingId ? { ...system, name: editingName } : system
      ));
      setEditingId(null);
    }
  };

  const deleteSystem = (id: string) => {
    setAllSystems(prev => prev.filter(system => system.id !== id));
    setNodePositions(prev => {
      const { [id]: _, ...rest } = prev;
      return rest;
    });
    setConnections(prev => {
      const { [id]: _, ...rest } = prev;
      Object.keys(rest).forEach(key => {
        rest[key] = rest[key].filter(c => c !== id);
      });
      return rest;
    });
  };

  const addNewSystem = () => {
    if (!newCard.name.trim()) {
      alert('Veuillez entrer un nom pour la carte');
      return;
    }
    // Utiliser l'ID canonique si le nom correspond à un outil connu
    // (permet au scoring de reconnaître PMS, POS, etc.)
    const knownMatch = WIZARD_TOOLS.find(
      t => t.name.toLowerCase() === newCard.name.trim().toLowerCase()
    );
    // Éviter les doublons si l'outil est déjà sur le canvas
    const alreadyPresent = knownMatch && allSystems.some(s => s.id === knownMatch.id);
    const newId = (knownMatch && !alreadyPresent) ? knownMatch.id : `new-${Date.now()}`;
    const newSystem: SystemNode = {
      id: newId,
      name: newCard.name.trim(),
      category: newCard.category,
      icon: newCard.icon,
      x: 50,
      y: 50,
      connections: []
    };
    setAllSystems(prev => [...prev, newSystem]);
    setNodePositions(prev => ({
      ...prev,
      [newId]: { x: 50, y: 50 }
    }));
    setConnections(prev => ({
      ...prev,
      [newId]: prev[newId] ?? [] // conserver les connexions existantes si même ID
    }));
    setShowAddModal(false);
    setNewCard({ name: '', category: 'management', icon: 'Bed' });
    // Passer en mode liaison pour connecter immédiatement le nouvel outil
    setViewMode('admin');
    setMode('link');
  };


  const loadSocle = (socle: SystemNode[], socleType: 'essentiel' | 'performance' | 'signature') => {
    setAllSystems(socle);
    setNodePositions(
      socle.reduce((acc, system) => {
        acc[system.id] = { x: system.x, y: system.y };
        return acc;
      }, {} as Record<string, { x: number; y: number }>)
    );
    setConnections(
      socle.reduce((acc, system) => {
        acc[system.id] = system.connections || [];
        return acc;
      }, {} as Record<string, string[]>)
    );
    setSelectedForLink(null);
    setMode('move');
    setIsStackMenuOpen(false);
    
    // Fermer le panneau sur Performance/Signature, ouvrir sur Essentiel
    setScorePanelOpen(socleType === 'essentiel');
    setCurrentSocle(socleType);
  };

  const handleConnectionClick = (fromId: string, toId: string) => {
    if (mode === 'link') {
      setConnections(prev => {
        const newConnections = { ...prev };
        if (newConnections[fromId]) {
          newConnections[fromId] = newConnections[fromId].filter(id => id !== toId);
        }
        return newConnections;
      });
    }
  };

  // ── Wizard handlers ──
  const startWizard = () => {
    setShowWizardOverlay(false);
    setShowWizardModal(true);
    setWizardStep(1);
    setSelectedTools(new Set());
    setSelectedConnections(new Set());
  };

  const skipWizard = () => {
    setShowWizardOverlay(false);
    // Socle Essentiel déjà chargé par défaut
  };

  const toggleTool = (toolId: string) => {
    setSelectedTools(prev => {
      const next = new Set(prev);
      if (next.has(toolId)) {
        next.delete(toolId);
      } else {
        next.add(toolId);
      }
      return next;
    });
  };

  const toggleConnection = (pairKey: string) => {
    setSelectedConnections(prev => {
      const next = new Set(prev);
      if (next.has(pairKey)) {
        next.delete(pairKey);
      } else {
        next.add(pairKey);
      }
      return next;
    });
  };

  const finishWizard = () => {
    // 1. Nettoyer le canvas
    const newSystems: SystemNode[] = [];
    const newPositions: Record<string, { x: number; y: number }> = {};
    const newConnections: Record<string, string[]> = {};

    // 2. Ajouter les cartes sélectionnées
    const toolsList = Array.from(selectedTools);
    toolsList.forEach((toolId, index) => {
      const tool = WIZARD_TOOLS.find(t => t.id === toolId);
      if (!tool) return;
      
      // Positionner en grille 3 colonnes
      const col = index % 3;
      const row = Math.floor(index / 3);
      const x = 25 + col * 25;
      const y = 25 + row * 20;

      newSystems.push({
        id: toolId,
        name: tool.name,
        category: tool.category,
        icon: tool.icon,
        x,
        y,
        connections: [],
      });

      newPositions[toolId] = { x, y };
      newConnections[toolId] = [];
    });

    // 3. Tracer les connexions
    selectedConnections.forEach(pairKey => {
      const [a, b] = pairKey.split('|');
      if (newConnections[a] && !newConnections[a].includes(b)) {
        newConnections[a].push(b);
      }
    });

    // 4. Appliquer au state
    setAllSystems(newSystems);
    setNodePositions(newPositions);
    setConnections(newConnections);
    setShowWizardModal(false);
    setScorePanelOpen(true);
    // Mettre en mode admin+link pour permettre corrections immédiates
    setViewMode('admin');
    setMode('link');
    // Scroller vers le canvas
    setTimeout(() => {
      document.getElementById('ecosystem')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 200);
  };

  // ── Score calculé en temps réel — recalculé à chaque render ──
  const { pct, maxScore, alertPairs, missingVitalTools, penalty } = computeScore(connections, allSystems);
  const diagnostic = getDiagnostic(pct, missingVitalTools.length > 0);
  // Set rapide pour lookup O(1)
  const alertNodeIds = new Set(alertPairs.flatMap(p => [p.a, p.b]));

  // Ouvrir automatiquement le panel score quand il y a des alertes ou score < 100%
  useEffect(() => {
    if (pct < 100 && pct > 0) setScorePanelOpen(true);
  }, [pct]);

  return (
    <div className="max-w-[1400px] mx-auto p-3 sm:p-4 md:p-8">

      {/* ══════════ WIZARD OVERLAY D'ACCUEIL ══════════ */}
      {showWizardOverlay && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm">
          <div className="text-center px-6 py-8 max-w-md">
            <div className="mb-8">
              <h2 className="text-3xl sm:text-4xl font-black text-white mb-3 leading-tight">
                Calculer mon score d’automatisation
              </h2>
              <p className="text-base text-slate-200 leading-relaxed">
                Répondez à quelques questions pour obtenir un diagnostic personnalisé de votre infrastructure hôtelière.
              </p>
            </div>
            <button
              onClick={startWizard}
              className="w-full px-8 py-4 bg-gradient-to-r from-amber-400 to-amber-500 text-slate-900 text-lg font-black rounded-2xl hover:from-amber-500 hover:to-amber-600 transition-all shadow-2xl hover:shadow-amber-500/50 hover:scale-105 active:scale-100 mb-4"
            >
              🚀 LANCER MON DIAGNOSTIC
            </button>
            <button
              onClick={skipWizard}
              className="text-sm text-slate-300 hover:text-white underline underline-offset-4 transition-colors"
            >
              Explorer Manuellement - Expert
            </button>
          </div>
        </div>
      )}

      {/* ══════════ WIZARD MODAL (2 STEPS) ══════════ */}
      {showWizardModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
            
            {/* Header */}
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between flex-shrink-0">
              <div>
                <h3 className="text-xl font-bold text-slate-800">
                  {wizardStep === 1 ? 'Étape 1 : Inventaire' : 'Étape 2 : Connectivité'}
                </h3>
                <p className="text-sm text-slate-500">
                  {wizardStep === 1 ? 'Sélectionnez les outils présents dans votre hôtel' : 'Indiquez les connexions actives'}
                </p>
              </div>
              <button
                onClick={() => setShowWizardModal(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            {/* Body scrollable */}
            <div className="flex-1 overflow-y-auto p-6">
              
              {/* STEP 1 — Inventaire */}
              {wizardStep === 1 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {WIZARD_TOOLS.map(tool => {
                    const Icon = iconMap[tool.icon];
                    const isSelected = selectedTools.has(tool.id);
                    const config = categoryConfig[tool.category];
                    return (
                      <button
                        key={tool.id}
                        onClick={() => toggleTool(tool.id)}
                        className={`
                          relative p-4 rounded-xl border-2 transition-all hover:scale-105 active:scale-100
                          ${isSelected 
                            ? 'border-amber-400 bg-amber-50 shadow-lg shadow-amber-200' 
                            : 'border-slate-200 bg-white hover:border-slate-300'}
                        `}
                      >
                        {/* Checkbox */}
                        <div className={`
                          absolute top-2 right-2 w-5 h-5 rounded-md border-2 flex items-center justify-center transition-colors
                          ${isSelected ? 'bg-amber-400 border-amber-500' : 'bg-white border-slate-300'}
                        `}>
                          {isSelected && (
                            <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </div>
                        
                        {/* Icon */}
                        <div 
                          className="w-12 h-12 rounded-lg mx-auto mb-2 flex items-center justify-center"
                          style={{ backgroundColor: config.color + '22' }}
                        >
                          <Icon className="w-6 h-6" style={{ color: config.color }} />
                        </div>
                        
                        {/* Name */}
                        <p className="text-xs font-semibold text-slate-700 text-center leading-tight">
                          {tool.name}
                        </p>
                      </button>
                    );
                  })}
                </div>
              )}

              {/* STEP 2 — Connectivité avec warning + severity */}
              {wizardStep === 2 && (
                <div className="space-y-3">
                  {getLogicalPairs(selectedTools).map(({ a, b, question, warning, severity }) => {
                    const pairKey = `${a}|${b}`;
                    const isConnected = selectedConnections.has(pairKey);
                    const severityColors = {
                      critique: { bg: 'bg-red-50', border: 'border-red-200', badge: 'bg-red-100 text-red-700', icon: '🔴', dot: 'bg-red-500' },
                      warning:  { bg: 'bg-amber-50', border: 'border-amber-200', badge: 'bg-amber-100 text-amber-700', icon: '🟠', dot: 'bg-amber-400' },
                      info:     { bg: 'bg-blue-50', border: 'border-blue-200', badge: 'bg-blue-100 text-blue-700', icon: '🔵', dot: 'bg-blue-400' },
                    };
                    const sc = severityColors[severity];
                    return (
                      <div
                        key={pairKey}
                        className={`p-3 rounded-xl border-2 transition-all duration-200 ${isConnected ? 'bg-emerald-50 border-emerald-200' : `${sc.bg} ${sc.border}`}`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-slate-700 leading-snug">{question}</p>
                            {/* Warning message — visible uniquement si NON connecté */}
                            {!isConnected && (
                              <div className="flex items-start gap-1.5 mt-1.5">
                                <span className={`w-1.5 h-1.5 rounded-full ${sc.dot} flex-shrink-0 mt-1`} />
                                <p className="text-xs text-slate-500 leading-relaxed">{warning}</p>
                              </div>
                            )}
                          </div>
                          <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                            {!isConnected && (
                              <span className={`text-[9px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full ${sc.badge}`}>
                                {severity}
                              </span>
                            )}
                            <button
                              onClick={() => toggleConnection(pairKey)}
                              className={`relative w-11 h-6 rounded-full transition-colors duration-300 flex-shrink-0 ${isConnected ? 'bg-emerald-500' : 'bg-slate-300'}`}
                            >
                              <span className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-md transition-transform duration-300" style={{ transform: isConnected ? 'translateX(20px)' : 'translateX(0px)' }} />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  {getLogicalPairs(selectedTools).length === 0 && (
                    <div className="text-center py-8 text-slate-400">
                      <p className="text-sm">Aucune connexion possible avec votre sélection.</p>
                      <p className="text-xs mt-1">Retournez à l'étape 1 pour ajouter des outils.</p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-slate-200 flex items-center justify-between gap-3 flex-shrink-0">
              {wizardStep === 1 && (
                <>
                  <button
                    onClick={() => setShowWizardModal(false)}
                    className="px-4 py-2 text-sm text-slate-600 hover:text-slate-800 transition-colors"
                  >
                    Annuler
                  </button>
                  <button
                    onClick={() => setWizardStep(2)}
                    disabled={selectedTools.size === 0}
                    className="px-6 py-2 bg-slate-800 text-white text-sm font-bold rounded-xl hover:bg-slate-900 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    Suivant →
                  </button>
                </>
              )}
              {wizardStep === 2 && (
                <>
                  <button
                    onClick={() => setWizardStep(1)}
                    className="px-4 py-2 text-sm text-slate-600 hover:text-slate-800 transition-colors"
                  >
                    ← Retour
                  </button>
                  <button
                    onClick={finishWizard}
                    className="px-6 py-2 bg-gradient-to-r from-amber-400 to-amber-500 text-slate-900 text-sm font-black rounded-xl hover:from-amber-500 hover:to-amber-600 transition-all shadow-lg"
                  >
                    Générer mon diagnostic
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ══════════ HEADER COMMERCIAL ══════════ */}
      <div className="mb-3 md:mb-6">
        <div className="flex items-center justify-between gap-2 mb-3 px-3 sm:px-5 py-2 bg-white rounded-xl shadow-lg border-2 border-slate-200">
          {/* Brand */}
          <div className="flex flex-col leading-tight flex-shrink-0">
            <span className="text-sm sm:text-base md:text-xl font-bold bg-gradient-to-r from-slate-700 to-slate-900 bg-clip-text text-transparent whitespace-nowrap">Océane Habonneau</span>
            <span className="text-[9px] sm:text-xs text-slate-500 font-medium tracking-wide hidden sm:block">Flux &amp; Automatisations</span>
          </div>
          {/* Nav — icônes seules sur sm, icône+texte sur md+ */}
          <nav className="hidden sm:flex items-center gap-1 md:gap-2 text-[11px] md:text-sm font-medium text-slate-600">
            <a href="#ecosystem" className="flex items-center gap-1 px-2 py-1.5 rounded-lg hover:bg-slate-100 hover:text-slate-900 transition-colors">
              <Layers className="w-3.5 h-3.5 flex-shrink-0" /><span className="hidden md:inline whitespace-nowrap">Écosystème</span>
            </a>
            <a href="#services" className="flex items-center gap-1 px-2 py-1.5 rounded-lg hover:bg-slate-100 hover:text-slate-900 transition-colors">
              <Wrench className="w-3.5 h-3.5 flex-shrink-0" /><span className="hidden md:inline whitespace-nowrap">Services</span>
            </a>
            <button onClick={startWizard} className="flex items-center gap-1 px-2 py-1.5 rounded-lg hover:bg-slate-100 hover:text-slate-900 transition-colors">
              <Radio className="w-3.5 h-3.5 flex-shrink-0" /><span className="hidden md:inline whitespace-nowrap">Diagnostic</span>
            </button>
          </nav>
          {/* Right: CTA + burger mobile */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <a href="https://calendar.app.google/cKNAVTh1TFacNkXs6" target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 sm:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-amber-400 to-amber-500 text-slate-900 text-[11px] sm:text-xs md:text-sm font-bold rounded-lg hover:from-amber-500 hover:to-amber-600 transition-all shadow hover:shadow-md hover:-translate-y-0.5 whitespace-nowrap">
              <Calendar className="w-3.5 h-3.5 flex-shrink-0" />
              <span className="hidden sm:inline">Audit Gratuit</span><span className="sm:hidden">RDV</span>
            </a>
            {/* Burger — mobile uniquement, ouvre le drawer de navigation (ancres) */}
            <button
              onClick={() => setMobileNavOpen(o => !o)}
              className="sm:hidden w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 transition-colors flex-shrink-0"
              aria-label="Menu navigation"
            >
              <Menu className="w-4 h-4" />
            </button>
          </div>
        </div>
        <div className="text-center hidden sm:block">
          <h1 className="text-xl sm:text-2xl md:text-4xl mb-2 bg-gradient-to-r from-slate-700 to-slate-900 bg-clip-text text-transparent font-bold leading-tight">Scannez la rentabilité de votre environnement technologique.</h1>
          <p className="text-xs sm:text-sm md:text-base text-slate-600"><strong>Identifiez en 2 minutes les ruptures de flux qui saturent vos équipes et freinent vos réservations directes.</strong></p>
        </div>
      </div>

      {/* ── Drawer navigation mobile (burger navbar) ── */}
      {mobileNavOpen && (
        <>
          <div className="fixed inset-0 z-[200] bg-black/40 backdrop-blur-sm sm:hidden" onClick={() => setMobileNavOpen(false)} />
          <div className="fixed top-0 right-0 h-full w-64 z-[201] bg-white shadow-2xl sm:hidden flex flex-col">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200">
              <span className="font-bold text-slate-800">Navigation</span>
              <button onClick={() => setMobileNavOpen(false)} className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center">
                <X className="w-4 h-4 text-slate-600" />
              </button>
            </div>
            <nav className="flex flex-col gap-1 p-4 flex-1">
              <a href="#ecosystem" onClick={() => setMobileNavOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-100 transition-colors">
                <Layers className="w-4 h-4 text-amber-500 flex-shrink-0" />
                Écosystème
              </a>
              <a href="#services" onClick={() => setMobileNavOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-100 transition-colors">
                <Wrench className="w-4 h-4 text-amber-500 flex-shrink-0" />
                Services
              </a>
              <button onClick={() => { startWizard(); setMobileNavOpen(false); }}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-100 transition-colors text-left w-full">
                <Radio className="w-4 h-4 text-amber-500 flex-shrink-0" />
                Lancer mon diagnostic
              </button>
            </nav>
            <div className="p-4 border-t border-slate-200">
              <a href="https://calendar.app.google/cKNAVTh1TFacNkXs6" target="_blank" rel="noopener noreferrer"
                onClick={() => setMobileNavOpen(false)}
                className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-gradient-to-r from-amber-400 to-amber-500 text-slate-900 text-sm font-bold rounded-xl shadow-lg">
                <Calendar className="w-4 h-4" /> Audit Gratuit
              </a>
            </div>
          </div>
        </>
      )}

      {/* Admin Controls + Toolbar */}
      {(true) && (
        <>
          {/* ═══ TOOLBAR DESKTOP — pill radio buttons ═══ */}
          <div className="hidden md:block mb-4 p-3 bg-white rounded-2xl shadow-lg border-2 border-slate-200">
            <div className="flex flex-wrap gap-3 items-center justify-between">

              {/* ── Groupe Vue ── */}
              <div className="flex flex-col gap-1">
                <span className="text-[10px] uppercase tracking-widest font-semibold text-slate-400 px-1">Vue</span>
                <div className="flex rounded-full overflow-hidden shadow-md border-2" style={{ borderColor: '#475569' }}>
                  <button
                    onClick={() => setViewMode('admin')}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold transition-all duration-200"
                    style={viewMode === 'admin'
                      ? { background: '#475569', color: '#fff', boxShadow: 'inset 0 0 10px rgba(71,85,105,0.5)' }
                      : { background: '#fff', color: '#475569' }}
                  >
                    <Settings className="w-3.5 h-3.5" />
                    Admin
                  </button>
                  <button
                    onClick={() => {
                      setViewMode('public');
                      setMode('move');
                      setSelectedForLink(null);
                      setDraggingId(null);
                      setIsMobileMenuOpen(false);
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold transition-all duration-200"
                    style={viewMode === 'public'
                      ? { background: '#475569', color: '#fff', boxShadow: 'inset 0 0 10px rgba(71,85,105,0.5)' }
                      : { background: '#fff', color: '#475569' }}
                  >
                    <Eye className="w-3.5 h-3.5" />
                    Publique
                  </button>
                </div>
              </div>

              {/* ── Les autres groupes uniquement en mode Admin ── */}
              {viewMode === 'admin' && (
                <>

              {/* ── Groupe Mode ── */}
              <div className="flex flex-col gap-1">
                <span className="text-[10px] uppercase tracking-widest font-semibold text-slate-400 px-1">Mode</span>
                <div className="flex rounded-full overflow-hidden shadow-md border-2" style={{ borderColor: '#3B82F6' }}>
                  <button
                    onClick={() => { setMode('move'); setSelectedForLink(null); }}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold transition-all duration-200"
                    style={mode === 'move'
                      ? { background: '#3B82F6', color: '#fff', boxShadow: 'inset 0 0 10px rgba(59,130,246,0.5)' }
                      : { background: '#fff', color: '#3B82F6' }}
                  >
                    <Move className="w-3.5 h-3.5" />
                    Déplacement
                  </button>
                  <button
                    onClick={() => { setMode('link'); setDraggingId(null); }}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold transition-all duration-200"
                    style={mode === 'link'
                      ? { background: '#3B82F6', color: '#fff', boxShadow: 'inset 0 0 10px rgba(59,130,246,0.5)' }
                      : { background: '#fff', color: '#3B82F6' }}
                  >
                    <Link2 className="w-3.5 h-3.5" />
                    Liaison
                  </button>
                </div>
              </div>

              {/* ── Groupe Socle ── */}
              <div className="flex flex-col gap-1">
                <span className="text-[10px] uppercase tracking-widest font-semibold text-slate-400 px-1">Choisir mon Socle</span>
                <div className="flex rounded-full overflow-hidden shadow-md border-2" style={{ borderColor: '#119843' }}>
                  {[
                    { label: 'Essentiel', socle: socle1Essentiel, type: 'essentiel' as const },
                    { label: 'Performance', socle: socle2Performance, type: 'performance' as const },
                    { label: 'Signature', socle: socle3Signature, type: 'signature' as const },
                  ].map(({ label, socle, type }) => {
                    const isActive = currentSocle === type;
                    return (
                      <button
                        key={type}
                        onClick={() => loadSocle(socle, type)}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold transition-all duration-200"
                        style={isActive
                          ? { background: '#119843', color: '#fff', boxShadow: 'inset 0 0 10px rgba(17,152,67,0.5)' }
                          : { background: '#fff', color: '#119843' }}
                      >
                        <Layers className="w-3.5 h-3.5" />
                        {label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* ── Bouton Ajouter ── */}
              <div className="flex flex-col gap-1">
                <span className="text-[10px] uppercase tracking-widest font-semibold text-slate-400 px-1">Outil</span>
                <button
                  onClick={() => setShowAddModal(true)}
                  className="flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold text-white shadow-md transition-all duration-200 hover:brightness-110 active:scale-95"
                  style={{ background: '#fe9a00', border: '2px solid #fe9a00' }}
                >
                  <Plus className="w-3.5 h-3.5" />
                  Ajouter un outil
                </button>
              </div>

              {/* ── Groupe Réinitialiser ── */}
              <div className="flex flex-col gap-1">
                <span className="text-[10px] uppercase tracking-widest font-semibold text-slate-400 px-1">Réinitialiser</span>
                <div className="flex rounded-full overflow-hidden shadow-md border-2" style={{ borderColor: '#aeaeae' }}>
                  <button
                    onClick={resetConnections}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold transition-all duration-200 hover:brightness-90"
                    style={{ background: '#f5f5f5', color: '#555' }}
                  >
                    <Unlink className="w-3.5 h-3.5" />
                    Liaisons
                  </button>
                  <button
                    onClick={resetPositions}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold transition-all duration-200 hover:brightness-90"
                    style={{ background: '#f5f5f5', color: '#555', borderLeft: '1px solid #aeaeae' }}
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    Positions
                  </button>
                </div>
              </div>

              </>
              )}{/* /admin-only groups */}

            </div>
          </div>

          {/* Mode instructions — only in admin */}
          {viewMode === 'admin' && (
          <div className="mb-4">
            {mode === 'move' && (
              <div className="flex items-center gap-2 px-3 md:px-4 py-2 bg-blue-50 border-2 border-blue-200 text-blue-700 rounded-lg md:rounded-xl shadow-md">
                <Move className="w-3.5 h-3.5 md:w-4 md:h-4 flex-shrink-0" />
                <span className="text-xs md:text-sm">
                  <span className="hidden sm:inline">Cliquez et glissez pour déplacer les cartes</span>
                  <span className="sm:hidden">Déplacez les cartes</span>
                </span>
              </div>
            )}
            {mode === 'link' && (
              <div className="flex items-center justify-between gap-2 px-3 md:px-4 py-2 rounded-lg md:rounded-xl shadow-md" style={{ background: 'linear-gradient(135deg, rgba(139,92,246,0.12), rgba(59,130,246,0.08))', border: '2px solid rgba(139,92,246,0.3)' }}>
                <div className="flex items-center gap-2">
                  <Link2 className="w-3.5 h-3.5 md:w-4 md:h-4 flex-shrink-0 text-purple-600" />
                  <span className="text-xs md:text-sm text-purple-700 font-medium">
                    {selectedForLink
                      ? <><span className="hidden sm:inline">Cliquez sur une autre carte pour créer/supprimer une liaison</span><span className="sm:hidden">Cliquez sur une carte cible</span></>
                      : <><span className="hidden sm:inline">Mode liaison actif — cliquez sur une carte pour commencer</span><span className="sm:hidden">Cliquez sur une carte</span></>}
                  </span>
                </div>
                {/* Le score se met à jour en temps réel */}
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0" style={{ background: 'rgba(139,92,246,0.15)', color: '#7c3aed' }}>
                  Score : {pct}%
                </span>
              </div>
            )}
          </div>
          )}{/* /mode instructions */}
        </>
      )}{/* /toolbar wrapper */}

      {/* ═══ MOBILE FAB + BOTTOM DRAWER ═══ */}
      <div className="md:hidden">
        {/* Floating Action Button */}
        <button
          onClick={() => setMobileDrawerOpen(true)}
          className="fixed bottom-6 right-6 z-[90] w-14 h-14 rounded-full bg-gradient-to-br from-slate-700 to-slate-900 text-white shadow-2xl flex items-center justify-center hover:scale-110 transition-transform"
        >
          <Settings className="w-6 h-6" />
        </button>

        {/* Bottom Drawer */}
        {mobileDrawerOpen && (
          <>
            {/* Overlay */}
            <div
              className="fixed inset-0 z-[95] bg-black/50 backdrop-blur-sm"
              onClick={() => setMobileDrawerOpen(false)}
            />
            
            {/* Drawer */}
            <div className="fixed bottom-0 left-0 right-0 z-[96] bg-white rounded-t-3xl shadow-2xl max-h-[80vh] overflow-y-auto">
              {/* Handle */}
              <div className="flex justify-center pt-3 pb-2">
                <div className="w-12 h-1.5 bg-slate-300 rounded-full" />
              </div>

              {/* Header */}
              <div className="px-6 pb-4 border-b border-slate-200 flex items-center justify-between">
                <h3 className="text-lg font-bold text-slate-800">Paramètres</h3>
                <button
                  onClick={() => setMobileDrawerOpen(false)}
                  className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center"
                >
                  <X className="w-5 h-5 text-slate-600" />
                </button>
              </div>

              {/* Content */}
              <div className="p-6 space-y-6">
                {/* Vue */}
                <div>
                  <p className="text-xs uppercase tracking-widest font-semibold text-slate-400 mb-3">Vue</p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setViewMode('admin')}
                      className={`flex-1 py-3 rounded-xl font-semibold text-sm transition-all ${
                        viewMode === 'admin' 
                          ? 'bg-slate-800 text-white shadow-lg' 
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      <Settings className="w-4 h-4 inline mr-2" />
                      Admin
                    </button>
                    <button
                      onClick={() => {
                        setViewMode('public');
                        setMode('move');
                        setSelectedForLink(null);
                      }}
                      className={`flex-1 py-3 rounded-xl font-semibold text-sm transition-all ${
                        viewMode === 'public' 
                          ? 'bg-slate-800 text-white shadow-lg' 
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      <Eye className="w-4 h-4 inline mr-2" />
                      Publique
                    </button>
                  </div>
                </div>

                {viewMode === 'admin' && (
                  <>
                    {/* Mode */}
                    <div>
                      <p className="text-xs uppercase tracking-widest font-semibold text-slate-400 mb-3">Mode</p>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setMode('move')}
                          className={`flex-1 py-3 rounded-xl font-semibold text-sm transition-all ${
                            mode === 'move' 
                              ? 'bg-blue-600 text-white shadow-lg' 
                              : 'bg-blue-50 text-blue-600'
                          }`}
                        >
                          <Move className="w-4 h-4 inline mr-2" />
                          Déplacement
                        </button>
                        <button
                          onClick={() => setMode('link')}
                          className={`flex-1 py-3 rounded-xl font-semibold text-sm transition-all ${
                            mode === 'link' 
                              ? 'bg-blue-600 text-white shadow-lg' 
                              : 'bg-blue-50 text-blue-600'
                          }`}
                        >
                          <Link2 className="w-4 h-4 inline mr-2" />
                          Liaison
                        </button>
                      </div>
                    </div>

                    {/* Socle */}
                    <div>
                      <p className="text-xs uppercase tracking-widest font-semibold text-slate-400 mb-3">Choisir mon Socle</p>
                      <div className="space-y-2">
                        {[
                          { label: 'Essentiel', socle: socle1Essentiel, type: 'essentiel' as const },
                          { label: 'Performance', socle: socle2Performance, type: 'performance' as const },
                          { label: 'Signature', socle: socle3Signature, type: 'signature' as const },
                        ].map(({ label, socle, type }) => (
                          <button
                            key={type}
                            onClick={() => {
                              loadSocle(socle, type);
                              setMobileDrawerOpen(false);
                            }}
                            className={`w-full py-3 rounded-xl font-semibold text-sm transition-all ${
                              currentSocle === type 
                                ? 'bg-emerald-600 text-white shadow-lg' 
                                : 'bg-emerald-50 text-emerald-700'
                            }`}
                          >
                            <Layers className="w-4 h-4 inline mr-2" />
                            {label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Actions */}
                    <div>
                      <p className="text-xs uppercase tracking-widest font-semibold text-slate-400 mb-3">Actions</p>
                      <div className="space-y-2">
                        <button
                          onClick={() => {
                            setShowAddModal(true);
                            setMobileDrawerOpen(false);
                          }}
                          className="w-full py-3 rounded-xl font-semibold text-sm bg-orange-500 text-white shadow-lg"
                        >
                          <Plus className="w-4 h-4 inline mr-2" />
                          Ajouter un outil
                        </button>
                        <button
                          onClick={() => {
                            resetConnections();
                            setMobileDrawerOpen(false);
                          }}
                          className="w-full py-3 rounded-xl font-semibold text-sm bg-slate-100 text-slate-700"
                        >
                          <Unlink className="w-4 h-4 inline mr-2" />
                          Réinitialiser liaisons
                        </button>
                        <button
                          onClick={() => {
                            resetPositions();
                            setMobileDrawerOpen(false);
                          }}
                          className="w-full py-3 rounded-xl font-semibold text-sm bg-slate-100 text-slate-700"
                        >
                          <RotateCcw className="w-4 h-4 inline mr-2" />
                          Réinitialiser positions
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </>
        )}
      </div>

      {/* ── Descriptif du socle actif (visible uniquement en mode admin) ── */}
      {viewMode === 'admin' && (
        <div className="mb-3 px-4 py-2 bg-emerald-50 border border-emerald-200 rounded-xl text-center">
          <p className="text-xs text-emerald-700 font-medium leading-relaxed">
            <span className="font-bold">Le Socle {currentSocle === 'essentiel' ? 'Essentiel' : currentSocle === 'performance' ? 'Performance' : 'Signature'}</span> : {SOCLE_DESCRIPTIONS[currentSocle]}
          </p>
        </div>
      )}

      {/* ══════════ COMMENT LIRE CE SCHÉMA ══════════ */}
      {(() => {
        const stepsData = [
          { n: '1', title: 'Diagnostiquez', desc: 'Utilisez nos Socles de référence pour situer votre établissement.' },
          { n: '2', title: 'Analysez', desc: "Un socle est cohérent quand les flux sont tracés. Un outil isolé est une source de perte de temps." },
          { n: '3', title: 'Optimisez', desc: 'Visez le score de 100% pour garantir une automatisation totale de votre parcours client.' },
          { n: '4', title: 'Bénéfice pour vous', desc: "Passez la souris sur chaque carte pour comprendre ce qu'elle change dans votre quotidien opérationnel." },
        ];
        return (
          <div className="mb-4 p-3 sm:p-5 bg-white rounded-2xl shadow-lg border-2 border-slate-200">
            <div className="flex items-center justify-between mb-3">
              <p className="text-[10px] uppercase tracking-widest font-semibold text-slate-400">Comment utiliser cet outil ?</p>
              <span className="sm:hidden flex items-center gap-1 text-[10px] text-amber-500 font-semibold select-none">
                Défiler <ChevronDown className="w-3 h-3 -rotate-90" />
              </span>
            </div>
            {/* Mobile: scroll horizontal snap  ·  Desktop: grille 4 colonnes */}
            <div
              className="flex gap-3 overflow-x-auto pb-2 snap-x snap-mandatory lg:grid lg:grid-cols-4 lg:overflow-visible lg:pb-0"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {stepsData.map((step, i) => (
                <div
                  key={step.n}
                  className="flex items-start gap-2.5 snap-start flex-shrink-0 w-[calc(85vw)] sm:w-auto lg:w-auto"
                >
                  <div className="w-7 h-7 rounded-full bg-amber-400 text-slate-900 font-bold text-xs flex items-center justify-center flex-shrink-0 shadow-md mt-0.5">
                    {step.n}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-slate-800 mb-1 leading-tight">{step.title}</p>
                    <p className="text-[11px] text-slate-500 leading-relaxed">{step.desc}</p>
                    {/* Dots pagination — mobile seulement */}
                    <div className="flex gap-1 mt-2 lg:hidden">
                      {stepsData.map((_, j) => (
                        <span
                          key={j}
                          className="h-1 rounded-full transition-all duration-300 inline-block"
                          style={{ width: j === i ? 16 : 6, background: j === i ? '#f59e0b' : '#e2e8f0' }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })()}

      {/* ══════════ ECOSYSTEM DIAGRAM ══════════ */}
      <div id="ecosystem">
      {/* Tooltip overlay */}
      {tooltip.visible && (
        <div
          className="fixed z-[9999] pointer-events-none"
          style={{ left: tooltip.x + 16, top: tooltip.y - 10, maxWidth: 260 }}
        >
          <div className="bg-slate-900 text-white rounded-xl shadow-2xl p-3 sm:p-4 border-l-4 border-amber-400">
            <p className="text-[10px] uppercase tracking-widest text-amber-400 mb-1 font-semibold">Bénéfice pour vous</p>
            <p className="text-xs sm:text-sm font-bold text-white mb-1.5 leading-tight">{tooltip.title}</p>
            <p className="text-xs text-slate-300 leading-relaxed" dangerouslySetInnerHTML={{ __html: tooltip.benefit }} />
          </div>
        </div>
      )}

      {/* Ecosystem Diagram */}
      <div ref={diagramRef} className="relative rounded-2xl md:rounded-3xl shadow-2xl min-h-[400px] sm:min-h-[500px] md:min-h-[600px] touch-none" style={{ padding: '72px 20px', overflow: 'visible', background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)', border: '1px solid rgba(148,163,184,0.1)' }}>

        {/* ══════════ PANNEAU SCORE (Desktop) — dark style ══════════ */}
        <div className="hidden md:block">
          <div
            className="absolute top-4 right-4 z-[100] transition-all duration-500 ease-in-out"
            style={{ width: scorePanelOpen ? '228px' : 'auto' }}
          >
            {/* Pill header toggle */}
            <button
              onClick={() => setScorePanelOpen(o => !o)}
              className="w-full flex items-center justify-between gap-2 px-3 py-2 rounded-xl text-white transition-all duration-300 hover:brightness-110"
              style={{
                background: `linear-gradient(135deg, ${diagnostic.barColor}cc, ${diagnostic.barColor}99)`,
                border: `1px solid ${diagnostic.barColor}60`,
                backdropFilter: 'blur(16px)',
                boxShadow: `0 4px 16px rgba(0,0,0,0.3), 0 0 12px ${diagnostic.barColor}30`,
                minWidth: '130px'
              }}
            >
              <span className="text-sm font-black leading-none whitespace-nowrap">Score {pct}%</span>
              <ChevronUpIcon
                className="w-3.5 h-3.5 opacity-80 flex-shrink-0 transition-transform duration-300"
                style={{ transform: scorePanelOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
              />
            </button>

            {scorePanelOpen && (
              <div className="mt-1.5 rounded-2xl flex flex-col" style={{
                background: 'linear-gradient(145deg, rgba(15,23,42,0.97) 0%, rgba(30,41,59,0.95) 100%)',
                border: '1px solid rgba(148,163,184,0.12)',
                backdropFilter: 'blur(20px)',
                boxShadow: '0 16px 40px rgba(0,0,0,0.5)',
                maxHeight: '70vh',
              }}>

                {/* ── Header fixe : score + barre ── */}
                <div className="flex-shrink-0">
                  <div className="px-4 py-3 text-center border-b border-white/10">
                    <div className="text-4xl font-black mb-0.5" style={{ color: diagnostic.barColor, textShadow: `0 0 20px ${diagnostic.barColor}60` }}>{pct}%</div>
                    <p className="text-[11px] font-bold uppercase tracking-wide text-white/70">{diagnostic.label}</p>
                    <button
                      onClick={() => setHealthDetailsExpanded(e => !e)}
                      className="text-[10px] text-white/40 hover:text-white/70 underline mt-1 transition-colors"
                    >
                      {healthDetailsExpanded ? '− Masquer' : '+ Détails'}
                    </button>
                    {healthDetailsExpanded && (
                      <p className="text-[10px] text-white/50 leading-relaxed mt-2 px-1">{diagnostic.desc}</p>
                    )}
                  </div>
                  <div className="px-4 py-2.5 border-b border-white/10">
                    <div className="w-full h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
                      <div className="h-full rounded-full transition-all duration-700" style={{ width: `${pct}%`, backgroundColor: diagnostic.barColor, boxShadow: `0 0 8px ${diagnostic.barColor}80` }} />
                    </div>
                    <div className="flex justify-between text-[9px] text-white/30 mt-1">
                      <span>0%</span>
                      <span className="text-white/60 font-semibold">
                        {maxScore > 0 ? `${Math.round((pct * maxScore) / 100)} / ${maxScore} pts` : '—'}
                        {penalty < 0 && <span className="text-red-400"> ({penalty})</span>}
                      </span>
                      <span>100%</span>
                    </div>
                  </div>
                </div>

                {/* ── Zone scrollable : alertes triées par gravité ── */}
                {(alertPairs.length > 0 || missingVitalTools.length > 0) && (
                  <div
                    className="flex-1 overflow-y-auto px-3 py-2.5 space-y-1.5"
                    style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(255,255,255,0.12) transparent' }}
                  >
                    {/* 1️⃣ Critiques en premier */}
                    {alertPairs.filter(p => p.severity === 'critique').map(({ a, b, warning }) => {
                      const nameA = allSystems.find(s => s.id === a)?.name || a;
                      const nameB = allSystems.find(s => s.id === b)?.name || b;
                      return (
                        <div key={`${a}-${b}`} className="p-2 rounded-xl" style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)' }}>
                          <div className="flex items-center gap-1.5 mb-0.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse flex-shrink-0" />
                            <span className="text-[9px] font-bold uppercase tracking-wide text-red-400">{nameA} ↔ {nameB}</span>
                            <span className="ml-auto text-[8px] font-black uppercase bg-red-500/20 text-red-400 px-1.5 py-0.5 rounded-full">critique</span>
                          </div>
                          {warning && <p className="text-[9px] leading-snug pl-3 text-red-300/70">{warning}</p>}
                        </div>
                      );
                    })}

                    {/* 2️⃣ Warnings */}
                    {alertPairs.filter(p => p.severity === 'warning').map(({ a, b, warning }) => {
                      const nameA = allSystems.find(s => s.id === a)?.name || a;
                      const nameB = allSystems.find(s => s.id === b)?.name || b;
                      return (
                        <div key={`${a}-${b}`} className="p-2 rounded-xl" style={{ background: 'rgba(245,158,11,0.07)', border: '1px solid rgba(245,158,11,0.22)' }}>
                          <div className="flex items-center gap-1.5 mb-0.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 flex-shrink-0" />
                            <span className="text-[9px] font-bold uppercase tracking-wide text-amber-400">{nameA} ↔ {nameB}</span>
                            <span className="ml-auto text-[8px] font-black uppercase bg-amber-500/20 text-amber-400 px-1.5 py-0.5 rounded-full">warning</span>
                          </div>
                          {warning && <p className="text-[9px] leading-snug pl-3 text-amber-300/60">{warning}</p>}
                        </div>
                      );
                    })}

                    {/* 3️⃣ Info */}
                    {alertPairs.filter(p => p.severity === 'info').map(({ a, b, warning }) => {
                      const nameA = allSystems.find(s => s.id === a)?.name || a;
                      const nameB = allSystems.find(s => s.id === b)?.name || b;
                      return (
                        <div key={`${a}-${b}`} className="p-2 rounded-xl" style={{ background: 'rgba(59,130,246,0.07)', border: '1px solid rgba(59,130,246,0.20)' }}>
                          <div className="flex items-center gap-1.5 mb-0.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 flex-shrink-0" />
                            <span className="text-[9px] font-bold uppercase tracking-wide text-blue-400">{nameA} ↔ {nameB}</span>
                            <span className="ml-auto text-[8px] font-black uppercase bg-blue-500/20 text-blue-400 px-1.5 py-0.5 rounded-full">info</span>
                          </div>
                          {warning && <p className="text-[9px] leading-snug pl-3 text-blue-300/60">{warning}</p>}
                        </div>
                      );
                    })}

                    {/* 4️⃣ Outils absents */}
                    {missingVitalTools.length > 0 && (
                      <div className="p-2.5 rounded-xl" style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.20)' }}>
                        <div className="flex items-center gap-1.5 mb-1.5">
                          <span className="w-2 h-2 rounded-full bg-red-400 animate-pulse flex-shrink-0" />
                          <p className="text-[9px] font-black text-red-400 uppercase tracking-wide">Outils indispensables absents</p>
                        </div>
                        {missingVitalTools.map(toolId => {
                          const names: Record<string,string> = { 'booking-engine':'Moteur de Réservation','channel-manager':'Channel Manager','pms':'PMS','site-internet':'Site Internet','ota':'OTA' };
                          return (
                            <div key={toolId} className="mb-1 p-1.5 rounded-lg" style={{ background: 'rgba(239,68,68,0.08)' }}>
                              <p className="text-[10px] text-red-300 font-bold">{names[toolId] || toolId}</p>
                              <p className="text-[9px] text-red-400/60 leading-snug mt-0.5">Colonne vertébrale de votre rentabilité.</p>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}

                {/* ── Footer sticky : bouton ajouter ── */}
                <div className="flex-shrink-0 px-3 pb-3 pt-2 border-t border-white/10">
                  <button
                    onClick={() => setShowAddModal(true)}
                    className="w-full py-2 rounded-xl text-[11px] font-bold text-white flex items-center justify-center gap-1.5 transition-all hover:brightness-110 active:scale-95"
                    style={{ background: 'linear-gradient(135deg, rgba(16,185,129,0.8), rgba(5,150,105,0.9))', border: '1px solid rgba(16,185,129,0.4)', boxShadow: '0 4px 12px rgba(16,185,129,0.2)' }}
                  >
                    <Plus className="w-3.5 h-3.5" /> Ajouter un outil
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ══════════ STICKY PASTILLE MOBILE + MODAL SANTÉ ══════════ */}
        <div className="md:hidden">
          {/* Pastille santé mobile — au-dessus du FAB (bottom-24) */}
          <button
            onClick={() => setMobileHealthModalOpen(true)}
            className="fixed bottom-24 right-4 z-[100] flex items-center gap-2 px-3 py-2 rounded-xl text-white font-black backdrop-blur-lg transition-all hover:brightness-110 active:scale-95"
            style={{
              background: `linear-gradient(135deg, ${diagnostic.barColor}cc, ${diagnostic.barColor}99)`,
              border: `1px solid ${diagnostic.barColor}60`,
              boxShadow: `0 4px 16px rgba(0,0,0,0.4), 0 0 12px ${diagnostic.barColor}30`
            }}
          >
            <span className="text-sm font-black leading-none whitespace-nowrap">Score {pct}%</span>
            <ChevronUpIcon className="w-3.5 h-3.5 opacity-80" style={{ transform: 'rotate(180deg)' }} />
          </button>

          {/* Modal plein écran */}
          {mobileHealthModalOpen && (
            <div className="fixed inset-0 z-[9999] bg-white overflow-y-auto">
              {/* Header */}
              <div
                className="sticky top-0 px-6 py-4 flex items-center justify-between border-b border-slate-200"
                style={{ background: `linear-gradient(135deg, ${diagnostic.barColor}22, transparent)` }}
              >
                <h2 className="text-lg font-black" style={{ color: diagnostic.barColor }}>
                  Diagnostic
                </h2>
                <button
                  onClick={() => setMobileHealthModalOpen(false)}
                  className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center"
                >
                  <X className="w-5 h-5 text-slate-600" />
                </button>
              </div>

              {/* Content */}
              <div className="px-6 py-6">
                {/* Score */}
                <div className="text-center mb-6">
                  <div className="text-7xl font-black mb-2" style={{ color: diagnostic.barColor }}>
                    {pct}%
                  </div>
                  <p className={`text-base font-bold uppercase tracking-wide ${diagnostic.color}`}>
                    {diagnostic.label}
                  </p>
                  <p className="text-sm text-slate-600 leading-relaxed mt-3">
                    {diagnostic.desc}
                  </p>
                </div>

                {/* Progress */}
                <div className="mb-6">
                  <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{ width: `${pct}%`, backgroundColor: diagnostic.barColor }}
                    />
                  </div>
                  <p className="text-center text-sm text-slate-600 mt-2 font-semibold">
                    {maxScore > 0 ? `${Math.round((pct * maxScore) / 100)} / ${maxScore} pts` : '—'}
                    {penalty < 0 && <span className="text-red-600"> ({penalty})</span>}
                  </p>
                </div>

                {/* Alerts */}
                {missingVitalTools.length > 0 && (
                  <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-2xl">
                    <p className="text-sm font-bold text-red-600 uppercase mb-3">Outils absents</p>
                    {missingVitalTools.map(toolId => (
                      <div key={toolId} className="flex items-center gap-2 mb-2">
                        <span className="w-2 h-2 rounded-full bg-red-500" />
                        <span className="text-sm text-red-700">
                          {toolId === 'booking-engine' && 'Moteur de Réservation'}
                          {toolId === 'channel-manager' && 'Channel Manager'}
                          {toolId === 'pms' && 'PMS'}
                          {toolId === 'site-internet' && 'Site Internet'}
                          {toolId === 'ota' && 'OTA'}
                        </span>
                      </div>
                    ))}
                    <button
                      onClick={() => {
                        setMobileHealthModalOpen(false);
                        setShowAddModal(true);
                      }}
                      className="w-full mt-3 px-4 py-3 bg-red-600 text-white text-sm font-bold rounded-xl"
                    >
                      <Plus className="w-4 h-4 inline mr-2" />
                      Compléter mon socle
                    </button>
                  </div>
                )}

                {alertPairs.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-xs font-bold text-white/50 uppercase tracking-wide mb-1">⚡ Ruptures de flux</p>
                    {alertPairs.map(({ a, b, warning, severity }) => {
                      const isCrit = severity === 'critique';
                      const nameA = allSystems.find(s => s.id === a)?.name || a;
                      const nameB = allSystems.find(s => s.id === b)?.name || b;
                      return (
                        <div key={`${a}-${b}`} className="p-2.5 rounded-xl" style={{
                          background: isCrit ? 'rgba(239,68,68,0.08)' : 'rgba(245,158,11,0.08)',
                          border: `1px solid ${isCrit ? 'rgba(239,68,68,0.25)' : 'rgba(245,158,11,0.25)'}`
                        }}>
                          <div className="flex items-center gap-1.5 mb-0.5">
                            <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${isCrit ? 'bg-red-400 animate-pulse' : 'bg-amber-400'}`} />
                            <span className="text-[10px] font-bold uppercase tracking-wide" style={{ color: isCrit ? '#f87171' : '#fbbf24' }}>
                              {nameA} ↔ {nameB}
                            </span>
                          </div>
                          {warning && <p className="text-[10px] leading-snug pl-3" style={{ color: isCrit ? 'rgba(252,165,165,0.8)' : 'rgba(253,230,138,0.7)' }}>{warning}</p>}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <div 
          ref={containerRef}
          className="relative w-full h-full"
          style={{ minHeight: '400px', minWidth: '100%', touchAction: 'pan-x pan-y', overflow: 'visible' }}
        >
          {/* Connection Lines SVG */}
          <svg 
            className="absolute inset-0 w-full h-full pointer-events-none" 
            style={{ zIndex: 1 }}
          >
            <defs>
              <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#475569" stopOpacity="0.6" />
                <stop offset="100%" stopColor="#334155" stopOpacity="0.8" />
              </linearGradient>
              <filter id="lineGlow">
                <feGaussianBlur stdDeviation="2" result="blur" />
                <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
              </filter>
            </defs>
            
            {/* Draw all connections */}
            {Object.entries(connections).map(([fromId, targets]) => {
              if (!targets || targets.length === 0) return null;
              
              return targets.map((targetId, index) => {
                const fromPos = nodePositions[fromId];
                const toPos = nodePositions[targetId];
                
                if (!fromPos || !toPos) return null;
                
                const connectionKey = `${fromId}-${targetId}`;
                const isHovered = hoveredConnection === connectionKey;
                
                return (
                  <line
                    key={`${fromId}-${targetId}-${index}`}
                    x1={`${fromPos.x}%`}
                    y1={`${fromPos.y}%`}
                    x2={`${toPos.x}%`}
                    y2={`${toPos.y}%`}
                    stroke={isHovered ? '#f59e0b' : 'rgba(148,163,184,0.25)'}
                    strokeWidth={isHovered ? 2.5 : 1.5}
                    filter={isHovered ? 'url(#lineGlow)' : undefined}
                    style={{ 
                      pointerEvents: mode === 'link' ? 'stroke' : 'none',
                      cursor: mode === 'link' ? 'pointer' : 'default',
                      strokeLinecap: 'round',
                      transition: 'all 0.2s'
                    }}
                    onClick={() => mode === 'link' && handleConnectionClick(fromId, targetId)}
                    onMouseEnter={() => mode === 'link' && setHoveredConnection(connectionKey)}
                    onMouseLeave={() => mode === 'link' && setHoveredConnection(null)}
                  />
                );
              });
            })}
          </svg>

          {/* Nodes */}
          <div className="absolute inset-0" style={{ zIndex: 2 }}>
            {allSystems.map(system => {
              const config = categoryConfig[system.category];
              const Icon = iconMap[system.icon];
              const isPMS = system.id === 'pms';
              const pos = nodePositions[system.id];
              const isDragging = draggingId === system.id;
              const isSelected = selectedForLink === system.id;
              const hasConnectionToSelected = selectedForLink && connections[selectedForLink]?.includes(system.id);

              return (
                <div
                  key={system.id}
                  id={`node-${system.id}`}
                  className={`group absolute ${viewMode === 'admin' && mode === 'move' ? 'cursor-move' : viewMode === 'admin' && mode === 'link' ? 'cursor-pointer' : ''} touch-none select-none ${isPMS ? 'w-[60px] sm:w-[75px] md:w-[110px]' : 'w-[50px] sm:w-[62px] md:w-[90px]'}`}
                  style={{
                    left: `${pos.x}%`,
                    top: `${pos.y}%`,
                    transform: 'translate(-50%, -50%)',
                    zIndex: isDragging || isSelected ? 10 : 2
                  }}
                  onMouseDown={viewMode === 'admin' ? (e) => handleMouseDown(system.id, e) : undefined}
                  onTouchStart={viewMode === 'admin' ? (e) => handleMouseDown(system.id, e) : undefined}
                  onClick={viewMode === 'admin' ? (e) => handleCardClick(system.id, e) : undefined}
                  onMouseEnter={(e) => {
                    const info = nodeBenefits[system.id];
                    if (info) {
                      setTooltip({ visible: true, x: e.clientX, y: e.clientY, title: info.title, benefit: info.benefit });
                    }
                  }}
                  onMouseMove={(e) => {
                    if (tooltip.visible) {
                      setTooltip(prev => ({ ...prev, x: e.clientX, y: e.clientY }));
                    }
                  }}
                  onMouseLeave={() => setTooltip(prev => ({ ...prev, visible: false }))}
                >
                  {/* Dark card — style image référence */}
                  <div
                    className={`relative rounded-2xl transition-all duration-300 ${
                      isDragging ? 'scale-110 -translate-y-2' : 'hover:-translate-y-1'
                    } ${isSelected ? 'scale-110' : ''}`}
                    style={{
                      padding: isPMS ? '14px' : '10px',
                      background: 'linear-gradient(145deg, rgba(30,41,59,0.95) 0%, rgba(15,23,42,0.98) 100%)',
                      border: `1.5px solid ${config.color}${isSelected ? 'ff' : '99'}`,
                      boxShadow: isDragging
                        ? `0 20px 40px rgba(0,0,0,0.5), 0 0 20px ${config.color}40`
                        : isSelected
                        ? `0 0 0 2px ${config.color}60, 0 8px 24px rgba(0,0,0,0.4), 0 0 16px ${config.color}30`
                        : `0 4px 16px rgba(0,0,0,0.3), 0 0 8px ${config.color}15`,
                      backdropFilter: 'blur(12px)',
                    }}
                  >
                    {/* Category label */}
                    <p className="text-[6px] md:text-[8px] uppercase tracking-wider font-semibold text-center leading-none mb-0.5 md:mb-1" style={{ color: config.color, opacity: 0.8 }}>
                      {config.label.split(' ')[0]}
                    </p>

                    {/* 🚨 Badge alerte lien vital manquant */}
                    {alertNodeIds.has(system.id) && (
                      <div className="absolute -top-2 -right-2 z-20">
                        <span className="flex h-5 w-5 items-center justify-center">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                          <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500 items-center justify-center">
                            <AlertCircle className="w-2.5 h-2.5 text-white" />
                          </span>
                        </span>
                      </div>
                    )}

                    {/* Icon in circle — dark glow style */}
                    <div 
                      className={`${isPMS ? 'w-8 h-8 md:w-14 md:h-14' : 'w-7 h-7 md:w-11 md:h-11'} rounded-2xl mx-auto mb-1 md:mb-2 flex items-center justify-center`}
                      style={{
                        background: `linear-gradient(145deg, ${config.color}25, ${config.color}10)`,
                        border: `1px solid ${config.color}40`,
                        boxShadow: `0 0 12px ${config.color}20, inset 0 1px 0 ${config.color}20`
                      }}
                    >
                      <Icon className={`${isPMS ? 'w-4 h-4 md:w-7 md:h-7' : 'w-3.5 h-3.5 md:w-5 md:h-5'}`} style={{ color: config.color }} />
                    </div>

                    {/* Title */}
                    <h3 className={`${isPMS ? 'text-[9px] md:text-[12px] font-bold' : 'text-[7px] md:text-[10px] font-semibold'} text-center text-white leading-tight`}>
                      {editingId === system.id ? (
                        <input
                          type="text"
                          value={editingName}
                          onChange={(e) => setEditingName(e.target.value)}
                          onBlur={saveEdit}
                          onKeyDown={(e) => e.key === 'Enter' && saveEdit()}
                          className="w-full text-center text-[10px] font-semibold leading-tight bg-transparent border-b border-white/30 text-white"
                          autoFocus
                        />
                      ) : (
                        system.name
                      )}
                    </h3>

                    {/* Mode indicator - admin only */}
                    {viewMode === 'admin' && (
                      <div className="absolute top-1.5 left-1.5">
                        {mode === 'move' ? (
                          <Move className="w-2.5 h-2.5 text-white/30" />
                        ) : (
                          <Link2 className={`w-2.5 h-2.5 ${isSelected ? 'text-purple-400' : 'text-white/30'}`} />
                        )}
                      </div>
                    )}

                    {/* Connection count badge */}
                    {viewMode === 'admin' && connections[system.id] && connections[system.id].length > 0 && (
                      <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 text-white text-[9px] px-1.5 py-0.5 rounded-full font-bold" style={{ background: config.color, boxShadow: `0 0 8px ${config.color}80` }}>
                        {connections[system.id].length}
                      </div>
                    )}

                    {/* Edit/Delete — apparaissent au survol, style image */}
                    {viewMode === 'admin' && (
                      <div className="absolute -top-2 -right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-all duration-200 z-20">
                        <button
                          onClick={(e) => { e.stopPropagation(); startEditing(system.id); }}
                          className="w-6 h-6 rounded-lg flex items-center justify-center transition-all hover:scale-110"
                          style={{ background: 'rgba(30,41,59,0.95)', border: '1px solid rgba(148,163,184,0.3)', backdropFilter: 'blur(8px)', boxShadow: '0 4px 12px rgba(0,0,0,0.4)' }}
                        >
                          <Edit2 className="w-3 h-3 text-slate-300" />
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); deleteSystem(system.id); }}
                          className="w-6 h-6 rounded-lg flex items-center justify-center transition-all hover:scale-110"
                          style={{ background: 'rgba(30,41,59,0.95)', border: '1px solid rgba(239,68,68,0.4)', backdropFilter: 'blur(8px)', boxShadow: '0 4px 12px rgba(0,0,0,0.4)' }}
                        >
                          <Trash2 className="w-3 h-3 text-red-400" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Add Card Modal - Responsive */}
      {showAddModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-3 sm:p-4" style={{ backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)', background: 'rgba(15,23,42,0.25)' }}>
          <div className="bg-white p-4 sm:p-6 rounded-xl md:rounded-2xl shadow-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg sm:text-xl font-bold">Ajouter une nouvelle carte</h3>
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setNewCard({name: '', category: 'management', icon: 'Bed'});
                }}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-slate-700 mb-1">Nom *</label>
              <input
                type="text"
                list="card-suggestions"
                placeholder="Tapez ou sélectionnez..."
                value={newCard.name}
                onChange={(e) => setNewCard(prev => ({ ...prev, name: e.target.value }))}
                className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm"
              />
              <datalist id="card-suggestions">
                {cardSuggestions.map(suggestion => (
                  <option key={suggestion} value={suggestion} />
                ))}
              </datalist>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-slate-700 mb-1">Catégorie</label>
              <select
                value={newCard.category}
                onChange={(e) => setNewCard(prev => ({ ...prev, category: e.target.value as any }))}
                className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm"
              >
                {Object.entries(categoryConfig).map(([key, config]) => (
                  <option key={key} value={key}>{config.label}</option>
                ))}
              </select>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-slate-700 mb-2">Icône</label>
              <div className="grid grid-cols-4 sm:grid-cols-5 gap-2 max-h-48 overflow-y-auto p-2 border border-slate-200 rounded-lg">
                {Object.keys(iconMap).map((iconKey) => {
                  const IconComponent = iconMap[iconKey];
                  return (
                    <button
                      key={iconKey}
                      type="button"
                      onClick={() => setNewCard(prev => ({ ...prev, icon: iconKey }))}
                      className={`p-2 sm:p-3 rounded-lg transition-all ${
                        newCard.icon === iconKey
                          ? 'bg-purple-100 border-2 border-purple-500'
                          : 'bg-slate-50 border border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      <IconComponent className="w-5 h-5 sm:w-6 sm:h-6 mx-auto" />
                    </button>
                  );
                })}
              </div>
            </div>
            
            <div className="flex justify-end gap-2 mt-6">
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setNewCard({name: '', category: 'management', icon: 'Bed'});
                }}
                className="px-4 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition-colors text-sm"
              >
                Annuler
              </button>
              <button
                onClick={addNewSystem}
                disabled={!newCard.name.trim()}
                className={`px-4 py-2 rounded-lg transition-colors text-sm ${
                  newCard.name.trim()
                    ? 'bg-purple-500 text-white hover:bg-purple-600'
                    : 'bg-slate-300 text-slate-500 cursor-not-allowed'
                }`}
              >
                Ajouter
              </button>
            </div>
          </div>
        </div>
      )}


      </div>{/* /ecosystem section */}

      {/* ══════════ LÉGENDE & VALEUR ══════════ */}
      <div id="legende" className="mt-6 md:mt-8 p-4 sm:p-6 bg-white rounded-xl md:rounded-2xl border-2 border-slate-200 shadow-lg">
        <h3 className="mb-1 text-slate-800 text-center text-base sm:text-lg font-bold">Légende &amp; Valeur</h3>
        <p className="text-center text-xs sm:text-sm text-slate-500 mb-4">Code couleur des catégories</p>

        {/* Color legend */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-4">
          {Object.entries(categoryConfig).map(([key, config]) => (
            <div key={key} className="flex items-center gap-1.5 sm:gap-2">
              <div 
                className="w-4 h-4 sm:w-5 sm:h-5 rounded-lg shadow-sm flex-shrink-0" 
                style={{ backgroundColor: config.color }}
              />
              <span className="text-xs sm:text-sm text-slate-700">{config.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ══════════ MES SERVICES ══════════ */}
      <div id="services" className="mt-8 md:mt-12 p-4 sm:p-6 md:p-8 bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl md:rounded-2xl shadow-2xl">
        <div className="text-center mb-6 md:mb-8">
          <p className="text-xs uppercase tracking-widest text-amber-400 font-semibold mb-1">Ce que je fais pour vous</p>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white">Mes Services</h2>
          <p className="text-sm text-slate-400 mt-2 max-w-lg mx-auto">Des missions clés en main, pensées pour les hôteliers qui veulent de la clarté, pas du jargon.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            {
              icon: <Search className="w-7 h-7" />,
              name: 'Audit & Stratégie IT',
              desc: 'Analyse complète de votre stack technologique. Je cartographie vos flux et identifie les blocages.',
              tags: ['Audit flash', 'Schéma de flux', 'Identification des blocages'],
              color: '#3b82f6'
            },
            {
              icon: <Wrench className="w-7 h-7" />,
              name: 'Installation outils métier & Conseil',
              desc: 'Sélection, déploiement et paramétrage de vos outils métier. Accompagnement des équipes jusqu\'à l\'autonomie complète.',
              tags: ['Sélection outils', 'Déploiement', 'Formation équipe'],
              color: '#10b981'
            },
            {
              icon: <Radio className="w-7 h-7" />,
              name: 'Externalisation de votre pilotage IT',
              desc: 'Je pilote votre écosystème informatique à temps partagé : prestataires, contrats, veille technologique et support quotidien. La sérénité d\'une DSI sans le coût d\'un poste fixe.',
              tags: ['Temps partagé', 'Pilotage fournisseurs', 'Support quotidien'],
              color: '#f59e0b'
            },
          ].map(service => (
            <div
              key={service.name}
              className="group relative bg-white bg-opacity-5 border border-white border-opacity-10 rounded-xl p-5 sm:p-6 hover:bg-opacity-10 hover:border-opacity-20 transition-all hover:-translate-y-1 flex flex-col items-center text-center"
            >
              {/* Top accent line */}
              <div className="absolute top-0 left-0 right-0 h-0.5 rounded-t-xl opacity-0 group-hover:opacity-100 transition-opacity" style={{ backgroundColor: service.color }} />

              {/* Big centered icon */}
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4 flex-shrink-0" style={{ backgroundColor: service.color + '22', color: service.color }}>
                {service.icon}
              </div>

              <h3 className="text-base sm:text-lg font-bold text-black mb-3 leading-tight">{service.name}</h3>
              <p className="text-sm text-black leading-relaxed mb-5 flex-grow">{service.desc}</p>
              <div className="flex flex-wrap justify-center gap-1.5 mt-auto">
                {service.tags.map(tag => (
                  <span key={tag} className="text-xs px-2.5 py-1 rounded-full border font-medium" style={{ color: service.color, borderColor: service.color + '55', backgroundColor: service.color + '18' }}>
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ══════════ CTA AUDIT GRATUIT ══════════ */}
      <div className="mt-4 bg-gradient-to-br from-amber-400 to-amber-500 rounded-xl md:rounded-2xl p-5 sm:p-6 md:p-8 shadow-2xl">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <p className="text-xs font-bold text-amber-900 uppercase tracking-widest mb-1">Envie de commencer ?</p>
            <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-slate-900 leading-tight">Un audit gratuit de 30 min pour identifier vos priorités.</h3>
            <p className="text-xs sm:text-sm text-amber-900 mt-1">Sans jargon. Sans engagement. Avec un plan d'action concret en sortie.</p>
          </div>
          <a
            href="https://calendar.app.google/cKNAVTh1TFacNkXs6"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 flex-shrink-0 px-6 py-3 bg-slate-900 text-amber-400 font-bold rounded-xl hover:bg-slate-800 transition-all shadow-lg text-sm whitespace-nowrap"
          >
            <Calendar className="w-4 h-4" />
            Réserver mon audit gratuit
          </a>
        </div>
      </div>

      {/* ══════════ FOOTER ══════════ */}
      <div className="text-center text-xs sm:text-sm text-slate-600 space-y-3 mt-8 md:mt-10 pt-5 md:pt-6 border-t border-slate-200">
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
          <a
            href="https://www.linkedin.com/in/oc%C3%A9ane-habonneau-5a908212a/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors shadow-md font-semibold text-xs sm:text-sm"
          >
            <Linkedin className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            LinkedIn
          </a>
          <a
            href="mailto:oceane.habonneau@gmail.com?subject=Demande%20de%20contact%20-%20Écosystème%20hôtelier&body=Bonjour%20Océane%2C%0A%0AJe%20souhaiterais%20discuter%20avec%20vous.%0A%0A"
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all shadow-md font-semibold text-xs sm:text-sm"
          >
            <Mail className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            Me contacter
          </a>
          <a
            href="https://calendar.app.google/cKNAVTh1TFacNkXs6"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-amber-400 text-slate-900 rounded-xl hover:bg-amber-500 transition-colors shadow-md font-bold text-xs sm:text-sm"
          >
            <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            Prendre RDV
          </a>
        </div>
        <p className="text-xs text-slate-500">
          © 2026 Océane Habonneau – Consultante en Digitalisation Hôtelière – Tous droits réservés
        </p>
      </div>
    </div>
  );
}
