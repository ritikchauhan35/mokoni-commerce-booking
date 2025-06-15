
export interface ShippingAddress {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  landmark?: string;
  addressType?: 'home' | 'office' | 'other';
}

export interface ShippingProvider {
  id: string;
  name: string;
  displayName: string;
  logo?: string;
  isActive: boolean;
  supportedServices: string[];
}

export interface ShippingRate {
  providerId: string;
  providerName: string;
  serviceType: 'standard' | 'express' | 'same_day' | 'overnight';
  serviceName: string;
  rate: number;
  estimatedDays: number;
  deliveryDate: Date;
  isInsured: boolean;
  insuranceCost?: number;
  trackingAvailable: boolean;
}

export interface ShippingQuoteRequest {
  origin: {
    zipCode: string;
    city: string;
    state: string;
  };
  destination: ShippingAddress;
  packageDetails: {
    weight: number; // in kg
    dimensions: {
      length: number; // in cm
      width: number;
      height: number;
    };
    value: number; // package value for insurance
  };
  serviceTypes?: string[];
}

export interface AddressValidation {
  isValid: boolean;
  suggestions?: ShippingAddress[];
  errors?: string[];
  normalizedAddress?: ShippingAddress;
}

export interface TrackingInfo {
  trackingNumber: string;
  status: 'pending' | 'picked_up' | 'in_transit' | 'out_for_delivery' | 'delivered' | 'failed' | 'returned';
  currentLocation?: string;
  estimatedDelivery?: Date;
  deliveryDate?: Date;
  events: TrackingEvent[];
}

export interface TrackingEvent {
  timestamp: Date;
  location: string;
  status: string;
  description: string;
}

export interface DeliverySlot {
  id: string;
  date: Date;
  timeRange: string;
  isAvailable: boolean;
  additionalCost: number;
}
