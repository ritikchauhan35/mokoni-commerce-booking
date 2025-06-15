
import { 
  collection, 
  doc, 
  getDocs, 
  addDoc, 
  updateDoc, 
  query, 
  where, 
  orderBy, 
  serverTimestamp
} from 'firebase/firestore';
import { db } from '@/config/firebase';
import { Order } from '@/types';

export const createOrder = async (order: Omit<Order, 'id'>) => {
  return await addDoc(collection(db, 'orders'), {
    ...order,
    createdAt: serverTimestamp()
  });
};

export const getUserOrders = async (userId: string): Promise<Order[]> => {
  const ordersRef = collection(db, 'orders');
  const q = query(ordersRef, where('userId', '==', userId), orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Order));
};

export const getAllOrders = async (): Promise<Order[]> => {
  const ordersRef = collection(db, 'orders');
  const q = query(ordersRef, orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Order));
};

export const updateOrderStatus = async (orderId: string, status: Order['status']) => {
  return await updateDoc(doc(db, 'orders', orderId), { status });
};
