import { useState, useRef, useCallback, useEffect } from 'react';
import { translations, type Lang } from './translations';
import { useAnalytics } from './useAnalytics';
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
  ChevronUp as ChevronUpIcon,
  ClipboardList,
  CalendarDays
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

// 💡 Infobulles bénéfices par système → maintenant dans translations.ts
// 💡 Infobulles bénéfices par système → maintenant dans translations.ts

// 📋 Liste des suggestions de cartes → maintenant dans translations.ts

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

// SOCLE_DESCRIPTIONS désormais dans translations.ts → t.socles

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
  Building2, TrendingUp, ClipboardList, CalendarDays
};

// ══════════ WIZARD TOOLS CATALOG ══════════
const getWizardTools = (t: any) => {
  if (!t?.wizardTools) return [];
  try {
    return [
      { id: 'pms', name: t.wizardTools?.['pms'] || 'PMS', icon: 'Bed', category: 'management' as const },
      { id: 'channel-manager', name: t.wizardTools?.['channel-manager'] || 'Channel Manager', icon: 'Share2', category: 'sales' as const },
      { id: 'booking-engine', name: t.wizardTools?.['booking-engine'] || 'Moteur de Réservation', icon: 'Calendar', category: 'booking' as const },
      { id: 'site-internet', name: t.wizardTools?.['site-internet'] || 'Site Internet', icon: 'Globe', category: 'sales' as const },
      { id: 'ota', name: t.wizardTools?.['ota'] || 'OTA', icon: 'Building2', category: 'sales' as const },
      { id: 'psp', name: t.wizardTools?.['psp'] || 'PSP', icon: 'CreditCard', category: 'customer' as const },
      { id: 'pos', name: t.wizardTools?.['pos'] || 'POS Restaurant', icon: 'UtensilsCrossed', category: 'restaurant' as const },
      { id: 'compta', name: t.wizardTools?.['compta'] || 'Comptabilité', icon: 'Calculator', category: 'management' as const },
      { id: 'crm', name: t.wizardTools?.['crm'] || 'CRM', icon: 'Users', category: 'management' as const },
      { id: 'spa', name: t.wizardTools?.['spa'] || 'SPA', icon: 'Sparkles', category: 'wellness' as const },
      { id: 'gds', name: t.wizardTools?.['gds'] || 'GDS', icon: 'Globe', category: 'sales' as const },
      { id: 'rms', name: t.wizardTools?.['rms'] || 'RMS', icon: 'TrendingUp', category: 'management' as const },
      { id: 'serrure', name: t.wizardTools?.['serrure'] || 'Serrure Connectée', icon: 'Home', category: 'customer' as const },
      { id: 'housekeeping', name: t.wizardTools?.['housekeeping'] || 'Housekeeping', icon: 'ClipboardList', category: 'management' as const },
      { id: 'event-management', name: t.wizardTools?.['event-management'] || 'Event Management', icon: 'CalendarDays', category: 'management' as const },
    ];
  } catch (e) {
    console.error('Error loading wizard tools:', e);
    return [];
  }
};

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

function getLogicalPairs(tools: Set<string>, t: any): LogicalPair[] {
  // Règle identique au scoring : toute paire dont les DEUX outils
  // sont présents est affichée — sans condition sur un tiers.
  // L'utilisateur peut avoir PMS↔Moteur ET CM↔Moteur simultanément,
  // exactement comme dans les VITAL_PATHS du scoring (chemins OR).

  // Construire ALL_PAIRS depuis les traductions
  const ALL_PAIRS: LogicalPair[] = [];
  
  // Safety check
  if (!t?.logicalPairs) return [];
  
  // Parcourir toutes les paires disponibles dans les traductions
  try {
    Object.keys(t.logicalPairs).forEach(pairKey => {
      const [a, b] = pairKey.split('|');
      const pair = t.logicalPairs[pairKey];
      if (pair) {
        ALL_PAIRS.push({
          a,
          b,
          question: pair.question || '',
          warning: pair.warning || '',
          severity: pair.severity as any
        });
      }
    });
  } catch (e) {
    console.error('Error building logical pairs:', e);
    return [];
  }

  // Même logique que le scoring : afficher toute paire dont les deux outils sont présents
  return ALL_PAIRS.filter(p => tools.has(p.a) && tools.has(p.b));
}

// ══════════ SCORING MATRIX V3 — Intelligence Métier ══════════
// ══════════ SCORING V1.5 ══════════
type ScoreLink = { a: string; b: string; points: number; malus: number; severity: Severity; msg: string };
type AlternativePath = { paths: Array<{ a: string; b: string }>; points: number; malus: number; severity: Severity; label: string; msg: string };

// ── Malus d'absence (PDF V1.5) ──
const ABSENCE_PENALTIES: Record<string, { malus: number; severity: Severity }> = {
  'pms':             { malus: -5, severity: 'critique' },
  'channel-manager': { malus: -5, severity: 'critique' },
  'site-internet':   { malus: -4, severity: 'critique' },
  'booking-engine':  { malus: -4, severity: 'critique' },
};

// ── Points de présence par outil (PDF V1.5 §1) ──
const PRESENCE_POINTS: Record<string, number> = {
  // Indispensable ++ → +6
  'pms':              6,
  'channel-manager':  6,
  // Indispensable + → +5
  'site-internet':    5,
  'booking-engine':   5,
  // Wifi n'a pas d'ID card — ignoré
  // Indispensable → +4
  'crm':              4,
  'compta':           4,
  'spa':              4,
  'pos':              4,
  'moteur-resto':     4,
  // Conseillé + → +3 (inclut OTA)
  'ota':              3,
  // Tout le reste → +3 (HK, PSP, E-Reput, RMS, Serrure, GDS, etc.)
};
const PRESENCE_DEFAULT = 3; // fallback pour tout outil non listé

// ── Liaisons OR : BE, PSP, RMS ──
function getVitalOrPaths(t: any): AlternativePath[] {
  return [
    {
      label: 'BE ↔ PMS ou CM', points: 5, malus: -5, severity: 'critique',
      msg: t?.diagnosticRules?.vitalOrPaths?.beReservation
        ?? 'Flux Réservation : Vos réservations directes ne remontent pas automatiquement vers votre gestion.',
      paths: [
        { a: 'pms',             b: 'booking-engine' },
        { a: 'channel-manager', b: 'booking-engine' },
      ],
    },
    {
      label: 'PSP ↔ PMS ou BE', points: 4, malus: -4, severity: 'warning',
      msg: t?.diagnosticRules?.vitalOrPaths?.pspPayment
        ?? "Paiement : Risque d'impayés ou de saisie manuelle. Pas de garantie bancaire automatique.",
      paths: [
        { a: 'pms',            b: 'psp' },
        { a: 'booking-engine', b: 'psp' },
      ],
    },
    {
      label: 'RMS ↔ PMS ou CM', points: 2, malus: -2, severity: 'warning',
      msg: t?.diagnosticRules?.vitalOrPaths?.rmsYield
        ?? 'Yield : Vos décisions tarifaires ne sont pas diffusées en temps réel sur vos canaux.',
      paths: [
        { a: 'pms',             b: 'rms' },
        { a: 'channel-manager', b: 'rms' },
      ],
    },
  ];
}

// ── Liaisons Indispensable ++ simples (5 pts / -5 malus) ──
function getVitalLinks(t: any): ScoreLink[] {
  return [
    { a: 'pms',             b: 'channel-manager', points: 5, malus: -5, severity: 'critique',
      msg: t?.diagnosticRules?.vitalLinks?.pmsCmStock
        ?? 'Flux Distribution : Risque critique de surréservation. Vos stocks ne sont pas synchronisés.' },
    { a: 'site-internet',   b: 'booking-engine',  points: 5, malus: -5, severity: 'critique',
      msg: t?.diagnosticRules?.vitalLinks?.siteBeBooking
        ?? 'Tunnel de Vente : Rupture du parcours client. Votre site ne permet pas de réserver.' },
    { a: 'channel-manager', b: 'ota',             points: 5, malus: -5, severity: 'critique',
      msg: t?.diagnosticRules?.vitalLinks?.cmOtaDistribution
        ?? 'Distribution : Vos canaux ne sont pas alimentés. Gestion manuelle des stocks obligatoire.' },
    { a: 'channel-manager', b: 'gds',             points: 5, malus: -5, severity: 'critique',
      msg: t?.diagnosticRules?.vitalLinks?.cmGdsDistribution
        ?? 'Distribution : Vos canaux ne sont pas alimentés. Gestion manuelle des stocks obligatoire.' },
  ];
}

// ── Liaisons Indispensable (3 pts / 0 malus) ──
function getIndispensableLinks(t: any): ScoreLink[] {
  return [
    { a: 'pms',          b: 'pos',          points: 3, malus: 0, severity: 'warning',
      msg: t?.diagnosticRules?.indispensableLinks?.pmsPosRestaurant
        ?? 'Flux F&B : Les consommations restaurant ne remontent pas sur la facture du client en chambre.' },
    { a: 'pms',          b: 'spa',          points: 3, malus: 0, severity: 'warning',
      msg: t?.diagnosticRules?.indispensableLinks?.pmsSpaSpa
        ?? 'Flux SPA : Les consommations SPA ne remontent pas sur la facture du client en chambre.' },
    { a: 'site-internet',b: 'moteur-resto', points: 3, malus: 0, severity: 'warning',
      msg: t?.diagnosticRules?.indispensableLinks?.siteMoteurRestoDirect
        ?? "Vente Directe : Votre site ne commercialise pas l'ensemble de vos services (Resto, SPA, Cadeaux)." },
    { a: 'site-internet',b: 'exp-client',   points: 3, malus: 0, severity: 'warning',
      msg: t?.diagnosticRules?.indispensableLinks?.siteExpClientDirect
        ?? "Vente Directe : Votre site ne commercialise pas l'ensemble de vos services (Resto, SPA, Cadeaux)." },
  ];
}

// ── Liaisons Conseillé + (2-3 pts / 0 malus) ──
function getAdvisedLinks(t: any): ScoreLink[] {
  return [
    { a: 'pms', b: 'crm',          points: 2, malus: 0, severity: 'warning',
      msg: t?.diagnosticRules?.advisedLinks?.pmsCrmData
        ?? "Data Client : Vos profils sont isolés. Impossible de personnaliser l'accueil ou de fidéliser." },
    { a: 'pms', b: 'housekeeping', points: 3, malus: 0, severity: 'warning',
      msg: t?.diagnosticRules?.advisedLinks?.pmsHousekeepingOps
        ?? 'Opérations : Retards de communication entre la réception et les étages (statut des chambres).' },
    { a: 'pms', b: 'serrure',      points: 2, malus: 0, severity: 'info',
      msg: t?.diagnosticRules?.advisedLinks?.pmsSerrureAutonomy
        ?? "Autonomie : La création des clés/codes n'est pas synchronisée avec l'arrivée du client." },
    { a: 'pms', b: 'exp-client',   points: 2, malus: 0, severity: 'info',
      msg: t?.diagnosticRules?.advisedLinks?.pmsExpClientExperience
        ?? "Expérience : Le client n'a pas accès à ses informations de séjour en temps réel." },
    { a: 'pms', b: 'tv',           points: 2, malus: 0, severity: 'info',
      msg: t?.diagnosticRules?.advisedLinks?.pmsTvComfort
        ?? "Confort : Le message de bienvenue ou le check-out sur TV n'est pas activé." },
  ];
}

// ── Liaisons Comptabilité (2 pts / 0 malus) ──
function getComptaLinks(t: any): ScoreLink[] {
  return [
    { a: 'compta', b: 'pms', points: 2, malus: 0, severity: 'warning',
      msg: t?.diagnosticRules?.comptaLinks?.comptaPmsAccounting
        ?? "Comptabilité : Saisie manuelle du CA. Risque d'erreurs et perte de temps en fin de mois." },
    { a: 'compta', b: 'pos', points: 2, malus: 0, severity: 'warning',
      msg: t?.diagnosticRules?.comptaLinks?.comptaPosAccounting
        ?? "Comptabilité : Saisie manuelle du CA. Risque d'erreurs et perte de temps en fin de mois." },
    { a: 'compta', b: 'spa', points: 2, malus: 0, severity: 'warning',
      msg: t?.diagnosticRules?.comptaLinks?.comptaSpaAccounting
        ?? "Comptabilité : Saisie manuelle du CA. Risque d'erreurs et perte de temps en fin de mois." },
  ];
}

// ── Helpers ──
function isLinkActive(a: string, b: string, connections: Record<string, string[]>): boolean {
  return (connections[a]?.includes(b)) || (connections[b]?.includes(a));
}

function isLinkRelevant(a: string, b: string, presentIds: Set<string>): boolean {
  return presentIds.has(a) && presentIds.has(b);
}

function isAlternativePathActive(
  altPath: AlternativePath,
  connections: Record<string, string[]>,
  presentIds: Set<string>
): boolean {
  return altPath.paths.some(({ a, b }) =>
    isLinkRelevant(a, b, presentIds) && isLinkActive(a, b, connections)
  );
}

function isAlternativePathRelevant(altPath: AlternativePath, presentIds: Set<string>): boolean {
  return altPath.paths.some(({ a, b }) => isLinkRelevant(a, b, presentIds));
}

function computeScore(
  connections: Record<string, string[]>,
  allSystems: { id: string }[],
  t: any
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

  // 0️⃣ Points de présence (chaque carte posée rapporte des points)
  for (const sys of allSystems) {
    const pts = PRESENCE_POINTS[sys.id] ?? PRESENCE_DEFAULT;
    score   += pts;
    maxScore += pts;
  }

  // 1️⃣ Malus d'absence
  for (const [toolId, { malus }] of Object.entries(ABSENCE_PENALTIES)) {
    if (!presentIds.has(toolId)) {
      penalty += malus;
      missingVitalTools.push(toolId);
    }
  }

  // Helper pour push une alerte en consultant pairWarnMap d'abord
  const pushAlert = (a: string, b: string, fallbackMsg: string, fallbackSev: Severity) => {
    const warnKey = [a, b].sort().join(',');
    const w = t?.pairWarnMap?.[warnKey];
    alertPairs.push({ a, b, warning: w?.[0] ?? fallbackMsg, severity: (w?.[1] as Severity) ?? fallbackSev });
  };

  // 2️⃣ Liaisons OR (BE, PSP, RMS)
  // Malus appliqué uniquement si l'outil focal est PRÉSENT mais non relié à aucune cible autorisée
  const VITAL_OR_PATHS = getVitalOrPaths(t);
  for (const altPath of VITAL_OR_PATHS) {
    if (!isAlternativePathRelevant(altPath, presentIds)) continue;
    maxScore += altPath.points;
    if (isAlternativePathActive(altPath, connections, presentIds)) {
      score += altPath.points;
    } else {
      // Identifier l'outil focal (celui qui apparaît dans toutes les paires)
      const allNodes = altPath.paths.flatMap(p => [p.a, p.b]);
      const focalId = allNodes.find(id =>
        altPath.paths.every(p => p.a === id || p.b === id)
      );
      // Appliquer malus si l'outil focal est présent
      if (focalId && presentIds.has(focalId) && altPath.malus < 0) {
        penalty += altPath.malus;
      }
      for (const { a, b } of altPath.paths) {
        if (isLinkRelevant(a, b, presentIds)) pushAlert(a, b, altPath.msg, altPath.severity);
      }
    }
  }

  // 3️⃣ Liaisons Indispensable ++
  const seen = new Set<string>();
  const VITAL_LINKS = getVitalLinks(t);
  for (const link of VITAL_LINKS) {
    const key = [link.a, link.b].sort().join('|');
    if (seen.has(key) || !isLinkRelevant(link.a, link.b, presentIds)) continue;
    seen.add(key);
    maxScore += link.points;
    if (isLinkActive(link.a, link.b, connections)) {
      score += link.points;
    } else {
      pushAlert(link.a, link.b, link.msg, link.severity);
    }
  }

  // 4️⃣ Liaisons Indispensable (3 pts)
  const INDISPENSABLE_LINKS = getIndispensableLinks(t);
  for (const link of INDISPENSABLE_LINKS) {
    const key = [link.a, link.b].sort().join('|');
    if (seen.has(key) || !isLinkRelevant(link.a, link.b, presentIds)) continue;
    seen.add(key);
    maxScore += link.points;
    if (isLinkActive(link.a, link.b, connections)) {
      score += link.points;
    } else {
      pushAlert(link.a, link.b, link.msg, link.severity);
    }
  }

  // 5️⃣ Liaisons Conseillé +
  const ADVISED_LINKS = getAdvisedLinks(t);
  for (const link of ADVISED_LINKS) {
    const key = [link.a, link.b].sort().join('|');
    if (seen.has(key) || !isLinkRelevant(link.a, link.b, presentIds)) continue;
    seen.add(key);
    maxScore += link.points;
    if (isLinkActive(link.a, link.b, connections)) {
      score += link.points;
    } else {
      pushAlert(link.a, link.b, link.msg, link.severity);
    }
  }

  // 6️⃣ Liaisons Comptabilité
  const COMPTA_LINKS = getComptaLinks(t);
  for (const link of COMPTA_LINKS) {
    const key = [link.a, link.b].sort().join('|');
    if (seen.has(key) || !isLinkRelevant(link.a, link.b, presentIds)) continue;
    seen.add(key);
    maxScore += link.points;
    if (isLinkActive(link.a, link.b, connections)) {
      score += link.points;
    } else {
      pushAlert(link.a, link.b, link.msg, link.severity);
    }
  }

  // 7️⃣ Score brut
  const rawScore = Math.max(0, score + penalty);
  const rawPct   = maxScore === 0 ? 0 : Math.round((rawScore / maxScore) * 100);

  // 8️⃣ Verrous de score (plafonds PDF V1.5)
  // Cap 40 : PMS ou CM absent
  const missingPmsOrCm = !presentIds.has('pms') || !presentIds.has('channel-manager');
  // Cap 65 : au moins une liaison Indisp++ manquante entre deux outils présents
  const indispPPIds = new Set(
    VITAL_LINKS.filter(l => l.severity === 'critique').map(l => [l.a, l.b].sort().join('|'))
  );
  const vitOrCritiqueKeys = VITAL_OR_PATHS
    .filter(vo => vo.severity === 'critique')
    .flatMap(vo => vo.paths.map(p => [p.a, p.b].sort().join('|')));
  [...vitOrCritiqueKeys].forEach(k => indispPPIds.add(k));

  const hasIndispPPBreak = alertPairs.some(p => {
    const k = [p.a, p.b].sort().join('|');
    return p.severity === 'critique' && indispPPIds.has(k);
  });
  // Cap 85 : CRM ou Compta présents mais non reliés au PMS
  const missingCrmOrCompta =
    (presentIds.has('crm')    && !isLinkActive('pms', 'crm',    connections)) ||
    (presentIds.has('compta') && !isLinkActive('compta', 'pms', connections) &&
                                   !isLinkActive('compta', 'pos', connections) &&
                                   !isLinkActive('compta', 'spa', connections));

  let cappedPct = rawPct;
  if (missingPmsOrCm)     cappedPct = Math.min(cappedPct, 40);
  if (hasIndispPPBreak)   cappedPct = Math.min(cappedPct, 65);
  if (missingCrmOrCompta) cappedPct = Math.min(cappedPct, 85);

  // Safety check: ensure pct is always a valid number
  if (isNaN(cappedPct) || cappedPct === null || cappedPct === undefined) {
    cappedPct = 0;
  }

  return { score: rawScore, maxScore, pct: cappedPct, alertPairs, missingVitalTools, penalty };
}
function getDiagnostic(pct: number, d: typeof translations['fr']['diagnostic']): {
  label: string;
  desc: string;
  color: string;
  barColor: string;
} {
  // Safety check
  if (!d || typeof pct !== 'number' || isNaN(pct)) {
    console.warn('getDiagnostic: invalid inputs', { pct, d });
    return {
      label: '⚠️ Erreur',
      desc: 'Impossible de calculer le diagnostic.',
      color: 'text-gray-500',
      barColor: '#6b7280',
    };
  }

  // PDF V1.5 — 4 paliers stricts
  // Les verrous de computeScore ont DÉJÀ capé pct si PMS/CM absent (→ ≤40) ou liaison critique manquante (→ ≤65).
  // hasMissingVitalTools ne doit plus forcer rouge ici — c'est le pct capé qui fait foi.
  if (pct <= 40) return {
    label: d.critical?.label || '🚨 Alerte Survie : Système en Silos',
    desc: d.critical?.desc || '',
    color: 'text-red-700',
    barColor: '#dc2626',
  };
  if (pct <= 65) return {
    label: d.weak?.label || '⚠️ Performance bridée',
    desc: d.weak?.desc || '',
    color: 'text-orange-500',
    barColor: '#f97316',
  };
  if (pct <= 85) return {
    // PDF : 66-85 = Bleu "En route vers l'Excellence"
    label: d.good?.label || '💪 En route vers l\'Excellence',
    desc: d.good?.desc || '',
    color: 'text-blue-600',
    barColor: '#2563eb',
  };
  return {
    // PDF : 86-100 = Vert "Écosystème de Champion"
    label: d.excellent?.label || '🚀 Écosystème de Champion',
    desc: d.excellent?.desc || '',
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
  const [lang, setLang] = useState<Lang>('fr');
    // Initialiser le hook analytics
  const { trackDiagnostic, getUserAgent } = useAnalytics();
  const t = translations[lang];
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
    const knownMatch = t ? getWizardTools(t).find(
      tool => tool?.name?.toLowerCase() === newCard.name.trim().toLowerCase()
    ) : null;
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
// ── Helper : Générer les points positifs pour analytics ──
  const getPositiveMessages = (
    connections: Record<string, string[]>,
    systems: { id: string }[]
  ): string[] => {
    const positives: string[] = [];
    const presentIds = new Set(systems.map(s => s.id));

    // Vérifier les liaisons VITAL
    const vitalLinks = [
      { a: 'pms', b: 'channel-manager', msg: 'PMS ↔ CM connecté (+5pts)' },
      { a: 'site-internet', b: 'booking-engine', msg: 'Site ↔ BE connecté (+5pts)' },
      { a: 'channel-manager', b: 'ota', msg: 'CM ↔ OTA connecté (+5pts)' },
      { a: 'channel-manager', b: 'gds', msg: 'CM ↔ GDS connecté (+5pts)' },
    ];

    vitalLinks.forEach(link => {
      if (presentIds.has(link.a) && presentIds.has(link.b)) {
        const isConnected = connections[link.a]?.includes(link.b) || connections[link.b]?.includes(link.a);
        if (isConnected) {
          positives.push(link.msg);
        }
      }
    });

    // Logic OR paths
    const orPaths = [
      {
        label: 'BE ↔ PMS ou CM',
        paths: [
          { a: 'pms', b: 'booking-engine' },
          { a: 'channel-manager', b: 'booking-engine' }
        ],
        msg: 'BE ↔ (PMS|CM) Logic OR OK (+5pts)'
      },
      {
        label: 'PSP ↔ PMS ou BE',
        paths: [
          { a: 'pms', b: 'psp' },
          { a: 'booking-engine', b: 'psp' }
        ],
        msg: 'PSP ↔ (PMS|BE) Logic OR OK (+4pts)'
      },
    ];

    orPaths.forEach(orPath => {
      const hasAnyConnection = orPath.paths.some(p => {
        if (!presentIds.has(p.a) || !presentIds.has(p.b)) return false;
        return connections[p.a]?.includes(p.b) || connections[p.b]?.includes(p.a);
      });
      if (hasAnyConnection) {
        positives.push(orPath.msg);
      }
    });

    return positives;
  };
  const finishWizard = async () => {
    // 1. Initialisation locale des données
    const newSystems: SystemNode[] = [];
    const newPositions: Record<string, { x: number; y: number }> = {};
    const newConnections: Record<string, string[]> = {};

    // 2. Préparation des outils sélectionnés
    const toolsList = Array.from(selectedTools);
    if (!t) return;
    toolsList.forEach((toolId, index) => {
      const tool = getWizardTools(t).find(wt => wt?.id === toolId);
      if (!tool) return;
      
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

    // 3. Liaison des connexions (Points Vitaux et Logic OR)
    selectedConnections.forEach(pairKey => {
      const [a, b] = pairKey.split('|');
      if (newConnections[a] && !newConnections[a].includes(b)) {
        newConnections[a].push(b);
      }
      if (newConnections[b] && !newConnections[b].includes(a)) {
        newConnections[b].push(a);
      }
    });

    // 4. Calcul du score final pour l'analytics
    const scoreResult = computeScore(newConnections, newSystems, t);
    const diagnosticResult = getDiagnostic(scoreResult.pct, t.diagnostic);

    // 5. Envoi des données vers Firebase
    try {
      await trackDiagnostic({
        tools: newSystems.map(s => s.name),
        toolsCount: newSystems.length,
        connections: Array.from(selectedConnections).map(key => {
          const [from, to] = key.split('|');
          return { from, to };
        }),
        connectionsCount: selectedConnections.size,
        score: {
          final: scoreResult.pct,
          raw: Math.max(0, scoreResult.maxScore - scoreResult.penalty),
          max: scoreResult.maxScore,
          penalty: scoreResult.penalty
        },
        diagnostic: {
          level: diagnosticResult.id, 
          label: diagnosticResult.label,
          hasMissingVitals: scoreResult.missingVitalTools.length > 0
        },
        alerts: scoreResult.alertPairs.map(p => ({
          pair: `${p.a}|${p.b}`,
          severity: p.severity || 'warning',
          message: p.message || p.warning || 'Flux manquant'
        })),
        alertsCount: scoreResult.alertPairs.length,
        positives: getPositiveMessages(newConnections, newSystems), // <--- INSTRUCTION CLAUDE OK
        source: 'wizard',
        language: lang,
        userAgent: getUserAgent()
      });
      console.log('✅ Diagnostic validé et envoyé');
    } catch (error) {
      console.error('❌ Erreur Analytics:', error);
    }

    // 6. Mise à jour de l'interface React
    setAllSystems(newSystems);
    setNodePositions(newPositions);
    setConnections(newConnections);
    setShowWizardModal(false);
    setScorePanelOpen(true);
    setViewMode('admin');
    setMode('link');
    
    setTimeout(() => {
      document.getElementById('ecosystem')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 200);
  };

  // ── Score calculé en temps réel à chaque render ──
  const { pct, maxScore, alertPairs, missingVitalTools, penalty } = computeScore(connections, allSystems, t);
  const diagnostic = getDiagnostic(pct, t.diagnostic);
  const alertNodeIds = new Set(alertPairs.flatMap(p => [p.a, p.b]));

  return (
    <div className="max-w-[1400px] mx-auto p-3 sm:p-4 md:p-8">
      {showWizardModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
            
            {/* Header */}
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between flex-shrink-0">
              <div>
                <h3 className="text-xl font-bold text-slate-800">
                  {wizardStep === 1 ? t.wizard.step1Label : t.wizard.step2Label}
                </h3>
                <p className="text-sm text-slate-500">
                  {wizardStep === 1 ? t.wizard.step1Sub : t.wizard.step2Sub}
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
                  {getWizardTools(t).map(tool => {
                    const Icon = iconMap[tool.icon];
                    const isSelected = selectedTools.has(tool.id);
                    const config = categoryConfig[tool.category] || categoryConfig.management;
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

              {/* STEP 2 — Connectivité groupée par outil focal */}
              {wizardStep === 2 && (() => {
                const pairs = getLogicalPairs(selectedTools, t);
                if (pairs.length === 0) return (
                  <div className="text-center py-8 text-slate-400">
                    <p className="text-sm">{t.wizard.noPairs}</p>
                    <p className="text-xs mt-1">{t.wizard.noPairsSub}</p>
                  </div>
                );

                // Noms exacts depuis getWizardTools — aucun alias inventé
                const SHORT: Record<string, string> = Object.fromEntries(
                  getWizardTools(t).map(wt => [wt.id, wt.name])
                );

                // Couleur de sévérité
                const SEV_COLOR: Record<string, { dot: string; badge: string; text: string }> = {
                  critique: { dot: '#ef4444', badge: 'rgba(239,68,68,0.1)', text: '#dc2626' },
                  warning:  { dot: '#f59e0b', badge: 'rgba(245,158,11,0.1)', text: '#d97706' },
                  info:     { dot: '#3b82f6', badge: 'rgba(59,130,246,0.1)', text: '#2563eb' },
                };

                // Grouper les paires par outil focal (a)
                const groups: Record<string, typeof pairs> = {};
                const order: string[] = [];
                pairs.forEach(p => {
                  if (!groups[p.a]) { groups[p.a] = []; order.push(p.a); }
                  groups[p.a].push(p);
                });

                return (
                  <div className="space-y-3">
                    {order.map(focal => {
                      const focalPairs = groups[focal];
                      const focalName = SHORT[focal] || focal;
                      const allConnected = focalPairs.every(p => selectedConnections.has(`${p.a}|${p.b}`));
                      const someConnected = focalPairs.some(p => selectedConnections.has(`${p.a}|${p.b}`));

                      return (
                        <div key={focal} className="rounded-2xl border border-slate-200 overflow-hidden bg-white shadow-sm">
                          {/* ── Titre du groupe ── */}
                          <div className="flex items-center justify-between px-4 py-2.5 border-b border-slate-100" style={{ background: allConnected ? 'rgba(16,185,129,0.06)' : someConnected ? 'rgba(245,158,11,0.05)' : 'rgba(248,250,252,1)' }}>
                            <div className="flex items-center gap-2">
                              <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: allConnected ? '#10b981' : someConnected ? '#f59e0b' : '#cbd5e1' }} />
                              <div>
                                <span className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">{t.wizard.connectivityLabel}</span>
                                <p className="text-sm font-bold text-slate-800 leading-tight">
                                  {focalName} {t.wizard.connectedWith}
                                </p>
                              </div>
                            </div>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: allConnected ? 'rgba(16,185,129,0.12)' : 'rgba(148,163,184,0.15)', color: allConnected ? '#059669' : '#94a3b8' }}>
                              {focalPairs.filter(p => selectedConnections.has(`${p.a}|${p.b}`)).length}/{focalPairs.length}
                            </span>
                          </div>

                          {/* ── Sous-lignes : une par cible ── */}
                          <div className="divide-y divide-slate-100">
                            {focalPairs.map(({ a, b, warning, severity }) => {
                              const pairKey = `${a}|${b}`;
                              const isConnected = selectedConnections.has(pairKey);
                              const safeSeverity = severity || 'warning';
                              const sc = SEV_COLOR[safeSeverity] || SEV_COLOR.warning;
                              const targetName = SHORT[b] || b;

                              return (
                                <div key={pairKey} className="flex items-center gap-3 px-4 py-2.5 transition-colors" style={{ background: isConnected ? 'rgba(16,185,129,0.04)' : 'transparent' }}>
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2">
                                      {/* Indicateur sévérité */}
                                      {isConnected
                                        ? <svg className="w-3.5 h-3.5 flex-shrink-0" style={{ color: '#10b981' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                                        : <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: sc.dot }} />
                                      }
                                      {/* Nom de l'outil cible — sans "au" */}
                                      <span className="text-sm font-bold text-slate-800">{targetName}</span>
                                      {/* Badge sévérité discret */}
                                      {!isConnected && (
                                        <span className="text-[9px] font-bold uppercase tracking-wide px-1.5 py-0.5 rounded-full flex-shrink-0" style={{ background: sc.badge, color: sc.text }}>
                                          {safeSeverity}
                                        </span>
                                      )}
                                    </div>
                                    {/* Impact — uniquement si pas connecté */}
                                    {!isConnected && (
                                      <p className="text-[11px] leading-snug mt-0.5 pl-5" style={{ color: '#94a3b8' }}>{warning}</p>
                                    )}
                                  </div>

                                  {/* Toggle */}
                                  <button
                                    onClick={() => toggleConnection(pairKey)}
                                    className="relative flex-shrink-0 rounded-full transition-colors duration-300"
                                    style={{ width: 44, height: 24, background: isConnected ? '#10b981' : '#cbd5e1' }}
                                  >
                                    <span
                                      className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-300"
                                      style={{ transform: isConnected ? 'translateX(20px)' : 'translateX(0px)' }}
                                    />
                                  </button>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                );
              })()}
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-slate-200 flex items-center justify-between gap-3 flex-shrink-0">
              {wizardStep === 1 && (
                <>
                  <button
                    onClick={() => setShowWizardModal(false)}
                    className="px-4 py-2 text-sm text-slate-600 hover:text-slate-800 transition-colors"
                  >
                    {t.wizard.closeBtn}
                  </button>
                  <button
                    onClick={() => setWizardStep(2)}
                    disabled={selectedTools.size === 0}
                    className="px-6 py-2 bg-slate-800 text-white text-sm font-bold rounded-xl hover:bg-slate-900 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    {t.wizard.nextBtn}
                  </button>
                </>
              )}
              {wizardStep === 2 && (
                <>
                  <button
                    onClick={() => setWizardStep(1)}
                    className="px-4 py-2 text-sm text-slate-600 hover:text-slate-800 transition-colors"
                  >
                    {t.wizard.backBtn}
                  </button>
                  <button
                    onClick={finishWizard}
                    className="px-6 py-2 bg-gradient-to-r from-amber-400 to-amber-500 text-slate-900 text-sm font-black rounded-xl hover:from-amber-500 hover:to-amber-600 transition-all shadow-lg"
                  >
                    {t.wizard.generateBtn}
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
            <span className="text-[9px] sm:text-xs text-slate-500 font-medium tracking-wide hidden sm:block">{t.hero.brandSub}</span>
          </div>
          {/* Nav — icônes seules sur sm, icône+texte sur md+ */}
          <nav className="hidden sm:flex items-center gap-1 md:gap-2 text-[11px] md:text-sm font-medium text-slate-600">
            <a href="#ecosystem" className="flex items-center gap-1 px-2 py-1.5 rounded-lg hover:bg-slate-100 hover:text-slate-900 transition-colors">
              <Layers className="w-3.5 h-3.5 flex-shrink-0" /><span className="hidden md:inline whitespace-nowrap">{t.nav.ecosystem}</span>
            </a>
            <a href="#services" className="flex items-center gap-1 px-2 py-1.5 rounded-lg hover:bg-slate-100 hover:text-slate-900 transition-colors">
              <Wrench className="w-3.5 h-3.5 flex-shrink-0" /><span className="hidden md:inline whitespace-nowrap">{t.nav.services}</span>
            </a>
            <button onClick={startWizard} className="flex items-center gap-1 px-2 py-1.5 rounded-lg hover:bg-slate-100 hover:text-slate-900 transition-colors">
              <Radio className="w-3.5 h-3.5 flex-shrink-0" /><span className="hidden md:inline whitespace-nowrap">{t.nav.diagnostic}</span>
            </button>
          </nav>
          {/* Right: CTA + burger mobile */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <a href="https://calendar.app.google/cKNAVTh1TFacNkXs6" target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 sm:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-amber-400 to-amber-500 text-slate-900 text-[11px] sm:text-xs md:text-sm font-bold rounded-lg hover:from-amber-500 hover:to-amber-600 transition-all shadow hover:shadow-md hover:-translate-y-0.5 whitespace-nowrap">
              <Calendar className="w-3.5 h-3.5 flex-shrink-0" />
              <span className="hidden sm:inline">{t.nav.auditBtn}</span><span className="sm:hidden">{t.nav.auditBtnShort}</span>
            </a>
            {/* Bouton langue FR / EN */}
            <button
              onClick={() => setLang(l => l === 'fr' ? 'en' : 'fr')}
              className="flex items-center gap-1 px-2 py-1 rounded-lg border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-all text-[11px] font-bold text-slate-500 hover:text-slate-700 flex-shrink-0"
              aria-label="Changer de langue"
              title={lang === 'fr' ? 'Switch to English' : 'Passer en français'}
            >
              <span className="text-[10px]">{lang === 'fr' ? '🇬🇧' : '🇫🇷'}</span>
              <span>{t.nav.langToggle}</span>
            </button>
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
          <h1 className="text-xl sm:text-2xl md:text-4xl mb-2 bg-gradient-to-r from-slate-700 to-slate-900 bg-clip-text text-transparent font-bold leading-tight">{t.hero.tagline}</h1>
          <p className="text-xs sm:text-sm md:text-base text-slate-600"><strong>{t.hero.subtitle}</strong></p>
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
                {t.nav.ecosystem}
              </a>
              <a href="#services" onClick={() => setMobileNavOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-100 transition-colors">
                <Wrench className="w-4 h-4 text-amber-500 flex-shrink-0" />
                {t.nav.services}
              </a>
              <button onClick={() => { startWizard(); setMobileNavOpen(false); }}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-100 transition-colors text-left w-full">
                <Radio className="w-4 h-4 text-amber-500 flex-shrink-0" />
                {t.nav.diagnostic}
              </button>
            </nav>
            <div className="p-4 border-t border-slate-200">
              <a href="https://calendar.app.google/cKNAVTh1TFacNkXs6" target="_blank" rel="noopener noreferrer"
                onClick={() => setMobileNavOpen(false)}
                className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-gradient-to-r from-amber-400 to-amber-500 text-slate-900 text-sm font-bold rounded-xl shadow-lg">
                <Calendar className="w-4 h-4" /> {t.nav.auditBtn}
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
                    {t.canvas.viewAdmin}
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
                    {t.canvas.viewPublic}
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
                    {t.canvas.modeMove}
                  </button>
                  <button
                    onClick={() => { setMode('link'); setDraggingId(null); }}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold transition-all duration-200"
                    style={mode === 'link'
                      ? { background: '#3B82F6', color: '#fff', boxShadow: 'inset 0 0 10px rgba(59,130,246,0.5)' }
                      : { background: '#fff', color: '#3B82F6' }}
                  >
                    <Link2 className="w-3.5 h-3.5" />
                    {t.canvas.modeLink}
                  </button>
                </div>
              </div>

              {/* ── Groupe Socle ── */}
              <div className="flex flex-col gap-1">
                {/* socle section label */}<span className="text-[10px] uppercase tracking-widest font-semibold text-slate-400 px-1">{t.socles.sectionLabel}</span>
                <div className="flex rounded-full overflow-hidden shadow-md border-2" style={{ borderColor: '#119843' }}>
                  {[
                    { label: t.socles.essentiel.label, socle: socle1Essentiel, type: 'essentiel' as const },
                    { label: t.socles.performance.label, socle: socle2Performance, type: 'performance' as const },
                    { label: t.socles.signature.label, socle: socle3Signature, type: 'signature' as const },
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
                  {t.canvas.addCardBtn}
                </button>
              </div>

              {/* ── Groupe Réinitialiser ── */}
              <div className="flex flex-col gap-1">
                <span className="text-[10px] uppercase tracking-widest font-semibold text-slate-400 px-1">{t.canvas.resetBtn}</span>
                <div className="flex rounded-full overflow-hidden shadow-md border-2" style={{ borderColor: '#aeaeae' }}>
                  <button
                    onClick={resetConnections}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold transition-all duration-200 hover:brightness-90"
                    style={{ background: '#f5f5f5', color: '#555' }}
                  >
                    <Unlink className="w-3.5 h-3.5" />
                    {t.canvas.resetLinks}
                  </button>
                  <button
                    onClick={resetPositions}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold transition-all duration-200 hover:brightness-90"
                    style={{ background: '#f5f5f5', color: '#555', borderLeft: '1px solid #aeaeae' }}
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    {t.canvas.resetPositions}
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
                  <span className="hidden sm:inline">{t.canvas.modeMove}</span>
                  <span className="sm:hidden">{t.canvas.modeMoveShort}</span>
                </span>
              </div>
            )}
            {mode === 'link' && (
              <div className="flex items-center justify-between gap-2 px-3 md:px-4 py-2 rounded-lg md:rounded-xl shadow-md" style={{ background: 'linear-gradient(135deg, rgba(139,92,246,0.12), rgba(59,130,246,0.08))', border: '2px solid rgba(139,92,246,0.3)' }}>
                <div className="flex items-center gap-2">
                  <Link2 className="w-3.5 h-3.5 md:w-4 md:h-4 flex-shrink-0 text-purple-600" />
                  <span className="text-xs md:text-sm text-purple-700 font-medium">
                    {selectedForLink
                      ? <><span className="hidden sm:inline">{t.canvas.modeLinkTarget}</span><span className="sm:hidden">{t.canvas.modeLinkTargetShort}</span></>
                      : <><span className="hidden sm:inline">{t.canvas.modeLinkActive}</span><span className="sm:hidden">{t.canvas.modeLinkShort}</span></>}
                  </span>
                </div>
                {/* Le score se met à jour en temps réel */}
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0" style={{ background: 'rgba(139,92,246,0.15)', color: '#7c3aed' }}>
                  {t.canvas.scoreIndicator.replace('{pct}', String(pct))}
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
                          {t.canvas.modeMove}
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
                          {t.canvas.modeLink}
                        </button>
                      </div>
                    </div>

                    {/* Socle */}
                    <div>
                      <p className="text-xs uppercase tracking-widest font-semibold text-slate-400 mb-3">{t.socles.sectionLabel}</p>
                      <div className="space-y-2">
                        {[
                          { label: t.socles.essentiel.label, socle: socle1Essentiel, type: 'essentiel' as const },
                          { label: t.socles.performance.label, socle: socle2Performance, type: 'performance' as const },
                          { label: t.socles.signature.label, socle: socle3Signature, type: 'signature' as const },
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
                          {t.canvas.addCardBtn}
                        </button>
                        <button
                          onClick={() => {
                            resetConnections();
                            setMobileDrawerOpen(false);
                          }}
                          className="w-full py-3 rounded-xl font-semibold text-sm bg-slate-100 text-slate-700"
                        >
                          <Unlink className="w-4 h-4 inline mr-2" />
                          {t.canvas.resetLinks}
                        </button>
                        <button
                          onClick={() => {
                            resetPositions();
                            setMobileDrawerOpen(false);
                          }}
                          className="w-full py-3 rounded-xl font-semibold text-sm bg-slate-100 text-slate-700"
                        >
                          <RotateCcw className="w-4 h-4 inline mr-2" />
                          {t.canvas.resetPositions}
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
            {t.socles.currentPrefix} <span className="font-bold">{currentSocle === 'essentiel' ? t.socles.essentiel.label : currentSocle === 'performance' ? t.socles.performance.label : t.socles.signature.label}</span> : {currentSocle === 'essentiel' ? t.socles.essentiel.desc : currentSocle === 'performance' ? t.socles.performance.desc : t.socles.signature.desc}
          </p>
        </div>
      )}

      {/* ══════════ COMMENT LIRE CE SCHÉMA ══════════ */}
      {(() => {
        const stepsData = t.steps.items.map(s => ({ n: s.num, title: s.title, desc: s.desc }));
        return (
          <div className="mb-4 p-3 sm:p-5 bg-white rounded-2xl shadow-lg border-2 border-slate-200">
            <div className="flex items-center justify-between mb-3">
              <p className="text-[10px] uppercase tracking-widest font-semibold text-slate-400">{t.steps.title}</p>
              <span className="sm:hidden flex items-center gap-1 text-[10px] text-amber-500 font-semibold select-none">
                {t.steps.scrollHint} <ChevronDown className="w-3 h-3 -rotate-90" />
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
            <p className="text-[10px] uppercase tracking-widest text-amber-400 mb-1 font-semibold">{t.tooltipHeader}</p>
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
                      {healthDetailsExpanded ? t.health.hideDetails : t.health.showDetails}
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
                          <p className="text-[9px] font-black text-red-400 uppercase tracking-wide">{t.health.missingTools}</p>
                        </div>
                        {missingVitalTools.map(toolId => {
                          return (
                            <div key={toolId} className="mb-1 p-1.5 rounded-lg" style={{ background: 'rgba(239,68,68,0.08)' }}>
                              <p className="text-[10px] text-red-300 font-bold">{t?.wizardTools?.[toolId] || toolId}</p>
                              <p className="text-[9px] text-red-400/60 leading-snug mt-0.5">{t.health.missingToolDesc}</p>
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
                    <Plus className="w-3.5 h-3.5" /> {t.health.addToolBtn}
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
                  {t.mobileHealth.title}
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
                          {t?.wizardTools?.[toolId] || toolId}
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
                      {t.health.addToolBtn}
                    </button>
                  </div>
                )}

                {alertPairs.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-xs font-bold text-white/50 uppercase tracking-wide mb-1">{t.health.fluxBreaks}</p>
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
              const config = categoryConfig[system.category] || categoryConfig.management;
              const Icon = iconMap[system.icon] || iconMap.Bed;
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
                    const info = t.nodeBenefits[system.id];
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
                      {t.categories[system.category].split(' ')[0]}
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
                        <>{t.wizardTools?.[system.id] ?? system.name}</>
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
              <h3 className="text-lg sm:text-xl font-bold">{t.addModal.title}</h3>
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
              <label className="block text-sm font-medium text-slate-700 mb-1">{t.addModal.nameLabel}</label>
              <input
                type="text"
                list="card-suggestions"
                placeholder={t.addModal.namePlaceholder}
                value={newCard.name}
                onChange={(e) => setNewCard(prev => ({ ...prev, name: e.target.value }))}
                className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm"
              />
              <datalist id="card-suggestions">
                {t.cardSuggestions.map(suggestion => (
                  <option key={suggestion} value={suggestion} />
                ))}
              </datalist>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-slate-700 mb-1">{t.addModal.categoryLabel}</label>
              <select
                value={newCard.category}
                onChange={(e) => setNewCard(prev => ({ ...prev, category: e.target.value as any }))}
                className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm"
              >
                {Object.entries(categoryConfig).map(([key, config]) => (
                  <option key={key} value={key}>{t.categories[key as keyof typeof categoryConfig]}</option>
                ))}
              </select>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-slate-700 mb-2">{t.addModal.iconLabel}</label>
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
                {t.addModal.cancelBtn}
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
                {t.addModal.addBtn}
              </button>
            </div>
          </div>
        </div>
      )}


      </div>{/* /ecosystem section */}

      {/* ══════════ LÉGENDE & VALEUR ══════════ */}
      <div id="legende" className="mt-6 md:mt-8 p-4 sm:p-6 bg-white rounded-xl md:rounded-2xl border-2 border-slate-200 shadow-lg">
        <h3 className="mb-1 text-slate-800 text-center text-base sm:text-lg font-bold">{t.legend.title}</h3>
        <p className="text-center text-xs sm:text-sm text-slate-500 mb-4">{t.legend.subtitle}</p>

        {/* Color legend */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-4">
          {Object.entries(categoryConfig).map(([key, config]) => (
            <div key={key} className="flex items-center gap-1.5 sm:gap-2">
              <div 
                className="w-4 h-4 sm:w-5 sm:h-5 rounded-lg shadow-sm flex-shrink-0" 
                style={{ backgroundColor: config.color }}
              />
              <span className="text-xs sm:text-sm text-slate-700">{t.categories[key as keyof typeof categoryConfig]}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ══════════ MES SERVICES ══════════ */}
      <div id="services" className="mt-8 md:mt-12 p-4 sm:p-6 md:p-8 bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl md:rounded-2xl shadow-2xl">
        <div className="text-center mb-6 md:mb-8">
          <p className="text-xs uppercase tracking-widest text-amber-400 font-semibold mb-1">{t.servicesSection.subtitle}</p>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white">{t.servicesSection.title}</h2>
          <p className="text-sm text-slate-400 mt-2 max-w-lg mx-auto">{t.servicesSection.subtitle}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {t.servicesSection.items.map((service, idx) => {
            const icons = [<Search className="w-7 h-7" />, <Wrench className="w-7 h-7" />, <Radio className="w-7 h-7" />];
            const colors = ['#3b82f6', '#10b981', '#f59e0b'];
            return (
              <div
                key={service.name}
                className="group relative bg-white bg-opacity-5 border border-white border-opacity-10 rounded-xl p-5 sm:p-6 hover:bg-opacity-10 hover:border-opacity-20 transition-all hover:-translate-y-1 flex flex-col items-center text-center"
              >
                {/* Top accent line */}
                <div className="absolute top-0 left-0 right-0 h-0.5 rounded-t-xl opacity-0 group-hover:opacity-100 transition-opacity" style={{ backgroundColor: colors[idx] }} />

                {/* Big centered icon */}
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4 flex-shrink-0" style={{ backgroundColor: colors[idx] + '22', color: colors[idx] }}>
                  {icons[idx]}
                </div>

                <h3 className="text-base sm:text-lg font-bold text-black mb-3 leading-tight">{service.name}</h3>
              <p className="text-sm text-black leading-relaxed mb-5 flex-grow">{service.desc}</p>
              <div className="flex flex-wrap justify-center gap-1.5 mt-auto">
                {service.tags.map(tag => (
                  <span key={tag} className="text-xs px-2.5 py-1 rounded-full border font-medium" style={{ color: colors[idx], borderColor: colors[idx] + '55', backgroundColor: colors[idx] + '18' }}>
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          );
          })}
        </div>
      </div>

      {/* ══════════ CTA AUDIT GRATUIT ══════════ */}
      <div className="mt-4 bg-gradient-to-br from-amber-400 to-amber-500 rounded-xl md:rounded-2xl p-5 sm:p-6 md:p-8 shadow-2xl">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <p className="text-xs font-bold text-amber-900 uppercase tracking-widest mb-1">{t.cta.eyebrow}</p>
            <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-slate-900 leading-tight">{t.cta.title}</h3>
            <p className="text-xs sm:text-sm text-amber-900 mt-1">{t.cta.subtitle}</p>
          </div>
          <a
            href="https://calendar.app.google/cKNAVTh1TFacNkXs6"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 flex-shrink-0 px-6 py-3 bg-slate-900 text-amber-400 font-bold rounded-xl hover:bg-slate-800 transition-all shadow-lg text-sm whitespace-nowrap"
          >
            <Calendar className="w-4 h-4" />
            {t.cta.btn}
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
            {t.footer.contact}
          </a>
          <a
            href="https://calendar.app.google/cKNAVTh1TFacNkXs6"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-amber-400 text-slate-900 rounded-xl hover:bg-amber-500 transition-colors shadow-md font-bold text-xs sm:text-sm"
          >
            <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            {t.footer.appointment}
          </a>
        </div>
        <p className="text-xs text-slate-500">
          {t.footer.copyright}
        </p>
      </div>
    </div>
  );
}
