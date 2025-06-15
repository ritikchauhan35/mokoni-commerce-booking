
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Search, Eye, Edit, Calendar } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { getAllBookings } from '@/services/firestore';
import { Booking } from '@/types';
import BookingStatusModal from '@/components/admin/BookingStatusModal';

const AdminBookings = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  const { data: bookings = [], isLoading } = useQuery({
    queryKey: ['admin-bookings'],
    queryFn: getAllBookings,
  });

  const filteredBookings = bookings.filter(booking =>
    booking.guestDetails.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    booking.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleUpdateStatus = (booking: Booking) => {
    setSelectedBooking(booking);
    setIsStatusModalOpen(true);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-olive-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-olive-800">Booking Management</h1>
        <div className="flex space-x-2">
          <Button variant="outline" className="border-olive-300">
            Export Bookings
          </Button>
        </div>
      </div>

      <Card className="bg-pearl-50 border-olive-200">
        <CardHeader>
          <CardTitle className="text-olive-800">Bookings ({bookings.length})</CardTitle>
          <div className="flex items-center space-x-2">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-olive-400" />
              <Input
                placeholder="Search bookings..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 border-olive-300 focus:border-olive-500"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-olive-700">Booking ID</TableHead>
                <TableHead className="text-olive-700">Guest</TableHead>
                <TableHead className="text-olive-700">Property</TableHead>
                <TableHead className="text-olive-700">Check-in</TableHead>
                <TableHead className="text-olive-700">Check-out</TableHead>
                <TableHead className="text-olive-700">Guests</TableHead>
                <TableHead className="text-olive-700">Total</TableHead>
                <TableHead className="text-olive-700">Status</TableHead>
                <TableHead className="text-olive-700">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredBookings.map((booking) => (
                <TableRow key={booking.id}>
                  <TableCell className="font-medium text-olive-800">
                    #{booking.id.slice(0, 8)}
                  </TableCell>
                  <TableCell className="text-olive-600">
                    <div>
                      <p>{booking.guestDetails.name}</p>
                      <p className="text-xs text-olive-500">{booking.guestDetails.email}</p>
                    </div>
                  </TableCell>
                  <TableCell className="text-olive-600">{booking.propertyId}</TableCell>
                  <TableCell className="text-olive-600">
                    {new Date(booking.checkIn).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-olive-600">
                    {new Date(booking.checkOut).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-olive-600">{booking.guests}</TableCell>
                  <TableCell className="text-olive-600">${booking.total.toFixed(2)}</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(booking.status)}>
                      {booking.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Button size="sm" variant="outline" className="border-olive-300">
                        <Eye className="h-3 w-3" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="border-olive-300"
                        onClick={() => handleUpdateStatus(booking)}
                      >
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button size="sm" variant="outline" className="border-olive-300">
                        <Calendar className="h-3 w-3" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <BookingStatusModal
        isOpen={isStatusModalOpen}
        onClose={() => setIsStatusModalOpen(false)}
        booking={selectedBooking}
      />
    </div>
  );
};

export default AdminBookings;
