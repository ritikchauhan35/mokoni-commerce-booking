
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Truck, Clock, Shield, MapPin } from 'lucide-react';
import { ShippingRate, ShippingQuoteRequest } from '@/types/shipping';
import { getShippingRates } from '@/services/shipping';

interface ShippingOptionsProps {
  shippingRequest: ShippingQuoteRequest;
  selectedRate: ShippingRate | null;
  onRateSelect: (rate: ShippingRate) => void;
}

const ShippingOptions: React.FC<ShippingOptionsProps> = ({
  shippingRequest,
  selectedRate,
  onRateSelect
}) => {
  const [rates, setRates] = useState<ShippingRate[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (shippingRequest) {
      fetchShippingRates();
    }
  }, [shippingRequest]);

  const fetchShippingRates = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const shippingRates = await getShippingRates(shippingRequest);
      setRates(shippingRates);
      
      // Auto-select first rate if none selected
      if (!selectedRate && shippingRates.length > 0) {
        onRateSelect(shippingRates[0]);
      }
    } catch (err) {
      setError('Failed to fetch shipping rates. Please try again.');
      console.error('Error fetching shipping rates:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatDeliveryDate = (date: Date) => {
    return date.toLocaleDateString('en-IN', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  const getServiceIcon = (serviceType: string) => {
    switch (serviceType) {
      case 'same_day':
        return <Clock className="h-4 w-4 text-orange-500" />;
      case 'express':
        return <Truck className="h-4 w-4 text-blue-500" />;
      default:
        return <MapPin className="h-4 w-4 text-green-500" />;
    }
  };

  if (loading) {
    return (
      <Card className="bg-pearl-100 border-olive-200">
        <CardHeader>
          <CardTitle className="text-olive-800 flex items-center">
            <Truck className="mr-2 h-5 w-5" />
            Loading Shipping Options...
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-3">
            <div className="h-16 bg-olive-100 rounded"></div>
            <div className="h-16 bg-olive-100 rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="bg-pearl-100 border-olive-200">
        <CardHeader>
          <CardTitle className="text-olive-800 flex items-center">
            <Truck className="mr-2 h-5 w-5" />
            Shipping Options
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-red-600">{error}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-pearl-100 border-olive-200">
      <CardHeader>
        <CardTitle className="text-olive-800 flex items-center">
          <Truck className="mr-2 h-5 w-5" />
          Shipping Options
        </CardTitle>
      </CardHeader>
      <CardContent>
        <RadioGroup
          value={selectedRate?.providerId}
          onValueChange={(value) => {
            const rate = rates.find(r => r.providerId === value);
            if (rate) onRateSelect(rate);
          }}
          className="space-y-3"
        >
          {rates.map((rate) => (
            <div
              key={`${rate.providerId}-${rate.serviceType}`}
              className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-pearl-50 cursor-pointer"
            >
              <RadioGroupItem 
                value={rate.providerId} 
                id={`${rate.providerId}-${rate.serviceType}`}
              />
              <Label 
                htmlFor={`${rate.providerId}-${rate.serviceType}`}
                className="flex-1 cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    {getServiceIcon(rate.serviceType)}
                    <div>
                      <p className="font-medium text-olive-800">
                        {rate.providerName}
                      </p>
                      <p className="text-sm text-olive-600">
                        {rate.serviceName}
                      </p>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge variant="outline" className="text-xs">
                          {rate.estimatedDays === 0 ? 'Today' : `${rate.estimatedDays} days`}
                        </Badge>
                        {rate.isInsured && (
                          <Badge variant="outline" className="text-xs">
                            <Shield className="h-3 w-3 mr-1" />
                            Insured
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-olive-800">₹{rate.rate.toFixed(2)}</p>
                    <p className="text-xs text-olive-600">
                      Delivery by {formatDeliveryDate(rate.deliveryDate)}
                    </p>
                  </div>
                </div>
              </Label>
            </div>
          ))}
        </RadioGroup>
      </CardContent>
    </Card>
  );
};

export default ShippingOptions;
