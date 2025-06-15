
export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  role: 'user' | 'admin';
  createdAt: Date;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: string;
  images: string[];
  rating: number;
  reviews: number;
  inStock: boolean;
  inventory: number;
  createdAt: Date;
}

export interface Property {
  id: string;
  name: string;
  description: string;
  price: number;
  location: string;
  guests: number;
  bedrooms: number;
  images: string[];
  rating: number;
  reviews: number;
  amenities: string[];
  availability: Date[];
  createdAt: Date;
}

export interface CartItem {
  id: string;
  productId: string;
  quantity: number;
  userId?: string;
}

export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  total: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  shippingAddress: Address;
  paymentMethod: 'cash_on_delivery';
  createdAt: Date;
}

export interface OrderItem {
  productId: string;
  quantity: number;
  price: number;
  name: string;
}

export interface Booking {
  id: string;
  userId: string;
  propertyId: string;
  checkIn: Date;
  checkOut: Date;
  guests: number;
  total: number;
  status: 'pending' | 'confirmed' | 'cancelled';
  createdAt: Date;
}

export interface Address {
  id?: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  isDefault?: boolean;
}

export interface Review {
  id: string;
  userId: string;
  productId?: string;
  propertyId?: string;
  rating: number;
  comment: string;
  createdAt: Date;
}
