
import { ShippingAddress, AddressValidation } from '@/types/shipping';

// Indian postal code patterns by state
const POSTAL_CODE_PATTERNS: Record<string, RegExp> = {
  'maharashtra': /^4[0-9]{5}$/,
  'delhi': /^1[0-9]{5}$/,
  'karnataka': /^5[0-9]{5}$/,
  'tamil nadu': /^6[0-9]{5}$/,
  'west bengal': /^7[0-9]{5}$/,
  'telangana': /^5[0-9]{5}$/,
  'gujarat': /^3[0-9]{5}$/,
  'rajasthan': /^3[0-9]{5}$/,
  'uttar pradesh': /^2[0-9]{5}$/,
  'bihar': /^8[0-9]{5}$/
};

// Major cities with their postal code ranges
const CITY_POSTAL_RANGES: Record<string, string[]> = {
  'mumbai': ['400001', '400104'],
  'delhi': ['110001', '110096'],
  'bangalore': ['560001', '560103'],
  'chennai': ['600001', '600123'],
  'kolkata': ['700001', '700156'],
  'hyderabad': ['500001', '500090'],
  'pune': ['411001', '411057'],
  'ahmedabad': ['380001', '380061']
};

export const validatePincode = async (pincode: string): Promise<boolean> => {
  // Basic format validation
  if (!/^[1-9][0-9]{5}$/.test(pincode)) {
    return false;
  }
  
  // In production, you would call India Post API or other pincode validation service
  // For now, we'll use basic validation
  const firstDigit = pincode.charAt(0);
  const validFirstDigits = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];
  
  return validFirstDigits.includes(firstDigit);
};

export const getPincodeDetails = async (pincode: string): Promise<{
  city: string;
  state: string;
  district: string;
} | null> => {
  // Mock data - in production, integrate with India Post API
  const pincodeData: Record<string, any> = {
    '400001': { city: 'Mumbai', state: 'Maharashtra', district: 'Mumbai' },
    '110001': { city: 'Delhi', state: 'Delhi', district: 'Central Delhi' },
    '560001': { city: 'Bangalore', state: 'Karnataka', district: 'Bangalore Urban' },
    '600001': { city: 'Chennai', state: 'Tamil Nadu', district: 'Chennai' },
    '700001': { city: 'Kolkata', state: 'West Bengal', district: 'Kolkata' },
    '500001': { city: 'Hyderabad', state: 'Telangana', district: 'Hyderabad' }
  };
  
  return pincodeData[pincode] || null;
};

export const validateAddress = async (
  address: ShippingAddress
): Promise<AddressValidation> => {
  const errors: string[] = [];
  
  // Validate pincode
  const isPincodeValid = await validatePincode(address.zipCode);
  if (!isPincodeValid) {
    errors.push('Invalid postal code format');
  }
  
  // Validate state-pincode combination
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
  // Mock suggestions - in production, integrate with Google Places API or MapMyIndia
  if (query.length < 3) return [];
  
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
