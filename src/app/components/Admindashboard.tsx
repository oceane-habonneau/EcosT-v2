// ══════════════════════════════════════════════════════════════════════
// AdminDashboard.tsx — Admin Analytics Dashboard
// ══════════════════════════════════════════════════════════════════════

import { useEffect, useState } from 'react';
import { 
  collection, 
  query, 
  orderBy, 
  limit, 
  getDocs,
  QueryDocumentSnapshot,
  DocumentData
} from 'firebase/firestore';
import { 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  signOut,
  User 
} from 'firebase/auth';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer,
  Cell 
} from 'recharts';
import { db, auth } from './firebase.config';
import { DiagnosticData } from './useAnalytics';

// ── Types ──
interface DiagnosticDocument extends DiagnosticData {
  id: string;
  createdAt: string;
}

interface ToolFrequency {
  tool: string;
  count: number;
}

// ══════════════════════════════════════════════════════════════════════
// Composant : Formulaire de connexion
// ══════════════════════════════════════════════════════════════════════
function LoginForm({ onLogin }: { onLogin: (email: string, password: string) => Promise<void> }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await onLogin(email, password);
    } catch (err: any) {
      setError(err.message || 'Erreur de connexion');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-800 mb-2">🔐 Admin Dashboard</h1>
          <p className="text-sm text-slate-500">Accès réservé aux administrateurs</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              placeholder="admin@hotel-ecosystem.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Mot de passe</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              placeholder="••••••••"
              required
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Connexion...' : 'Se connecter'}
          </button>
        </form>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════
// Composant principal : Admin Dashboard
// ══════════════════════════════════════════════════════════════════════
export function AdminDashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [diagnostics, setDiagnostics] = useState<DiagnosticDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [dataLoading, setDataLoading] = useState(false);

  // ── Auth State Listener ──
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        await loadDiagnostics();
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // ── Charger les diagnostics depuis Firestore ──
  const loadDiagnostics = async () => {
    setDataLoading(true);
    try {
      const q = query(
        collection(db, 'diagnostics'),
        orderBy('timestamp', 'desc'),
        limit(100)  // Charger les 100 derniers
      );

      const snapshot = await getDocs(q);
      const docs = snapshot.docs.map((doc: QueryDocumentSnapshot<DocumentData>) => ({
        id: doc.id,
        ...doc.data(),
      })) as DiagnosticDocument[];

      setDiagnostics(docs);
      console.log(`✅ Loaded ${docs.length} diagnostics`);
    } catch (error) {
      console.error('❌ Error loading diagnostics:', error);
    } finally {
      setDataLoading(false);
    }
  };

  // ── Handlers ──
  const handleLogin = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  const handleLogout = async () => {
    await signOut(auth);
    setDiagnostics([]);
  };

  // ── Affichage pendant le chargement ──
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Chargement...</p>
        </div>
      </div>
    );
  }

  // ── Affichage du formulaire de connexion si non authentifié ──
  if (!user) {
    return <LoginForm onLogin={handleLogin} />;
  }

  // ── Calcul des statistiques ──
  const stats = {
    total: diagnostics.length,
    avgScore: diagnostics.length > 0 
      ? Math.round(diagnostics.reduce((sum, d) => sum + d.score.final, 0) / diagnostics.length)
      : 0,
    avgTools: diagnostics.length > 0
      ? (diagnostics.reduce((sum, d) => sum + d.toolsCount, 0) / diagnostics.length).toFixed(1)
      : '0',
    avgConnections: diagnostics.length > 0
      ? (diagnostics.reduce((sum, d) => sum + d.connectionsCount, 0) / diagnostics.length).toFixed(1)
      : '0',
  };

  // ── Fréquence des outils sélectionnés ──
  const toolFrequencyMap: Record<string, number> = {};
  diagnostics.forEach(d => {
    d.tools.forEach(tool => {
      toolFrequencyMap[tool] = (toolFrequencyMap[tool] || 0) + 1;
    });
  });

  const topTools: ToolFrequency[] = Object.entries(toolFrequencyMap)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10)
    .map(([tool, count]) => ({ tool, count }));

  // Couleurs pour le graphique
  const COLORS = ['#3b82f6', '#06b6d4', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#ef4444', '#6366f1', '#14b8a6', '#f97316'];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* ── Header ── */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">📊 Analytics Dashboard</h1>
            <p className="text-sm text-slate-500">Hotel Ecosystem — Admin Panel</p>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-slate-600">{user.email}</span>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white text-sm font-medium rounded-lg transition-colors"
            >
              Déconnexion
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* ── KPIs (Indicateurs clés) ── */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-md border border-slate-200">
            <p className="text-sm text-slate-500 font-medium mb-1">Diagnostics Totaux</p>
            <p className="text-4xl font-bold text-blue-600">{stats.total}</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md border border-slate-200">
            <p className="text-sm text-slate-500 font-medium mb-1">Score Moyen</p>
            <p className="text-4xl font-bold text-emerald-600">{stats.avgScore}%</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md border border-slate-200">
            <p className="text-sm text-slate-500 font-medium mb-1">Outils Moyens</p>
            <p className="text-4xl font-bold text-purple-600">{stats.avgTools}</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md border border-slate-200">
            <p className="text-sm text-slate-500 font-medium mb-1">Connexions Moyennes</p>
            <p className="text-4xl font-bold text-orange-600">{stats.avgConnections}</p>
          </div>
        </div>

        {/* ── Graphique : Top 10 Outils ── */}
        <div className="bg-white p-6 rounded-xl shadow-md border border-slate-200 mb-8">
          <h2 className="text-xl font-bold text-slate-800 mb-4">🏆 Top 10 Outils Sélectionnés</h2>
          {topTools.length > 0 ? (
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={topTools}>
                <XAxis 
                  dataKey="tool" 
                  tick={{ fontSize: 12 }}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#fff', 
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px' 
                  }}
                />
                <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                  {topTools.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-slate-500 text-center py-8">Aucune donnée disponible</p>
          )}
        </div>

        {/* ── Tableau : 10 derniers diagnostics ── */}
        <div className="bg-white p-6 rounded-xl shadow-md border border-slate-200">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-slate-800">📋 Derniers Diagnostics</h2>
            <button
              onClick={loadDiagnostics}
              disabled={dataLoading}
              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50"
            >
              {dataLoading ? '⟳ Chargement...' : '🔄 Actualiser'}
            </button>
          </div>

          {diagnostics.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200 text-left">
                    <th className="p-3 text-sm font-semibold text-slate-700">Date</th>
                    <th className="p-3 text-sm font-semibold text-slate-700">Score</th>
                    <th className="p-3 text-sm font-semibold text-slate-700">Outils</th>
                    <th className="p-3 text-sm font-semibold text-slate-700">Connexions</th>
                    <th className="p-3 text-sm font-semibold text-slate-700">Niveau</th>
                    <th className="p-3 text-sm font-semibold text-slate-700">Source</th>
                  </tr>
                </thead>
                <tbody>
                  {diagnostics.slice(0, 10).map((d) => (
                    <tr key={d.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                      <td className="p-3 text-sm text-slate-600">
                        {d.createdAt ? new Date(d.createdAt).toLocaleString('fr-FR', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        }) : 'N/A'}
                      </td>
                      <td className="p-3">
                        <span className="text-lg font-bold text-slate-800">{d.score.final}%</span>
                      </td>
                      <td className="p-3 text-sm text-slate-600">{d.toolsCount} outils</td>
                      <td className="p-3 text-sm text-slate-600">{d.connectionsCount} liens</td>
                      <td className="p-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          d.diagnostic.level === 'excellent' ? 'bg-green-100 text-green-800' :
                          d.diagnostic.level === 'solid' ? 'bg-blue-100 text-blue-800' :
                          d.diagnostic.level === 'weak' ? 'bg-orange-100 text-orange-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {d.diagnostic.label}
                        </span>
                      </td>
                      <td className="p-3">
                        <span className="text-xs px-2 py-1 rounded bg-slate-100 text-slate-700 font-medium">
                          {d.source === 'wizard' ? '🧙 Wizard' : '✏️ Manuel'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-slate-500 text-center py-8">Aucun diagnostic enregistré</p>
          )}
        </div>
      </div>
    </div>
  );
}
