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
  Building2
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
  const [allSystems, setAllSystems] = useState<SystemNode[]>(systems);
  const [nodePositions, setNodePositions] = useState<Record<string, { x: number; y: number }>>(
    systems.reduce((acc, system) => {
      acc[system.id] = { x: system.x, y: system.y };
      return acc;
    }, {} as Record<string, { x: number; y: number }>)
  );
  const [connections, setConnections] = useState<Record<string, string[]>>(
    systems.reduce((acc, system) => {
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
  const [newCard, setNewCard] = useState({
    name: '',
    category: 'management' as const,
    icon: 'Bed'
  });
  const [connectionToDelete, setConnectionToDelete] = useState<{from: string, to: string} | null>(null);
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
      systems.reduce((acc, system) => {
        acc[system.id] = { x: system.x, y: system.y };
        return acc;
      }, {} as Record<string, { x: number; y: number }>)
    );
  };

  const resetConnections = () => {
    setConnections(
      systems.reduce((acc, system) => {
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

  const cancelEdit = () => {
    setEditingId(null);
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

  const downloadDiagram = () => {
    if (diagramRef.current) {
      html2canvas(diagramRef.current).then(canvas => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF();
        const imgProps = pdf.getImageProperties(imgData);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        pdf.save('hotel_ecosystem.pdf');
      });
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
                onClick={downloadDiagram}
                className="flex items-center gap-2 px-3 md:px-4 py-2 bg-white border-2 border-slate-300 text-slate-700 rounded-xl hover:bg-slate-50 transition-colors shadow-md text-sm"
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
                    ? 'Cliquez sur une autre carte pour créer/supprimer une liaison' 
                    : 'Cliquez sur une carte pour commencer une liaison'}
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
                
                return (
                  <line
                    key={`${fromId}-${targetId}-${index}`}
                    x1={`${fromPos.x}%`}
                    y1={`${fromPos.y}%`}
                    x2={`${toPos.x}%`}
                    y2={`${toPos.y}%`}
                    stroke="url(#lineGradient)"
                    strokeWidth="3"
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
                      {editingId === system.id ? (
                        <input
                          type="text"
                          value={editingName}
                          onChange={(e) => setEditingName(e.target.value)}
                          onBlur={saveEdit}
                          onKeyDown={(e) => e.key === 'Enter' && saveEdit()}
                          className="w-full text-center text-xs font-semibold leading-tight min-h-[24px] flex items-center justify-center px-1"
                        />
                      ) : (
                        system.name
                      )}
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

                    {/* Edit/Delete buttons - only in admin mode */}
                    {viewMode === 'admin' && (
                      <div className="absolute bottom-2 right-2 flex gap-1">
                        <button
                          onClick={() => startEditing(system.id)}
                          className="w-4 h-4 text-slate-400 hover:text-slate-600"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deleteSystem(system.id)}
                          className="w-4 h-4 text-slate-400 hover:text-slate-600"
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
                placeholder="Ex: Site Internet"
                value={newCard.name}
                onChange={(e) => setNewCard(prev => ({ ...prev, name: e.target.value }))}
                className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
              />
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

      {/* Description */}
      <div className="mt-6 text-center">
        <p className="text-sm text-slate-500">
          Le PMS est au centre de l'écosystème et interconnecte les différents systèmes de gestion hôtelière
        </p>
      </div>
    </div>
  );
}
