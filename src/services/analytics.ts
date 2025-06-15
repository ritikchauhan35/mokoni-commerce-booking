
import { Analytics } from '@/types';

// Mock analytics data for demonstration
const generateMockAnalytics = (): Analytics => {
  const today = new Date();
  const thisMonth = today.getMonth();
  const thisYear = today.getFullYear();
  
  return {
    id: `analytics-${Date.now()}`,
    date: today,
    productViews: {
      'product-1': Math.floor(Math.random() * 500) + 100,
      'product-2': Math.floor(Math.random() * 400) + 80,
      'product-3': Math.floor(Math.random() * 300) + 50,
    },
    propertyViews: {
      'property-1': Math.floor(Math.random() * 200) + 30,
      'property-2': Math.floor(Math.random() * 150) + 25,
      'property-3': Math.floor(Math.random() * 100) + 15,
    },
    orders: Math.floor(Math.random() * 50) + 20,
    bookings: Math.floor(Math.random() * 30) + 10,
    revenue: Math.floor(Math.random() * 10000) + 5000,
    newUsers: Math.floor(Math.random() * 25) + 5,
    activeUsers: Math.floor(Math.random() * 100) + 50,
  };
};

export const getAnalytics = async (): Promise<Analytics> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Check if we have cached analytics data
  const cached = localStorage.getItem('mokoni-analytics');
  if (cached) {
    return JSON.parse(cached);
  }
  
  // Generate and cache new analytics data
  const analytics = generateMockAnalytics();
  localStorage.setItem('mokoni-analytics', JSON.stringify(analytics));
  
  return analytics;
};

export const getMonthlyRevenue = async (): Promise<{ month: string; revenue: number }[]> => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return months.map(month => ({
    month,
    revenue: Math.floor(Math.random() * 15000) + 5000
  }));
};

export const getTopProducts = async (): Promise<{ name: string; sales: number; revenue: number }[]> => {
  return [
    { name: 'Organic Honey', sales: 156, revenue: 2340 },
    { name: 'Fresh Herbs Bundle', sales: 142, revenue: 1988 },
    { name: 'Artisan Cheese', sales: 128, revenue: 2560 },
    { name: 'Farm Vegetables', sales: 115, revenue: 1725 },
    { name: 'Free-range Eggs', sales: 98, revenue: 1176 },
  ];
};

export const getTopProperties = async (): Promise<{ name: string; bookings: number; revenue: number }[]> => {
  return [
    { name: 'Mountain Retreat', bookings: 28, revenue: 8400 },
    { name: 'Lakeside Cottage', bookings: 24, revenue: 7200 },
    { name: 'Forest Cabin', bookings: 20, revenue: 5000 },
    { name: 'City Apartment', bookings: 18, revenue: 5400 },
    { name: 'Beach House', bookings: 15, revenue: 6750 },
  ];
};
