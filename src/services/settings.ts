
import { SiteSettings } from '@/types';

const defaultSettings: SiteSettings = {
  id: 'site-settings-1',
  siteName: 'Mokoni',
  siteDescription: 'Your trusted marketplace for premium products and unique experiences',
  contactEmail: 'info@mokoni.com',
  contactPhone: '+1 (555) 123-4567',
  address: {
    street: '123 Business Avenue',
    city: 'Commerce City',
    state: 'California',
    zipCode: '90210',
    country: 'United States',
    type: 'work'
  },
  socialLinks: {
    facebook: 'https://facebook.com/mokoni',
    instagram: 'https://instagram.com/mokoni',
    twitter: 'https://twitter.com/mokoni',
    linkedin: 'https://linkedin.com/company/mokoni'
  },
  paymentMethods: ['card', 'paypal', 'cash_on_delivery'],
  shippingZones: [
    {
      id: 'zone-1',
      name: 'Local Delivery',
      countries: ['United States'],
      states: ['California'],
      rate: 5.99,
      freeShippingThreshold: 50,
      estimatedDays: 2
    },
    {
      id: 'zone-2',
      name: 'National Shipping',
      countries: ['United States'],
      rate: 12.99,
      freeShippingThreshold: 100,
      estimatedDays: 5
    }
  ],
  taxRate: 8.25,
  currency: 'USD',
  maintenanceMode: false,
  createdAt: new Date(),
  updatedAt: new Date()
};

export const getSettings = async (): Promise<SiteSettings> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const saved = localStorage.getItem('mokoni-settings');
  if (saved) {
    return JSON.parse(saved);
  }
  
  // Save default settings
  localStorage.setItem('mokoni-settings', JSON.stringify(defaultSettings));
  return defaultSettings;
};

export const updateSettings = async (settings: Partial<SiteSettings>): Promise<SiteSettings> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const current = await getSettings();
  const updated = {
    ...current,
    ...settings,
    updatedAt: new Date()
  };
  
  localStorage.setItem('mokoni-settings', JSON.stringify(updated));
  return updated;
};

export const resetSettings = async (): Promise<SiteSettings> => {
  localStorage.removeItem('mokoni-settings');
  return defaultSettings;
};
