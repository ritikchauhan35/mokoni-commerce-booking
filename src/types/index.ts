
export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  role: 'user' | 'admin' | 'super_admin';
  addresses?: Address[];
  profileImage?: string;
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
  tags?: string[];
  weight?: number;
  dimensions?: {
    length: number;
    width: number;
    height: number;
  };
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
  bathrooms?: number;
  images: string[];
  rating: number;
  reviews: number;
  amenities: string[];
  availability: Date[];
  rules?: string[];
  coordinates?: {
    lat: number;
    lng: number;
  };
  hostId?: string;
  createdAt: Date;
}

export interface CartItem {
  id: string;
  productId: string;
  quantity: number;
  userId?: string;
  addedAt?: Date;
}

export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  total: number;
  subtotal: number;
  tax: number;
  shipping: number;
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  shippingAddress: Address;
  billingAddress?: Address;
  paymentMethod: 'cash_on_delivery' | 'card' | 'paypal' | 'upi' | { type: string; last4?: string; upiId?: string };
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  trackingNumber?: string;
  estimatedDelivery?: Date;
  notes?: string;
  createdAt: Date;
  updatedAt?: Date;
}

export interface OrderItem {
  productId: string;
  quantity: number;
  price: number;
  name: string;
  image?: string;
}

export interface Booking {
  id: string;
  userId: string;
  propertyId: string;
  checkIn: Date;
  checkOut: Date;
  guests: number;
  total: number;
  subtotal: number;
  tax: number;
  cleaningFee: number;
  serviceFee: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  specialRequests?: string;
  guestDetails: {
    name: string;
    email: string;
    phone: string;
  };
  createdAt: Date;
  updatedAt?: Date;
}

export interface Address {
  id?: string;
  name?: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  isDefault?: boolean;
  type?: 'home' | 'work' | 'other';
}

export interface Review {
  id: string;
  userId: string;
  userName: string;
  userImage?: string;
  productId?: string;
  propertyId?: string;
  orderId?: string;
  bookingId?: string;
  rating: number;
  title?: string;
  comment: string;
  images?: string[];
  helpfulCount: number;
  verified: boolean;
  createdAt: Date;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  image?: string;
  parentId?: string;
  type: 'product' | 'property';
  isActive: boolean;
  sortOrder: number;
  createdAt: Date;
}

export interface Wishlist {
  id: string;
  userId: string;
  productIds: string[];
  propertyIds: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Notification {
  id: string;
  userId: string;
  type: 'order' | 'booking' | 'review' | 'promotion' | 'system';
  title: string;
  message: string;
  isRead: boolean;
  actionUrl?: string;
  data?: Record<string, any>;
  createdAt: Date;
}

export interface Analytics {
  id: string;
  date: Date;
  productViews: Record<string, number>;
  propertyViews: Record<string, number>;
  orders: number;
  bookings: number;
  revenue: number;
  newUsers: number;
  activeUsers: number;
}

export interface SiteSettings {
  id: string;
  siteName: string;
  siteDescription: string;
  logoUrl?: string;
  faviconUrl?: string;
  contactEmail: string;
  contactPhone?: string;
  address?: Address;
  socialLinks: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
    linkedin?: string;
  };
  paymentMethods: string[];
  shippingZones: ShippingZone[];
  taxRate: number;
  currency: string;
  maintenanceMode: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ShippingZone {
  id: string;
  name: string;
  countries: string[];
  states?: string[];
  rate: number;
  freeShippingThreshold?: number;
  estimatedDays: number;
}

// API Response types
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface SearchFilters {
  query?: string;
  category?: string;
  location?: string;
  minPrice?: number;
  maxPrice?: number;
  rating?: number;
  inStock?: boolean;
  sortBy?: 'price' | 'rating' | 'name' | 'created';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface PropertySearchFilters extends SearchFilters {
  checkIn?: Date;
  checkOut?: Date;
  guests?: number;
  bedrooms?: number;
  amenities?: string[];
}
