
import { ShippingAddress, AddressValidation } from '@/types/shipping';

// Data.gov.in PIN Code API with provided key
const DATA_GOV_API_KEY = '579b464db66ec23bdd00000135c042f9159b4eef553ab76f7f57f0f5';
const DATA_GOV_BASE_URL = 'https://api.data.gov.in/resource';

// OpenStreetMap Nominatim API (Free geocoding)
const NOMINATIM_BASE_URL = 'https://nominatim.openstreetmap.org';

// Zone mapping for shipping calculations
const SHIPPING_ZONES: Record<string, number> = {
  'north': 1, // Delhi, Punjab, Haryana, Himachal Pradesh, J&K, Uttarakhand
  'west': 2,  // Maharashtra, Gujarat, Rajasthan, Goa
  'south': 3, // Karnataka, Tamil Nadu, Kerala, Andhra Pradesh, Telangana
  'east': 4,  // West Bengal, Odisha, Jharkhand, Bihar
  'central': 5, // MP, Chhattisgarh, UP
  'northeast': 6 // Assam, Meghalaya, etc.
};

const STATE_TO_ZONE: Record<string, string> = {
  'delhi': 'north',
  'punjab': 'north',
  'haryana': 'north',
  'himachal pradesh': 'north',
  'jammu and kashmir': 'north',
  'uttarakhand': 'north',
  'maharashtra': 'west',
  'gujarat': 'west',
  'rajasthan': 'west',
  'goa': 'west',
  'karnataka': 'south',
  'tamil nadu': 'south',
  'kerala': 'south',
  'andhra pradesh': 'south',
  'telangana': 'south',
  'west bengal': 'east',
  'odisha': 'east',
  'jharkhand': 'east',
  'bihar': 'east',
  'madhya pradesh': 'central',
  'chhattisgarh': 'central',
  'uttar pradesh': 'central'
};

export const validatePincode = async (pincode: string): Promise<boolean> => {
  // Basic format validation
  if (!/^[1-9][0-9]{5}$/.test(pincode)) {
    return false;
  }
  
  try {
    // Use Data.gov.in API for validation
    const response = await fetch(
      `${DATA_GOV_BASE_URL}/25198f6c-d6b3-4112-af83-4f62c1d13e24?api-key=${DATA_GOV_API_KEY}&format=json&filters[pincode]=${pincode}`,
      {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        }
      }
    );
    
    if (response.ok) {
      const data = await response.json();
      return data.records && data.records.length > 0;
    }
  } catch (error) {
    console.log('Data.gov.in API unavailable, using fallback validation');
  }
  
  // Fallback validation
  const firstDigit = pincode.charAt(0);
  const validFirstDigits = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];
  return validFirstDigits.includes(firstDigit);
};

export const getPincodeDetails = async (pincode: string): Promise<{
  city: string;
  state: string;
  district: string;
  zone: string;
} | null> => {
  try {
    // Use Data.gov.in API for detailed information
    const response = await fetch(
      `${DATA_GOV_BASE_URL}/25198f6c-d6b3-4112-af83-4f62c1d13e24?api-key=${DATA_GOV_API_KEY}&format=json&filters[pincode]=${pincode}`,
      {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        }
      }
    );
    
    if (response.ok) {
      const data = await response.json();
      if (data.records && data.records.length > 0) {
        const record = data.records[0];
        const state = record.statename?.toLowerCase() || '';
        const zone = STATE_TO_ZONE[state] || 'central';
        
        return {
          city: record.districtname || record.officename || 'Unknown',
          state: record.statename || 'Unknown',
          district: record.districtname || 'Unknown',
          zone
        };
      }
    }
  } catch (error) {
    console.log('Data.gov.in API error, using fallback data');
  }
  
  // Fallback data for common pincodes
  const fallbackData: Record<string, any> = {
    '400001': { city: 'Mumbai', state: 'Maharashtra', district: 'Mumbai', zone: 'west' },
    '110001': { city: 'Delhi', state: 'Delhi', district: 'Central Delhi', zone: 'north' },
    '560001': { city: 'Bangalore', state: 'Karnataka', district: 'Bangalore Urban', zone: 'south' },
    '600001': { city: 'Chennai', state: 'Tamil Nadu', district: 'Chennai', zone: 'south' },
    '700001': { city: 'Kolkata', state: 'West Bengal', district: 'Kolkata', zone: 'east' },
    '500001': { city: 'Hyderabad', state: 'Telangana', district: 'Hyderabad', zone: 'south' }
  };
  
  return fallbackData[pincode] || null;
};

export const validateAddress = async (
  address: ShippingAddress
): Promise<AddressValidation> => {
  const errors: string[] = [];
  
  // Validate pincode
  const isPincodeValid = await validatePincode(address.zipCode);
  if (!isPincodeValid) {
    errors.push('Invalid postal code - PIN code not found in Indian postal directory');
  }
  
  // Get pincode details and validate state-pincode combination
  const pincodeDetails = await getPincodeDetails(address.zipCode);
  if (pincodeDetails && pincodeDetails.state.toLowerCase() !== address.state.toLowerCase()) {
    errors.push('Postal code does not match the selected state');
  }
  
  // Basic address completeness check
  if (!address.street || address.street.length < 5) {
    errors.push('Street address is too short');
  }
  
  if (!address.city || address.city.length < 2) {
    errors.push('City name is required');
  }
  
  const isValid = errors.length === 0;
  
  // Generate normalized address if valid
  let normalizedAddress: ShippingAddress | undefined;
  if (isValid && pincodeDetails) {
    normalizedAddress = {
      ...address,
      city: pincodeDetails.city,
      state: pincodeDetails.state
    };
  }
  
  return {
    isValid,
    errors: errors.length > 0 ? errors : undefined,
    normalizedAddress
  };
};

export const getAddressSuggestions = async (
  query: string,
  zipCode?: string
): Promise<ShippingAddress[]> => {
  if (query.length < 3) return [];
  
  try {
    // Use OpenStreetMap Nominatim for address suggestions (Free)
    const response = await fetch(
      `${NOMINATIM_BASE_URL}/search?q=${encodeURIComponent(query + ', India')}&format=json&addressdetails=1&limit=3`,
      {
        headers: {
          'User-Agent': 'EcommerceApp/1.0'
        }
      }
    );
    
    if (response.ok) {
      const data = await response.json();
      return data.map((item: any) => ({
        street: item.display_name.split(',')[0],
        city: item.address?.city || item.address?.town || item.address?.village || 'Unknown',
        state: item.address?.state || 'Unknown',
        zipCode: item.address?.postcode || zipCode || '',
        country: 'IN'
      })).slice(0, 3);
    }
  } catch (error) {
    console.log('Nominatim API error, using fallback suggestions');
  }
  
  // Fallback suggestions
  const mockSuggestions: ShippingAddress[] = [
    {
      street: `${query} Main Road`,
      city: 'Mumbai',
      state: 'Maharashtra',
      zipCode: zipCode || '400001',
      country: 'IN'
    },
    {
      street: `${query} Lane`,
      city: 'Mumbai',
      state: 'Maharashtra', 
      zipCode: zipCode || '400002',
      country: 'IN'
    }
  ];
  
  return mockSuggestions.slice(0, 3);
};

// Calculate shipping zone distance for rate calculation
export const getShippingZone = (fromState: string, toState: string): number => {
  const fromZone = STATE_TO_ZONE[fromState.toLowerCase()] || 'central';
  const toZone = STATE_TO_ZONE[toState.toLowerCase()] || 'central';
  
  if (fromZone === toZone) return 1; // Same zone
  
  const zoneDistance: Record<string, Record<string, number>> = {
    'west': { 'north': 2, 'south': 3, 'east': 4, 'central': 2, 'northeast': 5 },
    'north': { 'west': 2, 'south': 4, 'east': 3, 'central': 2, 'northeast': 3 },
    'south': { 'west': 3, 'north': 4, 'east': 4, 'central': 3, 'northeast': 5 },
    'east': { 'west': 4, 'north': 3, 'south': 4, 'central': 3, 'northeast': 2 },
    'central': { 'west': 2, 'north': 2, 'south': 3, 'east': 3, 'northeast': 4 }
  };
  
  return zoneDistance[fromZone]?.[toZone] || 3;
};
