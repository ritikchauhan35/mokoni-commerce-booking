
import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Star, ShoppingCart } from 'lucide-react';

const ProductGrid = () => {
  const products = [
    {
      id: 1,
      name: "Premium Wireless Headphones",
      price: 299.99,
      rating: 4.8,
      reviews: 156,
      image: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=400&h=300&fit=crop",
      originalPrice: 399.99
    },
    {
      id: 2,
      name: "Smart Home Assistant",
      price: 149.99,
      rating: 4.6,
      reviews: 89,
      image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&h=300&fit=crop",
      originalPrice: null
    },
    {
      id: 3,
      name: "Professional Laptop Stand",
      price: 79.99,
      rating: 4.9,
      reviews: 234,
      image: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=400&h=300&fit=crop",
      originalPrice: 99.99
    },
    {
      id: 4,
      name: "Ergonomic Office Chair",
      price: 399.99,
      rating: 4.7,
      reviews: 67,
      image: "https://images.unsplash.com/photo-1721322800607-8c38375eef04?w=400&h=300&fit=crop",
      originalPrice: null
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {products.map((product) => (
        <Card key={product.id} className="bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/20 transition-all duration-300 group">
          <CardHeader className="p-0">
            <div className="relative overflow-hidden rounded-t-lg">
              <img 
                src={product.image} 
                alt={product.name}
                className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
              />
              {product.originalPrice && (
                <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-sm font-semibold">
                  Sale
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent className="p-4">
            <h3 className="text-white font-semibold mb-2 line-clamp-2">{product.name}</h3>
            <div className="flex items-center mb-2">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < Math.floor(product.rating)
                        ? 'text-yellow-400 fill-current'
                        : 'text-gray-400'
                    }`}
                  />
                ))}
              </div>
              <span className="text-gray-300 text-sm ml-2">({product.reviews})</span>
            </div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <span className="text-white font-bold text-lg">${product.price}</span>
                {product.originalPrice && (
                  <span className="text-gray-400 line-through text-sm">${product.originalPrice}</span>
                )}
              </div>
            </div>
            <Button className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white border-0">
              <ShoppingCart className="mr-2 h-4 w-4" />
              Add to Cart
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ProductGrid;
