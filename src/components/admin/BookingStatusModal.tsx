
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { useForm } from 'react-hook-form';
import { Booking } from '@/types';
import { updateBookingStatus } from '@/services';
import { useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';

interface BookingStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  booking: Booking | null;
}

interface StatusFormData {
  status: Booking['status'];
}

const BookingStatusModal: React.FC<BookingStatusModalProps> = ({ isOpen, onClose, booking }) => {
  const { handleSubmit, setValue, watch } = useForm<StatusFormData>();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const currentStatus = watch('status');

  React.useEffect(() => {
    if (booking) {
      setValue('status', booking.status);
    }
  }, [booking, setValue]);

  const onSubmit = async (data: StatusFormData) => {
    if (!booking) return;

    try {
      await updateBookingStatus(booking.id, data.status);
      queryClient.invalidateQueries({ queryKey: ['admin-bookings'] });
      toast({
        title: "Success",
        description: "Booking status updated successfully",
      });
      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update booking status",
        variant: "destructive",
      });
    }
  };

  if (!booking) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Update Booking Status</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label>Booking ID</Label>
            <p className="text-sm text-gray-600">#{booking.id.slice(0, 8)}</p>
          </div>
          
          <div>
            <Label>Guest</Label>
            <p className="text-sm text-gray-600">{booking.guestDetails.name}</p>
          </div>
          
          <div>
            <Label>Current Status</Label>
            <Select value={currentStatus} onValueChange={(value) => setValue('status', value as Booking['status'])}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" className="bg-olive-600 hover:bg-olive-700">
              Update Status
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default BookingStatusModal;
