import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getProperty } from '@/services/properties';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Calendar } from 'lucide-react';
import { DateRange } from 'react-day-picker';
import { format } from 'date-fns';
import { DatePicker } from '@/components/ui/date-picker';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Slider } from "@/components/ui/slider"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { toast } from "@/components/ui/use-toast"
import { createBooking } from '@/services/bookings';
import { Booking } from '@/types';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const PropertyDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isBooking, setIsBooking] = useState(false);
  const [checkInDate, setCheckInDate] = useState<string | undefined>('');
  const [checkOutDate, setCheckOutDate] = useState<string | undefined>('');
  const [guests, setGuests] = useState(1);

  const { data: property, isLoading, isError } = useQuery({
    queryKey: ['property', id],
    queryFn: () => getProperty(id as string),
  });

  useEffect(() => {
    if (property) {
      setGuests(1); // Reset guests when property changes
    }
  }, [property]);

  if (isLoading) {
    return <div className="min-h-screen bg-pearl-50 flex items-center justify-center">Loading...</div>;
  }

  if (isError || !property) {
    return <div className="min-h-screen bg-pearl-50 flex items-center justify-center">Error loading property</div>;
  }

  const calculateTotal = () => {
    if (!checkInDate || !checkOutDate) return 0;

    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);
    const duration = (checkOut.getTime() - checkIn.getTime()) / (1000 * 3600 * 24);
    return duration * property.pricePerNight;
  };

  const handleBooking = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (!property || !checkInDate || !checkOutDate || guests < 1) {
      toast.error('Please fill in all booking details');
      return;
    }

    setIsBooking(true);
    try {
      const bookingData: Omit<Booking, 'id'> = {
        userId: user.uid,
        propertyId: property.id,
        checkIn: checkInDate,
        checkOut: checkOutDate,
        guests,
        total: calculateTotal(),
        status: 'pending',
        guestDetails: {
          name: user.displayName || '',
          email: user.email || '',
          phone: ''
        },
        createdAt: new Date()
      };

      await createBooking(bookingData);
      toast.success('Booking created successfully!');
      navigate('/booking-confirmation');
    } catch (error) {
      console.error('Booking error:', error);
      toast.error('Failed to create booking. Please try again.');
    } finally {
      setIsBooking(false);
    }
  };

  return (
    <div className="min-h-screen bg-pearl-50">
      <Navbar />
      <div className="container mx-auto mt-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Property Images */}
          <div>
            <img src={property.imageUrl} alt={property.name} className="w-full h-auto rounded-lg shadow-md" />
          </div>

          {/* Property Details */}
          <div>
            <h1 className="text-3xl font-semibold text-olive-800 mb-4">{property.name}</h1>
            <div className="flex items-center space-x-2 mb-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              <span className="text-olive-700 font-medium">Hosted by {property.host}</span>
            </div>
            <div className="flex items-center space-x-2 mb-4">
              <Badge variant="secondary">{property.propertyType}</Badge>
              <Badge variant="outline">{property.location}</Badge>
            </div>
            <p className="text-olive-700 mb-6">{property.description}</p>

            <Separator className="my-4" />

            {/* Booking Section */}
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-olive-800 mb-3">Book this property</h2>

              {/* Date Picker */}
              <div className="mb-4">
                <Label htmlFor="date" className="text-olive-700 block mb-2">
                  Dates
                </Label>
                <DatePicker
                  mode="range"
                  defaultMonth={new Date()}
                  onSelect={(date: DateRange | undefined) => {
                    if (date?.from) {
                      setCheckInDate(format(date.from, 'yyyy-MM-dd'));
                    }
                    if (date?.to) {
                      setCheckOutDate(format(date.to, 'yyyy-MM-dd'));
                    }
                  }}
                />
                {checkInDate && checkOutDate && (
                  <p className="text-sm text-olive-600 mt-2">
                    Selected dates: {checkInDate} - {checkOutDate}
                  </p>
                )}
              </div>

              {/* Guests */}
              <div className="mb-4">
                <Label htmlFor="guests" className="text-olive-700 block mb-2">
                  Guests
                </Label>
                <Input
                  type="number"
                  id="guests"
                  min="1"
                  value={guests}
                  onChange={(e) => setGuests(parseInt(e.target.value))}
                  className="bg-pearl-100 border-olive-200 text-olive-800 placeholder-olive-500 focus:border-olive-500 focus:ring-olive-500"
                />
              </div>

              {/* Price and Booking Button */}
              <div className="flex items-center justify-between mb-4">
                <div>
                  <span className="text-olive-800 font-bold text-xl">${property.pricePerNight}</span>
                  <span className="text-olive-600"> / night</span>
                </div>
                <div>
                  <span className="text-olive-800 font-medium mr-2">Total: ${calculateTotal()}</span>
                  <Button
                    onClick={handleBooking}
                    disabled={isBooking}
                    className="bg-olive-600 hover:bg-olive-700 text-pearl-50"
                  >
                    {isBooking ? 'Booking...' : 'Book Now'}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default PropertyDetail;
