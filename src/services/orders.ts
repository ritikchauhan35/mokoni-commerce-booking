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
import { sendOrderNotification, sendOrderStatusNotification } from './notifications';
import { getSettings } from './settings';

export const createOrder = async (order: Omit<Order, 'id'>) => {
  const orderRef = await addDoc(collection(db, 'orders'), {
    ...order,
    createdAt: serverTimestamp()
  });

  // Send notification to admin
  try {
    const settings = await getSettings();
    if (settings.notifications) {
      await sendOrderNotification({
        orderId: orderRef.id,
        customerName: order.userId, // In real app, you'd get actual customer name
        total: order.total,
        status: order.status,
        items: order.items.map(item => ({
          name: item.productId, // In real app, you'd get actual product name
          quantity: item.quantity,
          price: item.price
        }))
      }, settings.notifications);
    }
  } catch (error) {
    console.error('Failed to send order notification:', error);
  }

  return orderRef;
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
  await updateDoc(doc(db, 'orders', orderId), { status });

  // Send status update notification
  try {
    const settings = await getSettings();
    if (settings.notifications) {
      await sendOrderStatusNotification(orderId, status, '', settings.notifications);
    }
  } catch (error) {
    console.error('Failed to send status update notification:', error);
  }
};
