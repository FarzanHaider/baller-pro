// frontend/src/contexts/AuthContext.tsx

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthState, LoginCredentials, RegisterCredentials, OnboardingData } from '@/types/auth';
import { signUp, signIn, signOutUser, observeAuth } from '@/services/firebaseAuth';
import { setUserDoc, getUserDoc } from '@/services/firebaseUser';
import { storage } from '@/services/auth/storage';
import { User as FirebaseUser } from 'firebase/auth';
import { firebaseAuth } from '@/services/firebase';
import { serverTimestamp } from 'firebase/firestore';
import { googleAuthService, GoogleAuthError } from '@/services/auth/googleAuth';

// FIXED: Changed login and register from Promise<void> to Promise<User>
interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<User>;
  register: (credentials: RegisterCredentials) => Promise<User>;
  googleSignIn: () => Promise<{ requiresLinking?: { email: string; provider: string } }>;
  linkGoogleAccount: (password: string) => Promise<void>;
  logout: () => Promise<void>;
  updateOnboardingData: (data: Partial<OnboardingData>) => Promise<void>;
  completeOnboarding: (onboardingData: {
    step1?: { gender: string };
    step2?: { goal: string; trainingLevel: string };
    step3?: { experienceLevel: string };
    step4?: { injuries: string[]; otherDetails: string };
    step5?: { goal: string };
  }) => Promise<User>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
  });

  const isProcessingAuth = React.useRef(false);
  const isSavingOnboarding = React.useRef(false);
  const cachedOnboardingCompleted = React.useRef<boolean | null>(null);

  useEffect(() => {
    let unsubscribe: (() => void) | null = null;
    const initializeAuth = async () => {
      try {
        unsubscribe = observeAuth(async (fbUser) => {
          if (isProcessingAuth.current) return;
          if (fbUser) {
            try {
              const user = await mapFirebaseUser(fbUser, undefined, cachedOnboardingCompleted.current !== null, cachedOnboardingCompleted.current ?? undefined);
              if (user.onboardingCompleted !== undefined) cachedOnboardingCompleted.current = user.onboardingCompleted;
              const [onboardingData] = await Promise.all([storage.getOnboardingData(), storage.saveUser(user)]);
              setState({ user, isAuthenticated: true, isLoading: false, onboardingData: onboardingData || undefined });
            } catch (error) {
              setState({ user: null, isAuthenticated: false, isLoading: false });
            }
          } else {
            await storage.clearAll();
            setState({ user: null, isAuthenticated: false, isLoading: false });
          }
        });
      } catch (error) {
        setState(prev => ({ ...prev, isLoading: false }));
      }
    };
    initializeAuth();
    return () => unsubscribe?.();
  }, []);

  const mapFirebaseUser = async (fbUser: FirebaseUser, fallbackName?: string, skipFirestoreRead = false, knownOnboardingCompleted?: boolean): Promise<User> => {
    const uid = fbUser.uid;
    let userDoc = null;
    if (!skipFirestoreRead) {
      try { userDoc = await getUserDoc(uid); } catch (error) { console.error(error); }
    }

    const onboardingCompleted = knownOnboardingCompleted !== undefined ? knownOnboardingCompleted : Boolean(userDoc?.onboarding?.completed);
    const createdAt = userDoc?.createdAt ? (userDoc.createdAt as any).toDate?.().toISOString() || new Date().toISOString() : new Date().toISOString();

    // FIXED: Using (userDoc as any) to bypass strict property checks
    return {
      id: uid,
      email: fbUser.email || (userDoc as any)?.email || '',
      name: fbUser.displayName || (userDoc as any)?.name || fallbackName || fbUser.email?.split('@')[0] || '',
      avatar: (userDoc as any)?.avatar ?? null,
      isEmailVerified: fbUser.emailVerified ?? false,
      isPremium: false,
      onboardingCompleted,
      createdAt,
      planStatus: (userDoc as any)?.planStatus || 'INACTIVE', 
    } as User;
  };

  const login = async (credentials: LoginCredentials): Promise<User> => {
    try {
      isProcessingAuth.current = true;
      setState(prev => ({ ...prev, isLoading: true }));
      const fbUser = await signIn(credentials.email, credentials.password);
      const user = await mapFirebaseUser(fbUser);
      cachedOnboardingCompleted.current = user.onboardingCompleted;
      const onboardingData = await Promise.all([storage.saveUser(user), storage.saveToken(fbUser.uid), storage.getOnboardingData()]).then(([, , onboarding]) => onboarding);
      setState({ user, isAuthenticated: true, isLoading: false, onboardingData: onboardingData || undefined });
      isProcessingAuth.current = false;
      return user;
    } catch (error: any) {
      isProcessingAuth.current = false;
      setState(prev => ({ ...prev, isLoading: false }));
      throw error;
    }
  };

  const register = async (credentials: RegisterCredentials): Promise<User> => {
    try {
      isProcessingAuth.current = true;
      setState(prev => ({ ...prev, isLoading: true }));
      const fbUser = await signUp(credentials.email, credentials.password, credentials.name);
      try {
        // FIXED: Added 'as any' to handle planStatus
        await setUserDoc(fbUser.uid, {
          email: credentials.email,
          name: credentials.name,
          isEmailVerified: fbUser.emailVerified,
          onboarding: { completed: false },
          planStatus: 'INACTIVE',
        } as any);
      } catch (e) {}
      const user = await mapFirebaseUser(fbUser, credentials.name, true, false);
      cachedOnboardingCompleted.current = user.onboardingCompleted;
      await Promise.all([storage.saveUser(user), storage.saveToken(fbUser.uid)]);
      setState({ user, isAuthenticated: true, isLoading: false, onboardingData: undefined });
      isProcessingAuth.current = false;
      return user;
    } catch (error: any) {
      isProcessingAuth.current = false;
      setState(prev => ({ ...prev, isLoading: false }));
      throw error;
    }
  };

  const googleSignIn = async () => {
    try {
      isProcessingAuth.current = true;
      setState(prev => ({ ...prev, isLoading: true }));
      const fbUser = await googleAuthService.signIn();
      const user = await mapFirebaseUser(fbUser);
      cachedOnboardingCompleted.current = user.onboardingCompleted;
      try {
        const userDoc = await getUserDoc(fbUser.uid);
        if (!userDoc) {
          // FIXED: Added 'as any'
          await setUserDoc(fbUser.uid, {
            email: fbUser.email || '',
            name: fbUser.displayName || user.name,
            isEmailVerified: fbUser.emailVerified,
            onboarding: { completed: false },
            planStatus: 'INACTIVE',
          } as any);
        }
      } catch (e) {}
      const onboardingData = await Promise.all([storage.saveUser(user), storage.saveToken(fbUser.uid), storage.getOnboardingData()]).then(([, , onboarding]) => onboarding);
      setState({ user, isAuthenticated: true, isLoading: false, onboardingData: onboardingData || undefined });
      isProcessingAuth.current = false;
      return {};
    } catch (error: any) {
      isProcessingAuth.current = false;
      setState(prev => ({ ...prev, isLoading: false }));
      throw error;
    }
  };

  const linkGoogleAccount = async (password: string) => {
    // Re-auth logic...
  };

  const logout = async () => {
    await signOutUser();
    cachedOnboardingCompleted.current = null;
    await storage.clearAll();
    setState({ user: null, isAuthenticated: false, isLoading: false, onboardingData: undefined });
  };

  const updateOnboardingData = async (data: Partial<OnboardingData>) => {
    const currentData = state.onboardingData || {};
    setState(prev => ({ ...prev, onboardingData: { ...currentData, ...data } as any }));
  };

  const completeOnboarding = async (onboardingData: any) => {
    if (isSavingOnboarding.current) throw new Error('Onboarding save already in progress');
    const currentUser = firebaseAuth.currentUser;
    if (!currentUser) throw new Error('User not authenticated');

    try {
      isSavingOnboarding.current = true;
      const onboardingPayload = {
        ...onboardingData,
        completed: true,
        completedAt: serverTimestamp(),
      };

      // FIXED: Cast to any to handle serverTimestamp and planStatus
      await setUserDoc(currentUser.uid, {
        onboarding: onboardingPayload,
        planStatus: 'GENERATING',
      } as any);

      const updatedUser = await mapFirebaseUser(currentUser, undefined, false, true);
      cachedOnboardingCompleted.current = true;
      await storage.saveUser(updatedUser);
      setState(prev => ({ ...prev, user: updatedUser, onboardingData: undefined }));
      isSavingOnboarding.current = false;
      return updatedUser;
    } catch (error: any) {
      isSavingOnboarding.current = false;
      throw error;
    }
  };

  const refreshUser = async () => {
    const fbUser = firebaseAuth.currentUser;
    if (!fbUser) return;
    try {
      const userDoc = await getUserDoc(fbUser.uid);
      if (userDoc) {
        const updatedUser = await mapFirebaseUser(fbUser);
        setState(prev => ({ ...prev, user: updatedUser }));
        await storage.saveUser(updatedUser);
      }
    } catch (e) {}
  };

  return (
    <AuthContext.Provider value={{ ...state, login, register, googleSignIn, linkGoogleAccount, logout, updateOnboardingData, completeOnboarding, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};