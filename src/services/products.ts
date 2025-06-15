
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
  serverTimestamp
} from 'firebase/firestore';
import { db } from '@/config/firebase';
import { Product } from '@/types';

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
