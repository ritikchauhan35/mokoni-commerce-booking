
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Product } from '@/types';

interface ProductDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
}

const ProductDetailModal: React.FC<ProductDetailModalProps> = ({ isOpen, onClose, product }) => {
  if (!product) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{product.name}</DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <img 
                src={product.images[0] || "https://images.unsplash.com/photo-1472396961693-142e6e269027?w=400&h=300&fit=crop"} 
                alt={product.name}
                className="w-full h-64 object-cover rounded-lg"
              />
              {product.images.length > 1 && (
                <div className="grid grid-cols-3 gap-2 mt-2">
                  {product.images.slice(1, 4).map((image, index) => (
                    <img 
                      key={index}
                      src={image} 
                      alt={`${product.name} ${index + 2}`}
                      className="w-full h-20 object-cover rounded"
                    />
                  ))}
                </div>
              )}
            </div>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-olive-800">Description</h3>
                <p className="text-olive-600">{product.description}</p>
              </div>
              <div>
                <h3 className="font-semibold text-olive-800">Category</h3>
                <Badge>{product.category}</Badge>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold text-olive-800">Price</h3>
                  <p className="text-lg font-bold text-olive-600">${product.price}</p>
                  {product.originalPrice && (
                    <p className="text-sm text-gray-500 line-through">${product.originalPrice}</p>
                  )}
                </div>
                <div>
                  <h3 className="font-semibold text-olive-800">Inventory</h3>
                  <p className="text-olive-600">{product.inventory} items</p>
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-olive-800">Status</h3>
                <Badge variant={product.inStock ? 'default' : 'destructive'}>
                  {product.inStock ? 'In Stock' : 'Out of Stock'}
                </Badge>
              </div>
              <div>
                <h3 className="font-semibold text-olive-800">Rating</h3>
                <p className="text-olive-600">⭐ {product.rating} ({product.reviews} reviews)</p>
              </div>
              {product.weight && (
                <div>
                  <h3 className="font-semibold text-olive-800">Weight</h3>
                  <p className="text-olive-600">{product.weight} kg</p>
                </div>
              )}
              {product.tags && product.tags.length > 0 && (
                <div>
                  <h3 className="font-semibold text-olive-800">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {product.tags.map((tag, index) => (
                      <Badge key={index} variant="outline">{tag}</Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProductDetailModal;
