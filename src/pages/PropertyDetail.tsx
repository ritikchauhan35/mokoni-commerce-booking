import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar, Users, ArrowLeft, MapPin, Star } from 'lucide-react';
import { useProperty } from '@/hooks/useProperties';
import { useToast } from '@/hooks/use-toast';
import { createBooking } from '@/services/bookings';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const PropertyDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { data: property, isLoading } = useProperty(id!);
  const { toast } = useToast();
  const navigate = useNavigate();
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isBooking, setIsBooking] = useState(false);

  // Guest details form
  const [guestDetails, setGuestDetails] = useState({
    name: '',
    email: '',
    phone: ''
  });

  const handleBooking = async () => {
    if (!checkIn || !checkOut) {
      toast({
        title: "Error",
        description: "Please select check-in and check-out dates",
        variant: "destructive",
      });
      return;
    }

    if (new Date(checkIn) >= new Date(checkOut)) {
      toast({
        title: "Error",
        description: "Check-out date must be after check-in date",
        variant: "destructive",
      });
      return;
    }

    if (!guestDetails.name || !guestDetails.email) {
      toast({
        title: "Error",
        description: "Please fill in your name and email",
        variant: "destructive",
      });
      return;
    }

    setIsBooking(true);

    try {
      const nights = Math.ceil((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 60 * 60 * 24));
      const total = nights * property!.price * 1.1; // Including service fee

      const booking = await createBooking({
        propertyId: property!.id,
        userId: 'guest-user', // In real app, use actual user ID
        checkIn,
        checkOut,
        guests,
        total,
        status: 'pending',
        paymentStatus: 'pending',
        guestDetails
      });

      toast({
        title: "Booking Successful!",
        description: "Your booking has been confirmed. Redirecting...",
      });

      // Redirect to confirmation page
      setTimeout(() => {
        navigate(`/booking-confirmation/${booking.id}`);
      }, 1500);
    } catch (error) {
      console.error('Booking error:', error);
      toast({
        title: "Booking Failed",
        description: "Please try again or contact support",
        variant: "destructive",
      });
    } finally {
      setIsBooking(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-pearl-50">
        <Navbar />
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-olive-600"></div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-pearl-50">
        <Navbar />
        <div className="text-center py-8">
          <p className="text-olive-700">Property not found</p>
          <Link to="/properties">
            <Button className="mt-4 bg-olive-600 hover:bg-olive-700">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Properties
            </Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const nights = checkIn && checkOut ? 
    Math.ceil((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 60 * 60 * 24)) : 0;
  const totalPrice = nights * property.price;

  return (
    <div className="min-h-screen bg-pearl-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Link to="/properties">
          <Button variant="ghost" className="mb-6 text-olive-700 hover:bg-olive-100">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Properties
          </Button>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Property Images and Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Main Image */}
            <Card className="overflow-hidden">
              <CardContent className="p-0">
                <img 
                  src={property.images[selectedImage] || "https://images.unsplash.com/photo-1472396961693-142e6e269027?w=800&h=500&fit=crop"} 
                  alt={property.name}
                  className="w-full h-96 object-cover"
                />
              </CardContent>
            </Card>

            {/* Image Thumbnails */}
            {property.images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {property.images.map((image, index) => (
                  <img 
                    key={index}
                    src={image} 
                    alt={`${property.name} ${index + 1}`}
                    className={`w-full h-20 object-cover rounded cursor-pointer border-2 ${
                      selectedImage === index ? 'border-olive-600' : 'border-gray-200'
                    }`}
                    onClick={() => setSelectedImage(index)}
                  />
                ))}
              </div>
            )}

            {/* Property Details */}
            <Card className="bg-pearl-100 border-olive-200">
              <CardContent className="p-6">
                <h1 className="text-3xl font-bold text-olive-800 mb-2">{property.name}</h1>
                <div className="flex items-center text-olive-600 mb-4">
                  <MapPin className="h-4 w-4 mr-1" />
                  {property.location}
                </div>
                
                <div className="flex items-center mb-4">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-5 w-5 ${
                          i < Math.floor(property.rating)
                            ? 'text-yellow-500 fill-current'
                            : 'text-gray-400'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-olive-600 ml-2">({property.reviews} reviews)</span>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-6 text-center">
                  <div className="bg-pearl-50 p-3 rounded">
                    <Users className="h-5 w-5 mx-auto mb-1 text-olive-600" />
                    <p className="text-sm text-olive-600">Up to {property.guests} guests</p>
                  </div>
                  <div className="bg-pearl-50 p-3 rounded">
                    <span className="text-lg text-olive-800 font-semibold">{property.bedrooms}</span>
                    <p className="text-sm text-olive-600">Bedrooms</p>
                  </div>
                  <div className="bg-pearl-50 p-3 rounded">
                    <span className="text-lg text-olive-800 font-semibold">{property.bathrooms || 1}</span>
                    <p className="text-sm text-olive-600">Bathrooms</p>
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-olive-800 mb-2">Description</h3>
                  <p className="text-olive-600 leading-relaxed">{property.description}</p>
                </div>

                {property.amenities && property.amenities.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-olive-800 mb-2">Amenities</h3>
                    <div className="grid grid-cols-2 gap-2">
                      {property.amenities.map((amenity, index) => (
                        <div key={index} className="flex items-center text-olive-600">
                          <span className="w-2 h-2 bg-olive-600 rounded-full mr-2"></span>
                          {amenity}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Booking Card */}
          <div className="lg:col-span-1">
            <Card className="bg-pearl-100 border-olive-200 sticky top-4">
              <CardHeader>
                <CardTitle className="text-olive-800 flex items-center justify-between">
                  <span>${property.price}/night</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label htmlFor="checkin" className="text-olive-700">Check-in</Label>
                    <Input
                      id="checkin"
                      type="date"
                      value={checkIn}
                      onChange={(e) => setCheckIn(e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                      className="border-olive-300"
                    />
                  </div>
                  <div>
                    <Label htmlFor="checkout" className="text-olive-700">Check-out</Label>
                    <Input
                      id="checkout"
                      type="date"
                      value={checkOut}
                      onChange={(e) => setCheckOut(e.target.value)}
                      min={checkIn || new Date().toISOString().split('T')[0]}
                      className="border-olive-300"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="guests" className="text-olive-700">Guests</Label>
                  <Input
                    id="guests"
                    type="number"
                    value={guests}
                    onChange={(e) => setGuests(parseInt(e.target.value) || 1)}
                    min="1"
                    max={property.guests}
                    className="border-olive-300"
                  />
                </div>

                {/* Guest Details Form */}
                <div className="space-y-3 pt-4 border-t border-olive-200">
                  <h4 className="font-medium text-olive-800">Guest Information</h4>
                  <div>
                    <Label htmlFor="guestName" className="text-olive-700">Full Name</Label>
                    <Input
                      id="guestName"
                      value={guestDetails.name}
                      onChange={(e) => setGuestDetails({...guestDetails, name: e.target.value})}
                      className="border-olive-300"
                      placeholder="Enter your full name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="guestEmail" className="text-olive-700">Email</Label>
                    <Input
                      id="guestEmail"
                      type="email"
                      value={guestDetails.email}
                      onChange={(e) => setGuestDetails({...guestDetails, email: e.target.value})}
                      className="border-olive-300"
                      placeholder="your@email.com"
                    />
                  </div>
                  <div>
                    <Label htmlFor="guestPhone" className="text-olive-700">Phone (Optional)</Label>
                    <Input
                      id="guestPhone"
                      value={guestDetails.phone}
                      onChange={(e) => setGuestDetails({...guestDetails, phone: e.target.value})}
                      className="border-olive-300"
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>
                </div>

                {nights > 0 && (
                  <div className="space-y-2 p-3 bg-pearl-50 rounded">
                    <div className="flex justify-between text-olive-700">
                      <span>${property.price} x {nights} nights</span>
                      <span>${totalPrice}</span>
                    </div>
                    <div className="flex justify-between text-olive-700">
                      <span>Service fee</span>
                      <span>${(totalPrice * 0.1).toFixed(2)}</span>
                    </div>
                    <hr className="border-olive-300" />
                    <div className="flex justify-between font-bold text-olive-800">
                      <span>Total</span>
                      <span>${(totalPrice * 1.1).toFixed(2)}</span>
                    </div>
                  </div>
                )}

                <Button 
                  onClick={handleBooking}
                  disabled={isBooking}
                  className="w-full bg-olive-600 hover:bg-olive-700 py-3"
                >
                  <Calendar className="mr-2 h-4 w-4" />
                  {isBooking ? 'Processing...' : 'Book Now'}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default PropertyDetail;
