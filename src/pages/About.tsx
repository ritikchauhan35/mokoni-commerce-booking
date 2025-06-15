
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

const About = () => {
  const { ref: heroRef, isVisible: heroVisible } = useScrollAnimation();
  const { ref: storyRef, isVisible: storyVisible } = useScrollAnimation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-pearl-50 to-olive-50">
      <Navbar />
      
      {/* Hero Section */}
      <section ref={heroRef} className="px-4 py-16 bg-olive-700">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className={`text-4xl md:text-6xl font-bold text-pearl-50 mb-6 transition-all duration-700 ${heroVisible ? 'animate-fade-in' : 'opacity-0'}`}>
            About Mokoni
          </h1>
          <p className={`text-xl text-pearl-100 mb-8 max-w-3xl mx-auto transition-all duration-700 delay-300 ${heroVisible ? 'animate-slide-up' : 'opacity-0'}`}>
            Where shopping meets hospitality - creating exceptional experiences for our customers.
          </p>
        </div>
      </section>

      {/* Story Section */}
      <section ref={storyRef} className="px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className={`transition-all duration-700 ${storyVisible ? 'animate-fade-in' : 'opacity-0'}`}>
            <h2 className="text-3xl md:text-4xl font-bold text-olive-800 mb-8 text-center">Our Story</h2>
            <div className="prose prose-lg max-w-none text-olive-700">
              <p className="mb-6">
                Mokoni was founded with a simple vision: to create a platform where exceptional shopping and hospitality experiences converge. We believe that every purchase should be delightful and every stay should be memorable.
              </p>
              <p className="mb-6">
                Our carefully curated selection of products and properties reflects our commitment to quality, authenticity, and customer satisfaction. Whether you're looking for unique products or planning your next getaway, Mokoni is here to make your experience extraordinary.
              </p>
              <p>
                Join us on this journey as we continue to redefine what it means to shop and stay with purpose, passion, and excellence.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;
