
import React from 'react';
import { UseFormRegister, FieldErrors } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CreditCard } from 'lucide-react';

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

interface ContactFormProps {
  register: UseFormRegister<CheckoutFormData>;
  errors: FieldErrors<CheckoutFormData>;
}

const ContactForm: React.FC<ContactFormProps> = ({ register, errors }) => {
  return (
    <Card className="bg-pearl-100 border-olive-200">
      <CardHeader>
        <CardTitle className="text-olive-800 flex items-center">
          <CreditCard className="mr-2 h-5 w-5" />
          Contact Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            {...register('email', { required: 'Email is required' })}
            placeholder="your@email.com"
          />
          {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
        </div>
      </CardContent>
    </Card>
  );
};

export default ContactForm;
