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
  Wifi,
  Phone,
  Lock,
  TrendingUp,
  Linkedin
} from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

interface SystemNode {
  id: string;
  name: string;
  category: 'management' | 'booking' | 'sales' | 'customer' | 'restaurant' | 'wellness';
  icon: string;
  x: number;
  y: number;
  connections?: string[];
}

// Suggestions triées alphabétiquement
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

// Stack 1 - Simple (défaut)
const stack1Simple: SystemNode[] = [
  { id: 'pms', name: 'PMS', category: 'management', icon: 'Bed', x: 50, y: 50, connections: ['channel-manager', 'pos'] },
  { id: 'channel-manager', name: 'Channel Manager', category: 'sales', icon: 'Share2', x: 30, y: 30, connections: ['ota', 'booking-engine'] },
  { id: 'ota', name: 'OTA', category: 'sales', icon: 'Building2', x: 15, y: 20, connections: [] },
  { id: 'booking-engine', name: 'Moteur de réservation', category: 'booking', icon: 'Calendar', x: 50, y: 20, connections: ['site-internet', 'psp'] },
  { id: 'site-internet', name: 'Site internet', category: 'sales', icon: 'Globe', x: 65, y: 10, connections: [] },
  { id: 'psp', name: 'PSP', category: 'customer', icon: 'CreditCard', x: 70, y: 30, connections: [] },
  { id: 'pos', name: 'POS restaurant', category: 'restaurant', icon: 'UtensilsCrossed', x: 40, y: 70, connections: [] }
];

// Stack 2 - Intermédiaire
const stack2Intermediate: SystemNode[] = [
  { id: 'pms', name: 'PMS', category: 'management', icon: 'Bed', x: 50, y: 45, connections: ['channel-manager', 'pos', 'compta', 'crm'] },
  { id: 'channel-manager', name: 'Channel Manager', category: 'sales', icon: 'Share2', x: 25, y: 25, connections: ['ota', 'booking-engine'] },
  { id: 'ota', name: 'OTA', category: 'sales', icon: 'Building2', x: 10, y: 15, connections: [] },
  { id: 'booking-engine', name: 'Moteur de réservation', category: 'booking', icon: 'Calendar', x: 45, y: 15, connections: ['site-internet', 'psp'] },
  { id: 'site-internet', name: 'Site internet', category: 'sales', icon: 'Globe', x: 60, y: 10, connections: [] },
  { id: 'psp', name: 'PSP', category: 'customer', icon: 'CreditCard', x: 65, y: 25, connections: [] },
  { id: 'pos', name: 'POS restaurant', category: 'restaurant', icon: 'UtensilsCrossed', x: 35, y: 65, connections: [] },
  { id: 'compta', name: 'Comptabilité', category: 'management', icon: 'Calculator', x: 65, y: 45, connections: [] },
  { id: 'crm', name: 'CRM', category: 'management', icon: 'Users', x: 75, y: 55, connections: [] },
  { id: 'site-booking', name: 'Site web boutique', category: 'sales', icon: 'ShoppingBag', x: 25, y: 70, connections: [] }
];

// Stack 3 - Avancé
const stack3Advanced: SystemNode[] = [
  { id: 'pms', name: 'PMS', category: 'management', icon: 'Bed', x: 50, y: 45, connections: ['channel-manager', 'pos', 'compta', 'crm', 'spa', 'exp-client', 'rms'] },
  { id: 'channel-manager', name: 'Channel Manager', category: 'sales', icon: 'Share2', x: 25, y: 25, connections: ['ota', 'booking-engine', 'gds'] },
  { id: 'ota', name: 'OTA', category: 'sales', icon: 'Building2', x: 10, y: 15, connections: [] },
  { id: 'booking-engine', name: 'Moteur de réservation', category: 'booking', icon: 'Calendar', x: 45, y: 12, connections: ['site-internet', 'psp'] },
  { id: 'site-internet', name: 'Site internet', category: 'sales', icon: 'Globe', x: 60, y: 8, connections: ['moteur-resto'] },
  { id: 'psp', name: 'PSP', category: 'customer', icon: 'CreditCard', x: 68, y: 20, connections: [] },
  { id: 'pos', name: 'POS restaurant', category: 'restaurant', icon: 'UtensilsCrossed', x: 30, y: 65, connections: [] },
  { id: 'compta', name: 'Comptabilité', category: 'management', icon: 'Calculator', x: 70, y: 42, connections: [] },
  { id: 'crm', name: 'CRM', category: 'management', icon: 'Users', x: 75, y: 52, connections: [] },
  { id: 'spa', name: 'SPA', category: 'wellness', icon: 'Sparkles', x: 60, y: 62, connections: [] },
  { id: 'exp-client', name: 'Expérience client in-house', category: 'customer', icon: 'Star', x: 72, y: 72, connections: [] },
  { id: 'rms', name: 'RMS', category: 'management', icon: 'TrendingUp', x: 40, y: 75, connections: [] },
  { id: 'gds', name: 'GDS', category: 'sales', icon: 'Globe', x: 15, y: 35, connections: [] },
  { id: 'moteur-resto', name: 'Moteur résa restaurant', category: 'restaurant', icon: 'UtensilsCrossed', x: 75, y: 15, connections: [] }
];

export function HotelEcosystem() {
  // États principaux
  const [nodes, setNodes] = useState<SystemNode[]>(stack1Simple);
  const [nodePositions, setNodePositions] = useState<Record<string, { x: number; y: number }>>(() =>
    stack1Simple.reduce((acc, node) => {
      acc[node.id] = { x: node.x, y: node.y };
      return acc;
    }, {} as Record<string, { x: number; y: number }>)
  );
  const [connections, setConnections] = useState<Record<string, string[]>>(() =>
    stack1Simple.reduce((acc, node) => {
      acc[node.id] = node.connections || [];
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
  const [showExportModal, setShowExportModal] = useState<boolean>(false);
  const [newCard, setNewCard] = useState({
    name: '',
    category: 'management' as const,
    icon: 'Bed'
  });
  const [hoveredConnection, setHoveredConnection] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const diagramRef = useRef<HTMLDivElement>(null);

  // Charger un stack
  const loadStack = (stack: SystemNode[]) => {
    setNodes(stack);
    setNodePositions(stack.reduce((acc, node) => {
      acc[node.id] = { x: node.x, y: node.y };
      return acc;
    }, {} as Record<string, { x: number; y: number }>));
    setConnections(stack.reduce((acc, node) => {
      acc[node.id] = node.connections || [];
      return acc;
    }, {} as Record<string, string[]>));
    setSelectedForLink(null);
  };

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

  // Supprimer une liaison en cliquant dessus
  const handleConnectionClick = (fromId: string, toId: string) => {
    if (mode === 'link') {
      setConnections(prev => {
        const newConnections = { ...prev };
        newConnections[fromId] = newConnections[fromId].filter(id => id !== toId);
        return newConnections;
      });
    }
  };

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!draggingId || !containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

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
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [draggingId, handleMouseMove, handleMouseUp]);

  const resetPositions = () => {
    setNodePositions(
      nodes.reduce((acc, node) => {
        acc[node.id] = { x: node.x, y: node.y };
        return acc;
      }, {} as Record<string, { x: number; y: number }>)
    );
  };

  const resetConnections = () => {
    setConnections(
      nodes.reduce((acc, node) => {
        acc[node.id] = node.connections || [];
        return acc;
      }, {} as Record<string, string[]>)
    );
  };

  const handleEdit = (id: string) => {
    const node = nodes.find(n => n.id === id);
    if (node) {
      setEditingId(id);
      setEditingName(node.name);
    }
  };

  const saveEdit = () => {
    if (editingId) {
      setNodes(prev => prev.map(n => 
        n.id === editingId ? { ...n, name: editingName } : n
      ));
      setEditingId(null);
      setEditingName('');
    }
  };

  const handleDelete = (id: string) => {
    setNodes(prev => prev.filter(n => n.id !== id));
    setConnections(prev => {
      const newConnections = { ...prev };
      delete newConnections[id];
      Object.keys(newConnections).forEach(key => {
        newConnections[key] = newConnections[key].filter(c => c !== id);
      });
      return newConnections;
    });
    delete nodePositions[id];
  };

  const handleAddCard = () => {
    if (!newCard.name.trim()) return;

    const newId = `node-${Date.now()}`;
    const newNode: SystemNode = {
      id: newId,
      name: newCard.name,
      category: newCard.category,
      icon: newCard.icon,
      x: 50,
      y: 50,
      connections: []
    };

    setNodes(prev => [...prev, newNode]);
    setNodePositions(prev => ({ ...prev, [newId]: { x: 50, y: 50 } }));
    setConnections(prev => ({ ...prev, [newId]: [] }));
    setShowAddModal(false);
    setNewCard({ name: '', category: 'management', icon: 'Bed' });
  };

  // Export PNG
  const exportToPNG = async () => {
    if (!diagramRef.current) return;
    
    try {
      const canvas = await html2canvas(diagramRef.current, {
        backgroundColor: '#ffffff',
        scale: 2,
      });
      
      const link = document.createElement('a');
      link.download = `ecosysteme-hotelier-${Date.now()}.png`;
      link.href = canvas.toDataURL();
      link.click();
      setShowExportModal(false);
    } catch (error) {
      console.error('Erreur export PNG:', error);
    }
  };

  // Export PDF
  const exportToPDF = async () => {
    if (!diagramRef.current) return;
    
    try {
      const canvas = await html2canvas(diagramRef.current, {
        backgroundColor: '#ffffff',
        scale: 2,
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
    }
  };

  const getIconComponent = (iconName: string) => {
    const icons: Record<string, any> = {
      Bed, Users, Star, Home, Calculator, CreditCard, Globe, ShoppingBag,
      MessageCircle, UtensilsCrossed, Calendar, Sparkles, Share2, DollarSign,
      Building2, Wifi, Phone, Lock, TrendingUp
    };
    const IconComponent = icons[iconName] || Bed;
    return <IconComponent className="w-6 h-6" />;
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      management: 'from-emerald-400 to-emerald-600',
      booking: 'from-blue-400 to-blue-600',
      sales: 'from-orange-400 to-orange-600',
      customer: 'from-cyan-400 to-cyan-600',
      restaurant: 'from-red-400 to-red-600',
      wellness: 'from-purple-400 to-purple-600'
    };
    return colors[category as keyof typeof colors] || colors.management;
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
          Écosystème IT Hôtelier
        </h1>
        <p className="text-slate-600 text-lg">Océane Habonneau</p>
        
        {/* Contact Button */}
        <a
          href="mailto:oceane.habonneau@gmail.com?subject=Demande de contact - Écosystème IT Hôtelier&body=Bonjour Océane,%0D%0A%0D%0AJe vous contacte suite à la consultation de votre schéma d'écosystème IT hôtelier.%0D%0A%0D%0A[Votre message ici]%0D%0A%0D%0ACordialement"
          className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg font-semibold hover:from-blue-600 hover:to-blue-700 transition-all shadow-md hover:shadow-lg"
        >
          <Mail className="w-5 h-5" />
          Contactez-moi
        </a>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap gap-3 justify-center items-center">
        {/* View Mode */}
        <div className="flex gap-2 bg-white rounded-lg shadow-sm p-1">
          <button
            onClick={() => setViewMode('admin')}
            className={`px-4 py-2 rounded-md flex items-center gap-2 transition-colors ${
              viewMode === 'admin' 
                ? 'bg-slate-800 text-white' 
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Settings className="w-4 h-4" />
            Admin
          </button>
          <button
            onClick={() => setViewMode('public')}
            className={`px-4 py-2 rounded-md flex items-center gap-2 transition-colors ${
              viewMode === 'public' 
                ? 'bg-slate-800 text-white' 
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Eye className="w-4 h-4" />
            Public
          </button>
        </div>

        {viewMode === 'admin' && (
          <>
            {/* Mode Selection */}
            <div className="flex gap-2 bg-white rounded-lg shadow-sm p-1">
              <button
                onClick={() => { setMode('move'); setSelectedForLink(null); }}
                className={`px-4 py-2 rounded-md flex items-center gap-2 transition-colors ${
                  mode === 'move' 
                    ? 'bg-blue-500 text-white' 
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Move className="w-4 h-4" />
                Déplacer
              </button>
              <button
                onClick={() => setMode('link')}
                className={`px-4 py-2 rounded-md flex items-center gap-2 transition-colors ${
                  mode === 'link' 
                    ? 'bg-blue-500 text-white' 
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Link2 className="w-4 h-4" />
                Liaison
              </button>
            </div>

            {/* Stack Buttons */}
            <div className="flex gap-2 bg-white rounded-lg shadow-sm p-1">
              <button
                onClick={() => loadStack(stack1Simple)}
                className="px-4 py-2 rounded-md bg-green-500 text-white hover:bg-green-600 transition-colors text-sm font-medium"
              >
                Stack Simple
              </button>
              <button
                onClick={() => loadStack(stack2Intermediate)}
                className="px-4 py-2 rounded-md bg-orange-500 text-white hover:bg-orange-600 transition-colors text-sm font-medium"
              >
                Stack Intermédiaire
              </button>
              <button
                onClick={() => loadStack(stack3Advanced)}
                className="px-4 py-2 rounded-md bg-blue-500 text-white hover:bg-blue-600 transition-colors text-sm font-medium"
              >
                Stack Avancé
              </button>
            </div>

            {/* Actions */}
            <button
              onClick={resetPositions}
              className="px-4 py-2 bg-white rounded-lg shadow-sm flex items-center gap-2 hover:bg-slate-50 transition-colors text-slate-700"
            >
              <RotateCcw className="w-4 h-4" />
              Réinitialiser positions
            </button>

            <button
              onClick={resetConnections}
              className="px-4 py-2 bg-white rounded-lg shadow-sm flex items-center gap-2 hover:bg-slate-50 transition-colors text-slate-700"
            >
              <Unlink className="w-4 h-4" />
              Réinitialiser liaisons
            </button>

            <button
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2 bg-white rounded-lg shadow-sm flex items-center gap-2 hover:bg-slate-50 transition-colors text-slate-700"
            >
              <Plus className="w-4 h-4" />
              Ajouter carte
            </button>

            <button
              onClick={() => setShowExportModal(true)}
              className="px-4 py-2 bg-green-500 text-white rounded-lg shadow-sm flex items-center gap-2 hover:bg-green-600 transition-colors font-medium"
            >
              <Download className="w-4 h-4" />
              Export
            </button>
          </>
        )}
      </div>

      {/* Help message */}
      {viewMode === 'admin' && mode === 'link' && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center text-blue-800">
          <p className="font-medium">
            {selectedForLink 
              ? 'Cliquez sur une carte pour créer/supprimer la liaison, ou cliquez sur une liaison existante pour la supprimer'
              : 'Cliquez sur une carte source, puis sur une carte destination'}
          </p>
        </div>
      )}

      {/* Diagram */}
      <div 
        ref={containerRef}
        className="relative bg-white rounded-xl shadow-lg p-12 min-h-[600px] border border-slate-200"
      >
        <div ref={diagramRef} className="relative w-full h-full">
          {/* Connections SVG */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 1 }}>
            {Object.entries(connections).map(([fromId, toIds]) => {
              const fromNode = nodes.find(n => n.id === fromId);
              const fromPos = nodePositions[fromId];
              if (!fromNode || !fromPos) return null;

              return toIds.map(toId => {
                const toNode = nodes.find(n => n.id === toId);
                const toPos = nodePositions[toId];
                if (!toNode || !toPos) return null;

                const connectionKey = `${fromId}-${toId}`;
                const isHovered = hoveredConnection === connectionKey;

                return (
                  <line
                    key={connectionKey}
                    x1={`${fromPos.x}%`}
                    y1={`${fromPos.y}%`}
                    x2={`${toPos.x}%`}
                    y2={`${toPos.y}%`}
                    stroke={isHovered ? '#f59e0b' : '#cbd5e1'}
                    strokeWidth={isHovered ? 4 : 2}
                    opacity={isHovered ? 0.9 : 0.5}
                    className="transition-all duration-200 cursor-pointer"
                    style={{ 
                      pointerEvents: mode === 'link' ? 'stroke' : 'none',
                      strokeLinecap: 'round'
                    }}
                    onClick={() => handleConnectionClick(fromId, toId)}
                    onMouseEnter={() => setHoveredConnection(connectionKey)}
                    onMouseLeave={() => setHoveredConnection(null)}
                  />
                );
              });
            })}
          </svg>

          {/* Nodes */}
          {nodes.map(node => {
            const pos = nodePositions[node.id];
            if (!pos) return null;

            const isSelected = selectedForLink === node.id;
            const isDragging = draggingId === node.id;

            return (
              <div
                key={node.id}
                className={`absolute transform -translate-x-1/2 -translate-y-1/2 transition-all ${
                  isDragging ? 'cursor-grabbing scale-105 z-50' : mode === 'move' ? 'cursor-grab' : 'cursor-pointer'
                } ${isSelected ? 'ring-4 ring-blue-400 scale-110' : ''}`}
                style={{
                  left: `${pos.x}%`,
                  top: `${pos.y}%`,
                  zIndex: isDragging ? 50 : isSelected ? 40 : 10
                }}
                onMouseDown={(e) => handleMouseDown(node.id, e)}
                onClick={(e) => handleCardClick(node.id, e)}
              >
                <div className={`bg-gradient-to-br ${getCategoryColor(node.category)} rounded-xl shadow-lg p-4 min-w-[160px] text-white`}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="bg-white/20 backdrop-blur-sm rounded-lg p-2">
                      {getIconComponent(node.icon)}
                    </div>
                    {viewMode === 'admin' && mode === 'move' && (
                      <div className="flex gap-1">
                        <button
                          onClick={(e) => { e.stopPropagation(); handleEdit(node.id); }}
                          className="p-1 bg-white/20 hover:bg-white/30 rounded transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); handleDelete(node.id); }}
                          className="p-1 bg-white/20 hover:bg-white/30 rounded transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                  <p className="text-sm font-semibold text-center leading-tight">{node.name}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer */}
      <div className="text-center text-sm text-slate-600 space-y-2 pt-6 border-t border-slate-200">
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

      {/* Add Card Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
            <h2 className="text-2xl font-bold mb-4">Ajouter une carte</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Nom du système</label>
                <input
                  type="text"
                  list="card-suggestions"
                  value={newCard.name}
                  onChange={(e) => setNewCard({ ...newCard, name: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Tapez ou choisissez..."
                />
                <datalist id="card-suggestions">
                  {cardSuggestions.map(suggestion => (
                    <option key={suggestion} value={suggestion} />
                  ))}
                </datalist>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Catégorie</label>
                <select
                  value={newCard.category}
                  onChange={(e) => setNewCard({ ...newCard, category: e.target.value as any })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="management">Gestion & Opérations</option>
                  <option value="booking">Réservations</option>
                  <option value="sales">Distribution & Ventes</option>
                  <option value="customer">Expérience Client</option>
                  <option value="restaurant">Restauration</option>
                  <option value="wellness">Bien-être</option>
                </select>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowAddModal(false)}
                className="flex-1 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={handleAddCard}
                className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                Ajouter
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editingId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
            <h2 className="text-2xl font-bold mb-4">Éditer la carte</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Nom</label>
                <input
                  type="text"
                  value={editingName}
                  onChange={(e) => setEditingName(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  autoFocus
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => { setEditingId(null); setEditingName(''); }}
                className="flex-1 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={saveEdit}
                className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                Sauvegarder
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Export Modal */}
      {showExportModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
            <h2 className="text-2xl font-bold mb-4">Exporter le schéma</h2>
            <p className="text-slate-600 mb-6">Choisissez le format d'export :</p>
            
            <div className="space-y-3">
              <button
                onClick={exportToPNG}
                className="w-full px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center gap-2"
              >
                <FileImage className="w-5 h-5" />
                Exporter en PNG
              </button>
              <button
                onClick={exportToPDF}
                className="w-full px-4 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center justify-center gap-2"
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
    </div>
  );
}
