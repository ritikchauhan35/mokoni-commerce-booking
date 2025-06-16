
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useForm } from 'react-hook-form';
import { Property } from '@/types';
import { addProperty, updateProperty } from '@/services';
import { useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import FileUpload from '@/components/ui/file-upload';

interface PropertyFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  property?: Property;
  mode: 'create' | 'edit';
}

interface PropertyFormData {
  name: string;
  description: string;
  price: number;
  pricePerNight: number;
  location: string;
  guests: number;
  bedrooms: number;
  bathrooms?: number;
  images: string;
  amenities: string;
  rules?: string;
  host: string;
  propertyType: string;
}

const PropertyFormModal: React.FC<PropertyFormModalProps> = ({ isOpen, onClose, property, mode }) => {
  const { register, handleSubmit, formState: { errors }, reset, setValue, watch } = useForm<PropertyFormData>();
  const [imageMethod, setImageMethod] = useState<'url' | 'upload'>('url');
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const watchedImages = watch('images');

  React.useEffect(() => {
    if (property && mode === 'edit') {
      setValue('name', property.name);
      setValue('description', property.description);
      setValue('price', property.price);
      setValue('pricePerNight', property.pricePerNight);
      setValue('location', property.location);
      setValue('guests', property.guests);
      setValue('bedrooms', property.bedrooms);
      setValue('bathrooms', property.bathrooms);
      setValue('images', property.images.join(', '));
      setValue('amenities', property.amenities.join(', '));
      setValue('rules', property.rules?.join(', '));
      setValue('host', property.host);
      setValue('propertyType', property.propertyType);
      
      // Detect if images are URLs or base64
      const hasBase64 = property.images.some(img => img.startsWith('data:'));
      setImageMethod(hasBase64 ? 'upload' : 'url');
    } else {
      reset();
      setImageMethod('url');
    }
  }, [property, mode, setValue, reset]);

  const handleFileUpload = (urls: string[]) => {
    setValue('images', urls.join(', '));
  };

  const getCurrentImages = (): string[] => {
    if (imageMethod === 'upload' && watchedImages) {
      return watchedImages.split(',').map(img => img.trim()).filter(img => img);
    }
    return [];
  };

  const onSubmit = async (data: PropertyFormData) => {
    try {
      const images = data.images.split(',').map(img => img.trim()).filter(img => img);
      const propertyData = {
        ...data,
        images,
        imageUrl: images[0] || '', // Use first image as main imageUrl
        amenities: data.amenities.split(',').map(amenity => amenity.trim()).filter(amenity => amenity),
        rules: data.rules ? data.rules.split(',').map(rule => rule.trim()).filter(rule => rule) : [],
        rating: property?.rating || 0,
        reviews: property?.reviews || 0,
        availability: property?.availability || [],
        createdAt: property?.createdAt || new Date(),
      };

      if (mode === 'create') {
        await addProperty(propertyData);
        toast({
          title: "Success",
          description: "Property created successfully",
        });
      } else if (property) {
        await updateProperty(property.id, propertyData);
        toast({
          title: "Success",
          description: "Property updated successfully",
        });
      }

      queryClient.invalidateQueries({ queryKey: ['admin-properties'] });
      onClose();
      reset();
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to ${mode} property`,
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{mode === 'create' ? 'Add New Property' : 'Edit Property'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Property Name</Label>
              <Input
                id="name"
                {...register('name', { required: 'Property name is required' })}
                placeholder="Enter property name"
              />
              {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
            </div>
            <div>
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                {...register('location', { required: 'Location is required' })}
                placeholder="Enter location"
              />
              {errors.location && <p className="text-red-500 text-sm">{errors.location.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="host">Host Name</Label>
              <Input
                id="host"
                {...register('host', { required: 'Host name is required' })}
                placeholder="Enter host name"
              />
              {errors.host && <p className="text-red-500 text-sm">{errors.host.message}</p>}
            </div>
            <div>
              <Label htmlFor="propertyType">Property Type</Label>
              <Input
                id="propertyType"
                {...register('propertyType', { required: 'Property type is required' })}
                placeholder="e.g., Apartment, House, Villa"
              />
              {errors.propertyType && <p className="text-red-500 text-sm">{errors.propertyType.message}</p>}
            </div>
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              {...register('description', { required: 'Description is required' })}
              placeholder="Enter property description"
              rows={3}
            />
            {errors.description && <p className="text-red-500 text-sm">{errors.description.message}</p>}
          </div>

          <div className="grid grid-cols-5 gap-4">
            <div>
              <Label htmlFor="price">Price ($)</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                {...register('price', { required: 'Price is required', min: 0 })}
                placeholder="0.00"
              />
              {errors.price && <p className="text-red-500 text-sm">{errors.price.message}</p>}
            </div>
            <div>
              <Label htmlFor="pricePerNight">Price/night ($)</Label>
              <Input
                id="pricePerNight"
                type="number"
                step="0.01"
                {...register('pricePerNight', { required: 'Price per night is required', min: 0 })}
                placeholder="0.00"
              />
              {errors.pricePerNight && <p className="text-red-500 text-sm">{errors.pricePerNight.message}</p>}
            </div>
            <div>
              <Label htmlFor="guests">Guests</Label>
              <Input
                id="guests"
                type="number"
                {...register('guests', { required: 'Number of guests is required', min: 1 })}
                placeholder="1"
              />
              {errors.guests && <p className="text-red-500 text-sm">{errors.guests.message}</p>}
            </div>
            <div>
              <Label htmlFor="bedrooms">Bedrooms</Label>
              <Input
                id="bedrooms"
                type="number"
                {...register('bedrooms', { required: 'Number of bedrooms is required', min: 1 })}
                placeholder="1"
              />
              {errors.bedrooms && <p className="text-red-500 text-sm">{errors.bedrooms.message}</p>}
            </div>
            <div>
              <Label htmlFor="bathrooms">Bathrooms</Label>
              <Input
                id="bathrooms"
                type="number"
                step="0.5"
                {...register('bathrooms', { min: 0 })}
                placeholder="1"
              />
            </div>
          </div>

          <div>
            <Label>Images</Label>
            <Tabs value={imageMethod} onValueChange={(value) => setImageMethod(value as 'url' | 'upload')}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="url">Image URLs</TabsTrigger>
                <TabsTrigger value="upload">Upload Images</TabsTrigger>
              </TabsList>
              
              <TabsContent value="url">
                <Textarea
                  {...register('images')}
                  placeholder="https://example.com/image1.jpg, https://example.com/image2.jpg"
                  rows={2}
                />
              </TabsContent>
              
              <TabsContent value="upload">
                <FileUpload
                  onFilesChange={handleFileUpload}
                  currentFiles={getCurrentImages()}
                  multiple={true}
                  showPreview={true}
                />
              </TabsContent>
            </Tabs>
          </div>

          <div>
            <Label htmlFor="amenities">Amenities (comma-separated)</Label>
            <Textarea
              id="amenities"
              {...register('amenities')}
              placeholder="WiFi, Pool, Parking, Kitchen"
              rows={2}
            />
          </div>

          <div>
            <Label htmlFor="rules">House Rules (comma-separated)</Label>
            <Textarea
              id="rules"
              {...register('rules')}
              placeholder="No smoking, No pets, Check-in after 3 PM"
              rows={2}
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" className="bg-olive-600 hover:bg-olive-700">
              {mode === 'create' ? 'Create Property' : 'Update Property'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default PropertyFormModal;
