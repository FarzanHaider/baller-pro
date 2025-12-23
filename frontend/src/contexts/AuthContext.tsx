// Authentication Context Provider
// Firebase-based authentication

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthState, LoginCredentials, RegisterCredentials, OnboardingData } from '@/types/auth';
import { signUp, signIn, signOutUser, observeAuth } from '@/services/firebaseAuth';
import { setUserDoc, getUserDoc } from '@/services/firebaseUser';
import { storage } from '@/services/auth/storage';
import { User as FirebaseUser } from 'firebase/auth';
import { firebaseAuth } from '@/services/firebase';
import { serverTimestamp } from 'firebase/firestore';
import { googleAuthService, GoogleAuthError } from '@/services/auth/googleAuth';

interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (credentials: RegisterCredentials) => Promise<void>;
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
      console.log('[AuthContext] signup-success-navigation: User registered, will navigate to onboarding');
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

  /**
   * Google Sign-In
   * Returns object with requiresLinking if account exists with different credential
   */
  const googleSignIn = async (): Promise<{ requiresLinking?: { email: string; provider: string } }> => {
    try {
      console.log('[AuthContext] google-signin-start');
      isProcessingAuth.current = true;
      setState(prev => ({ ...prev, isLoading: true }));

      // Attempt Google sign-in
      const fbUser = await googleAuthService.signIn();

      // Map Firebase user to our User type
      const user = await mapFirebaseUser(fbUser);
      
      // Update cache
      cachedOnboardingCompleted.current = user.onboardingCompleted;

      // Check if user document exists in Firestore, create if not
      try {
        const userDoc = await getUserDoc(fbUser.uid);
        if (!userDoc) {
          // Create user document if it doesn't exist
          await setUserDoc(fbUser.uid, {
            email: fbUser.email || '',
            name: fbUser.displayName || user.name,
            isEmailVerified: fbUser.emailVerified,
            onboarding: {
              completed: false,
            },
          });
        }
      } catch (firestoreError: any) {
        console.error('[AuthContext] Firestore error during Google sign-in:', firestoreError);
        // Continue even if Firestore fails
      }

      // Parallelize storage operations
      const onboardingData = await Promise.all([
        storage.saveUser(user),
        storage.saveToken(fbUser.uid),
        storage.getOnboardingData(),
      ]).then(([, , onboarding]) => onboarding);

      // Update auth state
      setState({
        user,
        isAuthenticated: true,
        isLoading: false,
        onboardingData: onboardingData || undefined,
      });

      console.log('[AuthContext] google-signin-success:', { uid: user.id, email: user.email });
      isProcessingAuth.current = false;
      
      return {}; // No linking required
    } catch (error: any) {
      console.error('[AuthContext] Google sign-in error:', error);
      
      isProcessingAuth.current = false;
      setState(prev => ({ ...prev, isLoading: false }));

      // Handle account-exists-with-different-credential
      if (error instanceof GoogleAuthError && error.code === 'auth/account-exists-with-different-credential') {
        return {
          requiresLinking: {
            email: error.existingEmail || '',
            provider: error.existingProvider || 'email/password',
          },
        };
      }

      // Handle other errors
      let errorMessage = 'Google sign-in failed. Please try again.';
      
      if (error instanceof GoogleAuthError) {
        if (error.code === 'auth/cancelled') {
          errorMessage = 'Google sign-in was cancelled';
        } else {
          errorMessage = error.message || errorMessage;
        }
      } else if (error.message) {
        errorMessage = error.message;
      }

      throw new Error(errorMessage);
    }
  };

  /**
   * Link Google account to existing email/password account
   * Requires user to be signed in with email/password first
   */
  const linkGoogleAccount = async (password: string): Promise<void> => {
    try {
      console.log('[AuthContext] link-google-account-start');
      isProcessingAuth.current = true;
      setState(prev => ({ ...prev, isLoading: true }));

      const currentUser = firebaseAuth.currentUser;
      if (!currentUser) {
        throw new Error('No user signed in. Please sign in with email/password first.');
      }

      // Verify user is signed in with email/password
      if (!currentUser.email || !currentUser.providerData.some(p => p.providerId === 'password')) {
        throw new Error('Account linking requires email/password authentication. Please sign in with email/password first.');
      }

      // Re-authenticate with password (required for linking)
      await googleAuthService.reauthenticateWithPassword(currentUser, password);

      // Link Google account
      const linkedUser = await googleAuthService.linkAccount(currentUser);

      // Map Firebase user to our User type
      const user = await mapFirebaseUser(linkedUser);
      
      // Update cache
      cachedOnboardingCompleted.current = user.onboardingCompleted;

      // Parallelize storage operations
      const onboardingData = await Promise.all([
        storage.saveUser(user),
        storage.saveToken(linkedUser.uid),
        storage.getOnboardingData(),
      ]).then(([, , onboarding]) => onboarding);

      // Update auth state
      setState({
        user,
        isAuthenticated: true,
        isLoading: false,
        onboardingData: onboardingData || undefined,
      });

      console.log('[AuthContext] link-google-account-success:', { uid: user.id });
      isProcessingAuth.current = false;
    } catch (error: any) {
      console.error('[AuthContext] Link Google account error:', error);
      
      isProcessingAuth.current = false;
      setState(prev => ({ ...prev, isLoading: false }));

      let errorMessage = 'Failed to link Google account. Please try again.';
      
      if (error instanceof GoogleAuthError) {
        errorMessage = error.message || errorMessage;
      } else if (error.message) {
        errorMessage = error.message;
      }

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
   * Complete onboarding - saves all onboarding data to Firestore in one atomic operation
   * This is called only at the end of step 5
   * 
   * Requirements:
   * - Saves all steps (1-5) in one atomic operation
   * - Uses serverTimestamp() for completedAt (server-side timestamp)
   * - Uses merge: true to prevent overwriting other user fields
   * - Guards against duplicate writes with isSavingOnboarding flag
   * - Only navigates after successful write
   * 
   * @param onboardingData - All onboarding steps data (1-5)
   */
  const completeOnboarding = async (onboardingData: {
    step1?: { gender: string };
    step2?: { goal: string; trainingLevel: string };
    step3?: { experienceLevel: string };
    step4?: { injuries: string[]; otherDetails: string };
    step5?: { goal: string };
  }) => {
    // Guard: prevent concurrent saves (duplicate write protection)
    if (isSavingOnboarding.current) {
      console.warn('[AuthContext] completeOnboarding: Already saving, skipping duplicate write');
      throw new Error('Onboarding save already in progress');
    }

    const currentUser = firebaseAuth.currentUser;
    if (!currentUser) {
      const error = new Error('User not authenticated');
      console.error('[AuthContext] onboarding-write-failed:', { error: error.message, step: 'auth-check' });
      throw error;
    }

    try {
      isSavingOnboarding.current = true;
      
      // Log start with detailed information
      console.log('[AuthContext] onboarding-write-start:', { 
        uid: currentUser.uid,
        email: currentUser.email,
        steps: Object.keys(onboardingData),
        stepCount: Object.keys(onboardingData).length,
        timestamp: new Date().toISOString()
      });

      // Prepare complete onboarding object with all steps (1-5) in one atomic operation
      // Use serverTimestamp() for completedAt to ensure server-side timestamp accuracy
      const onboardingPayload = {
        ...onboardingData, // All steps 1-5
        completed: true,
        completedAt: serverTimestamp(), // Server-side timestamp - will be converted by Firestore
      };

      // Atomic write: Save all onboarding data at once with merge: true
      // merge: true ensures we don't overwrite other user fields (email, name, etc.)
      await setUserDoc(currentUser.uid, {
        onboarding: onboardingPayload,
      });

      // Log success with details
      console.log('[AuthContext] onboarding-write-success:', { 
        uid: currentUser.uid,
        email: currentUser.email,
        stepsSaved: Object.keys(onboardingData),
        completedAt: 'serverTimestamp()', // Note: actual timestamp set by server
        timestamp: new Date().toISOString()
      });

      // Update user state - skip Firestore read since we just wrote the data
      const updatedUser = await mapFirebaseUser(
        currentUser, 
        undefined, 
        true, // skip Firestore read (we just wrote)
        true // onboarding is now completed
      );
      
      // Verify onboardingCompleted is set
      if (!updatedUser.onboardingCompleted) {
        throw new Error('Failed to set onboardingCompleted flag');
      }
      
      // Update cache to avoid future Firestore reads
      cachedOnboardingCompleted.current = true;
      
      // Save user to local storage first
      await storage.saveUser(updatedUser);
      
      // Update auth state - this triggers re-render and index.tsx navigation logic
      // Use functional update to ensure we have the latest state
      setState(prev => {
        const newState = {
          ...prev,
          user: updatedUser,
          onboardingData: undefined, // Clear local onboarding data
        };
        
        // Log state update - this will trigger index.tsx useEffect
        console.log('[AuthContext] onboardingCompleted-state-updated:', {
          uid: updatedUser.id,
          email: updatedUser.email,
          onboardingCompleted: updatedUser.onboardingCompleted,
          timestamp: new Date().toISOString()
        });
        
        return newState;
      });

      isSavingOnboarding.current = false;
      return updatedUser;
    } catch (error: any) {
      isSavingOnboarding.current = false;
      
      // Log failure with detailed error information
      console.error('[AuthContext] onboarding-write-failed:', {
        uid: currentUser?.uid,
        email: currentUser?.email,
        error: error?.message || 'Unknown error',
        errorCode: error?.code,
        errorStack: error?.stack,
        steps: Object.keys(onboardingData),
        timestamp: new Date().toISOString()
      });
      
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
        googleSignIn,
        linkGoogleAccount,
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

