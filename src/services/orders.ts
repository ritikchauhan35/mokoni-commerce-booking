
import { 
  collection, 
  doc, 
  getDocs, 
  addDoc, 
  updateDoc, 
  query, 
  where, 
  orderBy, 
  serverTimestamp,
  Timestamp
} from 'firebase/firestore';
import { db } from '@/config/firebase';
import { Order } from '@/types';
import { sendOrderNotification, sendOrderStatusNotification } from './notifications';
import { getSettings } from './settings';

export const createOrder = async (order: Omit<Order, 'id'>) => {
  const orderData = {
    ...order,
    createdAt: serverTimestamp(),
    orderDate: new Date().toISOString(), // Add human-readable date
    orderNumber: generateOrderNumber() // Add order number
  };

  const orderRef = await addDoc(collection(db, 'orders'), orderData);

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

// Generate a human-readable order number
const generateOrderNumber = (): string => {
  const now = new Date();
  const year = now.getFullYear().toString().slice(-2);
  const month = (now.getMonth() + 1).toString().padStart(2, '0');
  const day = now.getDate().toString().padStart(2, '0');
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `ORD${year}${month}${day}${random}`;
};

export const getUserOrders = async (userId: string): Promise<Order[]> => {
  const ordersRef = collection(db, 'orders');
  const q = query(ordersRef, where('userId', '==', userId), orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => {
    const data = doc.data();
    return {
      id: doc.id,
      ...data,
      // Convert Firestore timestamp to Date
      createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate() : data.createdAt
    } as Order;
  });
};

export const getAllOrders = async (): Promise<Order[]> => {
  const ordersRef = collection(db, 'orders');
  const q = query(ordersRef, orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => {
    const data = doc.data();
    return {
      id: doc.id,
      ...data,
      // Convert Firestore timestamp to Date
      createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate() : data.createdAt
    } as Order;
  });
};

export const updateOrderStatus = async (orderId: string, status: Order['status']) => {
  await updateDoc(doc(db, 'orders', orderId), { 
    status,
    updatedAt: serverTimestamp()
  });

  // Send status update notification
  try {
    const settings = await getSettings();
    if (settings.notifications) {
      await sendOrderStatusNotification(
        orderId, 
        status, 
        '', // customerEmail - In real app, you'd get customer email from order data
        '', // customerName - In real app, you'd get customer name from order data
        settings.notifications
      );
    }
  } catch (error) {
    console.error('Failed to send status update notification:', error);
  }
};
