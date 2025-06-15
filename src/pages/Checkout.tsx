
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useForm } from 'react-hook-form';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/hooks/useCart';
import { useProducts } from '@/hooks/useProducts';
import { createOrder } from '@/services';
import { useToast } from '@/hooks/use-toast';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { ShoppingBag, CreditCard, Truck, Wallet, Banknote } from 'lucide-react';
import { Product } from '@/types';

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
  
  // Calculate subtotal with proper typing
  const subtotal = checkoutItems.reduce((total: number, item: CheckoutItem) => {
    return total + (item.product.price * item.quantity);
  }, 0);

  const gst = subtotal * 0.18; // 18% GST for India
  const shipping = subtotal > 500 ? 0 : 50; // Free shipping above ₹500
  const codCharges = paymentMethod === 'cod' ? 25 : 0; // ₹25 COD charges
  const total = subtotal + gst + shipping + codCharges;

  const onSubmit = async (data: CheckoutFormData) => {
    setIsProcessing(true);
    try {
      // Fix payment method mapping to match Order interface
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
        shipping,
        status: 'pending' as const,
        paymentStatus: data.paymentMethod === 'cod' ? 'pending' : 'pending',
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

      await createOrder(order);

      if (!isDirectPurchase) {
        await clearCart();
      }

      toast({
        title: "Order placed successfully!",
        description: "You will receive a confirmation email shortly.",
      });

      navigate('/');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to process your order. Please try again.",
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
              {/* Contact Information */}
              <Card className="bg-pearl-100 border-olive-200">
                <CardHeader>
                  <CardTitle className="text-olive-800 flex items-center">
                    <CreditCard className="mr-2 h-5 w-5" />
                    Contact Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      {...register('email', { required: 'Email is required' })}
                      placeholder="your@email.com"
                    />
                    {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
                  </div>
                </CardContent>
              </Card>

              {/* Shipping Address */}
              <Card className="bg-pearl-100 border-olive-200">
                <CardHeader>
                  <CardTitle className="text-olive-800 flex items-center">
                    <Truck className="mr-2 h-5 w-5" />
                    Shipping Address
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        {...register('firstName', { required: 'First name is required' })}
                        placeholder="राज / Raj"
                      />
                      {errors.firstName && <p className="text-red-500 text-sm">{errors.firstName.message}</p>}
                    </div>
                    <div>
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        {...register('lastName', { required: 'Last name is required' })}
                        placeholder="शर्मा / Sharma"
                      />
                      {errors.lastName && <p className="text-red-500 text-sm">{errors.lastName.message}</p>}
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="address">Address</Label>
                    <Input
                      id="address"
                      {...register('address', { required: 'Address is required' })}
                      placeholder="House No, Street, Locality"
                    />
                    {errors.address && <p className="text-red-500 text-sm">{errors.address.message}</p>}
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="city">City</Label>
                      <Input
                        id="city"
                        {...register('city', { required: 'City is required' })}
                        placeholder="Mumbai"
                      />
                      {errors.city && <p className="text-red-500 text-sm">{errors.city.message}</p>}
                    </div>
                    <div>
                      <Label htmlFor="state">State</Label>
                      <Input
                        id="state"
                        {...register('state', { required: 'State is required' })}
                        placeholder="Maharashtra"
                      />
                      {errors.state && <p className="text-red-500 text-sm">{errors.state.message}</p>}
                    </div>
                    <div>
                      <Label htmlFor="zipCode">PIN Code</Label>
                      <Input
                        id="zipCode"
                        {...register('zipCode', { required: 'PIN code is required' })}
                        placeholder="400001"
                      />
                      {errors.zipCode && <p className="text-red-500 text-sm">{errors.zipCode.message}</p>}
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      {...register('phone', { required: 'Phone is required' })}
                      placeholder="+91 98765 43210"
                    />
                    {errors.phone && <p className="text-red-500 text-sm">{errors.phone.message}</p>}
                  </div>
                </CardContent>
              </Card>

              {/* Payment Method */}
              <Card className="bg-pearl-100 border-olive-200">
                <CardHeader>
                  <CardTitle className="text-olive-800 flex items-center">
                    <Wallet className="mr-2 h-5 w-5" />
                    Payment Method
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <RadioGroup {...register('paymentMethod')} defaultValue="cod" className="space-y-3">
                    <div className="flex items-center space-x-2 p-3 border rounded-lg">
                      <RadioGroupItem value="cod" id="cod" />
                      <Label htmlFor="cod" className="flex items-center cursor-pointer">
                        <Banknote className="mr-2 h-4 w-4" />
                        Cash on Delivery (COD) - ₹25 charges
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 p-3 border rounded-lg">
                      <RadioGroupItem value="upi" id="upi" />
                      <Label htmlFor="upi" className="flex items-center cursor-pointer">
                        <Wallet className="mr-2 h-4 w-4" />
                        UPI Payment
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 p-3 border rounded-lg">
                      <RadioGroupItem value="card" id="card" />
                      <Label htmlFor="card" className="flex items-center cursor-pointer">
                        <CreditCard className="mr-2 h-4 w-4" />
                        Credit/Debit Card
                      </Label>
                    </div>
                  </RadioGroup>

                  {paymentMethod === 'upi' && (
                    <div>
                      <Label htmlFor="upiId">UPI ID</Label>
                      <Input
                        id="upiId"
                        {...register('upiId', { required: paymentMethod === 'upi' ? 'UPI ID is required' : false })}
                        placeholder="yourname@paytm"
                      />
                      {errors.upiId && <p className="text-red-500 text-sm">{errors.upiId.message}</p>}
                    </div>
                  )}

                  {paymentMethod === 'card' && (
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="cardName">Name on Card</Label>
                        <Input
                          id="cardName"
                          {...register('cardName', { required: paymentMethod === 'card' ? 'Name on card is required' : false })}
                          placeholder="John Doe"
                        />
                        {errors.cardName && <p className="text-red-500 text-sm">{errors.cardName.message}</p>}
                      </div>
                      <div>
                        <Label htmlFor="cardNumber">Card Number</Label>
                        <Input
                          id="cardNumber"
                          {...register('cardNumber', { required: paymentMethod === 'card' ? 'Card number is required' : false })}
                          placeholder="1234 5678 9012 3456"
                        />
                        {errors.cardNumber && <p className="text-red-500 text-sm">{errors.cardNumber.message}</p>}
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="expiryDate">Expiry Date</Label>
                          <Input
                            id="expiryDate"
                            {...register('expiryDate', { required: paymentMethod === 'card' ? 'Expiry date is required' : false })}
                            placeholder="MM/YY"
                          />
                          {errors.expiryDate && <p className="text-red-500 text-sm">{errors.expiryDate.message}</p>}
                        </div>
                        <div>
                          <Label htmlFor="cvv">CVV</Label>
                          <Input
                            id="cvv"
                            {...register('cvv', { required: paymentMethod === 'card' ? 'CVV is required' : false })}
                            placeholder="123"
                          />
                          {errors.cvv && <p className="text-red-500 text-sm">{errors.cvv.message}</p>}
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

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
            <Card className="bg-pearl-100 border-olive-200 sticky top-4">
              <CardHeader>
                <CardTitle className="text-olive-800">Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Items */}
                <div className="space-y-3">
                  {checkoutItems.map((item) => (
                    <div key={item.id} className="flex items-center space-x-3">
                      <img 
                        src={item.product.images[0] || "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=100&h=100&fit=crop"} 
                        alt={item.product.name}
                        className="w-12 h-12 object-cover rounded"
                      />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-olive-800">{item.product.name}</p>
                        <p className="text-xs text-olive-600">Qty: {item.quantity}</p>
                      </div>
                      <p className="text-sm font-bold text-olive-800">
                        ₹{(item.product.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>

                <Separator />

                {/* Totals */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-olive-700">Subtotal</span>
                    <span className="text-olive-800">₹{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-olive-700">GST (18%)</span>
                    <span className="text-olive-800">₹{gst.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-olive-700">Shipping</span>
                    <span className="text-olive-800">
                      {shipping === 0 ? 'Free' : `₹${shipping.toFixed(2)}`}
                    </span>
                  </div>
                  {codCharges > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-olive-700">COD Charges</span>
                      <span className="text-olive-800">₹{codCharges.toFixed(2)}</span>
                    </div>
                  )}
                  <Separator />
                  <div className="flex justify-between font-bold text-lg">
                    <span className="text-olive-800">Total</span>
                    <span className="text-olive-800">₹{total.toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Checkout;
