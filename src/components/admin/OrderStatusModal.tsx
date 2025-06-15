
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { useForm } from 'react-hook-form';
import { Order } from '@/types';
import { updateOrderStatus } from '@/services';
import { useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';

interface OrderStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: Order | null;
}

interface StatusFormData {
  status: Order['status'];
}

const OrderStatusModal: React.FC<OrderStatusModalProps> = ({ isOpen, onClose, order }) => {
  const { handleSubmit, setValue, watch } = useForm<StatusFormData>();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const currentStatus = watch('status');

  React.useEffect(() => {
    if (order) {
      setValue('status', order.status);
    }
  }, [order, setValue]);

  const onSubmit = async (data: StatusFormData) => {
    if (!order) return;

    try {
      await updateOrderStatus(order.id, data.status);
      queryClient.invalidateQueries({ queryKey: ['admin-orders'] });
      toast({
        title: "Success",
        description: "Order status updated successfully",
      });
      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update order status",
        variant: "destructive",
      });
    }
  };

  if (!order) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Update Order Status</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label>Order ID</Label>
            <p className="text-sm text-gray-600">#{order.id.slice(0, 8)}</p>
          </div>
          
          <div>
            <Label>Current Status</Label>
            <Select value={currentStatus} onValueChange={(value) => setValue('status', value as Order['status'])}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="processing">Processing</SelectItem>
                <SelectItem value="shipped">Shipped</SelectItem>
                <SelectItem value="delivered">Delivered</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
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

export default OrderStatusModal;
