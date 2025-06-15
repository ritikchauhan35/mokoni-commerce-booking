
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { useProducts } from '@/hooks/useProducts';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const Cart = () => {
  const { cartItems, updateQuantity, removeItem, getCartTotal } = useCart();
  const { data: products = [] } = useProducts();

  const getCartItemsWithProducts = () => {
    return cartItems.map(cartItem => {
      const product = products.find(p => p.id === cartItem.productId);
      return { ...cartItem, product };
    }).filter(item => item.product);
  };

  const cartItemsWithProducts = getCartItemsWithProducts();
  
  const subtotal = cartItemsWithProducts.reduce((total, item) => {
    return total + (item.product!.price * item.quantity);
  }, 0);

  const tax = subtotal * 0.1; // 10% tax
  const shipping = subtotal > 50 ? 0 : 9.99;
  const grandTotal = subtotal + tax + shipping;

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-pearl-50">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 py-16 text-center">
          <ShoppingBag className="h-16 w-16 text-olive-400 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-olive-800 mb-4">Your Cart is Empty</h1>
          <p className="text-olive-600 mb-8">Add some products to get started!</p>
          <Link to="/products">
            <Button className="bg-olive-600 hover:bg-olive-700">
              Continue Shopping
            </Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-pearl-50">
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-olive-800 mb-8">Shopping Cart</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cartItemsWithProducts.map((item) => (
              <Card key={item.id} className="bg-pearl-100 border-olive-200">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-4">
                    <img 
                      src={item.product!.images[0] || "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=200&h=200&fit=crop"} 
                      alt={item.product!.name}
                      className="w-20 h-20 object-cover rounded"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold text-olive-800">{item.product!.name}</h3>
                      <p className="text-olive-600 text-sm">{item.product!.category}</p>
                      <p className="text-lg font-bold text-olive-800">
                        ${typeof item.product!.price === 'number' ? item.product!.price.toFixed(2) : '0.00'}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="h-8 w-8 p-0"
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <Input 
                        type="number" 
                        value={item.quantity}
                        onChange={(e) => updateQuantity(item.id, parseInt(e.target.value) || 1)}
                        className="w-16 text-center"
                        min="1"
                      />
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="h-8 w-8 p-0"
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <Button 
                      size="sm" 
                      variant="destructive"
                      onClick={() => removeItem(item.id)}
                      className="h-8 w-8 p-0"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="bg-pearl-100 border-olive-200 sticky top-4">
              <CardHeader>
                <CardTitle className="text-olive-800">Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-olive-700">Subtotal</span>
                  <span className="text-olive-800">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-olive-700">Tax</span>
                  <span className="text-olive-800">${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-olive-700">Shipping</span>
                  <span className="text-olive-800">
                    {shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}
                  </span>
                </div>
                <hr className="border-olive-300" />
                <div className="flex justify-between font-bold text-lg">
                  <span className="text-olive-800">Total</span>
                  <span className="text-olive-800">${grandTotal.toFixed(2)}</span>
                </div>
                <Button className="w-full bg-olive-600 hover:bg-olive-700 py-3">
                  Proceed to Checkout
                </Button>
                <Link to="/products">
                  <Button variant="outline" className="w-full border-olive-600 text-olive-600 hover:bg-olive-50">
                    Continue Shopping
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Cart;
