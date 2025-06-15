
// Local caching service to reduce API calls for free tier limits
interface CacheItem<T> {
  data: T;
  timestamp: number;
  ttl: number; // Time to live in milliseconds
}

class CacheService {
  private cache = new Map<string, CacheItem<any>>();
  private readonly defaultTTL = 24 * 60 * 60 * 1000; // 24 hours

  set<T>(key: string, data: T, ttl: number = this.defaultTTL): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl
    });
  }

  get<T>(key: string): T | null {
    const item = this.cache.get(key);
    
    if (!item) return null;
    
    // Check if cache item has expired
    if (Date.now() - item.timestamp > item.ttl) {
      this.cache.delete(key);
      return null;
    }
    
    return item.data;
  }

  has(key: string): boolean {
    const item = this.cache.get(key);
    if (!item) return false;
    
    // Check if expired
    if (Date.now() - item.timestamp > item.ttl) {
      this.cache.delete(key);
      return false;
    }
    
    return true;
  }

  delete(key: string): void {
    this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
  }

  // Get cache statistics
  getStats(): { size: number; keys: string[] } {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys())
    };
  }

  // Clean expired entries
  cleanup(): void {
    const now = Date.now();
    for (const [key, item] of this.cache.entries()) {
      if (now - item.timestamp > item.ttl) {
        this.cache.delete(key);
      }
    }
  }
}

// Export singleton instance
export const cache = new CacheService();

// Cache keys for different services
export const CACHE_KEYS = {
  PINCODE_DETAILS: (pincode: string) => `pincode_${pincode}`,
  SHIPPING_RATES: (fromZip: string, toZip: string, weight: number) => 
    `shipping_${fromZip}_${toZip}_${weight}`,
  ADDRESS_SUGGESTIONS: (query: string) => `address_${query}`,
  TRACKING_INFO: (trackingNumber: string) => `tracking_${trackingNumber}`,
  DELIVERY_SLOTS: (zipCode: string, date: string) => `slots_${zipCode}_${date}`
};

// Cache wrapper functions for common operations
export const getCachedPincodeDetails = async (
  pincode: string,
  fetchFunction: (pincode: string) => Promise<any>
): Promise<any> => {
  const cacheKey = CACHE_KEYS.PINCODE_DETAILS(pincode);
  
  // Try to get from cache first
  const cached = cache.get(cacheKey);
  if (cached) {
    console.log(`Cache hit for pincode: ${pincode}`);
    return cached;
  }
  
  // Fetch from API
  console.log(`Cache miss for pincode: ${pincode}, fetching from API`);
  const data = await fetchFunction(pincode);
  
  // Cache for 7 days (pincode data doesn't change often)
  cache.set(cacheKey, data, 7 * 24 * 60 * 60 * 1000);
  
  return data;
};

export const getCachedShippingRates = async (
  request: any,
  fetchFunction: (request: any) => Promise<any>
): Promise<any> => {
  const cacheKey = CACHE_KEYS.SHIPPING_RATES(
    request.origin.zipCode,
    request.destination.zipCode,
    request.packageDetails.weight
  );
  
  const cached = cache.get(cacheKey);
  if (cached) {
    console.log('Cache hit for shipping rates');
    return cached;
  }
  
  console.log('Cache miss for shipping rates, calculating');
  const data = await fetchFunction(request);
  
  // Cache for 1 hour (shipping rates can change)
  cache.set(cacheKey, data, 60 * 60 * 1000);
  
  return data;
};

// Auto cleanup every hour
setInterval(() => {
  cache.cleanup();
  console.log('Cache cleanup completed');
}, 60 * 60 * 1000);
