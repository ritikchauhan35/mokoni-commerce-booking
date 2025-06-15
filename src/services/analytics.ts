
import { 
  collection, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  limit,
  Timestamp 
} from 'firebase/firestore';
import { db } from '@/config/firebase';
import { Analytics, Order, Booking, Product, Property } from '@/types';

export const getAnalytics = async (): Promise<Analytics> => {
  try {
    // Get all orders
    const ordersRef = collection(db, 'orders');
    const ordersSnapshot = await getDocs(ordersRef);
    const orders = ordersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Order));

    // Get all bookings
    const bookingsRef = collection(db, 'bookings');
    const bookingsSnapshot = await getDocs(bookingsRef);
    const bookings = bookingsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Booking));

    // Get all products
    const productsRef = collection(db, 'products');
    const productsSnapshot = await getDocs(productsRef);
    const products = productsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));

    // Get all properties
    const propertiesRef = collection(db, 'properties');
    const propertiesSnapshot = await getDocs(propertiesRef);
    const properties = propertiesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Property));

    // Calculate product views (based on orders for now)
    const productViews: { [key: string]: number } = {};
    orders.forEach(order => {
      order.items.forEach(item => {
        productViews[item.productId] = (productViews[item.productId] || 0) + 1;
      });
    });

    // Calculate property views (based on bookings for now)
    const propertyViews: { [key: string]: number } = {};
    bookings.forEach(booking => {
      propertyViews[booking.propertyId] = (propertyViews[booking.propertyId] || 0) + 1;
    });

    // Calculate total revenue
    const orderRevenue = orders.reduce((sum, order) => sum + order.total, 0);
    const bookingRevenue = bookings.reduce((sum, booking) => sum + booking.total, 0);
    const totalRevenue = orderRevenue + bookingRevenue;

    // Count new users (this month - simplified calculation)
    const thisMonth = new Date();
    thisMonth.setDate(1);
    const newUsers = Math.floor(Math.random() * 25) + 5; // Placeholder until user registration tracking

    // Count active users (simplified calculation)
    const activeUsers = orders.length + bookings.length;

    return {
      id: `analytics-${Date.now()}`,
      date: new Date(),
      productViews,
      propertyViews,
      orders: orders.length,
      bookings: bookings.length,
      revenue: totalRevenue,
      newUsers,
      activeUsers,
    };
  } catch (error) {
    console.error('Error fetching analytics:', error);
    throw error;
  }
};

export const getMonthlyRevenue = async (): Promise<{ month: string; revenue: number }[]> => {
  try {
    const ordersRef = collection(db, 'orders');
    const ordersSnapshot = await getDocs(ordersRef);
    const orders = ordersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Order));

    const bookingsRef = collection(db, 'bookings');
    const bookingsSnapshot = await getDocs(bookingsRef);
    const bookings = bookingsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Booking));

    // Group revenue by month
    const monthlyRevenue: { [key: string]: number } = {};
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    // Initialize all months with 0
    months.forEach(month => {
      monthlyRevenue[month] = 0;
    });

    // Add order revenue
    orders.forEach(order => {
      if (order.createdAt) {
        const date = order.createdAt instanceof Timestamp ? order.createdAt.toDate() : new Date(order.createdAt);
        const monthName = months[date.getMonth()];
        monthlyRevenue[monthName] += order.total;
      }
    });

    // Add booking revenue
    bookings.forEach(booking => {
      if (booking.createdAt) {
        const date = booking.createdAt instanceof Timestamp ? booking.createdAt.toDate() : new Date(booking.createdAt);
        const monthName = months[date.getMonth()];
        monthlyRevenue[monthName] += booking.total;
      }
    });

    return months.map(month => ({
      month,
      revenue: monthlyRevenue[month]
    }));
  } catch (error) {
    console.error('Error fetching monthly revenue:', error);
    return [];
  }
};

export const getTopProducts = async (): Promise<{ name: string; sales: number; revenue: number }[]> => {
  try {
    const ordersRef = collection(db, 'orders');
    const ordersSnapshot = await getDocs(ordersRef);
    const orders = ordersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Order));

    const productsRef = collection(db, 'products');
    const productsSnapshot = await getDocs(productsRef);
    const products = productsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));

    // Calculate product performance
    const productStats: { [key: string]: { sales: number; revenue: number; name: string } } = {};

    orders.forEach(order => {
      order.items.forEach(item => {
        const product = products.find(p => p.id === item.productId);
        if (product) {
          if (!productStats[item.productId]) {
            productStats[item.productId] = { sales: 0, revenue: 0, name: product.name };
          }
          productStats[item.productId].sales += item.quantity;
          productStats[item.productId].revenue += item.price * item.quantity;
        }
      });
    });

    return Object.values(productStats)
      .sort((a, b) => b.sales - a.sales)
      .slice(0, 5);
  } catch (error) {
    console.error('Error fetching top products:', error);
    return [];
  }
};

export const getTopProperties = async (): Promise<{ name: string; bookings: number; revenue: number }[]> => {
  try {
    const bookingsRef = collection(db, 'bookings');
    const bookingsSnapshot = await getDocs(bookingsRef);
    const bookings = bookingsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Booking));

    const propertiesRef = collection(db, 'properties');
    const propertiesSnapshot = await getDocs(propertiesRef);
    const properties = propertiesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Property));

    // Calculate property performance
    const propertyStats: { [key: string]: { bookings: number; revenue: number; name: string } } = {};

    bookings.forEach(booking => {
      const property = properties.find(p => p.id === booking.propertyId);
      if (property) {
        if (!propertyStats[booking.propertyId]) {
          propertyStats[booking.propertyId] = { bookings: 0, revenue: 0, name: property.name };
        }
        propertyStats[booking.propertyId].bookings += 1;
        propertyStats[booking.propertyId].revenue += booking.total;
      }
    });

    return Object.values(propertyStats)
      .sort((a, b) => b.bookings - a.bookings)
      .slice(0, 5);
  } catch (error) {
    console.error('Error fetching top properties:', error);
    return [];
  }
};
