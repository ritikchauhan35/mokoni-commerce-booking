
import React from 'react';
import Navbar from '@/components/Navbar';
import PropertyGrid from '@/components/PropertyGrid';
import Footer from '@/components/Footer';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

const Properties = () => {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-pearl-50 to-olive-50">
      <Navbar />
      
      {/* Header Section */}
      <section ref={ref} className="px-4 py-16 bg-olive-700">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className={`text-4xl md:text-6xl font-bold text-pearl-50 mb-6 transition-all duration-700 ${isVisible ? 'animate-fade-in' : 'opacity-0'}`}>
            Beautiful Properties
          </h1>
          <p className={`text-xl text-pearl-100 mb-8 max-w-3xl mx-auto transition-all duration-700 delay-300 ${isVisible ? 'animate-slide-up' : 'opacity-0'}`}>
            Discover amazing properties for your perfect getaway. From cozy apartments to luxury villas.
          </p>
        </div>
      </section>

      {/* Properties Grid */}
      <section className="px-4 py-16">
        <div className="max-w-7xl mx-auto">
          <PropertyGrid />
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Properties;
