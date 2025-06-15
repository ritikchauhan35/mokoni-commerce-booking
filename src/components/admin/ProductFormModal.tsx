
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useForm } from 'react-hook-form';
import { Product } from '@/types';
import { addProduct, updateProduct } from '@/services/firestore';
import { useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';

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
  category: string;
  images: string;
  inventory: number;
  inStock: boolean;
  weight?: number;
  tags?: string;
}

const ProductFormModal: React.FC<ProductFormModalProps> = ({ isOpen, onClose, product, mode }) => {
  const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm<ProductFormData>();
  const queryClient = useQueryClient();
  const { toast } = useToast();

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
    } else {
      reset();
    }
  }, [product, mode, setValue, reset]);

  const onSubmit = async (data: ProductFormData) => {
    try {
      const productData = {
        ...data,
        images: data.images.split(',').map(img => img.trim()).filter(img => img),
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
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{mode === 'create' ? 'Add New Product' : 'Edit Product'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
              <Label htmlFor="category">Category</Label>
              <Input
                id="category"
                {...register('category', { required: 'Category is required' })}
                placeholder="Enter category"
              />
              {errors.category && <p className="text-red-500 text-sm">{errors.category.message}</p>}
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
              <Label htmlFor="originalPrice">Original Price ($)</Label>
              <Input
                id="originalPrice"
                type="number"
                step="0.01"
                {...register('originalPrice', { min: 0 })}
                placeholder="0.00"
              />
            </div>
            <div>
              <Label htmlFor="inventory">Inventory</Label>
              <Input
                id="inventory"
                type="number"
                {...register('inventory', { required: 'Inventory is required', min: 0 })}
                placeholder="0"
              />
              {errors.inventory && <p className="text-red-500 text-sm">{errors.inventory.message}</p>}
            </div>
          </div>

          <div>
            <Label htmlFor="images">Images (comma-separated URLs)</Label>
            <Textarea
              id="images"
              {...register('images')}
              placeholder="https://example.com/image1.jpg, https://example.com/image2.jpg"
              rows={2}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="weight">Weight (kg)</Label>
              <Input
                id="weight"
                type="number"
                step="0.01"
                {...register('weight', { min: 0 })}
                placeholder="0.00"
              />
            </div>
            <div>
              <Label htmlFor="tags">Tags (comma-separated)</Label>
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
