
import { ShippingRate, ShippingQuoteRequest, ShippingAddress, TrackingInfo } from '@/types/shipping';

// Indian shipping providers configuration
const SHIPPING_PROVIDERS = {
  DELHIVERY: {
    id: 'delhivery',
    name: 'Delhivery',
    displayName: 'Delhivery',
    baseUrl: 'https://track.delhivery.com/api',
    isActive: true,
    supportedServices: ['standard', 'express']
  },
  BLUEDART: {
    id: 'bluedart',
    name: 'Blue Dart',
    displayName: 'Blue Dart Express',
    baseUrl: 'https://www.bluedart.com/api',
    isActive: true,
    supportedServices: ['standard', 'express', 'same_day']
  },
  INDIAPOST: {
    id: 'indiapost',
    name: 'India Post',
    displayName: 'India Post',
    baseUrl: 'https://www.indiapost.gov.in/api',
    isActive: true,
    supportedServices: ['standard']
  },
  DTDC: {
    id: 'dtdc',
    name: 'DTDC',
    displayName: 'DTDC Express',
    baseUrl: 'https://www.dtdc.in/api',
    isActive: true,
    supportedServices: ['standard', 'express']
  }
};

// Fallback shipping calculator for when APIs are not available
export const calculateFallbackShipping = (
  request: ShippingQuoteRequest
): ShippingRate[] => {
  const { packageDetails, destination } = request;
  const baseRate = packageDetails.weight * 25; // ₹25 per kg base rate
  
  const rates: ShippingRate[] = [
    {
      providerId: 'standard',
      providerName: 'Standard Shipping',
      serviceType: 'standard',
      serviceName: 'Standard Delivery (5-7 days)',
      rate: Math.max(baseRate, 50),
      estimatedDays: 6,
      deliveryDate: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000),
      isInsured: false,
      trackingAvailable: true
    },
    {
      providerId: 'express',
      providerName: 'Express Shipping',
      serviceType: 'express',
      serviceName: 'Express Delivery (2-3 days)',
      rate: Math.max(baseRate * 1.8, 100),
      estimatedDays: 2,
      deliveryDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
      isInsured: true,
      insuranceCost: packageDetails.value * 0.005,
      trackingAvailable: true
    }
  ];

  // Add same-day delivery for major cities
  const majorCities = ['mumbai', 'delhi', 'bangalore', 'chennai', 'kolkata', 'hyderabad', 'pune', 'ahmedabad'];
  if (majorCities.includes(destination.city.toLowerCase())) {
    rates.push({
      providerId: 'same_day',
      providerName: 'Same Day Delivery',
      serviceType: 'same_day',
      serviceName: 'Same Day Delivery',
      rate: Math.max(baseRate * 3, 200),
      estimatedDays: 0,
      deliveryDate: new Date(),
      isInsured: true,
      insuranceCost: packageDetails.value * 0.005,
      trackingAvailable: true
    });
  }

  return rates;
};

export const getShippingRates = async (
  request: ShippingQuoteRequest
): Promise<ShippingRate[]> => {
  try {
    // For now, we'll use the fallback calculator
    // In production, you would integrate with actual shipping provider APIs
    console.log('Calculating shipping rates for:', request);
    
    const rates = calculateFallbackShipping(request);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return rates;
  } catch (error) {
    console.error('Error getting shipping rates:', error);
    return calculateFallbackShipping(request);
  }
};

export const trackShipment = async (
  trackingNumber: string,
  providerId: string
): Promise<TrackingInfo | null> => {
  try {
    // Mock tracking data for demonstration
    const mockTracking: TrackingInfo = {
      trackingNumber,
      status: 'in_transit',
      currentLocation: 'Mumbai Processing Center',
      estimatedDelivery: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
      events: [
        {
          timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
          location: 'Origin Facility',
          status: 'picked_up',
          description: 'Package picked up from sender'
        },
        {
          timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
          location: 'Mumbai Hub',
          status: 'in_transit',
          description: 'Package in transit to destination city'
        }
      ]
    };
    
    return mockTracking;
  } catch (error) {
    console.error('Error tracking shipment:', error);
    return null;
  }
};

export const getDeliverySlots = async (
  zipCode: string,
  date: Date
): Promise<any[]> => {
  // Mock delivery slots for major cities
  const majorCityZipCodes = ['400001', '110001', '560001', '600001', '700001'];
  
  if (majorCityZipCodes.some(zip => zipCode.startsWith(zip.substring(0, 3)))) {
    return [
      { id: '1', timeRange: '9:00 AM - 12:00 PM', isAvailable: true, additionalCost: 0 },
      { id: '2', timeRange: '12:00 PM - 3:00 PM', isAvailable: true, additionalCost: 25 },
      { id: '3', timeRange: '3:00 PM - 6:00 PM', isAvailable: false, additionalCost: 25 },
      { id: '4', timeRange: '6:00 PM - 9:00 PM', isAvailable: true, additionalCost: 50 }
    ];
  }
  
  return [];
};
