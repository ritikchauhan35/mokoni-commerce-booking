
import { ShippingRate, ShippingQuoteRequest, ShippingAddress, TrackingInfo } from '@/types/shipping';
import { getPincodeDetails, getShippingZone } from './addressValidation';

// India Post Speed Post API integration (Free)
const INDIA_POST_TRACKING_URL = 'https://www.indiapost.gov.in/_layouts/15/dop.portal.tracking/TrackConsignment.aspx';

// Free shipping rate calculation based on zones and weight
export const calculateZoneBasedShipping = async (
  request: ShippingQuoteRequest
): Promise<ShippingRate[]> => {
  const { packageDetails, destination } = request;
  
  // Get destination zone details
  const destDetails = await getPincodeDetails(destination.zipCode);
  const originState = 'Maharashtra'; // Your business location
  const destState = destDetails?.state || destination.state;
  
  // Calculate zone distance
  const zoneDistance = getShippingZone(originState, destState);
  
  // Base rates per kg based on zone distance
  const baseRates = {
    1: 25,  // Same zone
    2: 35,  // Adjacent zones
    3: 45,  // 2 zones away
    4: 55,  // 3 zones away
    5: 65   // Far zones (Northeast)
  };
  
  const baseRate = baseRates[zoneDistance as keyof typeof baseRates] || 45;
  const weightCost = packageDetails.weight * baseRate;
  const volumetricWeight = (packageDetails.dimensions.length * packageDetails.dimensions.width * packageDetails.dimensions.height) / 5000;
  const chargeableWeight = Math.max(packageDetails.weight, volumetricWeight);
  
  const rates: ShippingRate[] = [
    {
      providerId: 'india_post_standard',
      providerName: 'India Post Speed Post',
      serviceType: 'standard',
      serviceName: 'Speed Post (5-7 days)',
      rate: Math.max(chargeableWeight * baseRate, 50),
      estimatedDays: zoneDistance <= 2 ? 4 : zoneDistance <= 3 ? 6 : 8,
      deliveryDate: new Date(Date.now() + (zoneDistance <= 2 ? 4 : zoneDistance <= 3 ? 6 : 8) * 24 * 60 * 60 * 1000),
      isInsured: true,
      insuranceCost: packageDetails.value * 0.005,
      trackingAvailable: true
    },
    {
      providerId: 'zone_express',
      providerName: 'Express Delivery',
      serviceType: 'express',
      serviceName: 'Express Delivery (2-4 days)',
      rate: Math.max(chargeableWeight * baseRate * 1.8, 100),
      estimatedDays: zoneDistance <= 2 ? 2 : zoneDistance <= 3 ? 3 : 4,
      deliveryDate: new Date(Date.now() + (zoneDistance <= 2 ? 2 : zoneDistance <= 3 ? 3 : 4) * 24 * 60 * 60 * 1000),
      isInsured: true,
      insuranceCost: packageDetails.value * 0.008,
      trackingAvailable: true
    }
  ];

  // Add same-day delivery for major cities in same/adjacent zones
  const majorCities = ['mumbai', 'pune', 'nashik', 'aurangabad', 'nagpur'];
  if (zoneDistance <= 2 && majorCities.includes(destination.city.toLowerCase())) {
    rates.push({
      providerId: 'same_day',
      providerName: 'Same Day Delivery',
      serviceType: 'same_day',
      serviceName: 'Same Day Delivery',
      rate: Math.max(chargeableWeight * baseRate * 3, 200),
      estimatedDays: 0,
      deliveryDate: new Date(),
      isInsured: true,
      insuranceCost: packageDetails.value * 0.01,
      trackingAvailable: true
    });
  }

  return rates;
};

export const getShippingRates = async (
  request: ShippingQuoteRequest
): Promise<ShippingRate[]> => {
  try {
    console.log('Calculating zone-based shipping rates for:', request);
    
    const rates = await calculateZoneBasedShipping(request);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return rates;
  } catch (error) {
    console.error('Error getting shipping rates:', error);
    // Fallback to simple calculation
    return calculateFallbackShipping(request);
  }
};

// Fallback shipping calculator
export const calculateFallbackShipping = (
  request: ShippingQuoteRequest
): ShippingRate[] => {
  const { packageDetails } = request;
  const baseRate = packageDetails.weight * 25;
  
  return [
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
};

export const trackShipment = async (
  trackingNumber: string,
  providerId: string
): Promise<TrackingInfo | null> => {
  try {
    // For India Post tracking, we would normally scrape or use their API
    // For now, providing mock data structure for demonstration
    
    if (providerId === 'india_post_standard') {
      // In production, integrate with India Post tracking
      console.log(`Tracking India Post shipment: ${trackingNumber}`);
    }
    
    // Mock tracking data
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
  // Get pincode details to determine delivery availability
  const pincodeDetails = await getPincodeDetails(zipCode);
  
  if (!pincodeDetails) return [];
  
  // Major cities get time slot delivery
  const majorCities = ['mumbai', 'pune', 'delhi', 'bangalore', 'chennai', 'kolkata', 'hyderabad'];
  const cityName = pincodeDetails.city.toLowerCase();
  
  if (majorCities.some(city => cityName.includes(city))) {
    return [
      { id: '1', timeRange: '9:00 AM - 12:00 PM', isAvailable: true, additionalCost: 0 },
      { id: '2', timeRange: '12:00 PM - 3:00 PM', isAvailable: true, additionalCost: 25 },
      { id: '3', timeRange: '3:00 PM - 6:00 PM', isAvailable: false, additionalCost: 25 },
      { id: '4', timeRange: '6:00 PM - 9:00 PM', isAvailable: true, additionalCost: 50 }
    ];
  }
  
  return [];
};

// Holiday and weekend delivery adjustments
export const adjustDeliveryForHolidays = (deliveryDate: Date): Date => {
  const day = deliveryDate.getDay();
  
  // If delivery falls on Sunday, move to Monday
  if (day === 0) {
    deliveryDate.setDate(deliveryDate.getDate() + 1);
  }
  
  // Add more holiday logic here using a free holiday API or static data
  const indianHolidays = [
    '2024-01-26', // Republic Day
    '2024-08-15', // Independence Day
    '2024-10-02', // Gandhi Jayanti
    // Add more holidays as needed
  ];
  
  const dateString = deliveryDate.toISOString().split('T')[0];
  if (indianHolidays.includes(dateString)) {
    deliveryDate.setDate(deliveryDate.getDate() + 1);
  }
  
  return deliveryDate;
};

// Calculate packaging costs
export const calculatePackagingCost = (packageDetails: any): number => {
  const volume = packageDetails.dimensions.length * packageDetails.dimensions.width * packageDetails.dimensions.height;
  
  if (volume <= 1000) return 10; // Small package
  if (volume <= 5000) return 25; // Medium package
  if (volume <= 10000) return 50; // Large package
  return 100; // Extra large package
};
