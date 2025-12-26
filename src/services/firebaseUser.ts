import {
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { firebaseDb } from './firebase';

// Firestore user document shape, aligned to current onboarding needs.
export type FirestoreOnboarding = {
  step1?: { gender?: string };
  step2?: { goal?: string; trainingLevel?: string };
  step3?: { experienceLevel?: string };
  step4?: { injuries?: string[]; otherDetails?: string };
  step5?: { goal?: string };
  completed?: boolean;
  completedAt?: Date;
};

export type FirestoreUser = {
  email?: string;
  name?: string;
  avatar?: string | null;
  isEmailVerified?: boolean;
  onboarding?: FirestoreOnboarding;
  createdAt?: Date;
  updatedAt?: Date;
};

const userDocRef = (uid: string) => doc(firebaseDb, 'users', uid);

// Remove any undefined values so Firestore setDoc doesn't error
const removeUndefined = (value: any): any => {
  if (Array.isArray(value)) {
    return value.map(removeUndefined);
  }
  if (value && typeof value === 'object') {
    const cleaned: Record<string, any> = {};
    Object.entries(value).forEach(([k, v]) => {
      if (v !== undefined) {
        cleaned[k] = removeUndefined(v);
      }
    });
    return cleaned;
  }
  return value;
};

export const getUserDoc = async (uid: string) => {
  try {
    const snap = await getDoc(userDocRef(uid));
    return snap.exists() ? snap.data() : null;
  } catch (error) {
    console.error('[firebaseUser] getUserDoc error:', error);
    throw error;
  }
};

export const setUserDoc = async (uid: string, data: Partial<FirestoreUser>) => {
  try {
    // Remove undefined values (but preserve serverTimestamp() FieldValue objects)
    // serverTimestamp() returns a FieldValue which is not undefined, so it's preserved
    const cleaned = removeUndefined(data) as Partial<FirestoreUser>;
    
    // Add timeout warning for setDoc (10 seconds)
    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => {
        reject(new Error('setDoc timeout after 10s'));
      }, 10000);
    });
    
    // Prepare data with serverTimestamp for timestamps
    // Note: serverTimestamp() returns a FieldValue that Firestore will convert server-side
    const dataToWrite: any = {
      ...cleaned,
      updatedAt: serverTimestamp(), // Always update updatedAt
    };
    
    // Only set createdAt if it doesn't exist (preserve original creation time)
    if (!cleaned.createdAt) {
      dataToWrite.createdAt = serverTimestamp();
    }
    
    // Atomic write with merge: true to prevent overwriting existing fields
    // merge: true ensures we only update specified fields, not replace entire document
    const setDocPromise = setDoc(
      userDocRef(uid),
      dataToWrite,
      { merge: true } // Critical: prevents overwriting other user fields
    );
    
    // Race against timeout to detect slow writes
    await Promise.race([setDocPromise, timeoutPromise]).catch((error: any) => {
      if (error?.message?.includes('timeout')) {
        console.warn('[firebaseUser] setDoc timeout warning:', {
          uid,
          dataKeys: Object.keys(cleaned),
          timestamp: new Date().toISOString(),
        });
      }
      throw error;
    });
  } catch (error) {
    console.error('[firebaseUser] setUserDoc error:', {
      uid,
      error: error instanceof Error ? error.message : 'Unknown error',
      errorCode: (error as any)?.code,
    });
    throw error;
  }
};

