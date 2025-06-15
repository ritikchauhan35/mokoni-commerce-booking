
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ShippingRate } from '@/types/shipping';
import { Product } from '@/types';

interface CheckoutItem {
  id: string;
  productId: string;
  quantity: number;
  product: Product;
}

interface OrderSummaryProps {
  checkoutItems: CheckoutItem[];
  subtotal: number;
  gst: number;
  shippingCost: number;
  codCharges: number;
  total: number;
  selectedShippingRate: ShippingRate | null;
}

const OrderSummary: React.FC<OrderSummaryProps> = ({
  checkoutItems,
  subtotal,
  gst,
  shippingCost,
  codCharges,
  total,
  selectedShippingRate
}) => {
  return (
    <Card className="bg-pearl-100 border-olive-200 sticky top-4">
      <CardHeader>
        <CardTitle className="text-olive-800">Order Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Items */}
        <div className="space-y-3">
          {checkoutItems.map((item) => (
            <div key={item.id} className="flex items-center space-x-3">
              <img 
                src={item.product.images[0] || "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=100&h=100&fit=crop"} 
                alt={item.product.name}
                className="w-12 h-12 object-cover rounded"
              />
              <div className="flex-1">
                <p className="text-sm font-medium text-olive-800">{item.product.name}</p>
                <p className="text-xs text-olive-600">Qty: {item.quantity}</p>
              </div>
              <p className="text-sm font-bold text-olive-800">
                ₹{(item.product.price * item.quantity).toFixed(2)}
              </p>
            </div>
          ))}
        </div>

        <Separator />

        {/* Totals */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-olive-700">Subtotal</span>
            <span className="text-olive-800">₹{subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-olive-700">GST (18%)</span>
            <span className="text-olive-800">₹{gst.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-olive-700">
              Shipping {selectedShippingRate ? `(${selectedShippingRate.providerName})` : ''}
            </span>
            <span className="text-olive-800">
              {shippingCost === 0 ? 'Free' : `₹${shippingCost.toFixed(2)}`}
            </span>
          </div>
          {codCharges > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-olive-700">COD Charges</span>
              <span className="text-olive-800">₹{codCharges.toFixed(2)}</span>
            </div>
          )}
          <Separator />
          <div className="flex justify-between font-bold text-lg">
            <span className="text-olive-800">Total</span>
            <span className="text-olive-800">₹{total.toFixed(2)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default OrderSummary;
