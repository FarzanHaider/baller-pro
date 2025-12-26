import { User as FirebaseUser } from 'firebase/auth';
import { signIn, signOutUser, signUp, observeAuth } from '@/services/firebaseAuth';
import { getUserDoc, setUserDoc } from '@/services/firebaseUser';
import { storage } from './storage';
import { User, LoginCredentials, RegisterCredentials } from '@/types/auth';

const mapUser = async (fbUser: FirebaseUser, fallbackDoc?: any): Promise<User> => {
  const uid = fbUser.uid;
  let doc = fallbackDoc;
  
  // Try to fetch doc if not provided, but don't fail if offline
  if (!doc) {
    try {
      doc = await getUserDoc(uid);
    } catch (error: any) {
      // If offline or error, use empty doc (will use Firebase user data)
      console.warn('[mapUser] Failed to fetch user doc (may be offline):', error.message);
      doc = null;
    }
  }
  
  const onboardingCompleted = Boolean(doc?.onboarding?.completed);

  return {
    id: uid,
    email: fbUser.email || doc?.email || '',
    name: fbUser.displayName || doc?.name || fbUser.email?.split('@')[0] || '',
    avatar: doc?.avatar ?? null,
    isEmailVerified: fbUser.emailVerified ?? false,
    isPremium: false,
    onboardingCompleted,
    createdAt: doc?.createdAt ?? undefined,
  };
};

export const authServiceFirebase = {
  async register(credentials: RegisterCredentials): Promise<User> {
    const fbUser = await signUp(credentials.email, credentials.password, credentials.name);
    
    // Prepare user doc data
    const userDocData = {
      email: credentials.email,
      name: credentials.name,
      isEmailVerified: fbUser.emailVerified,
      onboarding: { completed: false },
    };
    
    // Try to create Firestore doc, but don't fail if offline
    try {
      await setUserDoc(fbUser.uid, userDocData);
    } catch (error: any) {
      console.warn('[authServiceFirebase] Failed to save user doc (may be offline):', error.message);
      // Continue anyway - user is created in Firebase Auth
    }
    
    // Map user using the data we just set (or fetch if available)
    const user = await mapUser(fbUser, userDocData);
    await storage.saveUser(user);
    // Tokens not required for Firebase; clear any old tokens
    await storage.saveToken('');
    await storage.saveRefreshToken('');
    return user;
  },

  async login(credentials: LoginCredentials): Promise<User> {
    const fbUser = await signIn(credentials.email, credentials.password);
    const user = await mapUser(fbUser);
    await storage.saveUser(user);
    await storage.saveToken('');
    await storage.saveRefreshToken('');
    return user;
  },

  async logout(): Promise<void> {
    await signOutUser();
    await storage.clearAll();
  },

  async getCurrentUser(): Promise<User | null> {
    const stored = await storage.getUser();
    if (stored) return stored;
    // Try Firebase current user if present
    const unsubscribe = observeAuth(async (fbUser) => {
      if (fbUser) {
        const user = await mapUser(fbUser);
        await storage.saveUser(user);
      }
    });
    unsubscribe(); // one-shot
    return await storage.getUser();
  },

  async getToken(): Promise<string | null> {
    // Not needed with Firebase; return empty string to satisfy callers
    return '';
  },

  async clearAuth(): Promise<void> {
    await storage.clearAll();
  },

  async updateUser(updates: Partial<User>): Promise<User> {
    const current = await storage.getUser();
    if (!current) throw new Error('No authenticated user');
    const merged: User = { ...current, ...updates };
    await storage.saveUser(merged);
    if (updates.name || updates.avatar) {
      await setUserDoc(current.id, {
        name: updates.name,
        avatar: updates.avatar,
      });
    }
    return merged;
  },

  async completeOnboarding(): Promise<User> {
    const current = await storage.getUser();
    if (!current) throw new Error('No authenticated user');
    await setUserDoc(current.id, {
      onboarding: { ...(current as any).onboarding, completed: true, completedAt: new Date() },
    });
    const updated = { ...current, onboardingCompleted: true };
    await storage.saveUser(updated);
    return updated;
  },
};

