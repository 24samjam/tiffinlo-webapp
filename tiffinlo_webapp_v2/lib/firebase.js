// lib/firebase.js. Firebase init for auth and firestore. Client side, fail safe.
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const config = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

let _auth = null;
let _db = null;

// Only init in the browser, and never crash the app if keys are missing.
if (typeof window !== 'undefined' && config.apiKey) {
  try {
    const app = getApps().length ? getApp() : initializeApp(config);
    _auth = getAuth(app);
    _db = getFirestore(app);
  } catch (e) {
    console.warn('Firebase not configured yet. Add keys to .env.local. See SETUP_BACKEND.md');
  }
}

export const auth = _auth;
export const db = _db;
