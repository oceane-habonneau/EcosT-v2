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
    // 🛡️ DÉTECTION MODE TEST / LOCALHOST BLINDÉE
    const hostname = typeof window !== 'undefined' ? window.location.hostname : '';
    
    const isLocalhost = 
      hostname === 'localhost' || 
      hostname === '127.0.0.1' || 
      hostname.startsWith('192.168.') || // Pour les tests sur réseau local (Wifi)
      hostname.startsWith('10.') ||       // Réseaux privés
      hostname === '[::1]' ||             // IPv6 local
      hostname.endsWith('.local');        // Noms de machine locaux (Mac/Linux)

    const isTestMode = typeof window !== 'undefined' && 
      new URLSearchParams(window.location.search).has('test');

    if (isLocalhost || isTestMode) {
      console.log(
        '%c🧪 MODE TEST/LOCAL DÉTECTÉ : Diagnostic calculé mais envoi Firebase bloqué', 
        'color: #fbbf24; font-weight: bold; background: #334155; padding: 4px 8px; border-radius: 4px;'
      );
      return; // On stoppe l'exécution ici
    }

    try {
      // Préparation de la donnée avec Timestamps
      const diagnosticWithTimestamp = {
        ...data,
        timestamp: serverTimestamp(), // Timestamp officiel Firebase
        createdAt: new Date().toISOString(),
        userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : 'Unknown'
      };

      // Envoi réel à Firestore
      const docRef = await addDoc(
        collection(db, 'diagnostics'),
        diagnosticWithTimestamp
      );

      console.log('%c✅ Diagnostic enregistré avec succès dans Firebase', 'color: #10b981; font-weight: bold;');
      console.log('ID Document:', docRef.id);
    } catch (error) {
      console.error('❌ Erreur lors de l\'envoi Firebase:', error);
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
