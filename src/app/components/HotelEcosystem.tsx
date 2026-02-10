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
  Download,
  FileImage,
  FileText,
  Mail,
  Building2,
  Linkedin,
  TrendingUp,
  Menu,
  ChevronDown,
  ChevronUp
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
  const [showExportModal, setShowExportModal] = useState(false);
  const [hoveredConnection, setHoveredConnection] = useState<string | null>(null);
  const [newCard, setNewCard] = useState({
    name: '',
    category: 'management' as const,
    icon: 'Bed'
  });
  
  // 📱 États pour le mobile
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isStackMenuOpen, setIsStackMenuOpen] = useState(false);
  const [isActionsMenuOpen, setIsActionsMenuOpen] = useState(false);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const diagramRef = useRef<HTMLDivElement>(null);

  // Gestion du drag tactile ET souris
  const handleMouseDown = (id: string, e: React.MouseEvent | React.TouchEvent) => {
    if (mode !== 'move' || viewMode !== 'admin') return;
    e.preventDefault();
    setDraggingId(id);

    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    const moveHandler = (moveEvent: MouseEvent | TouchEvent) => {
      if (!containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const moveClientX = 'touches' in moveEvent ? moveEvent.touches[0].clientX : moveEvent.clientX;
      const moveClientY = 'touches' in moveEvent ? moveEvent.touches[0].clientY : moveEvent.clientY;

      const newX = Math.min(95, Math.max(5, ((moveClientX - rect.left) / rect.width) * 100));
      const newY = Math.min(95, Math.max(5, ((moveClientY - rect.top) / rect.height) * 100));

      setNodePositions((prev) => ({
        ...prev,
        [id]: { x: newX, y: newY },
      }));
    };

    const upHandler = () => {
      setDraggingId(null);
      document.removeEventListener('mousemove', moveHandler as any);
      document.removeEventListener('mouseup', upHandler);
      document.removeEventListener('touchmove', moveHandler as any);
      document.removeEventListener('touchend', upHandler);
    };

    document.addEventListener('mousemove', moveHandler as any);
    document.addEventListener('mouseup', upHandler);
    document.addEventListener('touchmove', moveHandler as any);
    document.addEventListener('touchend', upHandler);
  };

  const createConnection = (targetId: string) => {
    if (selectedForLink && selectedForLink !== targetId) {
      setConnections((prev) => ({
        ...prev,
        [selectedForLink]: [...(prev[selectedForLink] || []), targetId],
      }));
      setSelectedForLink(null);
    }
  };

  const removeConnection = (sourceId: string, targetId: string) => {
    setConnections((prev) => ({
      ...prev,
      [sourceId]: (prev[sourceId] || []).filter((id) => id !== targetId),
    }));
  };

  const resetDiagram = () => {
    if (window.confirm('Voulez-vous vraiment réinitialiser le schéma ?')) {
      loadStack(stack1Simple);
    }
  };

  const deleteSystem = (id: string) => {
    if (window.confirm('Supprimer cette carte ?')) {
      setAllSystems(prev => prev.filter(s => s.id !== id));
      const newConnections = { ...connections };
      delete newConnections[id];
      Object.keys(newConnections).forEach(key => {
        newConnections[key] = newConnections[key].filter(connId => connId !== id);
      });
      setConnections(newConnections);
      const newPositions = { ...nodePositions };
      delete newPositions[id];
      setNodePositions(newPositions);
    }
  };

  const startEditing = (id: string, name: string) => {
    setEditingId(id);
    setEditingName(name);
  };

  const saveEdit = () => {
    if (editingId && editingName.trim()) {
      setAllSystems(prev =>
        prev.map(s => (s.id === editingId ? { ...s, name: editingName.trim() } : s))
      );
    }
    setEditingId(null);
    setEditingName('');
  };

  const addNewSystem = () => {
    if (!newCard.name.trim()) return;
    
    const newId = `system-${Date.now()}`;
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
      [newId]: []
    }));
    setShowAddModal(false);
    setNewCard({
      name: '',
      category: 'management',
      icon: 'Bed'
    });
  };

  // ✅ CORRECTION : Fonction exportToPNG simplifiée avec gestion d'erreur
  const exportToPNG = async () => {
    if (!diagramRef.current) {
      alert('Erreur : Zone de diagramme non trouvée');
      return;
    }
    
    try {
      // Charger html2canvas depuis CDN
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js';
      
      await new Promise((resolve, reject) => {
        script.onload = resolve;
        script.onerror = () => reject(new Error('Impossible de charger html2canvas'));
        document.head.appendChild(script);
      });
      
      // Attendre que html2canvas soit disponible
      const html2canvas = (window as any).html2canvas;
      
      if (!html2canvas) {
        throw new Error('html2canvas non disponible');
      }
      
      const canvas = await html2canvas(diagramRef.current, {
        backgroundColor: '#ffffff',
        scale: 2,
        logging: false,
        useCORS: true,
        allowTaint: true
      });
      
      const link = document.createElement('a');
      link.download = `ecosysteme-hotelier-${Date.now()}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
      
      setShowExportModal(false);
      alert('Export PNG réussi ! 🎉');
    } catch (error) {
      console.error('Erreur export PNG:', error);
      alert(`Erreur lors de l'export PNG : ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
    }
  };

  // ✅ CORRECTION : Fonction exportToPDF simplifiée avec gestion d'erreur
  const exportToPDF = async () => {
    if (!diagramRef.current) {
      alert('Erreur : Zone de diagramme non trouvée');
      return;
    }
    
    try {
      // Charger html2canvas
      const html2canvasScript = document.createElement('script');
      html2canvasScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js';
      
      await new Promise((resolve, reject) => {
        html2canvasScript.onload = resolve;
        html2canvasScript.onerror = () => reject(new Error('Impossible de charger html2canvas'));
        document.head.appendChild(html2canvasScript);
      });
      
      // Charger jsPDF
      const jsPDFScript = document.createElement('script');
      jsPDFScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
      
      await new Promise((resolve, reject) => {
        jsPDFScript.onload = resolve;
        jsPDFScript.onerror = () => reject(new Error('Impossible de charger jsPDF'));
        document.head.appendChild(jsPDFScript);
      });
      
      const html2canvas = (window as any).html2canvas;
      const jsPDF = (window as any).jspdf.jsPDF;
      
      if (!html2canvas || !jsPDF) {
        throw new Error('Bibliothèques non disponibles');
      }
      
      const canvas = await html2canvas(diagramRef.current, {
        backgroundColor: '#ffffff',
        scale: 2,
        logging: false,
        useCORS: true,
        allowTaint: true
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: canvas.width > canvas.height ? 'landscape' : 'portrait',
        unit: 'px',
        format: [canvas.width, canvas.height]
      });
      
      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
      pdf.save(`ecosysteme-hotelier-${Date.now()}.pdf`);
      
      setShowExportModal(false);
      alert('Export PDF réussi ! 🎉');
    } catch (error) {
      console.error('Erreur export PDF:', error);
      alert(`Erreur lors de l'export PDF : ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
    }
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
  };

  const renderLines = () => {
    return allSystems.flatMap((system) => {
      const systemConnections = connections[system.id] || [];
      return systemConnections.map((targetId) => {
        const target = allSystems.find((s) => s.id === targetId);
        if (!target) return null;

        const startPos = nodePositions[system.id];
        const endPos = nodePositions[targetId];

        const connectionKey = `${system.id}-${targetId}`;
        const isHovered = hoveredConnection === connectionKey;

        return (
          <g 
            key={connectionKey}
            onMouseEnter={() => setHoveredConnection(connectionKey)}
            onMouseLeave={() => setHoveredConnection(null)}
            style={{ cursor: viewMode === 'admin' ? 'pointer' : 'default' }}
          >
            <line
              x1={`${startPos.x}%`}
              y1={`${startPos.y}%`}
              x2={`${endPos.x}%`}
              y2={`${endPos.y}%`}
              stroke={isHovered ? '#6366f1' : '#cbd5e1'}
              strokeWidth={isHovered ? '3' : '2'}
              strokeDasharray={isHovered ? '0' : '5,5'}
              style={{ transition: 'all 0.2s' }}
            />
            {viewMode === 'admin' && isHovered && (
              <g>
                <circle
                  cx={`${(startPos.x + endPos.x) / 2}%`}
                  cy={`${(startPos.y + endPos.y) / 2}%`}
                  r="12"
                  fill="white"
                  stroke="#6366f1"
                  strokeWidth="2"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeConnection(system.id, targetId);
                    setHoveredConnection(null);
                  }}
                  style={{ cursor: 'pointer' }}
                />
                <text
                  x={`${(startPos.x + endPos.x) / 2}%`}
                  y={`${(startPos.y + endPos.y) / 2}%`}
                  fill="#6366f1"
                  fontSize="16"
                  fontWeight="bold"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeConnection(system.id, targetId);
                    setHoveredConnection(null);
                  }}
                  style={{ cursor: 'pointer', pointerEvents: 'none' }}
                >
                  ×
                </text>
              </g>
            )}
          </g>
        );
      });
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-3 sm:p-4 md:p-8">
      {/* Header - Responsive */}
      <div className="max-w-7xl mx-auto mb-4 sm:mb-6 md:mb-8">
        <div className="bg-white rounded-xl md:rounded-2xl shadow-lg p-4 sm:p-6 md:p-8 border-2 border-purple-100">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <h1 className="text-xl sm:text-2xl md:text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Écosystème Hôtelier Interactif
            </h1>
            
            {/* 📱 Bouton menu mobile */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg bg-purple-100 hover:bg-purple-200 transition-colors"
            >
              <Menu className="w-5 h-5 text-purple-600" />
            </button>
          </div>

          {/* 💻 Menu desktop (caché sur mobile) */}
          <div className="hidden lg:flex flex-wrap gap-2 mb-4">
            {/* Modes */}
            <div className="flex gap-2">
              <button
                onClick={() => setMode('move')}
                className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg transition-all shadow-md text-xs sm:text-sm ${
                  mode === 'move'
                    ? 'bg-blue-500 text-white'
                    : 'bg-white text-slate-700 hover:bg-blue-50'
                }`}
              >
                <Move className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">Déplacer</span>
              </button>
              <button
                onClick={() => setMode('link')}
                className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg transition-all shadow-md text-xs sm:text-sm ${
                  mode === 'link'
                    ? 'bg-purple-500 text-white'
                    : 'bg-white text-slate-700 hover:bg-purple-50'
                }`}
              >
                <Link2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">Relier</span>
              </button>
            </div>

            {/* Stacks */}
            <div className="flex gap-2">
              <button
                onClick={() => loadStack(stack1Simple)}
                className="px-3 sm:px-4 py-1.5 sm:py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all shadow-md text-xs sm:text-sm"
              >
                Stack 🟢 Simple
              </button>
              <button
                onClick={() => loadStack(stack2Intermediate)}
                className="px-3 sm:px-4 py-1.5 sm:py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-all shadow-md text-xs sm:text-sm"
              >
                Stack 🟠 Intermédiaire
              </button>
              <button
                onClick={() => loadStack(stack3Advanced)}
                className="px-3 sm:px-4 py-1.5 sm:py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all shadow-md text-xs sm:text-sm"
              >
                Stack 🔵 Avancé
              </button>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <button
                onClick={() => setShowAddModal(true)}
                className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all shadow-md text-xs sm:text-sm"
              >
                <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">Ajouter</span>
              </button>
              <button
                onClick={resetDiagram}
                className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-slate-500 text-white rounded-lg hover:bg-slate-600 transition-all shadow-md text-xs sm:text-sm"
              >
                <RotateCcw className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">Réinitialiser</span>
              </button>
              <button
                onClick={() => setViewMode(viewMode === 'admin' ? 'public' : 'admin')}
                className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg transition-all shadow-md text-xs sm:text-sm ${
                  viewMode === 'admin'
                    ? 'bg-indigo-500 text-white hover:bg-indigo-600'
                    : 'bg-teal-500 text-white hover:bg-teal-600'
                }`}
              >
                {viewMode === 'admin' ? (
                  <>
                    <Settings className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    <span className="hidden sm:inline">Mode Admin</span>
                  </>
                ) : (
                  <>
                    <Eye className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    <span className="hidden sm:inline">Mode Public</span>
                  </>
                )}
              </button>
              <button
                onClick={() => setShowExportModal(true)}
                className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg hover:from-blue-600 hover:to-cyan-600 transition-all shadow-md text-xs sm:text-sm"
              >
                <Download className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">Exporter</span>
              </button>
            </div>
          </div>

          {/* 📱 Menu mobile (déplié) */}
          {isMobileMenuOpen && (
            <div className="lg:hidden space-y-3 mb-4 pt-4 border-t border-slate-200">
              {/* Modes */}
              <div>
                <p className="text-xs font-semibold text-slate-600 mb-2">Modes</p>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setMode('move');
                      setIsMobileMenuOpen(false);
                    }}
                    className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg transition-all shadow-md text-sm ${
                      mode === 'move'
                        ? 'bg-blue-500 text-white'
                        : 'bg-white text-slate-700'
                    }`}
                  >
                    <Move className="w-4 h-4" />
                    Déplacer
                  </button>
                  <button
                    onClick={() => {
                      setMode('link');
                      setIsMobileMenuOpen(false);
                    }}
                    className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg transition-all shadow-md text-sm ${
                      mode === 'link'
                        ? 'bg-purple-500 text-white'
                        : 'bg-white text-slate-700'
                    }`}
                  >
                    <Link2 className="w-4 h-4" />
                    Relier
                  </button>
                </div>
              </div>

              {/* Stacks */}
              <div>
                <button
                  onClick={() => setIsStackMenuOpen(!isStackMenuOpen)}
                  className="w-full flex items-center justify-between px-3 py-2 bg-slate-100 rounded-lg text-sm font-semibold text-slate-700"
                >
                  <span>Charger un stack</span>
                  {isStackMenuOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
                {isStackMenuOpen && (
                  <div className="mt-2 space-y-2">
                    <button
                      onClick={() => {
                        loadStack(stack1Simple);
                        setIsStackMenuOpen(false);
                        setIsMobileMenuOpen(false);
                      }}
                      className="w-full px-3 py-2 bg-green-500 text-white rounded-lg text-sm"
                    >
                      Stack 🟢 Simple
                    </button>
                    <button
                      onClick={() => {
                        loadStack(stack2Intermediate);
                        setIsStackMenuOpen(false);
                        setIsMobileMenuOpen(false);
                      }}
                      className="w-full px-3 py-2 bg-orange-500 text-white rounded-lg text-sm"
                    >
                      Stack 🟠 Intermédiaire
                    </button>
                    <button
                      onClick={() => {
                        loadStack(stack3Advanced);
                        setIsStackMenuOpen(false);
                        setIsMobileMenuOpen(false);
                      }}
                      className="w-full px-3 py-2 bg-blue-500 text-white rounded-lg text-sm"
                    >
                      Stack 🔵 Avancé
                    </button>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div>
                <button
                  onClick={() => setIsActionsMenuOpen(!isActionsMenuOpen)}
                  className="w-full flex items-center justify-between px-3 py-2 bg-slate-100 rounded-lg text-sm font-semibold text-slate-700"
                >
                  <span>Actions</span>
                  {isActionsMenuOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
                {isActionsMenuOpen && (
                  <div className="mt-2 space-y-2">
                    <button
                      onClick={() => {
                        setShowAddModal(true);
                        setIsActionsMenuOpen(false);
                        setIsMobileMenuOpen(false);
                      }}
                      className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg text-sm"
                    >
                      <Plus className="w-4 h-4" />
                      Ajouter une carte
                    </button>
                    <button
                      onClick={() => {
                        resetDiagram();
                        setIsActionsMenuOpen(false);
                        setIsMobileMenuOpen(false);
                      }}
                      className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-slate-500 text-white rounded-lg text-sm"
                    >
                      <RotateCcw className="w-4 h-4" />
                      Réinitialiser
                    </button>
                    <button
                      onClick={() => {
                        setViewMode(viewMode === 'admin' ? 'public' : 'admin');
                        setIsActionsMenuOpen(false);
                        setIsMobileMenuOpen(false);
                      }}
                      className={`w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm ${
                        viewMode === 'admin'
                          ? 'bg-indigo-500 text-white'
                          : 'bg-teal-500 text-white'
                      }`}
                    >
                      {viewMode === 'admin' ? (
                        <>
                          <Settings className="w-4 h-4" />
                          Mode Admin
                        </>
                      ) : (
                        <>
                          <Eye className="w-4 h-4" />
                          Mode Public
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => {
                        setShowExportModal(true);
                        setIsActionsMenuOpen(false);
                        setIsMobileMenuOpen(false);
                      }}
                      className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg text-sm"
                    >
                      <Download className="w-4 h-4" />
                      Exporter
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Instructions */}
          {mode === 'link' && viewMode === 'admin' && (
            <div className="mt-3 sm:mt-4 p-3 sm:p-4 bg-purple-50 border border-purple-200 rounded-lg">
              <p className="text-xs sm:text-sm text-purple-800">
                <strong>Mode Liaison :</strong> Cliquez sur une carte source, puis sur une carte cible pour créer un lien. 
                {selectedForLink && <span className="ml-1 font-semibold">✓ Carte source sélectionnée</span>}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Diagram - Responsive */}
      <div className="max-w-7xl mx-auto">
        <div 
          ref={diagramRef}
          className="bg-white rounded-xl md:rounded-2xl shadow-2xl border-2 border-slate-200 overflow-hidden"
        >
          <div
            ref={containerRef}
            className="relative w-full bg-gradient-to-br from-slate-50 to-slate-100"
            style={{ height: 'min(80vh, 800px)' }}
          >
            {/* SVG pour les lignes */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 1 }}>
              <defs>
                <marker
                  id="arrowhead"
                  markerWidth="10"
                  markerHeight="10"
                  refX="9"
                  refY="3"
                  orient="auto"
                >
                  <polygon points="0 0, 10 3, 0 6" fill="#cbd5e1" />
                </marker>
              </defs>
              {renderLines()}
            </svg>

            {/* Cartes système avec OPACITÉ */}
            {allSystems.map((system) => {
              const IconComponent = iconMap[system.icon] || Bed;
              const pos = nodePositions[system.id];
              const categoryColor = categoryConfig[system.category].color;
              const isSelected = selectedForLink === system.id;
              const isEditing = editingId === system.id;

              return (
                <div
                  key={system.id}
                  onMouseDown={(e) => {
                    if (mode === 'link' && viewMode === 'admin') {
                      if (!selectedForLink) {
                        setSelectedForLink(system.id);
                      } else {
                        createConnection(system.id);
                      }
                    } else {
                      handleMouseDown(system.id, e);
                    }
                  }}
                  onTouchStart={(e) => {
                    if (mode === 'link' && viewMode === 'admin') {
                      if (!selectedForLink) {
                        setSelectedForLink(system.id);
                      } else {
                        createConnection(system.id);
                      }
                    } else {
                      handleMouseDown(system.id, e);
                    }
                  }}
                  className={`absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-200 ${
                    draggingId === system.id ? 'scale-110 z-50' : 'z-10'
                  } ${
                    mode === 'move' && viewMode === 'admin' ? 'cursor-move' : mode === 'link' && viewMode === 'admin' ? 'cursor-pointer' : 'cursor-default'
                  }`}
                  style={{
                    left: `${pos.x}%`,
                    top: `${pos.y}%`,
                  }}
                >
                  <div
                    className={`relative p-3 sm:p-4 rounded-xl md:rounded-2xl shadow-lg transition-all ${
                      isSelected
                        ? 'ring-4 ring-purple-400 scale-105'
                        : 'hover:shadow-xl hover:scale-105'
                    }`}
                    style={{
                      backgroundColor: categoryColor,
                      opacity: 0.92, // ✅ OPACITÉ AJOUTÉE
                      minWidth: '120px',
                      maxWidth: '200px',
                    }}
                  >
                    <div className="flex flex-col items-center gap-1.5 sm:gap-2">
                      <IconComponent className="w-6 h-6 sm:w-8 sm:h-8 text-white" strokeWidth={2.5} />
                      {isEditing ? (
                        <input
                          type="text"
                          value={editingName}
                          onChange={(e) => setEditingName(e.target.value)}
                          onBlur={saveEdit}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') saveEdit();
                            if (e.key === 'Escape') {
                              setEditingId(null);
                              setEditingName('');
                            }
                          }}
                          autoFocus
                          className="w-full px-2 py-1 text-xs sm:text-sm text-center bg-white rounded border border-slate-300"
                          onClick={(e) => e.stopPropagation()}
                        />
                      ) : (
                        <span className="text-white text-xs sm:text-sm font-semibold text-center leading-tight px-1">
                          {system.name}
                        </span>
                      )}
                    </div>
                    
                    {/* Boutons d'édition et suppression */}
                    {viewMode === 'admin' && !isEditing && (
                      <div className="absolute -top-2 -right-2 flex gap-1">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            startEditing(system.id, system.name);
                          }}
                          className="w-3.5 h-3.5 md:w-4 md:h-4 bg-white rounded-full shadow-md flex items-center justify-center text-slate-400 hover:text-blue-600 transition-colors"
                        >
                          <Edit2 className="w-3 h-3 md:w-3.5 md:h-3.5" />
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

      {/* Export Modal */}
      {showExportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3 sm:p-4">
          <div className="bg-white rounded-xl md:rounded-2xl shadow-2xl max-w-md w-full p-4 sm:p-6">
            <h2 className="text-xl sm:text-2xl font-bold mb-4">Exporter le schéma</h2>
            <p className="text-slate-600 mb-6 text-sm sm:text-base">Choisissez le format d'export :</p>
            
            <div className="space-y-3">
              <button
                onClick={exportToPNG}
                className="w-full px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center gap-2 shadow-md text-sm sm:text-base"
              >
                <FileImage className="w-5 h-5" />
                Exporter en PNG
              </button>
              <button
                onClick={exportToPDF}
                className="w-full px-4 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center justify-center gap-2 shadow-md text-sm sm:text-base"
              >
                <FileText className="w-5 h-5" />
                Exporter en PDF
              </button>
              <button
                onClick={() => setShowExportModal(false)}
                className="w-full px-4 py-3 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors text-sm sm:text-base"
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Legend - Responsive */}
      <div className="mt-6 md:mt-8 p-4 sm:p-6 bg-white rounded-xl md:rounded-2xl border-2 border-slate-200 shadow-lg">
        <h3 className="mb-3 md:mb-4 text-slate-800 text-center text-sm sm:text-base font-semibold">Légende des catégories</h3>
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

      {/* Footer - Responsive */}
      <div className="text-center text-xs sm:text-sm text-slate-600 space-y-2 mt-6 md:mt-8 pt-4 md:pt-6 border-t border-slate-200">
        <p>
          Vous préférez me contacter via LinkedIn ?{' '}
          <a
            href="https://www.linkedin.com/in/oc%C3%A9ane-habonneau-5a908212a/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-700 font-semibold inline-flex items-center gap-1"
          >
            <Linkedin className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span className="hidden sm:inline">Voir mon profil LinkedIn</span>
            <span className="sm:hidden">LinkedIn</span>
          </a>
        </p>
        <p className="text-xs text-slate-500">
          © 2026 Océane Habonneau – Tous droits réservés
        </p>
      </div>
    </div>
  );
}
