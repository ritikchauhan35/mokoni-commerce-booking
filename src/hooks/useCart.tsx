
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { getCartItems, addToCart, updateCartItem, removeFromCart } from '@/services';
import { CartItem } from '@/types';
import { useToast } from '@/hooks/use-toast';

export const useCart = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      loadCartItems();
    } else {
      // Load from localStorage for guest users
      const guestCart = localStorage.getItem('guestCart');
      if (guestCart) {
        setCartItems(JSON.parse(guestCart));
      }
    }
  }, [user]);

  const loadCartItems = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const items = await getCartItems(user.uid);
      setCartItems(items);
      console.log('Cart items loaded:', items);
    } catch (error) {
      console.error('Error loading cart:', error);
    } finally {
      setLoading(false);
    }
  };

  const addItem = async (productId: string, quantity: number = 1) => {
    try {
      if (user) {
        // Check if item already exists
        const existingItem = cartItems.find(item => item.productId === productId);
        
        if (existingItem) {
          await updateCartItem(existingItem.id, existingItem.quantity + quantity);
        } else {
          await addToCart({
            productId,
            quantity,
            userId: user.uid
          });
        }
        await loadCartItems();
      } else {
        // Guest cart - save to localStorage
        const existingItemIndex = cartItems.findIndex(item => item.productId === productId);
        let newCart = [...cartItems];
        
        if (existingItemIndex >= 0) {
          newCart[existingItemIndex].quantity += quantity;
        } else {
          newCart.push({
            id: `guest-${Date.now()}`,
            productId,
            quantity,
          });
        }
        
        setCartItems(newCart);
        localStorage.setItem('guestCart', JSON.stringify(newCart));
      }
      
      toast({
        title: "Added to cart",
        description: "Item successfully added to your cart",
      });
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast({
        title: "Error",
        description: "Failed to add item to cart",
        variant: "destructive",
      });
    }
  };

  const updateQuantity = async (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      await removeItem(itemId);
      return;
    }

    try {
      if (user) {
        await updateCartItem(itemId, quantity);
        await loadCartItems();
      } else {
        const newCart = cartItems.map(item =>
          item.id === itemId ? { ...item, quantity } : item
        );
        setCartItems(newCart);
        localStorage.setItem('guestCart', JSON.stringify(newCart));
      }
    } catch (error) {
      console.error('Error updating cart:', error);
    }
  };

  const removeItem = async (itemId: string) => {
    try {
      if (user) {
        await removeFromCart(itemId);
        await loadCartItems();
      } else {
        const newCart = cartItems.filter(item => item.id !== itemId);
        setCartItems(newCart);
        localStorage.setItem('guestCart', JSON.stringify(newCart));
      }
      
      toast({
        title: "Removed from cart",
        description: "Item removed from your cart",
      });
    } catch (error) {
      console.error('Error removing from cart:', error);
      toast({
        title: "Error",
        description: "Failed to remove item from cart",
        variant: "destructive",
      });
    }
  };

  const clearCart = async () => {
    try {
      console.log('Clearing cart for user:', user?.uid || 'guest');
      
      if (user) {
        // Clear all items from Firebase for authenticated users
        const clearPromises = cartItems.map(item => removeFromCart(item.id));
        await Promise.all(clearPromises);
        console.log('All cart items removed from Firebase');
        await loadCartItems(); // Reload to ensure cart is empty
      } else {
        // Clear guest cart from localStorage
        setCartItems([]);
        localStorage.removeItem('guestCart');
        console.log('Guest cart cleared from localStorage');
      }
      
      console.log('Cart cleared successfully');
    } catch (error) {
      console.error('Error clearing cart:', error);
      toast({
        title: "Error",
        description: "Failed to clear cart completely",
        variant: "destructive",
      });
    }
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  return {
    cartItems,
    loading,
    addItem,
    updateQuantity,
    removeItem,
    clearCart,
    getCartTotal,
  };
};
