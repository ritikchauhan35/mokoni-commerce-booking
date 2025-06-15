
import { 
  collection, 
  doc, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  writeBatch
} from 'firebase/firestore';
import { db } from '@/config/firebase';
import { CartItem } from '@/types';

export const getCartItems = async (userId: string): Promise<CartItem[]> => {
  const cartRef = collection(db, 'cart');
  const q = query(cartRef, where('userId', '==', userId));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as CartItem));
};

export const addToCart = async (cartItem: Omit<CartItem, 'id'>) => {
  return await addDoc(collection(db, 'cart'), cartItem);
};

export const updateCartItem = async (id: string, quantity: number) => {
  return await updateDoc(doc(db, 'cart', id), { quantity });
};

export const removeFromCart = async (id: string) => {
  return await deleteDoc(doc(db, 'cart', id));
};

export const clearCart = async (userId: string) => {
  const cartRef = collection(db, 'cart');
  const q = query(cartRef, where('userId', '==', userId));
  const snapshot = await getDocs(q);
  
  const batch = writeBatch(db);
  snapshot.docs.forEach((document) => {
    batch.delete(document.ref);
  });
  
  return await batch.commit();
};
