
import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  serverTimestamp
} from 'firebase/firestore';
import { db } from '@/config/firebase';
import { Property } from '@/types';

export const getProperties = async (): Promise<Property[]> => {
  const propertiesRef = collection(db, 'properties');
  const snapshot = await getDocs(propertiesRef);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Property));
};

export const getProperty = async (id: string): Promise<Property | null> => {
  const propertyDoc = await getDoc(doc(db, 'properties', id));
  return propertyDoc.exists() ? { id: propertyDoc.id, ...propertyDoc.data() } as Property : null;
};

export const addProperty = async (property: Omit<Property, 'id'>) => {
  return await addDoc(collection(db, 'properties'), {
    ...property,
    createdAt: serverTimestamp()
  });
};

export const updateProperty = async (id: string, updates: Partial<Property>) => {
  return await updateDoc(doc(db, 'properties', id), updates);
};

export const deleteProperty = async (id: string) => {
  return await deleteDoc(doc(db, 'properties', id));
};

export const getAllProperties = async (): Promise<Property[]> => {
  return await getProperties();
};
