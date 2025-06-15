
import { createOrder } from './orders';
import { Order } from '@/types';

export const processCheckout = async (orderData: Omit<Order, 'id'>) => {
  try {
    // Create the order
    const order = await createOrder(orderData);
    
    // Here you could add additional checkout logic like:
    // - Payment processing
    // - Inventory updates
    // - Email notifications
    // - Analytics tracking
    
    return order;
  } catch (error) {
    console.error('Checkout error:', error);
    throw new Error('Failed to process checkout');
  }
};

export const validatePaymentInfo = (cardNumber: string, expiryDate: string, cvv: string) => {
  // Basic validation
  const cardNumberValid = /^\d{16}$/.test(cardNumber.replace(/\s/g, ''));
  const expiryValid = /^\d{2}\/\d{2}$/.test(expiryDate);
  const cvvValid = /^\d{3,4}$/.test(cvv);
  
  return {
    cardNumberValid,
    expiryValid,
    cvvValid,
    isValid: cardNumberValid && expiryValid && cvvValid
  };
};
