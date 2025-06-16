
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
import { sendBookingConfirmation, sendBookingStatusUpdate } from './bookingNotifications';
import { getSettings } from './settings';

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
  const bookingData = {
    ...booking,
    checkIn: booking.checkIn instanceof Date ? booking.checkIn.toISOString().split('T')[0] : booking.checkIn,
    checkOut: booking.checkOut instanceof Date ? booking.checkOut.toISOString().split('T')[0] : booking.checkOut,
    createdAt: serverTimestamp(),
    bookingNumber: generateBookingNumber()
  };

  const bookingRef = await addDoc(collection(db, 'bookings'), bookingData);

  // Send booking notifications
  try {
    const settings = await getSettings();
    if (settings?.notifications) {
      await sendBookingConfirmation({
        bookingId: bookingRef.id,
        propertyName: booking.propertyId,
        customerName: booking.guestDetails.name,
        customerEmail: booking.guestDetails.email,
        checkIn: typeof booking.checkIn === 'string' ? booking.checkIn : booking.checkIn.toISOString().split('T')[0],
        checkOut: typeof booking.checkOut === 'string' ? booking.checkOut : booking.checkOut.toISOString().split('T')[0],
        guests: booking.guests,
        total: booking.total,
        status: booking.status
      }, settings.notifications);
    }
  } catch (error) {
    console.error('Failed to send booking notification:', error);
  }

  return bookingRef;
};

// Generate a human-readable booking number
const generateBookingNumber = (): string => {
  const now = new Date();
  const year = now.getFullYear().toString().slice(-2);
  const month = (now.getMonth() + 1).toString().padStart(2, '0');
  const day = now.getDate().toString().padStart(2, '0');
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `BK${year}${month}${day}${random}`;
};

export const updateBookingStatus = async (bookingId: string, status: Booking['status']) => {
  await updateDoc(doc(db, 'bookings', bookingId), { 
    status,
    updatedAt: serverTimestamp()
  });

  // Send status update notification
  try {
    const settings = await getSettings();
    if (settings.notifications) {
      await sendBookingStatusUpdate(
        bookingId, 
        status, 
        '', // customerEmail - In real app, you'd get customer email from booking data
        '', // customerName - In real app, you'd get customer name from booking data
        '', // propertyName - In real app, you'd get property name from booking data
        settings.notifications
      );
    }
  } catch (error) {
    console.error('Failed to send booking status update notification:', error);
  }
};
