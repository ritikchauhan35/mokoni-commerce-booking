
import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  updateDoc, 
  setDoc, 
  serverTimestamp
} from 'firebase/firestore';
import { db } from '@/config/firebase';
import { User } from '@/types';

export const createUserProfile = async (userId: string, userData: Omit<User, 'id'>) => {
  return await setDoc(doc(db, 'users', userId), {
    ...userData,
    createdAt: serverTimestamp()
  });
};

export const getUserProfile = async (userId: string): Promise<User | null> => {
  const userDoc = await getDoc(doc(db, 'users', userId));
  return userDoc.exists() ? { id: userDoc.id, ...userDoc.data() } as User : null;
};

export const updateUserProfile = async (userId: string, updates: Partial<User>) => {
  return await updateDoc(doc(db, 'users', userId), updates);
};

export const getAllUsers = async (): Promise<User[]> => {
  const usersRef = collection(db, 'users');
  const snapshot = await getDocs(usersRef);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as User));
};
