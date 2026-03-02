// ══════════════════════════════════════════════════════════════════════
// firebase.config.ts — Firebase Initialization (v10.8.0)
// ══════════════════════════════════════════════════════════════════════

import { initializeApp, FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getAuth, Auth } from 'firebase/auth';

// Configuration Firebase (identifiants fournis)
const firebaseConfig = {
  apiKey: "AIzaSyALV5ANppa9y_5Sck_1ZyO37rzh876NUv4",
  authDomain: "hotel-ecosystem.firebaseapp.com",
  projectId: "hotel-ecosystem",
  storageBucket: "hotel-ecosystem.firebasestorage.app",
  messagingSenderId: "723533151790",
  appId: "1:723533151790:web:4966abaa6f32ab170469bf",
  measurementId: "G-V0PHBY3E0B"
};

// Initialisation de l'application Firebase
let app: FirebaseApp;
let db: Firestore;
let auth: Auth;

try {
  app = initializeApp(firebaseConfig);
  db = getFirestore(app);
  auth = getAuth(app);
  
  console.log('✅ Firebase initialized successfully');
} catch (error) {
  console.error('❌ Firebase initialization error:', error);
  throw error;
}

// Exports pour utilisation dans le reste de l'app
export { app, db, auth };
