
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useForm } from 'react-hook-form';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/hooks/useCart';
import { useProducts } from '@/hooks/useProducts';
import { createOrder } from '@/services';
import { useToast } from '@/hooks/use-toast';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { ShoppingBag } from 'lucide-react';
import { Product } from '@/types';
import { validateAddress } from '@/services/addressValidation';
import ContactForm from '@/components/checkout/ContactForm';
import AddressForm from '@/components/checkout/AddressForm';
import PaymentForm from '@/components/checkout/PaymentForm';
import OrderSummary from '@/components/checkout/OrderSummary';

interface CheckoutFormData {
  email: string;
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  phone: string;
  paymentMethod: 'cod' | 'card' | 'upi';
  cardNumber?: string;
  expiryDate?: string;
  cvv?: string;
  cardName?: string;
  upiId?: string;
}

interface CheckoutItem {
  id: string;
  productId: string;
  quantity: number;
  product: Product;
}

const Checkout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { cartItems, clearCart } = useCart();
  const { data: products = [] } = useProducts();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);

  // Get checkout items (from cart or single product from Buy Now)
  const checkoutItem = location.state?.product;
  const isDirectPurchase = !!checkoutItem;

  const { register, handleSubmit, watch, formState: { errors } } = useForm<CheckoutFormData>({
    defaultValues: {
      email: user?.email || '',
      firstName: '',
      lastName: '',
      address: '',
      city: '',
      state: '',
      zipCode: '',
      phone: '',
      paymentMethod: 'cod',
      cardNumber: '',
      expiryDate: '',
      cvv: '',
      cardName: '',
      upiId: '',
    }
  });

  const paymentMethod = watch('paymentMethod');

  const getCheckoutItems = (): CheckoutItem[] => {
    if (isDirectPurchase) {
      return [{ 
        id: 'temp-' + checkoutItem.id,
        productId: checkoutItem.id, 
        quantity: 1, 
        product: checkoutItem
      }];
    }
    
    return cartItems
      .map(cartItem => {
        const product = products.find(p => p.id === cartItem.productId);
        if (!product) return null;
        return { 
          id: cartItem.id,
          productId: cartItem.productId,
          quantity: cartItem.quantity,
          product 
        };
      })
      .filter((item): item is CheckoutItem => item !== null);
  };

  const checkoutItems = getCheckoutItems();
  
  // Calculate totals (simplified without shipping)
  const subtotal = checkoutItems.reduce((total: number, item: CheckoutItem) => {
    return total + (item.product.price * item.quantity);
  }, 0);

  const gst = subtotal * 0.18;
  const shippingCost = subtotal > 500 ? 0 : 50; // Simple shipping calculation
  const codCharges = paymentMethod === 'cod' ? 25 : 0;
  const total = subtotal + gst + shippingCost + codCharges;

  const onSubmit = async (data: CheckoutFormData) => {
    setIsProcessing(true);
    console.log('Starting checkout process with data:', data);
    
    try {
      // Validate address before proceeding
      const addressValidation = await validateAddress({
        street: data.address,
        city: data.city,
        state: data.state,
        zipCode: data.zipCode,
        country: 'IN'
      });

      if (!addressValidation.isValid) {
        toast({
          title: "Address Validation Failed",
          description: addressValidation.errors?.join(', '),
          variant: "destructive",
        });
        setIsProcessing(false);
        return;
      }

      // Map payment method to match Order interface
      let paymentMethodValue: 'cash_on_delivery' | 'card' | 'paypal' | 'upi';
      if (data.paymentMethod === 'cod') {
        paymentMethodValue = 'cash_on_delivery';
      } else if (data.paymentMethod === 'upi') {
        paymentMethodValue = 'upi';
      } else {
        paymentMethodValue = 'card';
      }

      const order = {
        userId: user?.uid || 'guest',
        items: checkoutItems.map(item => ({
          productId: item.productId,
          quantity: item.quantity,
          price: item.product.price,
          name: item.product.name
        })),
        total,
        subtotal,
        tax: gst,
        shipping: shippingCost,
        status: 'pending' as const,
        paymentStatus: 'pending' as const,
        shippingAddress: {
          street: data.address,
          city: data.city,
          state: data.state,
          zipCode: data.zipCode,
          country: 'IN'
        },
        paymentMethod: paymentMethodValue,
        createdAt: new Date()
      };

      console.log('Creating order:', order);
      const createdOrder = await createOrder(order);
      console.log('Order created successfully:', createdOrder);

      // Clear cart ONLY after successful order creation
      if (!isDirectPurchase) {
        console.log('Clearing cart after successful order...');
        await clearCart();
        console.log('Cart cleared successfully');
      }

      toast({
        title: "Order placed successfully!",
        description: `Order total: ₹${total.toFixed(2)}. You will receive a confirmation email shortly.`,
      });

      // Navigate to confirmation page or home
      navigate('/booking-confirmation', { 
        state: { 
          orderId: createdOrder.id,
          orderTotal: total,
          customerName: `${data.firstName} ${data.lastName}`
        } 
      });
      
    } catch (error) {
      console.error('Checkout error:', error);
      toast({
        title: "Order Failed",
        description: "Failed to process your order. Please try again. If the problem persists, contact support.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  if (checkoutItems.length === 0) {
    return (
      <div className="min-h-screen bg-pearl-50">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 py-16 text-center">
          <ShoppingBag className="h-16 w-16 text-olive-400 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-olive-800 mb-4">No Items to Checkout</h1>
          <p className="text-olive-600 mb-8">Add some products to your cart first!</p>
          <Button onClick={() => navigate('/products')} className="bg-olive-600 hover:bg-olive-700">
            Continue Shopping
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-pearl-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-olive-800 mb-8">Checkout</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2 space-y-6">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <ContactForm register={register} errors={errors} />
              <AddressForm register={register} errors={errors} />
              <PaymentForm 
                register={register} 
                errors={errors} 
                paymentMethod={paymentMethod}
              />

              <Button 
                type="submit" 
                className="w-full bg-olive-600 hover:bg-olive-700 py-3 text-lg"
                disabled={isProcessing}
              >
                {isProcessing ? 'Processing...' : `Place Order - ₹${total.toFixed(2)}`}
              </Button>
            </form>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <OrderSummary
              checkoutItems={checkoutItems}
              subtotal={subtotal}
              gst={gst}
              shippingCost={shippingCost}
              codCharges={codCharges}
              total={total}
              selectedShippingRate={null}
            />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Checkout;
