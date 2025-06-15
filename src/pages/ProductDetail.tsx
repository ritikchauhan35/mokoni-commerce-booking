
import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, ShoppingCart, ArrowLeft } from 'lucide-react';
import { useProduct } from '@/hooks/useProducts';
import { useCart } from '@/hooks/useCart';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useToast } from '@/hooks/use-toast';

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { data: product, isLoading } = useProduct(id!);
  const { addItem } = useCart();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState(0);

  const handleAddToCart = () => {
    if (product) {
      addItem(product.id, 1);
      toast({
        title: "Added to cart",
        description: `${product.name} has been added to your cart.`,
      });
    }
  };

  const handleBuyNow = () => {
    if (product) {
      // Navigate directly to checkout with this product
      navigate('/checkout', { state: { product } });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-pearl-50">
        <Navbar />
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-olive-600"></div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-pearl-50">
        <Navbar />
        <div className="text-center py-8">
          <p className="text-olive-700">Product not found</p>
          <Link to="/products">
            <Button className="mt-4 bg-olive-600 hover:bg-olive-700">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Products
            </Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-pearl-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Link to="/products">
          <Button variant="ghost" className="mb-6 text-olive-700 hover:bg-olive-100">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Products
          </Button>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Images Section */}
          <div className="space-y-4">
            <Card className="overflow-hidden">
              <CardContent className="p-0">
                <img 
                  src={product.images[selectedImage] || "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=600&h=400&fit=crop"} 
                  alt={product.name}
                  className="w-full h-96 object-cover"
                />
              </CardContent>
            </Card>
            
            {/* Image Thumbnails */}
            {product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {product.images.map((image, index) => (
                  <img 
                    key={index}
                    src={image} 
                    alt={`${product.name} ${index + 1}`}
                    className={`w-full h-20 object-cover rounded cursor-pointer border-2 ${
                      selectedImage === index ? 'border-olive-600' : 'border-gray-200'
                    }`}
                    onClick={() => setSelectedImage(index)}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Product Info Section */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-olive-800 mb-2">{product.name}</h1>
              <Badge className="mb-4">{product.category}</Badge>
              
              <div className="flex items-center mb-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${
                        i < Math.floor(product.rating)
                          ? 'text-yellow-500 fill-current'
                          : 'text-gray-400'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-olive-600 ml-2">({product.reviews} reviews)</span>
              </div>

              <div className="flex items-center space-x-4 mb-6">
                <span className="text-3xl font-bold text-olive-800">
                  ₹{typeof product.price === 'number' ? product.price.toFixed(2) : '0.00'}
                </span>
                {product.originalPrice && (
                  <span className="text-xl text-gray-500 line-through">
                    ₹{typeof product.originalPrice === 'number' ? product.originalPrice.toFixed(2) : '0.00'}
                  </span>
                )}
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
                <p className="text-sm text-green-800">
                  ✓ Free shipping on orders above ₹500
                </p>
                <p className="text-sm text-green-800">
                  ✓ Cash on Delivery available
                </p>
                <p className="text-sm text-green-800">
                  ✓ 7-day return policy
                </p>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-olive-800 mb-2">Description</h3>
              <p className="text-olive-600 leading-relaxed">{product.description}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold text-olive-800">Stock</h4>
                <p className="text-olive-600">{product.inventory} items</p>
              </div>
              {product.weight && (
                <div>
                  <h4 className="font-semibold text-olive-800">Weight</h4>
                  <p className="text-olive-600">{product.weight} kg</p>
                </div>
              )}
            </div>

            {product.tags && product.tags.length > 0 && (
              <div>
                <h4 className="font-semibold text-olive-800 mb-2">Tags</h4>
                <div className="flex flex-wrap gap-2">
                  {product.tags.map((tag, index) => (
                    <Badge key={index} variant="outline">{tag}</Badge>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-3">
              <Button 
                onClick={handleBuyNow}
                disabled={!product.inStock}
                className="w-full bg-olive-600 hover:bg-olive-700 text-pearl-50 py-3 text-lg"
              >
                {product.inStock ? 'Buy Now' : 'Out of Stock'}
              </Button>
              <Button 
                onClick={handleAddToCart}
                disabled={!product.inStock}
                variant="outline"
                className="w-full border-olive-600 text-olive-600 hover:bg-olive-50 py-3"
              >
                <ShoppingCart className="mr-2 h-5 w-5" />
                Add to Cart
              </Button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ProductDetail;
