// ══════════════════════════════════════════════════════════════════════
// useAnalytics.ts — Custom Hook for Analytics Tracking
// ══════════════════════════════════════════════════════════════════════
// NOTE: firebase.config.ts non trouvé au build.
// Les fonctions Firestore sont stubées — remplacer par le vrai import
// une fois firebase.config.ts créé dans le même dossier :
//   import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
//   import { db } from './firebase.config';
// ──────────────────────────────────────────────────────────────────────

// Stubs Firestore (no-op tant que firebase.config est absent)
const serverTimestamp = () => new Date().toISOString();
const collection = (_db: unknown, _name: string) => ({ _db, _name });
const addDoc = async (_ref: unknown, _data: unknown): Promise<{ id: string }> => {
  // TODO: connecter à Firestore quand firebase.config.ts sera disponible
  return { id: `local-${Date.now()}` };
};
const db = null;

// ── Types ──
export interface DiagnosticData {
  // Outils sélectionnés
  tools: string[];
  toolsCount: number;
  
  // Connexions établies
  connections: Array<{ from: string; to: string }>;
  connectionsCount: number;
  
  // Score et calcul
  score: {
    final: number;      // Score après plafonds (pct)
    raw: number;        // Score brut avant plafonds
    max: number;        // Score maximum possible
    penalty: number;    // Malus appliqués
  };
  
  // Diagnostic
  diagnostic: {
    level: string;      // 'critical', 'weak', 'solid', 'excellent'
    label: string;      // "🚨 Alerte Survie", "✅ En route vers l'Excellence", etc.
    hasMissingVitals: boolean;  // Si outils vitaux manquants (PMS, CM)
  };
  
  // Alertes (ruptures de flux)
  alerts: Array<{
    pair: string;       // "pms|pos"
    severity: string;   // 'critique', 'warning', 'info'
    message: string;    // Message de diagnostic
  }>;
  alertsCount: number;
  
  // Points positifs (connexions établies)
  positives: string[];
  
  // Métadonnées
  source: 'wizard' | 'manual';  // Origine du diagnostic
  language: 'fr' | 'en';        // Langue utilisée
  userAgent?: string;           // Navigateur (optionnel)
}

// ── Hook personnalisé ──
export function useAnalytics() {
  /**
   * Enregistre un diagnostic dans Firebase Firestore
   * Collection : 'diagnostics'
   */
  const trackDiagnostic = async (data: DiagnosticData): Promise<void> => {
    try {
      // Ajouter le timestamp serveur Firebase
      const diagnosticWithTimestamp = {
        ...data,
        timestamp: serverTimestamp(),  // Timestamp géré par Firebase (UTC)
        createdAt: new Date().toISOString(),  // ISO string pour affichage
      };

      // Enregistrer dans Firestore
      const docRef = await addDoc(
        collection(db, 'diagnostics'),
        diagnosticWithTimestamp
      );

      console.log('✅ Diagnostic tracked:', docRef.id);
    } catch (error) {
      console.error('❌ Analytics tracking error:', error);
      // Ne pas bloquer l'expérience utilisateur si le tracking échoue
    }
  };

  /**
   * Récupère les informations du navigateur
   */
  const getUserAgent = (): string => {
    return typeof window !== 'undefined' ? window.navigator.userAgent : 'Unknown';
  };

  return {
    trackDiagnostic,
    getUserAgent,
  };
}
