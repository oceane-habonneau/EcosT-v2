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
  TrendingUp
} from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

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

// Simplified default ecosystem with only requested cards
const systems: SystemNode[] = [
  // Center - PMS
  { 
    id: 'pms', 
    name: 'PMS', 
    category: 'management', 
    icon: 'Bed',
    x: 50,
    y: 50,
    connections: ['channel-manager', 'crm', 'booking-engine', 'pos']
  },
  
  // Channel Manager (top left)
  { 
    id: 'channel-manager', 
    name: 'Channel Manager', 
    category: 'sales', 
    icon: 'Share2',
    x: 25,
    y: 30,
    connections: ['ota']
  },
  
  // Booking Engine (top center)
  { 
    id: 'booking-engine', 
    name: 'Moteur de réservation', 
    category: 'booking', 
    icon: 'Calendar',
    x: 50,
    y: 20,
    connections: []
  },
  
  // OTA (top right)
  { 
    id: 'ota', 
    name: 'OTA', 
    category: 'sales', 
    icon: 'Building2',
    x: 75,
    y: 30,
    connections: []
  },
  
  // CRM (right)
  { 
    id: 'crm', 
    name: 'CRM', 
    category: 'management', 
    icon: 'Users',
    x: 75,
    y: 50,
    connections: []
  },
  
  // POS Restaurant (bottom left)
  { 
    id: 'pos', 
    name: 'POS Restaurant', 
    category: 'restaurant', 
    icon: 'UtensilsCrossed',
    x: 25,
    y: 70,
    connections: ['psp']
  },
  
  // PSP (bottom center)
  { 
    id: 'psp', 
    name: 'PSP', 
    category: 'management', 
    icon: 'CreditCard',
    x: 50,
    y: 80,
    connections: []
  },
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
  Building2
};

export function HotelEcosystem() {
  const [allSystems, setAllSystems] = useState<SystemNode[]>(stack1Simple);
  const [nodePositions, setNodePositions] = useState<Record<string, { x: number; y: number }>>(
    stack1Simple.reduce((acc, system) => {
      acc[system.id] = { x: system.x, y: system.y };
      return acc;
    }, {} as Record<string, { x: number; y: number }>)
  );
  const [connections, setConnections] = useState<Record<string, string[]>>(
    stack1Simple.reduce((acc, system) => {
      acc[system.id] = system.connections || [];
      return acc;
    }, {} as Record<string, string[]>)
  );
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [mode, setMode] = useState<'move' | 'link'>('move');
  const [selectedForLink, setSelectedForLink] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'admin' | 'public'>('admin');
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [newCard, setNewCard] = useState({
    name: '',
    category: 'management' as const,
    icon: 'Bed'
  });
  const [connectionToDelete, setConnectionToDelete] = useState<{from: string, to: string} | null>(null);
  const [hoveredConnection, setHoveredConnection] = useState<string | null>(null);
  const [showExportModal, setShowExportModal] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const diagramRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = (id: string, e: React.MouseEvent) => {
    if (mode === 'move') {
      e.preventDefault();
      setDraggingId(id);
    }
  };

  const handleCardClick = (id: string, e: React.MouseEvent) => {
    if (mode === 'link') {
      e.stopPropagation();
      if (!selectedForLink) {
        // First click - select source
        setSelectedForLink(id);
      } else if (selectedForLink === id) {
        // Clicking same card - deselect
        setSelectedForLink(null);
      } else {
        // Second click - create/remove connection
        const hasConnection = connections[selectedForLink]?.includes(id);
        
        setConnections(prev => {
          const newConnections = { ...prev };
          if (hasConnection) {
            // Remove connection
            newConnections[selectedForLink] = newConnections[selectedForLink].filter(c => c !== id);
          } else {
            // Add connection
            newConnections[selectedForLink] = [...(newConnections[selectedForLink] || []), id];
          }
          return newConnections;
        });
        
        setSelectedForLink(null);
      }
    }
  };

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!draggingId || !containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    // Clamp values between 5 and 95 to keep cards inside
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

  // Add and remove event listeners
  useEffect(() => {
    if (draggingId) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [draggingId, handleMouseMove, handleMouseUp]);

  const resetPositions = () => {
    setNodePositions(
      stack1Simple.reduce((acc, system) => {
        acc[system.id] = { x: system.x, y: system.y };
        return acc;
      }, {} as Record<string, { x: number; y: number }>)
    );
  };

  const resetConnections = () => {
    setConnections(
      stack1Simple.reduce((acc, system) => {
        acc[system.id] = system.connections || [];
        return acc;
      }, {} as Record<string, string[]>)
    );
    setSelectedForLink(null);
  };

  const deleteSystem = (id: string) => {
    setAllSystems(prev => prev.filter(system => system.id !== id));
    setNodePositions(prev => {
      const { [id]: _, ...rest } = prev;
      return rest;
    });
    setConnections(prev => {
      const { [id]: _, ...rest } = prev;
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

  const exportToPNG = async () => {
    if (diagramRef.current) {
      try {
        const canvas = await html2canvas(diagramRef.current, {
          backgroundColor: '#ffffff',
          scale: 2,
          logging: false,
          useCORS: true
        });
        
        const link = document.createElement('a');
        link.download = `ecosysteme-hotelier-${Date.now()}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
        setShowExportModal(false);
      } catch (error) {
        console.error('Erreur export PNG:', error);
        alert('Erreur lors de l\'export PNG. Veuillez réessayer.');
      }
    }
  };

  const exportToPDF = async () => {
    if (diagramRef.current) {
      try {
        const canvas = await html2canvas(diagramRef.current, {
          backgroundColor: '#ffffff',
          scale: 2,
          logging: false,
          useCORS: true
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
      } catch (error) {
        console.error('Erreur export PDF:', error);
        alert('Erreur lors de l\'export PDF. Veuillez réessayer.');
      }
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

  const removeConnection = (fromId: string, toId: string) => {
    setConnections(prev => {
      const newConnections = { ...prev };
      if (newConnections[fromId]) {
        newConnections[fromId] = newConnections[fromId].filter(id => id !== toId);
      }
      return newConnections;
    });
  };

  const handleConnectionClick = (fromId: string, toId: string) => {
    if (mode === 'link') {
      // Supprimer la connexion en mode liaison
      removeConnection(fromId, toId);
    }
  };

  return (
    <div className="max-w-[1400px] mx-auto p-4 md:p-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-5xl mb-2 bg-gradient-to-r from-slate-700 to-slate-900 bg-clip-text text-transparent">
          Schéma écosystème hôtelier
        </h1>
        <p className="text-base md:text-lg text-slate-600">Océane Habonneau</p>
        {/* Contact CTA */}
        <a 
          href="mailto:oceane.habonneau@gmail.com?subject=Demande%20de%20contact%20-%20Ecosyst%C3%A8me%20h%C3%B4telier&body=Bonjour%20Océane%2C%0A%0AJe%20souhaiterais%20discuter%20avec%20vous%20concernant%20votre%20schéma%20d'écosystème%20hôtelier.%0A%0A"
          className="inline-flex items-center gap-2 mt-4 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl"
        >
          <Mail className="w-5 h-5" />
          Contactez-moi
        </a>
      </div>

      {/* View Mode Toggle */}
      <div className="mb-6 flex justify-center">
        <div className="inline-flex rounded-xl border-2 border-slate-300 shadow-md bg-white p-1">
          <button
            onClick={() => setViewMode('admin')}
            className={`flex items-center gap-2 px-4 md:px-6 py-2 rounded-lg transition-colors text-sm md:text-base ${
              viewMode === 'admin' 
                ? 'bg-slate-700 text-white' 
                : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span className="hidden md:inline">Mode Administration</span>
            <span className="md:hidden">Admin</span>
          </button>
          <button
            onClick={() => {
              setViewMode('public');
              setMode('move');
              setSelectedForLink(null);
              setDraggingId(null);
            }}
            className={`flex items-center gap-2 px-4 md:px-6 py-2 rounded-lg transition-colors text-sm md:text-base ${
              viewMode === 'public' 
                ? 'bg-slate-700 text-white' 
                : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            <Eye className="w-4 h-4" />
            <span className="hidden md:inline">Vue Publique</span>
            <span className="md:hidden">Public</span>
          </button>
        </div>
      </div>

      {/* Admin Controls */}
      {viewMode === 'admin' && (
        <>
          {/* Controls */}
          <div className="mb-4 flex flex-col md:flex-row justify-between items-stretch md:items-center gap-3">
            {/* Mode Toggle */}
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => {
                  setMode('move');
                  setSelectedForLink(null);
                }}
                className={`flex items-center gap-2 px-3 md:px-4 py-2 rounded-xl transition-colors shadow-md text-sm ${
                  mode === 'move' 
                    ? 'bg-blue-500 text-white border-2 border-blue-600' 
                    : 'bg-white text-slate-700 border-2 border-slate-300 hover:bg-slate-50'
                }`}
              >
                <Move className="w-4 h-4" />
                <span className="hidden sm:inline">Mode Déplacement</span>
                <span className="sm:hidden">Déplacer</span>
              </button>
              <button
                onClick={() => {
                  setMode('link');
                  setDraggingId(null);
                }}
                className={`flex items-center gap-2 px-3 md:px-4 py-2 rounded-xl transition-colors shadow-md text-sm ${
                  mode === 'link' 
                    ? 'bg-purple-500 text-white border-2 border-purple-600' 
                    : 'bg-white text-slate-700 border-2 border-slate-300 hover:bg-slate-50'
                }`}
              >
                <Link2 className="w-4 h-4" />
                <span className="hidden sm:inline">Mode Liaison</span>
                <span className="sm:hidden">Lier</span>
              </button>
            </div>

            {/* Stack Buttons */}
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => loadStack(stack1Simple)}
                className="flex items-center gap-2 px-3 md:px-4 py-2 rounded-xl bg-green-500 text-white hover:bg-green-600 transition-colors shadow-md text-sm font-medium"
              >
                🟢 Stack Simple
              </button>
              <button
                onClick={() => loadStack(stack2Intermediate)}
                className="flex items-center gap-2 px-3 md:px-4 py-2 rounded-xl bg-orange-500 text-white hover:bg-orange-600 transition-colors shadow-md text-sm font-medium"
              >
                🟠 Stack Intermédiaire
              </button>
              <button
                onClick={() => loadStack(stack3Advanced)}
                className="flex items-center gap-2 px-3 md:px-4 py-2 rounded-xl bg-blue-500 text-white hover:bg-blue-600 transition-colors shadow-md text-sm font-medium"
              >
                🔵 Stack Avancé
              </button>

            {/* Right controls */}
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={resetConnections}
                className="flex items-center gap-2 px-3 md:px-4 py-2 bg-white border-2 border-slate-300 text-slate-700 rounded-xl hover:bg-slate-50 transition-colors shadow-md text-sm"
              >
                <Unlink className="w-4 h-4" />
                <span className="hidden lg:inline">Réinitialiser liaisons</span>
                <span className="lg:hidden">Liaisons</span>
              </button>
              <button
                onClick={resetPositions}
                className="flex items-center gap-2 px-3 md:px-4 py-2 bg-white border-2 border-slate-300 text-slate-700 rounded-xl hover:bg-slate-50 transition-colors shadow-md text-sm"
              >
                <RotateCcw className="w-4 h-4" />
                <span className="hidden lg:inline">Réinitialiser positions</span>
                <span className="lg:hidden">Positions</span>
              </button>
              <button
                onClick={() => setShowAddModal(true)}
                className="flex items-center gap-2 px-3 md:px-4 py-2 bg-white border-2 border-slate-300 text-slate-700 rounded-xl hover:bg-slate-50 transition-colors shadow-md text-sm"
              >
                <Plus className="w-4 h-4" />
                <span className="hidden md:inline">Ajouter</span>
              </button>
              <button
                onClick={() => setShowExportModal(true)}
                className="flex items-center gap-2 px-3 md:px-4 py-2 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-colors shadow-md text-sm font-medium"
              >
                <Download className="w-4 h-4" />
                <span className="hidden md:inline">Export</span>
              </button>
            </div>
          </div>

          {/* Mode instructions */}
          <div className="mb-4">
            {mode === 'move' && (
              <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 border-2 border-blue-200 text-blue-700 rounded-xl shadow-md">
                <Move className="w-4 h-4" />
                <span className="text-xs md:text-sm">Cliquez et glissez pour déplacer les cartes</span>
              </div>
            )}
            {mode === 'link' && (
              <div className="flex items-center gap-2 px-4 py-2 bg-purple-50 border-2 border-purple-200 text-purple-700 rounded-xl shadow-md">
                <Link2 className="w-4 h-4" />
                <span className="text-xs md:text-sm">
                  {selectedForLink 
                    ? 'Cliquez sur une autre carte pour créer/supprimer une liaison, ou cliquez sur une liaison existante pour la supprimer' 
                    : 'Cliquez sur une carte pour commencer une liaison, ou cliquez sur une liaison existante pour la supprimer'}
                </span>
              </div>
            )}
          </div>
        </>
      )}

      {/* Ecosystem Diagram */}
      <div ref={diagramRef} className="relative bg-gradient-to-br from-slate-50 to-white rounded-3xl p-8 md:p-16 shadow-2xl border-2 border-slate-200">
        <div 
          ref={containerRef}
          className="relative w-full select-none" 
          style={{ paddingBottom: '85%' }}
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
                  className={`absolute ${viewMode === 'admin' && mode === 'move' ? 'cursor-move' : viewMode === 'admin' && mode === 'link' ? 'cursor-pointer' : ''}`}
                  style={{
                    left: `${pos.x}%`,
                    top: `${pos.y}%`,
                    transform: 'translate(-50%, -50%)',
                    width: isPMS ? '140px' : '110px',
                    zIndex: isDragging || isSelected ? 10 : 2
                  }}
                  onMouseDown={viewMode === 'admin' ? (e) => handleMouseDown(system.id, e) : undefined}
                  onClick={viewMode === 'admin' ? (e) => handleCardClick(system.id, e) : undefined}
                >
                  {/* Card */}
                  <div
                    className={`relative bg-white rounded-2xl p-3 shadow-xl border-2 transition-all ${
                      isDragging ? 'scale-110 shadow-2xl' : ''
                    } ${
                      isSelected ? 'ring-4 ring-purple-400 scale-110' : ''
                    } ${
                      hasConnectionToSelected ? 'ring-2 ring-purple-200' : ''
                    }`}
                    style={{ borderColor: config.color }}
                  >
                    {/* Mode indicator - only in admin mode */}
                    {viewMode === 'admin' && (
                      <div className="absolute top-1 left-1/2 -translate-x-1/2">
                        {mode === 'move' ? (
                          <Move className="w-3 h-3 text-slate-400" />
                        ) : (
                          <Link2 className={`w-3 h-3 ${isSelected ? 'text-purple-600' : 'text-slate-400'}`} />
                        )}
                      </div>
                    )}

                    {/* Icon with colored background */}
                    <div 
                      className={`${isPMS ? 'w-14 h-14' : 'w-11 h-11'} rounded-xl mb-2 mx-auto flex items-center justify-center shadow-md`}
                      style={{ backgroundColor: config.color }}
                    >
                      <Icon className={`${isPMS ? 'w-7 h-7' : 'w-6 h-6'} text-white`} />
                    </div>

                    {/* Title */}
                    <h3 className={`${isPMS ? 'text-xs font-semibold' : 'text-xs'} text-center text-slate-800 leading-tight min-h-[24px] flex items-center justify-center px-1`}>
                      {system.name}
                    </h3>

                    {/* Category indicator dot */}
                    <div 
                      className="absolute top-2 right-2 w-2.5 h-2.5 rounded-full shadow-sm"
                      style={{ backgroundColor: config.color }}
                    />

                    {/* Connection count badge - only in admin mode */}
                    {viewMode === 'admin' && connections[system.id] && connections[system.id].length > 0 && (
                      <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-purple-500 text-white text-xs px-2 py-0.5 rounded-full shadow-md">
                        {connections[system.id].length}
                      </div>
                    )}

                    {/* Delete button - only in admin mode */}
                    {viewMode === 'admin' && (
                      <div className="absolute bottom-2 right-2">
                        <button
                          onClick={() => deleteSystem(system.id)}
                          className="w-4 h-4 text-slate-400 hover:text-red-600 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
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

      {/* Add Card Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded-2xl shadow-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">Ajouter une nouvelle carte</h3>
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
                onChange={(e) => setNewCard(prev => ({ ...prev, category: e.target.value as 'management' | 'booking' | 'sales' | 'customer' | 'restaurant' | 'wellness' }))}
                className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
              >
                {Object.entries(categoryConfig).map(([key, config]) => (
                  <option key={key} value={key}>{config.label}</option>
                ))}
              </select>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-slate-700 mb-2">Icône</label>
              <div className="grid grid-cols-5 gap-2">
                {[
                  { icon: 'Users', label: 'Utilisateurs' },
                  { icon: 'Bed', label: 'Lit' },
                  { icon: 'CreditCard', label: 'Carte' },
                  { icon: 'Globe', label: 'Globe' },
                  { icon: 'ShoppingBag', label: 'Boutique' },
                  { icon: 'MessageCircle', label: 'Message' },
                  { icon: 'UtensilsCrossed', label: 'Restaurant' },
                  { icon: 'Calendar', label: 'Calendrier' },
                  { icon: 'Sparkles', label: 'Étoiles' },
                  { icon: 'Share2', label: 'Partage' },
                  { icon: 'DollarSign', label: 'Dollar' },
                  { icon: 'Star', label: 'Étoile' },
                  { icon: 'Home', label: 'Maison' },
                  { icon: 'Calculator', label: 'Calculette' },
                  { icon: 'Building2', label: 'Bâtiment' },
                ].map(({icon, label}) => {
                  const IconComponent = iconMap[icon];
                  return (
                    <button
                      key={icon}
                      onClick={() => setNewCard(prev => ({ ...prev, icon }))}
                      className={`p-3 rounded-lg border-2 transition-all hover:scale-110 ${
                        newCard.icon === icon 
                          ? 'border-indigo-500 bg-indigo-50' 
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                      title={label}
                    >
                      <IconComponent className="w-5 h-5 mx-auto" />
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
                className="px-4 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={addNewSystem}
                disabled={!newCard.name.trim()}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  newCard.name.trim()
                    ? 'bg-indigo-500 text-white hover:bg-indigo-600'
                    : 'bg-slate-300 text-slate-500 cursor-not-allowed'
                }`}
              >
                Ajouter
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Legend */}
      <div className="mt-8 p-6 bg-white rounded-2xl border-2 border-slate-200 shadow-lg">
        <h3 className="mb-4 text-slate-800 text-center">Légende des catégories</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {Object.entries(categoryConfig).map(([key, config]) => (
            <div key={key} className="flex items-center gap-2">
              <div 
                className="w-5 h-5 rounded-lg shadow-sm" 
                style={{ backgroundColor: config.color }}
              />
              <span className="text-sm text-slate-700">{config.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Export Modal */}
      {showExportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
            <h2 className="text-2xl font-bold mb-4">Exporter le schéma</h2>
            <p className="text-slate-600 mb-6">Choisissez le format d'export :</p>
            
            <div className="space-y-3">
              <button
                onClick={exportToPNG}
                className="w-full px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center gap-2 shadow-md"
              >
                <FileImage className="w-5 h-5" />
                Exporter en PNG
              </button>
              <button
                onClick={exportToPDF}
                className="w-full px-4 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center justify-center gap-2 shadow-md"
              >
                <FileText className="w-5 h-5" />
                Exporter en PDF
              </button>
              <button
                onClick={() => setShowExportModal(false)}
                className="w-full px-4 py-3 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors"
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="text-center text-sm text-slate-600 space-y-2 mt-8 pt-6 border-t border-slate-200">
        <p>
          Vous préférez me contacter via LinkedIn ?{' '}
          <a
            href="https://www.linkedin.com/in/oc%C3%A9ane-habonneau-5a908212a/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-700 font-semibold inline-flex items-center gap-1"
          >
            <Linkedin className="w-4 h-4" />
            Voir mon profil LinkedIn
          </a>
        </p>
        <p className="text-xs text-slate-500">
          © 2026 Océane Habonneau – Tous droits réservés
        </p>
      </div>
    </div>
  );
}
