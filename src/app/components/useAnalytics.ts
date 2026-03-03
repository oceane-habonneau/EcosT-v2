// ══════════════════════════════════════════════════════════════════════
// useAnalytics.ts — Custom Hook for Analytics Tracking
// VERSION BLINDÉE avec logs de diagnostic complets
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

// ══════════════════════════════════════════════════════════════════════
// 🔍 Utilitaire de détection — ÉVALUATION SYNCHRONE À L'APPEL
// Placé en dehors du hook pour éviter tout effet de closure stale.
// Chaque appel à shouldBlockFirebase() relit window.location en live.
// ══════════════════════════════════════════════════════════════════════
function shouldBlockFirebase(): { block: boolean; reason: string; details: Record<string, unknown> } {
  // ── Vérification 1 : window disponible ──
  if (typeof window === 'undefined') {
    return {
      block: true,
      reason: 'SSR_NO_WINDOW',
      details: { info: 'window est undefined — contexte SSR ou Node.js détecté, envoi bloqué par sécurité' },
    };
  }

  // ── Lecture live de window.location (jamais depuis une closure) ──
  const hostname = window.location.hostname;
  const href = window.location.href;
  const search = window.location.search;

  // ── Vérification 2 : hostname vide (bug Vite/SSR) ──
  if (!hostname || hostname.trim() === '') {
    return {
      block: true,
      reason: 'EMPTY_HOSTNAME',
      details: {
        hostname,
        href,
        info: "hostname est vide — état window.location anormal, envoi bloqué par sécurité",
      },
    };
  }

  // ── Vérification 3 : localhost / réseau local ──
  const localhostChecks: Record<string, boolean> = {
    'hostname === localhost':  hostname === 'localhost',
    'hostname === 127.0.0.1': hostname === '127.0.0.1',
    'hostname === [::1]':     hostname === '[::1]',
    'startsWith 192.168.':    hostname.startsWith('192.168.'),
    'startsWith 10.':         hostname.startsWith('10.'),
    'startsWith 172.16-31.':  /^172\.(1[6-9]|2\d|3[01])\./.test(hostname),
    'endsWith .local':        hostname.endsWith('.local'),
    'endsWith .localhost':    hostname.endsWith('.localhost'), // ex: app.localhost
  };
  const isLocalhost = Object.values(localhostChecks).some(Boolean);

  // ── Vérification 4 : mode test via URL ──
  const params = new URLSearchParams(search);
  const testModeChecks: Record<string, boolean> = {
    'param ?test présent':    params.has('test'),
    'param ?debug présent':   params.has('debug'),
    'param ?preview présent': params.has('preview'),
  };
  const isTestMode = Object.values(testModeChecks).some(Boolean);

  // ── Vérification 5 : variable d'environnement Vite ──
  // import.meta.env.MODE vaut 'development' en local, 'production' en build
  const envMode = (typeof import.meta !== 'undefined' && (import.meta as Record<string, unknown>).env)
    ? ((import.meta as { env: { MODE?: string } }).env.MODE ?? 'unknown')
    : 'unknown';
  const isDevelopmentEnv = envMode === 'development' || envMode === 'test';

  // ── TABLEAU DE DÉCISION COMPLET (visible dans la console) ──
  const decisionTable = {
    '📍 hostname':          hostname,
    '🔗 href':              href,
    '🔎 search':            search,
    '🌍 env MODE':          envMode,
    ...localhostChecks,
    ...testModeChecks,
    '⚙️ isLocalhost':      isLocalhost,
    '🧪 isTestMode':        isTestMode,
    '🏗️ isDevelopmentEnv': isDevelopmentEnv,
  };

  const block = isLocalhost || isTestMode || isDevelopmentEnv;
  const reasons: string[] = [];
  if (isLocalhost)      reasons.push('LOCALHOST');
  if (isTestMode)       reasons.push('TEST_MODE_URL');
  if (isDevelopmentEnv) reasons.push('ENV_DEVELOPMENT');

  return {
    block,
    reason: block ? reasons.join(' + ') : 'PRODUCTION_OK',
    details: decisionTable,
  };
}

// ══════════════════════════════════════════════════════════════════════
// Hook personnalisé
// ══════════════════════════════════════════════════════════════════════
export function useAnalytics() {
  // Compteur de garde anti double-appel
  let _callInProgress = false;

  /**
   * Enregistre un diagnostic dans Firebase Firestore
   * Collection : 'diagnostics'
   */
  const trackDiagnostic = async (data: DiagnosticData): Promise<void> => {
    // ── GARDE ANTI DOUBLE-APPEL (closure + React StrictMode) ──
    // React StrictMode en dev monte les composants deux fois.
    // Ce flag empêche deux envois simultanés depuis le même hook.
    if (_callInProgress) {
      console.warn(
        '%c⚠️ trackDiagnostic déjà en cours d\'exécution — appel ignoré (double-call guard)',
        'color: #f59e0b; font-weight: bold;'
      );
      return;
    }
    _callInProgress = true;

    // ── ÉVALUATION DE LA CONDITION DE BLOCAGE ──
    // shouldBlockFirebase() est appelé ICI, à l'exécution, pas à la création du hook.
    // Cela évite tout problème de closure stale.
    const { block, reason, details } = shouldBlockFirebase();

    // ── LOG STRUCTURÉ — toujours affiché, quelle que soit la décision ──
    const logStyle = block
      ? 'color: #fbbf24; font-weight: bold; background: #1e293b; padding: 4px 10px; border-radius: 4px; border-left: 3px solid #fbbf24;'
      : 'color: #10b981; font-weight: bold; background: #1e293b; padding: 4px 10px; border-radius: 4px; border-left: 3px solid #10b981;';

    console.group(
      `%c${block ? '🚫 FIREBASE BLOQUÉ' : '✅ FIREBASE AUTORISÉ'} — Raison : ${reason}`,
      logStyle
    );
    console.table(details);
    console.log('📦 Données du diagnostic :', data);
    console.groupEnd();

    // ── ARRÊT SI BLOQUÉ ──
    if (block) {
      _callInProgress = false;
      return; // ← Sortie définitive, aucun code Firebase ne sera atteint
    }

    // ── ENVOI FIREBASE (production uniquement) ──
    try {
      const diagnosticWithTimestamp = {
        ...data,
        timestamp: serverTimestamp(),
        createdAt: new Date().toISOString(),
        userAgent: window.navigator.userAgent,
      };

      const docRef = await addDoc(
        collection(db, 'diagnostics'),
        diagnosticWithTimestamp
      );

      console.log(
        '%c✅ Diagnostic enregistré dans Firebase',
        'color: #10b981; font-weight: bold;',
        '— ID :', docRef.id
      );
    } catch (error) {
      console.error('❌ Erreur lors de l\'envoi Firebase :', error);
    } finally {
      _callInProgress = false;
    }
  };

  const getUserAgent = (): string => {
    return typeof window !== 'undefined' ? window.navigator.userAgent : 'Unknown';
  };

  return {
    trackDiagnostic,
    getUserAgent,
  };
}

// ══════════════════════════════════════════════════════════════════════
// 📋 GUIDE DE DEBUG CONSOLE
// ══════════════════════════════════════════════════════════════════════
// En local (Vite dev), tu verras :
//   🚫 FIREBASE BLOQUÉ — Raison : LOCALHOST + ENV_DEVELOPMENT
//   + un tableau avec toutes les valeurs évaluées
//
// Si le blocage ne se déclenche PAS alors que tu es en local :
//   → Vérifie la valeur de "hostname" dans le tableau (peut être "" ou "0.0.0.0")
//   → Vérifie la valeur de "env MODE" (peut valoir "unknown" si import.meta absent)
//   → Dans ce cas, ajoute la valeur exacte du hostname dans localhostChecks
//
// En production, tu verras :
//   ✅ FIREBASE AUTORISÉ — Raison : PRODUCTION_OK
// ══════════════════════════════════════════════════════════════════════
