
import React from 'react';
import { UseFormRegister, FieldErrors } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Truck } from 'lucide-react';

interface CheckoutFormData {
  email: string;
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  phone: string;
  paymentMethod: 'cod' | 'card' | 'upi';
  cardNumber?: string;
  expiryDate?: string;
  cvv?: string;
  cardName?: string;
  upiId?: string;
}

interface AddressFormProps {
  register: UseFormRegister<CheckoutFormData>;
  errors: FieldErrors<CheckoutFormData>;
}

const AddressForm: React.FC<AddressFormProps> = ({ register, errors }) => {
  return (
    <Card className="bg-pearl-100 border-olive-200">
      <CardHeader>
        <CardTitle className="text-olive-800 flex items-center">
          <Truck className="mr-2 h-5 w-5" />
          Shipping Address
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="firstName">First Name</Label>
            <Input
              id="firstName"
              {...register('firstName', { required: 'First name is required' })}
              placeholder="राज / Raj"
            />
            {errors.firstName && <p className="text-red-500 text-sm">{errors.firstName.message}</p>}
          </div>
          <div>
            <Label htmlFor="lastName">Last Name</Label>
            <Input
              id="lastName"
              {...register('lastName', { required: 'Last name is required' })}
              placeholder="शर्मा / Sharma"
            />
            {errors.lastName && <p className="text-red-500 text-sm">{errors.lastName.message}</p>}
          </div>
        </div>
        <div>
          <Label htmlFor="address">Address</Label>
          <Input
            id="address"
            {...register('address', { required: 'Address is required' })}
            placeholder="House No, Street, Locality"
          />
          {errors.address && <p className="text-red-500 text-sm">{errors.address.message}</p>}
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <Label htmlFor="city">City</Label>
            <Input
              id="city"
              {...register('city', { required: 'City is required' })}
              placeholder="Mumbai"
            />
            {errors.city && <p className="text-red-500 text-sm">{errors.city.message}</p>}
          </div>
          <div>
            <Label htmlFor="state">State</Label>
            <Input
              id="state"
              {...register('state', { required: 'State is required' })}
              placeholder="Maharashtra"
            />
            {errors.state && <p className="text-red-500 text-sm">{errors.state.message}</p>}
          </div>
          <div>
            <Label htmlFor="zipCode">PIN Code</Label>
            <Input
              id="zipCode"
              {...register('zipCode', { required: 'PIN code is required' })}
              placeholder="400001"
            />
            {errors.zipCode && <p className="text-red-500 text-sm">{errors.zipCode.message}</p>}
          </div>
        </div>
        <div>
          <Label htmlFor="phone">Phone</Label>
          <Input
            id="phone"
            {...register('phone', { required: 'Phone is required' })}
            placeholder="+91 98765 43210"
          />
          {errors.phone && <p className="text-red-500 text-sm">{errors.phone.message}</p>}
        </div>
      </CardContent>
    </Card>
  );
};

export default AddressForm;
