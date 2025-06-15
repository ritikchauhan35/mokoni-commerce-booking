
import React from 'react';
import Navbar from '@/components/Navbar';
import HeroCarousel from '@/components/HeroCarousel';
import ProductGrid from '@/components/ProductGrid';
import PropertyGrid from '@/components/PropertyGrid';
import Footer from '@/components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen bg-pearl-50">
      <Navbar />
      <main>
        <HeroCarousel />
        
        {/* Featured Products Section */}
        <section className="py-16 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-olive-800 mb-4">Featured Products</h2>
              <p className="text-lg text-olive-600 max-w-2xl mx-auto">
                Discover our handpicked selection of premium products designed to enhance your lifestyle
              </p>
            </div>
            <ProductGrid limit={8} />
          </div>
        </section>

        {/* Featured Properties Section */}
        <section className="py-16 px-4 bg-pearl-100">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-olive-800 mb-4">Beautiful Properties</h2>
              <p className="text-lg text-olive-600 max-w-2xl mx-auto">
                Escape to stunning locations with our carefully curated collection of properties
              </p>
            </div>
            <PropertyGrid limit={6} />
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Index;
