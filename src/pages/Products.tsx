
import React from 'react';
import Navbar from '@/components/Navbar';
import ProductGrid from '@/components/ProductGrid';
import Footer from '@/components/Footer';

const Products = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800">
      <Navbar />
      <div className="px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-4">Our Products</h1>
            <p className="text-gray-300 text-lg">Discover our amazing collection of premium products</p>
          </div>
          <ProductGrid />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Products;
