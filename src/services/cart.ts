
import { 
  collection, 
  doc, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  serverTimestamp
} from 'firebase/firestore';
import { db } from '@/config/firebase';
import { CartItem } from '@/types';

export const getCartItems = async (userId: string): Promise<CartItem[]> => {
  const cartRef = collection(db, 'cart');
  const q = query(cartRef, where('userId', '==', userId));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as CartItem));
};

export const addToCart = async (item: Omit<CartItem, 'id'>) => {
  return await addDoc(collection(db, 'cart'), {
    ...item,
    addedAt: serverTimestamp()
  });
};

export const updateCartItem = async (itemId: string, quantity: number) => {
  return await updateDoc(doc(db, 'cart', itemId), { quantity });
};

export const removeFromCart = async (itemId: string) => {
  return await deleteDoc(doc(db, 'cart', itemId));
};
