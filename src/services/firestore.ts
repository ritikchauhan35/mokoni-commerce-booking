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
  onSnapshot,
  writeBatch,
  serverTimestamp,
  setDoc
} from 'firebase/firestore';
import { db } from '@/config/firebase';
import { Product, Property, CartItem, Order, Booking, Review, User } from '@/types';

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
  return await addDoc(collection(db, 'products'), {
    ...product,
    createdAt: serverTimestamp()
  });
};

export const updateProduct = async (id: string, updates: Partial<Product>) => {
  return await updateDoc(doc(db, 'products', id), updates);
};

export const deleteProduct = async (id: string) => {
  return await deleteDoc(doc(db, 'products', id));
};

export const getProductsByCategory = async (category: string): Promise<Product[]> => {
  const productsRef = collection(db, 'products');
  const q = query(productsRef, where('category', '==', category));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
};

// Properties
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

export const getPropertiesByLocation = async (location: string): Promise<Property[]> => {
  const propertiesRef = collection(db, 'properties');
  const q = query(propertiesRef, where('location', '==', location));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Property));
};

// Cart Management
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

// Orders
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

// Bookings
export const createBooking = async (booking: Omit<Booking, 'id'>) => {
  return await addDoc(collection(db, 'bookings'), {
    ...booking,
    createdAt: serverTimestamp()
  });
};

export const getUserBookings = async (userId: string): Promise<Booking[]> => {
  const bookingsRef = collection(db, 'bookings');
  const q = query(bookingsRef, where('userId', '==', userId), orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Booking));
};

export const getAllBookings = async (): Promise<Booking[]> => {
  const bookingsRef = collection(db, 'bookings');
  const q = query(bookingsRef, orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Booking));
};

export const updateBookingStatus = async (bookingId: string, status: Booking['status']) => {
  return await updateDoc(doc(db, 'bookings', bookingId), { status });
};

// Reviews
export const getProductReviews = async (productId: string): Promise<Review[]> => {
  const reviewsRef = collection(db, 'reviews');
  const q = query(reviewsRef, where('productId', '==', productId), orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Review));
};

export const getPropertyReviews = async (propertyId: string): Promise<Review[]> => {
  const reviewsRef = collection(db, 'reviews');
  const q = query(reviewsRef, where('propertyId', '==', propertyId), orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Review));
};

export const addReview = async (review: Omit<Review, 'id'>) => {
  return await addDoc(collection(db, 'reviews'), {
    ...review,
    createdAt: serverTimestamp()
  });
};

// User Management
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

// Categories (for filtering)
export const getProductCategories = async (): Promise<string[]> => {
  const productsRef = collection(db, 'products');
  const snapshot = await getDocs(productsRef);
  const categories = new Set<string>();
  
  snapshot.docs.forEach(doc => {
    const product = doc.data() as Product;
    categories.add(product.category);
  });
  
  return Array.from(categories).sort();
};

export const getPropertyLocations = async (): Promise<string[]> => {
  const propertiesRef = collection(db, 'properties');
  const snapshot = await getDocs(propertiesRef);
  const locations = new Set<string>();
  
  snapshot.docs.forEach(doc => {
    const property = doc.data() as Property;
    locations.add(property.location);
  });
  
  return Array.from(locations).sort();
};

// Real-time listeners
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
