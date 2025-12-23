import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

// Firebase client configuration (non-secret, safe to keep in client)
const firebaseConfig = {
  apiKey: 'AIzaSyAB7L5KOHj7hEfX_s75GIiCKCzYwfh-EfY',
  // Default hosted auth domain; ensure this matches Firebase Console settings
  authDomain: 'baller-pro.firebaseapp.com',
  projectId: 'baller-pro',
  storageBucket: 'baller-pro.firebasestorage.app',
  messagingSenderId: '1003402954080',
  appId: '1:1003402954080:android:b691af5908396e52838a05',
};

// Ensure Firebase initializes exactly once
let app;
if (getApps().length === 0) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApp();
}

// Use React Native persistence so auth survives reloads in Expo
// For web, use standard getAuth. For React Native, use initializeAuth with AsyncStorage persistence
let firebaseAuthInstance;
if (Platform.OS === 'web') {
  firebaseAuthInstance = getAuth(app);
} else {
  // For React Native, use initializeAuth with AsyncStorage persistence
  // This ensures auth state persists across app restarts
  // Note: Must use initializeAuth (not getAuth) to enable persistence
  try {
    // Try to initialize with persistence - this will work if not already initialized
    firebaseAuthInstance = initializeAuth(app, {
      persistence: getReactNativePersistence(AsyncStorage),
    });
    console.log('[Firebase] Auth initialized with AsyncStorage persistence for React Native');
  } catch (err: any) {
    // If already initialized, get the existing instance
    // This can happen during hot reload or if auth was initialized elsewhere
    if (err?.code === 'auth/already-initialized') {
      firebaseAuthInstance = getAuth(app);
      console.log('[Firebase] Using existing auth instance (already initialized)');
    } else {
      // Re-throw unexpected errors
      throw err;
    }
  }
}

export const firebaseAuth = firebaseAuthInstance;
export const firebaseDb = getFirestore(app);
export const firebaseStorage = getStorage(app);
export default app;

