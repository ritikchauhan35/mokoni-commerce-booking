
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { CheckCircle, Package, ArrowRight } from 'lucide-react';

const OrderConfirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const { orderId, orderTotal, customerName } = location.state || {};

  if (!orderId) {
    return (
      <div className="min-h-screen bg-pearl-50">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 py-16 text-center">
          <h1 className="text-3xl font-bold text-olive-800 mb-4">Order Not Found</h1>
          <p className="text-olive-600 mb-8">We couldn't find your order information.</p>
          <Button onClick={() => navigate('/')} className="bg-olive-600 hover:bg-olive-700">
            Return Home
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-pearl-50">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="text-center mb-8">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-olive-800 mb-2">Order Confirmed!</h1>
          <p className="text-xl text-olive-600">Thank you for your purchase, {customerName}</p>
        </div>

        <Card className="bg-white border-olive-200 mb-8">
          <CardHeader>
            <CardTitle className="text-olive-800 flex items-center">
              <Package className="mr-2 h-5 w-5" />
              Order Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-olive-600">Order ID</p>
                <p className="font-semibold text-olive-800">#{orderId.slice(0, 8)}</p>
              </div>
              <div>
                <p className="text-sm text-olive-600">Total Amount</p>
                <p className="font-semibold text-olive-800">₹{orderTotal?.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-sm text-olive-600">Status</p>
                <p className="font-semibold text-green-600">Confirmed</p>
              </div>
              <div>
                <p className="text-sm text-olive-600">Payment</p>
                <p className="font-semibold text-olive-800">Processing</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
          <h2 className="text-lg font-semibold text-blue-800 mb-2">What happens next?</h2>
          <ul className="text-blue-700 space-y-2">
            <li className="flex items-center">
              <ArrowRight className="h-4 w-4 mr-2" />
              You will receive an order confirmation email shortly
            </li>
            <li className="flex items-center">
              <ArrowRight className="h-4 w-4 mr-2" />
              We'll prepare your order for shipping
            </li>
            <li className="flex items-center">
              <ArrowRight className="h-4 w-4 mr-2" />
              You'll get a tracking number once shipped
            </li>
            <li className="flex items-center">
              <ArrowRight className="h-4 w-4 mr-2" />
              Estimated delivery: 3-5 business days
            </li>
          </ul>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            onClick={() => navigate('/products')} 
            variant="outline"
            className="border-olive-600 text-olive-600 hover:bg-olive-50"
          >
            Continue Shopping
          </Button>
          <Button 
            onClick={() => navigate('/')} 
            className="bg-olive-600 hover:bg-olive-700"
          >
            Return Home
          </Button>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default OrderConfirmation;
