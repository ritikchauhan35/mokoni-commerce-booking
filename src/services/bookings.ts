
import { 
  collection, 
  getDocs, 
  addDoc, 
  updateDoc, 
  doc, 
  query, 
  where, 
  orderBy, 
  serverTimestamp
} from 'firebase/firestore';
import { db } from '@/config/firebase';
import { Booking } from '@/types';

export const getAllBookings = async (): Promise<Booking[]> => {
  const bookingsRef = collection(db, 'bookings');
  const q = query(bookingsRef, orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Booking));
};

export const getUserBookings = async (userId: string): Promise<Booking[]> => {
  const bookingsRef = collection(db, 'bookings');
  const q = query(bookingsRef, where('userId', '==', userId), orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Booking));
};

export const createBooking = async (booking: Omit<Booking, 'id'>) => {
  return await addDoc(collection(db, 'bookings'), {
    ...booking,
    createdAt: serverTimestamp()
  });
};

export const updateBookingStatus = async (bookingId: string, status: Booking['status']) => {
  return await updateDoc(doc(db, 'bookings', bookingId), { status });
};
