
import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-black/40 backdrop-blur-md border-t border-white/10 px-4 py-12">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg"></div>
              <span className="text-2xl font-bold text-white">Mokoni</span>
            </div>
            <p className="text-gray-300 text-sm">
              Your one-stop destination for premium products and unforgettable property experiences.
            </p>
          </div>

          {/* Shop */}
          <div className="space-y-4">
            <h3 className="text-white font-semibold">Shop</h3>
            <div className="space-y-2">
              <Link to="/products" className="text-gray-300 hover:text-white transition-colors text-sm block">
                All Products
              </Link>
              <Link to="/categories" className="text-gray-300 hover:text-white transition-colors text-sm block">
                Categories
              </Link>
              <Link to="/deals" className="text-gray-300 hover:text-white transition-colors text-sm block">
                Deals
              </Link>
              <Link to="/new-arrivals" className="text-gray-300 hover:text-white transition-colors text-sm block">
                New Arrivals
              </Link>
            </div>
          </div>

          {/* Stay */}
          <div className="space-y-4">
            <h3 className="text-white font-semibold">Stay</h3>
            <div className="space-y-2">
              <Link to="/properties" className="text-gray-300 hover:text-white transition-colors text-sm block">
                All Properties
              </Link>
              <Link to="/locations" className="text-gray-300 hover:text-white transition-colors text-sm block">
                Locations
              </Link>
              <Link to="/experiences" className="text-gray-300 hover:text-white transition-colors text-sm block">
                Experiences
              </Link>
              <Link to="/host" className="text-gray-300 hover:text-white transition-colors text-sm block">
                Become a Host
              </Link>
            </div>
          </div>

          {/* Support */}
          <div className="space-y-4">
            <h3 className="text-white font-semibold">Support</h3>
            <div className="space-y-2">
              <Link to="/help" className="text-gray-300 hover:text-white transition-colors text-sm block">
                Help Center
              </Link>
              <Link to="/contact" className="text-gray-300 hover:text-white transition-colors text-sm block">
                Contact Us
              </Link>
              <Link to="/privacy" className="text-gray-300 hover:text-white transition-colors text-sm block">
                Privacy Policy
              </Link>
              <Link to="/terms" className="text-gray-300 hover:text-white transition-colors text-sm block">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 mt-8 pt-8 text-center">
          <p className="text-gray-300 text-sm">
            © 2024 Mokoni. All rights reserved. Built with love for commerce and hospitality.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
