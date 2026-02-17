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

// 🟢 Stack 1 - Simple (par défaut)
const stack1Simple: SystemNode[] = [
  { id: 'pms', name: 'PMS', category: 'management', icon: 'Bed', x: 50, y: 50, connections: ['channel-manager', 'pos'] },
  { id: 'channel-manager', name: 'Channel Manager', category: 'sales', icon: 'Share2', x: 25, y: 30, connections: ['ota', 'booking-engine'] },
  { id: 'ota', name: 'OTA', category: 'sales', icon: 'Building2', x: 15, y: 15, connections: [] },
  { id: 'booking-engine', name: 'Moteur de réservation', category: 'booking', icon: 'Calendar', x: 50, y: 15, connections: ['site-internet', 'psp'] },
  { id: 'site-internet', name: 'Site internet', category: 'sales', icon: 'Globe', x: 70, y: 10, connections: [] },
  { id: 'psp', name: 'PSP', category: 'customer', icon: 'CreditCard', x: 75, y: 25, connections: [] },
  { id: 'pos', name: 'POS restaurant', category: 'restaurant', icon: 'UtensilsCrossed', x: 35, y: 70, connections: [] }
];

// 🟠 Stack 2 - Intermédiaire
const stack2Intermediate: SystemNode[] = [
  { id: 'pms', name: 'PMS', category: 'management', icon: 'Bed', x: 50, y: 45, connections: ['channel-manager', 'pos', 'compta', 'crm'] },
  { id: 'channel-manager', name: 'Channel Manager', category: 'sales', icon: 'Share2', x: 25, y: 25, connections: ['ota', 'booking-engine'] },
  { id: 'ota', name: 'OTA', category: 'sales', icon: 'Building2', x: 10, y: 15, connections: [] },
  { id: 'booking-engine', name: 'Moteur de réservation', category: 'booking', icon: 'Calendar', x: 45, y: 12, connections: ['site-internet', 'psp'] },
  { id: 'site-internet', name: 'Site internet', category: 'sales', icon: 'Globe', x: 65, y: 8, connections: [] },
  { id: 'psp', name: 'PSP', category: 'customer', icon: 'CreditCard', x: 70, y: 22, connections: [] },
  { id: 'pos', name: 'POS restaurant', category: 'restaurant', icon: 'UtensilsCrossed', x: 30, y: 65, connections: [] },
  { id: 'compta', name: 'Comptabilité', category: 'management', icon: 'Calculator', x: 70, y: 45, connections: [] },
  { id: 'crm', name: 'CRM', category: 'management', icon: 'Users', x: 75, y: 60, connections: [] },
  { id: 'site-booking', name: 'Site web', category: 'sales', icon: 'ShoppingBag', x: 20, y: 75, connections: [] }
];

// 🔵 Stack 3 - Avancé
const stack3Advanced: SystemNode[] = [
  { id: 'pms', name: 'PMS', category: 'management', icon: 'Bed', x: 50, y: 45, connections: ['channel-manager', 'pos', 'compta', 'crm', 'spa', 'exp-client', 'rms'] },
  { id: 'channel-manager', name: 'Channel Manager', category: 'sales', icon: 'Share2', x: 25, y: 25, connections: ['ota', 'booking-engine', 'gds'] },
  { id: 'ota', name: 'OTA', category: 'sales', icon: 'Building2', x: 10, y: 15, connections: [] },
  { id: 'booking-engine', name: 'Moteur de réservation', category: 'booking', icon: 'Calendar', x: 45, y: 10, connections: ['site-internet', 'psp'] },
  { id: 'site-internet', name: 'Site internet', category: 'sales', icon: 'Globe', x: 65, y: 5, connections: ['moteur-resto'] },
  { id: 'psp', name: 'PSP', category: 'customer', icon: 'CreditCard', x: 72, y: 18, connections: [] },
  { id: 'pos', name: 'POS restaurant', category: 'restaurant', icon: 'UtensilsCrossed', x: 28, y: 65, connections: [] },
  { id: 'compta', name: 'Comptabilité', category: 'management', icon: 'Calculator', x: 70, y: 42, connections: [] },
  { id: 'crm', name: 'CRM', category: 'management', icon: 'Users', x: 75, y: 55, connections: [] },
  { id: 'spa', name: 'SPA', category: 'wellness', icon: 'Sparkles', x: 60, y: 65, connections: [] },
  { id: 'exp-client', name: 'Exp client in-house', category: 'customer', icon: 'Star', x: 75, y: 75, connections: [] },
  { id: 'rms', name: 'RMS', category: 'management', icon: 'TrendingUp', x: 38, y: 80, connections: [] },
  { id: 'gds', name: 'GDS', category: 'sales', icon: 'Globe', x: 12, y: 35, connections: [] },
  { id: 'moteur-resto', name: 'Moteur résa resto', category: 'restaurant', icon: 'UtensilsCrossed', x: 80, y: 12, connections: [] }
];

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
  alertPairs: { a: string; b: string }[];
  missingVitalTools: string[];
  penalty: number;
} {
  const presentIds = new Set(allSystems.map(s => s.id));
  let score = 0;
  let maxScore = 0;
  let penalty = 0;
  const alertPairs: { a: string; b: string }[] = [];
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
          alertPairs.push({ a, b });
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
      alertPairs.push({ a: link.a, b: link.b });
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
  const [allSystems, setAllSystems] = useState<SystemNode[]>(stack1Simple);
  const [nodePositions, setNodePositions] = useState<Record<string, { x: number; y: number }>>(() =>
    stack1Simple.reduce((acc, system) => {
      acc[system.id] = { x: system.x, y: system.y };
      return acc;
    }, {} as Record<string, { x: number; y: number }>)
  );
  const [connections, setConnections] = useState<Record<string, string[]>>(() =>
    stack1Simple.reduce((acc, system) => {
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
  
  // 📊 Widget scoring — sidebar panel dépliant (ouvert uniquement sur Stack Simple par défaut)
  const [scorePanelOpen, setScorePanelOpen] = useState(true);
  
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
        const original = stack1Simple.find(s => s.id === system.id) || 
                        stack2Intermediate.find(s => s.id === system.id) ||
                        stack3Advanced.find(s => s.id === system.id);
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
    const newId = `new-${Date.now()}`;
    const newSystem: SystemNode = {
      id: newId,
      name: newCard.name,
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
      [newId]: []
    }));
    setShowAddModal(false);
    setNewCard({
      name: '',
      category: 'management',
      icon: 'Bed'
    });
  };


  const loadStack = (stack: SystemNode[]) => {
    setAllSystems(stack);
    setNodePositions(
      stack.reduce((acc, system) => {
        acc[system.id] = { x: system.x, y: system.y };
        return acc;
      }, {} as Record<string, { x: number; y: number }>)
    );
    setConnections(
      stack.reduce((acc, system) => {
        acc[system.id] = system.connections || [];
        return acc;
      }, {} as Record<string, string[]>)
    );
    setSelectedForLink(null);
    setMode('move');
    setIsStackMenuOpen(false);
    
    // Fermer le panneau sur Intermédiaire/Avancé, ouvrir sur Simple
    const isSimple = stack.length === stack1Simple.length && stack.every(s => stack1Simple.find(st => st.id === s.id));
    setScorePanelOpen(isSimple);
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

  // ── Score calculé en temps réel ──
  const { pct, maxScore, alertPairs, missingVitalTools, penalty } = computeScore(connections, allSystems);
  const diagnostic = getDiagnostic(pct, missingVitalTools.length > 0);
  // Set rapide pour lookup O(1)
  const alertNodeIds = new Set(alertPairs.flatMap(p => [p.a, p.b]));

  return (
    <div className="max-w-[1400px] mx-auto p-3 sm:p-4 md:p-8">

      {/* ══════════ HEADER COMMERCIAL ══════════ */}
      <div className="mb-6 md:mb-10">
        {/* Nav Bar */}
        <div className="flex items-center justify-between flex-wrap gap-3 mb-6 px-4 sm:px-6 py-3 sm:py-4 bg-white rounded-2xl shadow-lg border-2 border-slate-200">
          {/* Brand */}
          <div className="flex flex-col leading-tight">
            <span className="text-lg sm:text-xl md:text-2xl font-bold bg-gradient-to-r from-slate-700 to-slate-900 bg-clip-text text-transparent">
              Océane Habonneau
            </span>
            <span className="text-xs sm:text-sm text-slate-500 font-medium tracking-wide">
              Flux &amp; Automatisations
            </span>
          </div>
          {/* Nav links - desktop */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
            <a href="#ecosystem" className="hover:text-slate-900 transition-colors">L'Écosystème</a>
            <a href="#legende" className="hover:text-slate-900 transition-colors">Légende &amp; Valeur</a>
            <a href="#services" className="hover:text-slate-900 transition-colors">Services</a>
          </nav>
          {/* CTA Button */}
          <a
            href="https://calendar.app.google/cKNAVTh1TFacNkXs6"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-amber-400 to-amber-500 text-slate-900 text-sm sm:text-base font-bold rounded-xl hover:from-amber-500 hover:to-amber-600 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0"
          >
            <Calendar className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="hidden xs:inline">Prendre RDV /</span> Audit Gratuit
          </a>
        </div>

        {/* Hero tagline */}
        <div className="text-center">
          <h1 className="text-2xl sm:text-3xl md:text-5xl mb-2 bg-gradient-to-r from-slate-700 to-slate-900 bg-clip-text text-transparent font-bold">
            Écosystème Hôtelier
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-slate-600">
            <strong>Évaluez votre infrastructure</strong> : si votre écosystème n'atteint pas le <strong>Stack Simple</strong>, votre rentabilité est en péril. Entre les niveaux <strong>Intermédiaire et Avancé</strong>, identifiez dès maintenant les flux de données manquants pour débugger vos opérations et <strong>libérer vos équipes</strong> avant la saison.
          </p>
        </div>
      </div>

      {/* Admin Controls + Toolbar (always visible) */}
      {(true) && (
        <>
          {/* ═══ TOOLBAR — pill radio buttons ═══ */}
          <div className="mb-4 p-3 bg-white rounded-2xl shadow-lg border-2 border-slate-200">
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

              {/* ── Groupe Stack ── */}
              <div className="flex flex-col gap-1">
                <span className="text-[10px] uppercase tracking-widest font-semibold text-slate-400 px-1">Stack</span>
                <div className="flex rounded-full overflow-hidden shadow-md border-2" style={{ borderColor: '#119843' }}>
                  {[
                    { label: 'Simple', stack: stack1Simple, id: 'simple' },
                    { label: 'Intermédiaire', stack: stack2Intermediate, id: 'intermediate' },
                    { label: 'Avancé', stack: stack3Advanced, id: 'advanced' },
                  ].map(({ label, stack, id }) => {
                    const isActive = JSON.stringify(allSystems.map(s => s.id).sort()) === JSON.stringify(stack.map(s => s.id).sort());
                    return (
                      <button
                        key={id}
                        onClick={() => loadStack(stack)}
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
              <div className="flex items-center gap-2 px-3 md:px-4 py-2 bg-blue-50 border-2 border-blue-200 text-blue-700 rounded-lg md:rounded-xl shadow-md">
                <Link2 className="w-3.5 h-3.5 md:w-4 md:h-4 flex-shrink-0" />
                <span className="text-xs md:text-sm">
                  {selectedForLink 
                    ? <><span className="hidden sm:inline">Cliquez sur une autre carte pour créer/supprimer une liaison, ou cliquez sur une liaison existante pour la supprimer</span><span className="sm:hidden">Cliquez sur une carte ou une liaison</span></> 
                    : <><span className="hidden sm:inline">Cliquez sur une carte pour commencer une liaison, ou cliquez sur une liaison existante pour la supprimer</span><span className="sm:hidden">Cliquez sur une carte</span></>}
                </span>
              </div>
            )}
          </div>
          )}{/* /mode instructions */}
        </>
      )}{/* /toolbar wrapper */}

      {/* ══════════ COMMENT LIRE CE SCHÉMA ══════════ */}
      <div className="mb-4 p-4 sm:p-5 bg-white rounded-2xl shadow-lg border-2 border-slate-200">
        <p className="text-[10px] uppercase tracking-widest font-semibold text-slate-400 mb-3">Comment lire ce schéma ?</p>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { n: '1', title: 'Chaque carte = un système', desc: 'Un logiciel ou une technologie installée dans votre hôtel, reliée aux autres par des flux de données.' },
            { n: '2', title: 'Les lignes = des flux', desc: 'Chaque connexion représente un échange automatique de données — sans action manuelle de votre équipe.' },
            { n: '3', title: 'Le PMS au centre', desc: 'Il orchestre tout et garantit la cohérence de vos données en temps réel entre tous les systèmes.' },
            { n: '4', title: 'Survol = bénéfice concret', desc: 'Passez la souris sur chaque carte pour comprendre ce qu\'elle change dans votre quotidien opérationnel.' },
          ].map(step => (
            <div key={step.n} className="flex items-start gap-2.5">
              <div className="w-6 h-6 rounded-full bg-amber-400 text-slate-900 font-bold text-xs flex items-center justify-center flex-shrink-0 shadow-md">
                {step.n}
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-800 mb-0.5 leading-tight">{step.title}</p>
                <p className="text-[11px] text-slate-500 leading-relaxed">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

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
      <div ref={diagramRef} className="relative bg-slate-50 rounded-2xl md:rounded-3xl p-4 sm:p-6 md:p-12 lg:p-16 shadow-2xl border-2 border-slate-200 min-h-[400px] sm:min-h-[500px] md:min-h-[600px] touch-none">

        {/* ══════════ PANNEAU SCORE LATÉRAL DÉPLIANT ══════════ */}
        <div
          className={`
            absolute top-4 right-4 z-[100] 
            transition-all duration-500 ease-in-out
            ${scorePanelOpen ? 'w-72 opacity-100' : 'w-12 opacity-90'}
          `}
        >
          {/* Toggle button — toujours visible */}
          <button
            onClick={() => setScorePanelOpen(o => !o)}
            className="absolute -left-3 top-2 z-10 w-6 h-6 bg-white rounded-full shadow-lg border-2 flex items-center justify-center hover:scale-110 transition-transform"
            style={{ borderColor: diagnostic.barColor }}
          >
            <ChevronUpIcon
              className="w-3.5 h-3.5 transition-transform duration-300"
              style={{ color: diagnostic.barColor, transform: scorePanelOpen ? 'rotate(-90deg)' : 'rotate(90deg)' }}
            />
          </button>

          {/* Pastille % — visible quand fermé (mobile surtout) */}
          {!scorePanelOpen && (
            <div
              className="w-12 h-12 rounded-xl shadow-xl flex items-center justify-center text-white font-black text-sm transition-colors duration-700"
              style={{ backgroundColor: diagnostic.barColor }}
            >
              {pct}%
            </div>
          )}

          {/* Panneau complet — visible quand ouvert */}
          {scorePanelOpen && (
            <div className="bg-white rounded-2xl shadow-2xl border-2 border-slate-200 overflow-hidden">
              {/* Header coloré */}
              <div
                className="px-3 py-2.5 flex items-center justify-between transition-colors duration-700"
                style={{ backgroundColor: diagnostic.barColor }}
              >
                <span className="text-white text-[10px] font-bold tracking-wide uppercase">Score</span>
                <span className="text-white text-base font-black">{pct}%</span>
              </div>

              {/* Barre de progression */}
              <div className="px-3 pt-2 pb-1">
                <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden shadow-inner">
                  <div
                    className="h-full rounded-full transition-all duration-700 ease-out"
                    style={{ width: `${pct}%`, backgroundColor: diagnostic.barColor }}
                  />
                </div>
                <div className="flex justify-between text-[9px] text-slate-400 mt-0.5">
                  <span>0%</span>
                  <span className="text-slate-500 font-medium">
                    {maxScore > 0 ? `${Math.round((pct * maxScore) / 100)} / ${maxScore} pts` : '—'}
                    {penalty < 0 && <span className="text-red-600"> ({penalty})</span>}
                  </span>
                  <span>100%</span>
                </div>
              </div>

              {/* Seuils visuels */}
              <div className="px-3 pb-1.5 flex gap-0.5">
                {[
                  { label: 'Péril', max: 35, color: '#ef4444' },
                  { label: 'Tension', max: 70, color: '#f97316' },
                  { label: 'Perf', max: 95, color: '#10b981' },
                  { label: 'Couture', max: 100, color: '#059669' },
                ].map(s => (
                  <div key={s.label} className="flex-1 text-center">
                    <div
                      className="h-0.5 rounded-full mb-0.5"
                      style={{
                        backgroundColor:
                          pct <= s.max &&
                          (s.label === 'Péril' ||
                            pct > (s.label === 'Tension' ? 35 : s.label === 'Perf' ? 70 : 95))
                            ? s.color
                            : '#e2e8f0',
                      }}
                    />
                    <span className="text-[8px] text-slate-400">{s.label}</span>
                  </div>
                ))}
              </div>

              {/* Diagnostic */}
              <div className="px-3 pb-2 border-t border-slate-100 pt-1.5">
                <p className={`text-[11px] font-bold mb-0.5 leading-tight ${diagnostic.color}`}>
                  {diagnostic.label}
                </p>
                <p className="text-[10px] text-slate-500 leading-relaxed">{diagnostic.desc}</p>
              </div>

              {/* Outils vitaux manquants */}
              {missingVitalTools.length > 0 && (
                <div className="mx-3 mb-2 p-2 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-[9px] font-bold text-red-600 uppercase tracking-wide mb-1">
                    Outils absents
                  </p>
                  {missingVitalTools.map(toolId => (
                    <div key={toolId} className="flex items-center gap-1 mb-0.5">
                      <span className="w-1 h-1 rounded-full bg-red-500 flex-shrink-0" />
                      <span className="text-[9px] text-red-700 font-medium">
                        {toolId === 'booking-engine' && 'Moteur de Réservation'}
                        {toolId === 'channel-manager' && 'Channel Manager'}
                        {toolId === 'pms' && 'PMS'}
                        {toolId === 'site-internet' && 'Site Internet'}
                        {toolId === 'ota' && 'OTA'}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {/* Connexions vitales manquantes */}
              {alertPairs.length > 0 && (
                <div className="mx-3 mb-2 p-2 bg-orange-50 border border-orange-200 rounded-lg">
                  <p className="text-[9px] font-bold text-orange-600 uppercase tracking-wide mb-1">
                    Flux manquants
                  </p>
                  {alertPairs.slice(0, 2).map(({ a, b }) => (
                    <div key={`${a}-${b}`} className="flex items-center gap-1 mb-0.5">
                      <span className="w-1 h-1 rounded-full bg-orange-500 animate-pulse flex-shrink-0" />
                      <span className="text-[9px] text-orange-700 font-medium leading-tight">
                        {allSystems.find(s => s.id === a)?.name || a} → {allSystems.find(s => s.id === b)?.name || b}
                      </span>
                    </div>
                  ))}
                  {alertPairs.length > 2 && (
                    <p className="text-[9px] text-orange-500 mt-0.5">+{alertPairs.length - 2} autre(s)</p>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        <div 
          ref={containerRef}
          className="relative w-full h-full"
          style={{ minHeight: '400px', touchAction: 'none' }}
        >
          {/* Connection Lines SVG */}
          <svg 
            className="absolute inset-0 w-full h-full pointer-events-none" 
            style={{ zIndex: 1 }}
          >
            <defs>
              <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#94a3b8" stopOpacity="0.5" />
                <stop offset="100%" stopColor="#64748b" stopOpacity="0.7" />
              </linearGradient>
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
                    stroke={isHovered ? '#f59e0b' : 'url(#lineGradient)'}
                    strokeWidth={isHovered ? 4 : 3}
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
                  className={`absolute ${viewMode === 'admin' && mode === 'move' ? 'cursor-move' : viewMode === 'admin' && mode === 'link' ? 'cursor-pointer' : ''} touch-none select-none`}
                  style={{
                    left: `${pos.x}%`,
                    top: `${pos.y}%`,
                    transform: 'translate(-50%, -50%)',
                    width: isPMS ? '100px' : '80px',
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
                  {/* Card */}
                  <div
                    className={`relative bg-white bg-opacity-90 backdrop-blur-sm rounded-xl md:rounded-2xl p-2 md:p-3 shadow-xl border-2 transition-all ${
                      isDragging ? 'scale-110 shadow-2xl bg-opacity-100' : ''
                    } ${
                      isSelected ? 'ring-4 ring-purple-400 scale-110 bg-opacity-100' : ''
                    } ${
                      hasConnectionToSelected ? 'ring-2 ring-purple-200' : ''
                    }`}
                    style={{ borderColor: config.color }}
                  >
                    {/* Mode indicator - only in admin mode */}
                    {viewMode === 'admin' && (
                      <div className="absolute top-0.5 md:top-1 left-1/2 -translate-x-1/2">
                        {mode === 'move' ? (
                          <Move className="w-2.5 h-2.5 md:w-3 md:h-3 text-slate-400" />
                        ) : (
                          <Link2 className={`w-2.5 h-2.5 md:w-3 md:h-3 ${isSelected ? 'text-purple-600' : 'text-slate-400'}`} />
                        )}
                      </div>
                    )}

                    {/* Icon with colored background */}
                    <div 
                      className={`${isPMS ? 'w-10 h-10 md:w-14 md:h-14' : 'w-8 h-8 md:w-11 md:h-11'} rounded-lg md:rounded-xl mb-1 md:mb-2 mx-auto flex items-center justify-center shadow-md`}
                      style={{ backgroundColor: config.color, opacity: 0.92 }}
                    >
                      <Icon className={`${isPMS ? 'w-5 h-5 md:w-7 md:h-7' : 'w-4 h-4 md:w-6 md:h-6'} text-white`} />
                    </div>

                    {/* Title */}
                    <h3 className={`${isPMS ? 'text-[10px] md:text-xs font-semibold' : 'text-[9px] md:text-xs'} text-center text-slate-800 leading-tight min-h-[20px] md:min-h-[24px] flex items-center justify-center px-0.5 md:px-1`}>
                      {editingId === system.id ? (
                        <input
                          type="text"
                          value={editingName}
                          onChange={(e) => setEditingName(e.target.value)}
                          onBlur={saveEdit}
                          onKeyDown={(e) => e.key === 'Enter' && saveEdit()}
                          className="w-full text-center text-[9px] md:text-xs font-semibold leading-tight"
                          autoFocus
                        />
                      ) : (
                        system.name
                      )}
                    </h3>

                    {/* Category indicator dot */}
                    <div 
                      className="absolute top-1 md:top-2 right-1 md:right-2 w-2 h-2 md:w-2.5 md:h-2.5 rounded-full shadow-sm"
                      style={{ backgroundColor: config.color }}
                    />

                    {/* 🚨 Badge alerte lien vital manquant */}
                    {alertNodeIds.has(system.id) && (
                      <div className="absolute -top-2 -left-2 z-20">
                        <span className="flex h-4 w-4 items-center justify-center">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                          <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500 items-center justify-center">
                            <AlertCircle className="w-2 h-2 text-white" />
                          </span>
                        </span>
                      </div>
                    )}

                    {/* Connection count badge - only in admin mode */}
                    {viewMode === 'admin' && connections[system.id] && connections[system.id].length > 0 && (
                      <div className="absolute -bottom-1.5 md:-bottom-2 left-1/2 -translate-x-1/2 bg-purple-500 text-white text-[10px] md:text-xs px-1.5 md:px-2 py-0.5 rounded-full shadow-md">
                        {connections[system.id].length}
                      </div>
                    )}

                    {/* Edit/Delete buttons - only in admin mode and on desktop */}
                    {viewMode === 'admin' && (
                      <div className="absolute bottom-1 md:bottom-2 right-1 md:right-2 flex gap-0.5 md:gap-1">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            startEditing(system.id);
                          }}
                          className="w-3.5 h-3.5 md:w-4 md:h-4 text-slate-400 hover:text-slate-600 flex items-center justify-center"
                        >
                          <Edit2 className="w-3 h-3 md:w-4 md:h-4" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteSystem(system.id);
                          }}
                          className="w-3.5 h-3.5 md:w-4 md:h-4 text-slate-400 hover:text-slate-600 flex items-center justify-center"
                        >
                          <Trash2 className="w-3 h-3 md:w-4 md:h-4" />
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3 sm:p-4">
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
