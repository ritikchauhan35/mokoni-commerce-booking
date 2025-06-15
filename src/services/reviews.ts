
import { 
  collection, 
  getDocs, 
  addDoc, 
  query, 
  where, 
  orderBy, 
  serverTimestamp
} from 'firebase/firestore';
import { db } from '@/config/firebase';
import { Review } from '@/types';

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
