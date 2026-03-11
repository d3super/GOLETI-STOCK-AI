import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, updateProfile } from 'firebase/auth';
import { getFirestore, doc, getDoc, setDoc, updateDoc, onSnapshot, serverTimestamp } from 'firebase/firestore';
import firebaseConfig from '../firebase-applet-config.json';

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

// Auth Helpers
export const logout = () => signOut(auth);

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL: string;
  analysisCount: number;
  lastAnalysisDate: string;
  createdAt: any;
}

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId: string | undefined;
    email: string | null | undefined;
    emailVerified: boolean | undefined;
    isAnonymous: boolean | undefined;
    tenantId: string | null | undefined;
    providerInfo: {
      providerId: string;
      displayName: string | null;
      email: string | null;
      photoUrl: string | null;
    }[];
  }
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData.map(provider => ({
        providerId: provider.providerId,
        displayName: provider.displayName,
        email: provider.email,
        photoUrl: provider.photoURL
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error Details: ', JSON.stringify(errInfo));
  return errInfo;
}

// Firestore Helpers
export const getUserProfile = async (uid: string, retries = 3): Promise<UserProfile | null> => {
  console.log(`getUserProfile called for ${uid}, retries left: ${retries}`);
  const docRef = doc(db, 'users', uid);
  try {
    const docSnap = await getDoc(docRef);
    console.log(`getUserProfile result for ${uid}: exists=${docSnap.exists()}`);
    return docSnap.exists() ? docSnap.data() as UserProfile : null;
  } catch (error: any) {
    console.error(`getUserProfile error for ${uid}:`, error.code, error.message);
    if (retries > 0 && error.code === 'permission-denied') {
      console.warn(`Permission denied for users/${uid}. Retrying... (${retries} attempts left)`);
      await new Promise(resolve => setTimeout(resolve, 1000)); // Increased delay
      return getUserProfile(uid, retries - 1);
    }
    handleFirestoreError(error, OperationType.GET, `users/${uid}`);
    throw error;
  }
};

export const createUserProfile = async (user: any) => {
  console.log(`createUserProfile called for ${user.uid}`);
  const docRef = doc(db, 'users', user.uid);
  const profile: UserProfile = {
    uid: user.uid,
    email: user.email || '',
    displayName: user.displayName || '',
    photoURL: user.photoURL || `https://api.dicebear.com/7.x/initials/svg?seed=${user.displayName || user.email}`,
    analysisCount: 0,
    lastAnalysisDate: new Date().toISOString().split('T')[0],
    createdAt: serverTimestamp(),
  };
  try {
    await setDoc(docRef, profile);
    console.log(`createUserProfile successful for ${user.uid}`);
    return profile;
  } catch (error: any) {
    console.error(`createUserProfile error for ${user.uid}:`, error.code, error.message);
    handleFirestoreError(error, OperationType.CREATE, `users/${user.uid}`);
    throw error;
  }
};

export const incrementAnalysisCount = async (uid: string, currentCount: number) => {
  const docRef = doc(db, 'users', uid);
  const today = new Date().toISOString().split('T')[0];
  try {
    await updateDoc(docRef, {
      analysisCount: currentCount + 1,
      lastAnalysisDate: today
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `users/${uid}`);
    throw error;
  }
};
