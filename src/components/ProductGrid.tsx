
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Star, ShoppingCart, Eye } from 'lucide-react';
import { useProducts } from '@/hooks/useProducts';
import { useCart } from '@/hooks/useCart';
import { Skeleton } from '@/components/ui/skeleton';
import { Product } from '@/types';
import { useToast } from '@/hooks/use-toast';

interface ProductGridProps {
  limit?: number;
}

const ProductGrid = ({ limit }: ProductGridProps) => {
  const { data: products = [], isLoading, error } = useProducts();
  const { addItem } = useCart();
  const { toast } = useToast();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: limit || 8 }).map((_, i) => (
          <Card key={i} className="bg-pearl-100 border-olive-200 shadow-lg">
            <CardHeader className="p-0">
              <Skeleton className="w-full h-48 rounded-t-lg" />
            </CardHeader>
            <CardContent className="p-4">
              <Skeleton className="h-6 w-full mb-2" />
              <Skeleton className="h-4 w-3/4 mb-2" />
              <Skeleton className="h-6 w-1/2 mb-4" />
              <Skeleton className="h-10 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">Error loading products. Please try again later.</p>
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-olive-700">No products available at the moment.</p>
      </div>
    );
  }

  const handleAddToCart = (productId: string) => {
    addItem(productId, 1);
  };

  const handleBuyNow = (productId: string) => {
    addItem(productId, 1);
    toast({
      title: "Added to cart",
      description: "Redirecting to checkout...",
    });
  };

  // Apply limit if provided
  const displayedProducts = limit ? products.slice(0, limit) : products;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {displayedProducts.map((product: Product) => (
        <Card key={product.id} className="bg-pearl-50 border-olive-200 hover:bg-pearl-100 transition-all duration-300 group shadow-lg hover:shadow-xl">
          <CardHeader className="p-0">
            <div className="relative overflow-hidden rounded-t-lg">
              <img 
                src={product.images[0] || "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=400&h=300&fit=crop"} 
                alt={product.name}
                className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
              />
              {product.originalPrice && (
                <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-sm font-semibold">
                  Sale
                </div>
              )}
              {!product.inStock && (
                <div className="absolute top-2 right-2 bg-gray-800 text-white px-2 py-1 rounded text-sm">
                  Out of Stock
                </div>
              )}
              <Link 
                to={`/product/${product.id}`}
                className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100"
              >
                <Button size="sm" className="bg-olive-600 hover:bg-olive-700">
                  <Eye className="mr-2 h-4 w-4" />
                  View Details
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent className="p-4">
            <h3 className="text-olive-800 font-semibold mb-2 line-clamp-2">{product.name}</h3>
            <div className="flex items-center mb-2">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < Math.floor(product.rating)
                        ? 'text-yellow-500 fill-current'
                        : 'text-gray-400'
                    }`}
                  />
                ))}
              </div>
              <span className="text-olive-600 text-sm ml-2">({product.reviews})</span>
            </div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <span className="text-olive-800 font-bold text-lg">
                  ${typeof product.price === 'number' ? product.price.toFixed(2) : '0.00'}
                </span>
                {product.originalPrice && (
                  <span className="text-gray-500 line-through text-sm">
                    ${typeof product.originalPrice === 'number' ? product.originalPrice.toFixed(2) : '0.00'}
                  </span>
                )}
              </div>
            </div>
            <div className="space-y-2">
              <Button 
                className="w-full bg-olive-600 hover:bg-olive-700 text-pearl-50 border-0"
                onClick={() => handleBuyNow(product.id)}
                disabled={!product.inStock}
              >
                {product.inStock ? 'Buy Now' : 'Out of Stock'}
              </Button>
              <Button 
                variant="outline"
                className="w-full border-olive-600 text-olive-600 hover:bg-olive-50"
                onClick={() => handleAddToCart(product.id)}
                disabled={!product.inStock}
              >
                <ShoppingCart className="mr-2 h-4 w-4" />
                Add to Cart
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ProductGrid;
