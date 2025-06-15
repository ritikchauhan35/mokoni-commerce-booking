
import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  limit,
  onSnapshot
} from 'firebase/firestore';
import { db } from '@/config/firebase';
import { Product, Property, CartItem, Order, Booking, Review } from '@/types';

// Products
export const getProducts = async (): Promise<Product[]> => {
  const productsRef = collection(db, 'products');
  const snapshot = await getDocs(productsRef);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
};

export const getProduct = async (id: string): Promise<Product | null> => {
  const productDoc = await getDoc(doc(db, 'products', id));
  return productDoc.exists() ? { id: productDoc.id, ...productDoc.data() } as Product : null;
};

export const addProduct = async (product: Omit<Product, 'id'>) => {
  return await addDoc(collection(db, 'products'), product);
};

// Properties
export const getProperties = async (): Promise<Property[]> => {
  const propertiesRef = collection(db, 'properties');
  const snapshot = await getDocs(propertiesRef);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Property));
};

// Cart
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

// Orders
export const createOrder = async (order: Omit<Order, 'id'>) => {
  return await addDoc(collection(db, 'orders'), order);
};

export const getUserOrders = async (userId: string): Promise<Order[]> => {
  const ordersRef = collection(db, 'orders');
  const q = query(ordersRef, where('userId', '==', userId), orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Order));
};
