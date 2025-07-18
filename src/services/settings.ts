import { 
  doc, 
  getDoc, 
  setDoc, 
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '@/config/firebase';
import { SiteSettings } from '@/types';

const SETTINGS_DOC_ID = 'site-settings';

const defaultSettings: SiteSettings = {
  id: SETTINGS_DOC_ID,
  siteName: 'Mokoni',
  siteDescription: 'Your trusted marketplace for premium products and unique experiences',
  contactEmail: 'support@mokoni.com',
  contactPhone: '+1 (855) 665-6641',
  address: {
    street: '1234 Commerce Street',
    city: 'San Francisco',
    state: 'California',
    zipCode: '94102',
    country: 'United States',
    type: 'work'
  },
  socialLinks: {
    facebook: 'https://facebook.com/mokonistore',
    instagram: 'https://instagram.com/mokonistore',
    twitter: 'https://twitter.com/mokonistore',
    linkedin: 'https://linkedin.com/company/mokonistore'
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
  notifications: {
    emailEnabled: true,
    whatsappEnabled: true,
    adminEmail: 'admin@mokoni.com',
    adminWhatsapp: '+18556656641',
    twilioAccountSid: '',
    twilioAuthToken: '',
    twilioWhatsappNumber: '',
    emailjsServiceId: '',
    emailjsTemplateId: '',
    emailjsPublicKey: ''
  },
  createdAt: new Date(),
  updatedAt: new Date()
};

export const getSettings = async (): Promise<SiteSettings> => {
  try {
    const settingsDoc = await getDoc(doc(db, 'settings', SETTINGS_DOC_ID));
    
    if (settingsDoc.exists()) {
      const data = settingsDoc.data();
      return {
        ...data,
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date()
      } as SiteSettings;
    } else {
      // Create default settings in Firebase
      await setDoc(doc(db, 'settings', SETTINGS_DOC_ID), {
        ...defaultSettings,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      return defaultSettings;
    }
  } catch (error) {
    console.error('Error fetching settings:', error);
    // Fallback to localStorage if Firebase fails
    const saved = localStorage.getItem('mokoni-settings');
    if (saved) {
      return JSON.parse(saved);
    }
    return defaultSettings;
  }
};

export const updateSettings = async (settings: Partial<SiteSettings>): Promise<SiteSettings> => {
  try {
    const current = await getSettings();
    const updated = {
      ...current,
      ...settings,
      updatedAt: new Date()
    };
    
    // Update in Firebase
    await setDoc(doc(db, 'settings', SETTINGS_DOC_ID), {
      ...updated,
      updatedAt: serverTimestamp()
    });
    
    // Also update localStorage as backup
    localStorage.setItem('mokoni-settings', JSON.stringify(updated));
    
    return updated;
  } catch (error) {
    console.error('Error updating settings:', error);
    throw error;
  }
};

export const resetSettings = async (): Promise<SiteSettings> => {
  try {
    await setDoc(doc(db, 'settings', SETTINGS_DOC_ID), {
      ...defaultSettings,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    
    localStorage.removeItem('mokoni-settings');
    return defaultSettings;
  } catch (error) {
    console.error('Error resetting settings:', error);
    throw error;
  }
};

// Hook for getting settings in components
export const useSettings = () => {
  return { getSettings, updateSettings, resetSettings };
};
