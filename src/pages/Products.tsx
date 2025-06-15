
import React from 'react';
import Navbar from '@/components/Navbar';
import ProductGrid from '@/components/ProductGrid';
import Footer from '@/components/Footer';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

const Products = () => {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-pearl-50 to-olive-50">
      <Navbar />
      
      {/* Header Section */}
      <section ref={ref} className="px-4 py-16 bg-olive-700">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className={`text-4xl md:text-6xl font-bold text-pearl-50 mb-6 transition-all duration-700 ${isVisible ? 'animate-fade-in' : 'opacity-0'}`}>
            Our Products
          </h1>
          <p className={`text-xl text-pearl-100 mb-8 max-w-3xl mx-auto transition-all duration-700 delay-300 ${isVisible ? 'animate-slide-up' : 'opacity-0'}`}>
            Discover our amazing collection of premium products crafted with care and quality.
          </p>
        </div>
      </section>

      {/* Products Grid */}
      <section className="px-4 py-16">
        <div className="max-w-7xl mx-auto">
          <ProductGrid />
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Products;
