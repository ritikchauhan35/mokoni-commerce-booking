
import { 
  collection, 
  onSnapshot, 
  query, 
  where, 
  orderBy
} from 'firebase/firestore';
import { db } from '@/config/firebase';
import { Product, Property, Order } from '@/types';

export const subscribeToProducts = (callback: (products: Product[]) => void) => {
  const productsRef = collection(db, 'products');
  return onSnapshot(productsRef, (snapshot) => {
    const products = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
    callback(products);
  });
};

export const subscribeToProperties = (callback: (properties: Property[]) => void) => {
  const propertiesRef = collection(db, 'properties');
  return onSnapshot(propertiesRef, (snapshot) => {
    const properties = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Property));
    callback(properties);
  });
};

export const subscribeToUserOrders = (userId: string, callback: (orders: Order[]) => void) => {
  const ordersRef = collection(db, 'orders');
  const q = query(ordersRef, where('userId', '==', userId), orderBy('createdAt', 'desc'));
  return onSnapshot(q, (snapshot) => {
    const orders = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Order));
    callback(orders);
  });
};
