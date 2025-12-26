// Authentication Context Provider
// Firebase-based authentication
// BACKUP CREATED: Production Migration Preparation
// DO NOT MODIFY - This is a backup of the current working version

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthState, LoginCredentials, RegisterCredentials, OnboardingData } from '@/types/auth';
import { signUp, signIn, signOutUser, observeAuth } from '@/services/firebaseAuth';
import { setUserDoc, getUserDoc } from '@/services/firebaseUser';
import { storage } from '@/services/auth/storage';
import { User as FirebaseUser } from 'firebase/auth';
import { firebaseAuth } from '@/services/firebase';
import { serverTimestamp } from 'firebase/firestore';

interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (credentials: RegisterCredentials) => Promise<void>;
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

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [state, setState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true, // Start as true to prevent premature navigation
  });

  // Flag to prevent double work during login/register
  const isProcessingAuth = React.useRef(false);
  // Flag to prevent concurrent onboarding saves
  const isSavingOnboarding = React.useRef(false);
  // Cache onboardingCompleted to avoid multiple Firestore reads
  const cachedOnboardingCompleted = React.useRef<boolean | null>(null);

  // Initialize - check for existing Firebase auth session
  useEffect(() => {
    let unsubscribe: (() => void) | null = null;

    const initializeAuth = async () => {
      try {
        // Check for persistent token first (faster than waiting for Firebase auth)
        const storedToken = await storage.getToken();
        if (storedToken) {
          console.log('[AuthContext] Found persistent token on init:', storedToken);
        }
        
        // Listen for auth state changes
        unsubscribe = observeAuth(async (fbUser) => {
          // Skip if we're actively processing login/register (prevents double work)
          if (isProcessingAuth.current) {
            console.log('[AuthContext] auth-listener-skip: isProcessingAuth=true');
            return;
          }

          if (fbUser) {
            try {
              // Use cached onboardingCompleted if available to avoid Firestore read
              const user = await mapFirebaseUser(
                fbUser,
                undefined,
                cachedOnboardingCompleted.current !== null, // skip read if cached
                cachedOnboardingCompleted.current ?? undefined // use cached value
              );
              
              // Update cache
              if (user.onboardingCompleted !== undefined) {
                cachedOnboardingCompleted.current = user.onboardingCompleted;
              }
              
              // Parallelize storage operations
              const [onboardingData] = await Promise.all([
                storage.getOnboardingData(),
                storage.saveUser(user),
              ]);
              
              setState({
                user,
                isAuthenticated: true,
                isLoading: false,
                onboardingData: onboardingData || undefined,
              });
            } catch (error) {
              console.error('[AuthContext] Error mapping user in auth listener:', error);
              setState({
                user: null,
                isAuthenticated: false,
                isLoading: false,
              });
            }
          } else {
            // No user signed in
            await storage.clearAll();
            setState({
              user: null,
              isAuthenticated: false,
              isLoading: false,
            });
          }
        });
      } catch (error) {
        console.error('[AuthContext] Initialization error:', error);
        setState(prev => ({ ...prev, isLoading: false }));
      }
    };

    initializeAuth();

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []);

  const login = async (credentials: LoginCredentials) => {
    try {
      console.log('[AuthContext] login-start:', { email: credentials.email });
      isProcessingAuth.current = true;
      setState(prev => ({ ...prev, isLoading: true }));

      // 1. Sign in with Firebase Auth
      const fbUser = await signIn(credentials.email, credentials.password);

      // 2. Map Firebase user to our User type
      const user = await mapFirebaseUser(fbUser);
      
      // 3. Update cache
      cachedOnboardingCompleted.current = user.onboardingCompleted;

      // 4. Parallelize storage operations (save user, token, and get onboarding data)
      const onboardingData = await Promise.all([
        storage.saveUser(user),
        storage.saveToken(fbUser.uid), // Store UID as persistent token
        storage.getOnboardingData(),
      ]).then(([, , onboarding]) => onboarding);

      // 5. Update auth state
      setState({
        user,
        isAuthenticated: true,
        isLoading: false,
        onboardingData: onboardingData || undefined,
      });

      console.log('[AuthContext] login-success:', { uid: user.id, email: user.email });
      isProcessingAuth.current = false;
      return user;
    } catch (error: any) {
      console.error('[AuthContext] Login error:', error);
      
      // Handle Firebase Auth errors
      let errorMessage = 'Failed to login. Please try again.';
      
      if (error.code) {
        switch (error.code) {
          case 'auth/user-not-found':
            errorMessage = 'No account found with this email. Please sign up.';
            break;
          case 'auth/wrong-password':
            errorMessage = 'Incorrect password. Please try again.';
            break;
          case 'auth/invalid-email':
            errorMessage = 'Invalid email address. Please check your email.';
            break;
          case 'auth/user-disabled':
            errorMessage = 'This account has been disabled. Please contact support.';
            break;
          case 'auth/too-many-requests':
            errorMessage = 'Too many failed attempts. Please try again later.';
            break;
          case 'auth/network-request-failed':
            errorMessage = 'Network error. Please check your internet connection.';
            break;
          case 'auth/invalid-credential':
            errorMessage = 'Invalid email or password. Please try again.';
            break;
          default:
            errorMessage = error.message || 'Login failed. Please try again.';
        }
      } else if (error.message) {
        errorMessage = error.message;
      }

      isProcessingAuth.current = false;
      setState(prev => ({ ...prev, isLoading: false }));
      throw new Error(errorMessage);
    }
  };

  /**
   * Map Firebase User to our User type
   * @param skipFirestoreRead - If true, skips Firestore read (use when we just wrote data)
   * @param knownOnboardingCompleted - If provided, uses this instead of reading from Firestore
   */
  const mapFirebaseUser = async (
    fbUser: FirebaseUser, 
    fallbackName?: string,
    skipFirestoreRead = false,
    knownOnboardingCompleted?: boolean
  ): Promise<User> => {
    const uid = fbUser.uid;
    
    // Try to get user doc from Firestore (skip if we just wrote data)
    let userDoc = null;
    if (!skipFirestoreRead) {
      try {
        userDoc = await getUserDoc(uid);
      } catch (error) {
        console.error('[AuthContext] mapFirebaseUser: getUserDoc error:', error);
        // Continue with null doc - will use Firebase Auth data
      }
    }

    const onboardingCompleted = knownOnboardingCompleted !== undefined 
      ? knownOnboardingCompleted 
      : Boolean(userDoc?.onboarding?.completed);
    
    const createdAt = userDoc?.createdAt 
      ? (userDoc.createdAt as any).toDate?.().toISOString() || new Date().toISOString()
      : new Date().toISOString();

    return {
      id: uid,
      email: fbUser.email || userDoc?.email || '',
      name: fbUser.displayName || userDoc?.name || fallbackName || fbUser.email?.split('@')[0] || '',
      avatar: userDoc?.avatar ?? null,
      isEmailVerified: fbUser.emailVerified ?? false,
      isPremium: false,
      onboardingCompleted,
      createdAt,
    };
  };

  const register = async (credentials: RegisterCredentials) => {
    try {
      console.log('[AuthContext] signup-start:', { email: credentials.email });
      isProcessingAuth.current = true;
      setState(prev => ({ ...prev, isLoading: true }));

      // 1. Create Firebase Auth user
      const fbUser = await signUp(credentials.email, credentials.password, credentials.name);

      // 2. Create user document in Firestore
      try {
        await setUserDoc(fbUser.uid, {
          email: credentials.email,
          name: credentials.name,
          isEmailVerified: fbUser.emailVerified,
          onboarding: {
            completed: false,
          },
        });
      } catch (firestoreError: any) {
        // If Firestore fails (offline), log but don't fail registration
        console.error('[AuthContext] Firestore save failed during signup:', firestoreError);
        // User is still created in Firebase Auth, so we continue
      }

      // 3. Map Firebase user to our User type (skip Firestore read since we just wrote)
      const user = await mapFirebaseUser(fbUser, credentials.name, true, false);
      
      // 4. Update cache
      cachedOnboardingCompleted.current = user.onboardingCompleted;

      // 5. Save user to local storage and persistent auth token
      await Promise.all([
        storage.saveUser(user),
        storage.saveToken(fbUser.uid), // Store UID as persistent token
      ]);

      // 6. Update auth state
      setState({
        user,
        isAuthenticated: true,
        isLoading: false,
        onboardingData: undefined,
      });

      console.log('[AuthContext] signup-success:', { uid: user.id, email: user.email });
      isProcessingAuth.current = false;
      return user;
    } catch (error: any) {
      console.error('[AuthContext] Register error:', error);
      
      // Handle Firebase Auth errors
      let errorMessage = 'Failed to register. Please try again.';
      
      if (error.code) {
        switch (error.code) {
          case 'auth/email-already-in-use':
            errorMessage = 'This email is already registered. Please login instead.';
            break;
          case 'auth/invalid-email':
            errorMessage = 'Invalid email address. Please check your email.';
            break;
          case 'auth/weak-password':
            errorMessage = 'Password is too weak. Please use a stronger password (at least 6 characters).';
            break;
          case 'auth/operation-not-allowed':
            errorMessage = 'Email/password accounts are not enabled. Please contact support.';
            break;
          case 'auth/network-request-failed':
            errorMessage = 'Network error. Please check your internet connection.';
            break;
          default:
            errorMessage = error.message || 'Registration failed. Please try again.';
        }
      } else if (error.message) {
        errorMessage = error.message;
      }

      isProcessingAuth.current = false;
      setState(prev => ({ ...prev, isLoading: false }));
      throw new Error(errorMessage);
    }
  };

  const logout = async () => {
    try {
      await signOutUser();
      // Clear cache
      cachedOnboardingCompleted.current = null;
      // Clear all storage including persistent token
      await storage.clearAll();
      setState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        onboardingData: undefined,
      });
    } catch (error) {
      console.error('[AuthContext] Logout error:', error);
      // Clear cache and state even if Firebase logout fails
      cachedOnboardingCompleted.current = null;
      await storage.clearAll();
      setState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        onboardingData: undefined,
      });
    }
  };

  const updateOnboardingData = async (data: Partial<OnboardingData>) => {
    // TODO: Add Firebase onboarding data save logic here
    console.log('[AuthContext] Update onboarding data:', data);
    const currentData = state.onboardingData || {};
    const updatedData = { ...currentData, ...data };
    setState(prev => ({
      ...prev,
      onboardingData: updatedData,
    }));
  };

  /**
   * Complete onboarding - saves all onboarding data to Firestore at once
   * This is called only at the end of step 5
   * @param onboardingData - All onboarding steps data
   */
  const completeOnboarding = async (onboardingData: {
    step1?: { gender: string };
    step2?: { goal: string; trainingLevel: string };
    step3?: { experienceLevel: string };
    step4?: { injuries: string[]; otherDetails: string };
    step5?: { goal: string };
  }) => {
    // Guard: prevent concurrent saves
    if (isSavingOnboarding.current) {
      console.warn('[AuthContext] completeOnboarding: Already saving, skipping');
      return;
    }

    try {
      isSavingOnboarding.current = true;
      console.log('[AuthContext] onboarding-write-start:', { 
        uid: firebaseAuth.currentUser?.uid,
        steps: Object.keys(onboardingData)
      });

      const currentUser = firebaseAuth.currentUser;
      if (!currentUser) {
        throw new Error('User not authenticated');
      }

      // Save all onboarding data to Firestore at once with merge: true
      // Use serverTimestamp() for completedAt to ensure server-side timestamp
      await setUserDoc(currentUser.uid, {
        onboarding: {
          ...onboardingData,
          completed: true,
          completedAt: serverTimestamp(), // Use serverTimestamp() instead of new Date()
        },
      });

      console.log('[AuthContext] onboarding-write-success:', { uid: currentUser.uid });

      // Update user state - skip Firestore read since we just wrote the data
      const updatedUser = await mapFirebaseUser(
        currentUser, 
        undefined, 
        true, // skip Firestore read
        true // onboarding is now completed
      );
      
      // Update cache
      cachedOnboardingCompleted.current = true;
      
      // Save user and update state
      await storage.saveUser(updatedUser);
      
      setState(prev => ({
        ...prev,
        user: updatedUser,
        onboardingData: undefined,
      }));

      isSavingOnboarding.current = false;
      return updatedUser;
    } catch (error) {
      isSavingOnboarding.current = false;
      console.error('[AuthContext] onboarding-write-failed:', error);
      throw error;
    }
  };

  const refreshUser = async () => {
    // TODO: Add Firebase refresh user logic here
    console.log('[AuthContext] Refresh user called');
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        register,
        logout,
        updateOnboardingData,
        completeOnboarding,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

