import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  onAuthStateChanged,
  User,
} from 'firebase/auth';
import { firebaseAuth } from './firebase';

export const signUp = async (email: string, password: string, displayName?: string) => {
  const cred = await createUserWithEmailAndPassword(firebaseAuth, email, password);
  if (displayName) {
    await updateProfile(cred.user, { displayName });
  }
  return cred.user;
};

export const signIn = async (email: string, password: string) => {
  const cred = await signInWithEmailAndPassword(firebaseAuth, email, password);
  return cred.user;
};

export const signOutUser = async () => {
  await signOut(firebaseAuth);
};

export const observeAuth = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(firebaseAuth, callback);
};

