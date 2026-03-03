// ══════════════════════════════════════════════════════════════════════
// useAnalytics.ts — Custom Hook for Analytics Tracking
// ══════════════════════════════════════════════════════════════════════

import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from './Firebase.config';

// ── Types ──
export interface DiagnosticData {
  tools: string[];
  toolsCount: number;
  connections: Array<{ from: string; to: string }>;
  connectionsCount: number;
  score: {
    final: number;
    raw: number;
    max: number;
    penalty: number;
  };
  diagnostic: {
    level: string;
    label: string;
    hasMissingVitals: boolean;
  };
  alerts: Array<{
    pair: string;
    severity: string;
    message: string;
  }>;
  alertsCount: number;
  positives: string[];
  source: 'wizard' | 'manual';
  language: 'fr' | 'en';
  userAgent?: string;
}

// ── Hook personnalisé ──
export function useAnalytics() {
  /**
   * Enregistre un diagnostic dans Firebase Firestore
   * Collection : 'diagnostics'
   */
  const trackDiagnostic = async (data: DiagnosticData): Promise<void> => {
    // 🛡️ DÉTECTION MODE TEST / LOCALHOST
    const isLocalhost = typeof window !== 'undefined' && 
      (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');
    
    const isTestMode = typeof window !== 'undefined' && 
      new URLSearchParams(window.location.search).has('test');

    if (isLocalhost || isTestMode) {
      console.log(
        '%c🧪 MODE TEST ACTIVÉ : Diagnostic calculé mais non envoyé à Firebase', 
        'color: #fbbf24; font-weight: bold; background: #334155; padding: 2px 5px; rounded: 4px;'
      );
      return; // On stoppe l'exécution ici
    }

    try {
      // Préparation de la donnée avec Timestamps
      const diagnosticWithTimestamp = {
        ...data,
        timestamp: serverTimestamp(),
        createdAt: new Date().toISOString(),
      };

      // Envoi réel à Firestore
      const docRef = await addDoc(
        collection(db, 'diagnostics'),
        diagnosticWithTimestamp
      );

      console.log('✅ Diagnostic tracked in Firebase:', docRef.id);
    } catch (error) {
      console.error('❌ Analytics tracking error:', error);
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
