
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ShoppingCart, Calendar, Star } from 'lucide-react';
import Navbar from '@/components/Navbar';
import HeroCarousel from '@/components/HeroCarousel';
import ProductGrid from '@/components/ProductGrid';
import PropertyGrid from '@/components/PropertyGrid';
import Footer from '@/components/Footer';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

const Index = () => {
  const { ref: featuresRef, isVisible: featuresVisible } = useScrollAnimation();
  const { ref: productsRef, isVisible: productsVisible } = useScrollAnimation();
  const { ref: propertiesRef, isVisible: propertiesVisible } = useScrollAnimation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-pearl-50 to-olive-50">
      <Navbar />
      
      {/* Hero Section with Carousel */}
      <HeroCarousel />

      {/* Features Section */}
      <section ref={featuresRef} className="px-4 py-16 bg-pearl-100">
        <div className="max-w-7xl mx-auto">
          <h2 className={`text-3xl md:text-4xl font-bold text-olive-800 text-center mb-12 transition-all duration-700 ${featuresVisible ? 'animate-fade-in' : 'opacity-0'}`}>
            Why Choose Mokoni?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className={`bg-pearl-50 border-olive-200 text-olive-800 hover:shadow-lg transition-all duration-500 ${featuresVisible ? 'animate-slide-in-left' : 'opacity-0'}`}>
              <CardHeader>
                <ShoppingCart className="h-12 w-12 text-olive-600 mb-4" />
                <CardTitle className="text-olive-800">Premium Shopping</CardTitle>
                <CardDescription className="text-olive-600">
                  Curated selection of high-quality products with secure checkout and fast delivery.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className={`bg-pearl-50 border-olive-200 text-olive-800 hover:shadow-lg transition-all duration-500 delay-200 ${featuresVisible ? 'animate-scale-in' : 'opacity-0'}`}>
              <CardHeader>
                <Calendar className="h-12 w-12 text-olive-600 mb-4" />
                <CardTitle className="text-olive-800">Easy Booking</CardTitle>
                <CardDescription className="text-olive-600">
                  Book stunning properties with instant confirmation and flexible cancellation.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className={`bg-pearl-50 border-olive-200 text-olive-800 hover:shadow-lg transition-all duration-500 delay-400 ${featuresVisible ? 'animate-slide-in-right' : 'opacity-0'}`}>
              <CardHeader>
                <Star className="h-12 w-12 text-olive-600 mb-4" />
                <CardTitle className="text-olive-800">Trusted Reviews</CardTitle>
                <CardDescription className="text-olive-600">
                  Real reviews from verified customers to help you make the best choices.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section ref={productsRef} className="px-4 py-16">
        <div className="max-w-7xl mx-auto">
          <div className={`text-center mb-12 transition-all duration-700 ${productsVisible ? 'animate-fade-in' : 'opacity-0'}`}>
            <h2 className="text-3xl md:text-4xl font-bold text-olive-800 mb-4">Featured Products</h2>
            <p className="text-olive-600 text-lg">Discover our most popular items</p>
          </div>
          <div className={`transition-all duration-700 delay-300 ${productsVisible ? 'animate-slide-up' : 'opacity-0'}`}>
            <ProductGrid />
          </div>
          <div className={`text-center mt-8 transition-all duration-700 delay-500 ${productsVisible ? 'animate-fade-in' : 'opacity-0'}`}>
            <Link to="/products">
              <Button variant="outline" size="lg" className="border-olive-500 text-olive-700 hover:bg-olive-500 hover:text-pearl-50 font-medium">
                View All Products
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Properties */}
      <section ref={propertiesRef} className="px-4 py-16 bg-pearl-100">
        <div className="max-w-7xl mx-auto">
          <div className={`text-center mb-12 transition-all duration-700 ${propertiesVisible ? 'animate-fade-in' : 'opacity-0'}`}>
            <h2 className="text-3xl md:text-4xl font-bold text-olive-800 mb-4">Featured Properties</h2>
            <p className="text-olive-600 text-lg">Book your perfect getaway</p>
          </div>
          <div className={`transition-all duration-700 delay-300 ${propertiesVisible ? 'animate-slide-up' : 'opacity-0'}`}>
            <PropertyGrid />
          </div>
          <div className={`text-center mt-8 transition-all duration-700 delay-500 ${propertiesVisible ? 'animate-fade-in' : 'opacity-0'}`}>
            <Link to="/properties">
              <Button variant="outline" size="lg" className="border-olive-500 text-olive-700 hover:bg-olive-500 hover:text-pearl-50 font-medium">
                View All Properties
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
