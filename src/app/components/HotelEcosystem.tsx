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

  const exportToPNG = async () => {
    if (!diagramRef.current) return;
    
    try {
      // Vérifier si html2canvas est disponible
      let html2canvas;
      try {
        html2canvas = (await import('html2canvas')).default;
      } catch {
        // Fallback : charger depuis CDN
        await new Promise((resolve, reject) => {
          const script = document.createElement('script');
          script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js';
          script.onload = resolve;
          script.onerror = reject;
          document.head.appendChild(script);
        });
        html2canvas = (window as any).html2canvas;
      }
      
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
  };

  const exportToPDF = async () => {
    if (!diagramRef.current) return;
    
    try {
      // Charger html2canvas
      let html2canvas;
      try {
        html2canvas = (await import('html2canvas')).default;
      } catch {
        await new Promise((resolve, reject) => {
          const script = document.createElement('script');
          script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js';
          script.onload = resolve;
          script.onerror = reject;
          document.head.appendChild(script);
        });
        html2canvas = (window as any).html2canvas;
      }
      
      // Charger jsPDF
      let jsPDF;
      try {
        const jsPDFModule = await import('jspdf');
        jsPDF = jsPDFModule.default || jsPDFModule.jsPDF;
      } catch {
        await new Promise((resolve, reject) => {
          const script = document.createElement('script');
          script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
          script.onload = resolve;
          script.onerror = reject;
          document.head.appendChild(script);
        });
        jsPDF = (window as any).jspdf.jsPDF;
      }
      
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

  return (
    <div className="max-w-[1400px] mx-auto p-3 sm:p-4 md:p-8">
      {/* Header */}
      <div className="text-center mb-4 md:mb-8">
        <h1 className="text-2xl sm:text-3xl md:text-5xl mb-2 bg-gradient-to-r from-slate-700 to-slate-900 bg-clip-text text-transparent font-bold">
          Schéma écosystème hôtelier
        </h1>
        <p className="text-sm sm:text-base md:text-lg text-slate-600">Océane Habonneau</p>
        {/* Contact CTA */}
        <a 
          href="mailto:oceane.habonneau@gmail.com?subject=Demande%20de%20contact%20-%20Ecosyst%C3%A8me%20h%C3%B4telier&body=Bonjour%20Océane%2C%0A%0AJe%20souhaiterais%20discuter%20avec%20vous%20concernant%20votre%20schéma%20d'écosystème%20hôtelier.%0A%0A"
          className="inline-flex items-center gap-2 mt-3 md:mt-4 px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white text-sm sm:text-base rounded-lg md:rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl"
        >
          <Mail className="w-4 h-4 sm:w-5 sm:h-5" />
          Contactez-moi
        </a>
      </div>

      {/* View Mode Toggle */}
      <div className="mb-4 md:mb-6 flex justify-center">
        <div className="inline-flex rounded-lg md:rounded-xl border-2 border-slate-300 shadow-md bg-white p-0.5 md:p-1 w-full sm:w-auto">
          <button
            onClick={() => setViewMode('admin')}
            className={`flex-1 sm:flex-none flex items-center justify-center gap-1.5 md:gap-2 px-3 sm:px-4 md:px-6 py-2 rounded-md md:rounded-lg transition-colors text-xs sm:text-sm md:text-base ${
              viewMode === 'admin' 
                ? 'bg-slate-700 text-white' 
                : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            <Settings className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span className="sm:hidden">Admin</span>
            <span className="hidden sm:inline">Mode Administration</span>
          </button>
          <button
            onClick={() => {
              setViewMode('public');
              setMode('move');
              setSelectedForLink(null);
              setDraggingId(null);
              setIsMobileMenuOpen(false);
            }}
            className={`flex-1 sm:flex-none flex items-center justify-center gap-1.5 md:gap-2 px-3 sm:px-4 md:px-6 py-2 rounded-md md:rounded-lg transition-colors text-xs sm:text-sm md:text-base ${
              viewMode === 'public' 
                ? 'bg-slate-700 text-white' 
                : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            <Eye className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span className="sm:hidden">Public</span>
            <span className="hidden sm:inline">Vue Publique</span>
          </button>
        </div>
      </div>

      {/* Admin Controls */}
      {viewMode === 'admin' && (
        <>
          {/* 📱 Mobile: Menu Burger */}
          <div className="md:hidden mb-4">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="w-full flex items-center justify-between px-4 py-3 bg-slate-700 text-white rounded-xl shadow-md"
            >
              <div className="flex items-center gap-2">
                <Menu className="w-5 h-5" />
                <span className="font-medium">Menu</span>
              </div>
              {isMobileMenuOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </button>
          </div>

          {/* 📱 Mobile: Menu déroulant */}
          <div className={`md:hidden mb-4 space-y-3 ${isMobileMenuOpen ? 'block' : 'hidden'}`}>
            {/* Mode Toggle */}
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setMode('move');
                  setSelectedForLink(null);
                }}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl transition-colors shadow-md text-sm font-medium ${
                  mode === 'move' 
                    ? 'bg-blue-500 text-white border-2 border-blue-600' 
                    : 'bg-white text-slate-700 border-2 border-slate-300'
                }`}
              >
                <Move className="w-4 h-4" />
                Déplacer
              </button>
              <button
                onClick={() => {
                  setMode('link');
                  setDraggingId(null);
                }}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl transition-colors shadow-md text-sm font-medium ${
                  mode === 'link' 
                    ? 'bg-purple-500 text-white border-2 border-purple-600' 
                    : 'bg-white text-slate-700 border-2 border-slate-300'
                }`}
              >
                <Link2 className="w-4 h-4" />
                Lier
              </button>
            </div>

            {/* Stack Menu */}
            <div>
              <button
                onClick={() => setIsStackMenuOpen(!isStackMenuOpen)}
                className="w-full flex items-center justify-between px-4 py-3 bg-white border-2 border-slate-300 rounded-xl shadow-md text-sm font-medium"
              >
                <span>Charger un Stack</span>
                {isStackMenuOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
              {isStackMenuOpen && (
                <div className="mt-2 space-y-2">
                  <button
                    onClick={() => loadStack(stack1Simple)}
                    className="w-full px-4 py-3 rounded-xl bg-green-500 text-white hover:bg-green-600 transition-colors shadow-md text-sm font-medium"
                  >
                    🟢 Stack Simple
                  </button>
                  <button
                    onClick={() => loadStack(stack2Intermediate)}
                    className="w-full px-4 py-3 rounded-xl bg-orange-500 text-white hover:bg-orange-600 transition-colors shadow-md text-sm font-medium"
                  >
                    🟠 Stack Intermédiaire
                  </button>
                  <button
                    onClick={() => loadStack(stack3Advanced)}
                    className="w-full px-4 py-3 rounded-xl bg-blue-500 text-white hover:bg-blue-600 transition-colors shadow-md text-sm font-medium"
                  >
                    🔵 Stack Avancé
                  </button>
                </div>
              )}
            </div>

            {/* Actions Menu */}
            <div>
              <button
                onClick={() => setIsActionsMenuOpen(!isActionsMenuOpen)}
                className="w-full flex items-center justify-between px-4 py-3 bg-white border-2 border-slate-300 rounded-xl shadow-md text-sm font-medium"
              >
                <span>Actions</span>
                {isActionsMenuOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
              {isActionsMenuOpen && (
                <div className="mt-2 grid grid-cols-2 gap-2">
                  <button
                    onClick={resetConnections}
                    className="flex flex-col items-center justify-center gap-1 px-3 py-3 bg-white border-2 border-slate-300 rounded-xl hover:bg-slate-50 transition-colors shadow-md"
                  >
                    <Unlink className="w-5 h-5" />
                    <span className="text-xs font-medium">Liaisons</span>
                  </button>
                  <button
                    onClick={resetPositions}
                    className="flex flex-col items-center justify-center gap-1 px-3 py-3 bg-white border-2 border-slate-300 rounded-xl hover:bg-slate-50 transition-colors shadow-md"
                  >
                    <RotateCcw className="w-5 h-5" />
                    <span className="text-xs font-medium">Positions</span>
                  </button>
                  <button
                    onClick={() => setShowAddModal(true)}
                    className="flex flex-col items-center justify-center gap-1 px-3 py-3 bg-white border-2 border-slate-300 rounded-xl hover:bg-slate-50 transition-colors shadow-md"
                  >
                    <Plus className="w-5 h-5" />
                    <span className="text-xs font-medium">Ajouter</span>
                  </button>
                  <button
                    onClick={() => setShowExportModal(true)}
                    className="flex flex-col items-center justify-center gap-1 px-3 py-3 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-colors shadow-md"
                  >
                    <Download className="w-5 h-5" />
                    <span className="text-xs font-medium">Export</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* 💻 Desktop: Controls originaux */}
          <div className="hidden md:block mb-4">
            <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center gap-3">
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
                  🟢 <span className="hidden lg:inline">Stack Simple</span><span className="lg:hidden">Simple</span>
                </button>
                <button
                  onClick={() => loadStack(stack2Intermediate)}
                  className="flex items-center gap-2 px-3 md:px-4 py-2 rounded-xl bg-orange-500 text-white hover:bg-orange-600 transition-colors shadow-md text-sm font-medium"
                >
                  🟠 <span className="hidden lg:inline">Stack Intermédiaire</span><span className="lg:hidden">Inter</span>
                </button>
                <button
                  onClick={() => loadStack(stack3Advanced)}
                  className="flex items-center gap-2 px-3 md:px-4 py-2 rounded-xl bg-blue-500 text-white hover:bg-blue-600 transition-colors shadow-md text-sm font-medium"
                >
                  🔵 <span className="hidden lg:inline">Stack Avancé</span><span className="lg:hidden">Avancé</span>
                </button>
              </div>

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
          </div>

          {/* Mode instructions */}
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
              <div className="flex items-center gap-2 px-3 md:px-4 py-2 bg-purple-50 border-2 border-purple-200 text-purple-700 rounded-lg md:rounded-xl shadow-md">
                <Link2 className="w-3.5 h-3.5 md:w-4 md:h-4 flex-shrink-0" />
                <span className="text-xs md:text-sm">
                  {selectedForLink 
                    ? <><span className="hidden sm:inline">Cliquez sur une autre carte pour créer/supprimer une liaison, ou cliquez sur une liaison existante pour la supprimer</span><span className="sm:hidden">Cliquez sur une carte ou une liaison</span></> 
                    : <><span className="hidden sm:inline">Cliquez sur une carte pour commencer une liaison, ou cliquez sur une liaison existante pour la supprimer</span><span className="sm:hidden">Cliquez sur une carte</span></>}
                </span>
              </div>
            )}
          </div>
        </>
      )}

      {/* Ecosystem Diagram */}
      <div ref={diagramRef} className="relative bg-gradient-to-br from-slate-50 to-white rounded-2xl md:rounded-3xl p-4 sm:p-6 md:p-12 lg:p-16 shadow-2xl border-2 border-slate-200 min-h-[400px] sm:min-h-[500px] md:min-h-[600px] touch-none">
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
                >
                  {/* Card */}
                  <div
                    className={`relative bg-white bg-opacity-95 backdrop-blur-sm rounded-xl md:rounded-2xl p-2 md:p-3 shadow-xl border-2 transition-all ${
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
                      style={{ backgroundColor: config.color }}
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
