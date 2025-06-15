
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { HeroSlide } from '@/types/hero';

const heroSlideSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title must be less than 100 characters'),
  subtitle: z.string().min(1, 'Subtitle is required').max(150, 'Subtitle must be less than 150 characters'),
  description: z.string().min(1, 'Description is required').max(300, 'Description must be less than 300 characters'),
  image: z.string().url('Please enter a valid image URL'),
  primaryAction: z.string().min(1, 'Primary action text is required').max(50, 'Primary action must be less than 50 characters'),
  secondaryAction: z.string().min(1, 'Secondary action text is required').max(50, 'Secondary action must be less than 50 characters'),
  actionType: z.enum(['shop', 'book', 'explore']),
  isActive: z.boolean(),
});

type HeroSlideFormData = z.infer<typeof heroSlideSchema>;

interface HeroSlideFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: HeroSlideFormData) => void;
  slide?: HeroSlide | null;
  loading?: boolean;
}

const HeroSlideFormModal: React.FC<HeroSlideFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  slide,
  loading = false,
}) => {
  const form = useForm<HeroSlideFormData>({
    resolver: zodResolver(heroSlideSchema),
    defaultValues: {
      title: '',
      subtitle: '',
      description: '',
      image: '',
      primaryAction: '',
      secondaryAction: '',
      actionType: 'shop',
      isActive: true,
    },
  });

  useEffect(() => {
    if (slide) {
      form.reset({
        title: slide.title,
        subtitle: slide.subtitle,
        description: slide.description,
        image: slide.image,
        primaryAction: slide.primaryAction,
        secondaryAction: slide.secondaryAction,
        actionType: slide.actionType,
        isActive: slide.isActive,
      });
    } else {
      form.reset({
        title: '',
        subtitle: '',
        description: '',
        image: '',
        primaryAction: '',
        secondaryAction: '',
        actionType: 'shop',
        isActive: true,
      });
    }
  }, [slide, form]);

  const handleSubmit = (data: HeroSlideFormData) => {
    onSubmit(data);
    form.reset();
  };

  const handleClose = () => {
    form.reset();
    onClose();
  };

  const imageUrl = form.watch('image');

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {slide ? 'Edit Hero Slide' : 'Add New Hero Slide'}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter slide title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="subtitle"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Subtitle</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter slide subtitle" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Enter slide description" 
                      rows={3}
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="image"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Image URL</FormLabel>
                  <FormControl>
                    <Input placeholder="https://example.com/image.jpg" {...field} />
                  </FormControl>
                  <FormMessage />
                  {imageUrl && (
                    <div className="mt-2">
                      <img
                        src={imageUrl}
                        alt="Preview"
                        className="w-full h-32 object-cover rounded-md"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    </div>
                  )}
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="primaryAction"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Primary Action Text</FormLabel>
                    <FormControl>
                      <Input placeholder="Shop Now" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="secondaryAction"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Secondary Action Text</FormLabel>
                    <FormControl>
                      <Input placeholder="View Catalog" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="actionType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Action Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select action type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="shop">Shop</SelectItem>
                        <SelectItem value="book">Book</SelectItem>
                        <SelectItem value="explore">Explore</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="isActive"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Active Status</FormLabel>
                      <div className="text-sm text-muted-foreground">
                        Show this slide in the carousel
                      </div>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? 'Saving...' : slide ? 'Update Slide' : 'Add Slide'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default HeroSlideFormModal;
