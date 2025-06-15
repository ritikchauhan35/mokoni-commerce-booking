
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ShoppingCart, Calendar, Star, ArrowDown } from 'lucide-react';
import Navbar from '@/components/Navbar';
import ProductGrid from '@/components/ProductGrid';
import PropertyGrid from '@/components/PropertyGrid';
import Footer from '@/components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative px-4 py-20 md:py-32">
        <div className="max-w-7xl mx-auto text-center">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 blur-3xl rounded-full"></div>
          <div className="relative z-10">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
              Shop & Stay with
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent"> Mokoni</span>
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
              Discover amazing products and book stunning properties all in one place. 
              Your gateway to shopping and hospitality experiences.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white border-0">
                <ShoppingCart className="mr-2 h-5 w-5" />
                Shop Now
              </Button>
              <Button size="lg" variant="outline" className="border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-white">
                <Calendar className="mr-2 h-5 w-5" />
                Book Property
              </Button>
            </div>
          </div>
        </div>
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white animate-bounce">
          <ArrowDown className="h-6 w-6" />
        </div>
      </section>

      {/* Features Section */}
      <section className="px-4 py-16 bg-black/20 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-12">
            Why Choose Mokoni?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-white/10 backdrop-blur-md border-white/20 text-white hover:bg-white/20 transition-all duration-300">
              <CardHeader>
                <ShoppingCart className="h-12 w-12 text-blue-400 mb-4" />
                <CardTitle>Premium Shopping</CardTitle>
                <CardDescription className="text-gray-300">
                  Curated selection of high-quality products with secure checkout and fast delivery.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className="bg-white/10 backdrop-blur-md border-white/20 text-white hover:bg-white/20 transition-all duration-300">
              <CardHeader>
                <Calendar className="h-12 w-12 text-purple-400 mb-4" />
                <CardTitle>Easy Booking</CardTitle>
                <CardDescription className="text-gray-300">
                  Book stunning properties with instant confirmation and flexible cancellation.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className="bg-white/10 backdrop-blur-md border-white/20 text-white hover:bg-white/20 transition-all duration-300">
              <CardHeader>
                <Star className="h-12 w-12 text-yellow-400 mb-4" />
                <CardTitle>Trusted Reviews</CardTitle>
                <CardDescription className="text-gray-300">
                  Real reviews from verified customers to help you make the best choices.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="px-4 py-16">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Featured Products</h2>
            <p className="text-gray-300 text-lg">Discover our most popular items</p>
          </div>
          <ProductGrid />
          <div className="text-center mt-8">
            <Button variant="outline" size="lg" className="border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-white">
              View All Products
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Properties */}
      <section className="px-4 py-16 bg-black/20 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Featured Properties</h2>
            <p className="text-gray-300 text-lg">Book your perfect getaway</p>
          </div>
          <PropertyGrid />
          <div className="text-center mt-8">
            <Button variant="outline" size="lg" className="border-purple-400 text-purple-400 hover:bg-purple-400 hover:text-white">
              View All Properties
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
