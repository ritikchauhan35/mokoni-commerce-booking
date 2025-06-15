import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useForm } from 'react-hook-form';
import { Product } from '@/types';
import { addProduct, updateProduct } from '@/services';
import { useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { Upload, X, Plus } from 'lucide-react';
import { Card } from '@/components/ui/card';

interface ProductFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  product?: Product;
  mode: 'create' | 'edit';
}

interface ProductFormData {
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  category?: string;
  images: string;
  inventory?: number;
  inStock: boolean;
  weight?: number;
  tags?: string;
}

const ProductFormModal: React.FC<ProductFormModalProps> = ({ isOpen, onClose, product, mode }) => {
  const { register, handleSubmit, formState: { errors }, reset, setValue, watch } = useForm<ProductFormData>();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  React.useEffect(() => {
    if (product && mode === 'edit') {
      setValue('name', product.name);
      setValue('description', product.description);
      setValue('price', product.price);
      setValue('originalPrice', product.originalPrice);
      setValue('category', product.category);
      setValue('images', product.images.join(', '));
      setValue('inventory', product.inventory);
      setValue('inStock', product.inStock);
      setValue('weight', product.weight);
      setValue('tags', product.tags?.join(', '));
      setUploadedImages(product.images);
    } else {
      reset();
      setUploadedImages([]);
    }
  }, [product, mode, setValue, reset]);

  const handleFileUpload = (files: FileList | null) => {
    if (!files) return;

    Array.from(files).forEach(file => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const result = e.target?.result as string;
          setUploadedImages(prev => [...prev, result]);
          const currentImages = watch('images') || '';
          const newImages = currentImages ? `${currentImages}, ${result}` : result;
          setValue('images', newImages);
        };
        reader.readAsDataURL(file);
      } else {
        toast({
          title: "Invalid file type",
          description: "Please upload only image files",
          variant: "destructive",
        });
      }
    });
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileUpload(e.dataTransfer.files);
  };

  const removeImage = (index: number) => {
    const newImages = uploadedImages.filter((_, i) => i !== index);
    setUploadedImages(newImages);
    setValue('images', newImages.join(', '));
  };

  const onSubmit = async (data: ProductFormData) => {
    try {
      const productData = {
        ...data,
        category: data.category || 'Uncategorized',
        inventory: data.inventory || 0,
        images: uploadedImages.length > 0 ? uploadedImages : data.images.split(',').map(img => img.trim()).filter(img => img),
        tags: data.tags ? data.tags.split(',').map(tag => tag.trim()).filter(tag => tag) : [],
        rating: product?.rating || 0,
        reviews: product?.reviews || 0,
        createdAt: product?.createdAt || new Date(),
      };

      if (mode === 'create') {
        await addProduct(productData);
        toast({
          title: "Success",
          description: "Product created successfully",
        });
      } else if (product) {
        await updateProduct(product.id, productData);
        toast({
          title: "Success",
          description: "Product updated successfully",
        });
      }

      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      onClose();
      reset();
      setUploadedImages([]);
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to ${mode} product`,
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{mode === 'create' ? 'Add New Product' : 'Edit Product'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Product Name</Label>
              <Input
                id="name"
                {...register('name', { required: 'Product name is required' })}
                placeholder="Enter product name"
              />
              {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
            </div>
            <div>
              <Label htmlFor="category">Category (Optional)</Label>
              <Input
                id="category"
                {...register('category')}
                placeholder="Enter category"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              {...register('description', { required: 'Description is required' })}
              placeholder="Enter product description"
              rows={3}
            />
            {errors.description && <p className="text-red-500 text-sm">{errors.description.message}</p>}
          </div>

          <div className="grid grid-cols-3 gap-4">
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
              <Label htmlFor="originalPrice">Original Price ($) (Optional)</Label>
              <Input
                id="originalPrice"
                type="number"
                step="0.01"
                {...register('originalPrice', { min: 0 })}
                placeholder="0.00"
              />
            </div>
            <div>
              <Label htmlFor="inventory">Inventory (Optional)</Label>
              <Input
                id="inventory"
                type="number"
                {...register('inventory', { min: 0 })}
                placeholder="0"
              />
              {errors.inventory && <p className="text-red-500 text-sm">{errors.inventory.message}</p>}
            </div>
          </div>

          {/* Image Upload Section */}
          <div className="space-y-4">
            <Label>Product Images</Label>
            
            {/* File Upload Area */}
            <Card 
              className={`border-2 border-dashed p-6 text-center cursor-pointer transition-colors ${
                isDragging ? 'border-olive-500 bg-olive-50' : 'border-olive-300 hover:border-olive-400'
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => document.getElementById('file-upload')?.click()}
            >
              <Upload className="h-8 w-8 text-olive-500 mx-auto mb-2" />
              <p className="text-olive-700 mb-2">Drop images here or click to upload</p>
              <p className="text-sm text-olive-500">Supports: JPG, PNG, GIF, WebP</p>
              <input
                id="file-upload"
                type="file"
                multiple
                accept="image/*"
                className="hidden"
                onChange={(e) => handleFileUpload(e.target.files)}
              />
            </Card>

            {/* Image Previews */}
            {uploadedImages.length > 0 && (
              <div className="grid grid-cols-4 gap-4">
                {uploadedImages.map((image, index) => (
                  <div key={index} className="relative">
                    <img 
                      src={image} 
                      alt={`Product ${index + 1}`}
                      className="w-full h-24 object-cover rounded border"
                    />
                    <Button
                      type="button"
                      size="sm"
                      variant="destructive"
                      className="absolute -top-2 -right-2 h-6 w-6 p-0"
                      onClick={() => removeImage(index)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            )}

            {/* Manual URL Input */}
            <div>
              <Label htmlFor="images">Or enter image URLs (comma-separated)</Label>
              <Textarea
                id="images"
                {...register('images')}
                placeholder="https://example.com/image1.jpg, https://example.com/image2.jpg"
                rows={2}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="weight">Weight (kg) (Optional)</Label>
              <Input
                id="weight"
                type="number"
                step="0.01"
                {...register('weight', { min: 0 })}
                placeholder="0.00"
              />
            </div>
            <div>
              <Label htmlFor="tags">Tags (comma-separated) (Optional)</Label>
              <Input
                id="tags"
                {...register('tags')}
                placeholder="organic, fresh, local"
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="inStock"
              {...register('inStock')}
            />
            <Label htmlFor="inStock">In Stock</Label>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" className="bg-olive-600 hover:bg-olive-700">
              {mode === 'create' ? 'Create Product' : 'Update Product'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ProductFormModal;
