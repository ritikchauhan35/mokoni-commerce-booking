
import React from 'react';
import { UseFormRegister, FieldErrors } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Wallet, Banknote, CreditCard } from 'lucide-react';

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

interface PaymentFormProps {
  register: UseFormRegister<CheckoutFormData>;
  errors: FieldErrors<CheckoutFormData>;
  paymentMethod: 'cod' | 'card' | 'upi';
}

const PaymentForm: React.FC<PaymentFormProps> = ({ register, errors, paymentMethod }) => {
  return (
    <Card className="bg-pearl-100 border-olive-200">
      <CardHeader>
        <CardTitle className="text-olive-800 flex items-center">
          <Wallet className="mr-2 h-5 w-5" />
          Payment Method
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <RadioGroup {...register('paymentMethod')} defaultValue="cod" className="space-y-3">
          <div className="flex items-center space-x-2 p-3 border rounded-lg">
            <RadioGroupItem value="cod" id="cod" />
            <Label htmlFor="cod" className="flex items-center cursor-pointer">
              <Banknote className="mr-2 h-4 w-4" />
              Cash on Delivery (COD) - ₹25 charges
            </Label>
          </div>
          <div className="flex items-center space-x-2 p-3 border rounded-lg">
            <RadioGroupItem value="upi" id="upi" />
            <Label htmlFor="upi" className="flex items-center cursor-pointer">
              <Wallet className="mr-2 h-4 w-4" />
              UPI Payment
            </Label>
          </div>
          <div className="flex items-center space-x-2 p-3 border rounded-lg">
            <RadioGroupItem value="card" id="card" />
            <Label htmlFor="card" className="flex items-center cursor-pointer">
              <CreditCard className="mr-2 h-4 w-4" />
              Credit/Debit Card
            </Label>
          </div>
        </RadioGroup>

        {paymentMethod === 'upi' && (
          <div>
            <Label htmlFor="upiId">UPI ID</Label>
            <Input
              id="upiId"
              {...register('upiId', { required: paymentMethod === 'upi' ? 'UPI ID is required' : false })}
              placeholder="yourname@paytm"
            />
            {errors.upiId && <p className="text-red-500 text-sm">{errors.upiId.message}</p>}
          </div>
        )}

        {paymentMethod === 'card' && (
          <div className="space-y-4">
            <div>
              <Label htmlFor="cardName">Name on Card</Label>
              <Input
                id="cardName"
                {...register('cardName', { required: paymentMethod === 'card' ? 'Name on card is required' : false })}
                placeholder="John Doe"
              />
              {errors.cardName && <p className="text-red-500 text-sm">{errors.cardName.message}</p>}
            </div>
            <div>
              <Label htmlFor="cardNumber">Card Number</Label>
              <Input
                id="cardNumber"
                {...register('cardNumber', { required: paymentMethod === 'card' ? 'Card number is required' : false })}
                placeholder="1234 5678 9012 3456"
              />
              {errors.cardNumber && <p className="text-red-500 text-sm">{errors.cardNumber.message}</p>}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="expiryDate">Expiry Date</Label>
                <Input
                  id="expiryDate"
                  {...register('expiryDate', { required: paymentMethod === 'card' ? 'Expiry date is required' : false })}
                  placeholder="MM/YY"
                />
                {errors.expiryDate && <p className="text-red-500 text-sm">{errors.expiryDate.message}</p>}
              </div>
              <div>
                <Label htmlFor="cvv">CVV</Label>
                <Input
                  id="cvv"
                  {...register('cvv', { required: paymentMethod === 'card' ? 'CVV is required' : false })}
                  placeholder="123"
                />
                {errors.cvv && <p className="text-red-500 text-sm">{errors.cvv.message}</p>}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PaymentForm;
