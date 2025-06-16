
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Calendar, Users, MapPin, Home } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const BookingConfirmation = () => {
  const { id } = useParams<{ id: string }>();

  // In a real app, you'd fetch booking details by ID
  const bookingDetails = {
    id: id || '',
    propertyName: 'Luxury Villa with Ocean View',
    checkIn: '2024-07-15',
    checkOut: '2024-07-20',
    guests: 4,
    total: 1250.00,
    confirmationNumber: `BK${Date.now().toString().slice(-6)}`
  };

  return (
    <div className="min-h-screen bg-pearl-50">
      <Navbar />
      <div className="max-w-2xl mx-auto px-4 py-8">
        <Card className="bg-pearl-100 border-olive-200 shadow-lg">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <CardTitle className="text-2xl text-olive-800">Booking Confirmed!</CardTitle>
            <p className="text-olive-600">Your reservation has been successfully processed</p>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div className="bg-pearl-50 p-4 rounded-lg">
              <h3 className="font-semibold text-olive-800 mb-2">Confirmation Details</h3>
              <div className="space-y-2 text-olive-600">
                <p><strong>Confirmation #:</strong> {bookingDetails.confirmationNumber}</p>
                <p><strong>Booking ID:</strong> #{bookingDetails.id.slice(0, 8)}</p>
              </div>
            </div>

            <div className="grid gap-4">
              <div className="flex items-center space-x-3">
                <MapPin className="w-5 h-5 text-olive-600" />
                <div>
                  <p className="font-medium text-olive-800">{bookingDetails.propertyName}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <Calendar className="w-5 h-5 text-olive-600" />
                <div>
                  <p className="text-olive-800">
                    {new Date(bookingDetails.checkIn).toLocaleDateString()} - {new Date(bookingDetails.checkOut).toLocaleDateString()}
                  </p>
                  <p className="text-sm text-olive-600">5 nights</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <Users className="w-5 h-5 text-olive-600" />
                <div>
                  <p className="text-olive-800">{bookingDetails.guests} guests</p>
                </div>
              </div>
            </div>

            <div className="bg-olive-50 p-4 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-olive-800">Total Amount:</span>
                <span className="font-bold text-xl text-olive-800">${bookingDetails.total.toFixed(2)}</span>
              </div>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <h4 className="font-medium text-blue-800 mb-2">What's Next?</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• You'll receive a confirmation email shortly</li>
                <li>• Check-in instructions will be sent 24 hours before arrival</li>
                <li>• Contact us if you need to modify your booking</li>
              </ul>
            </div>

            <div className="flex gap-3">
              <Link to="/" className="flex-1">
                <Button variant="outline" className="w-full border-olive-300">
                  <Home className="mr-2 h-4 w-4" />
                  Back to Home
                </Button>
              </Link>
              <Link to="/properties" className="flex-1">
                <Button className="w-full bg-olive-600 hover:bg-olive-700">
                  Browse More Properties
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
      <Footer />
    </div>
  );
};

export default BookingConfirmation;
