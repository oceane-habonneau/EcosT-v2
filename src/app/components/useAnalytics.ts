// ══════════════════════════════════════════════════════════════════════
// useAnalytics.ts — Custom Hook for Analytics Tracking
// ══════════════════════════════════════════════════════════════════════

import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from './Firebase.config';

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
