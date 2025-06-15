
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ShoppingCart, User, Search, Menu, X, LogOut } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/hooks/useCart';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const { getCartTotal } = useCart();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <nav className="sticky top-0 z-50 bg-pearl-50/95 backdrop-blur-md border-b border-olive-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-olive-600 to-olive-500 rounded-lg"></div>
            <span className="text-2xl font-bold text-olive-800">Mokoni</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/products" className="text-olive-700 hover:text-olive-900 transition-colors font-medium">
              Products
            </Link>
            <Link to="/properties" className="text-olive-700 hover:text-olive-900 transition-colors font-medium">
              Properties
            </Link>
            <Link to="/about" className="text-olive-700 hover:text-olive-900 transition-colors font-medium">
              About
            </Link>
            <Link to="/contact" className="text-olive-700 hover:text-olive-900 transition-colors font-medium">
              Contact
            </Link>
          </div>

          {/* Search Bar */}
          <div className="hidden md:flex items-center space-x-4 flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-olive-500 h-4 w-4" />
              <Input 
                placeholder="Search products & properties..." 
                className="pl-10 bg-pearl-100 border-olive-200 text-olive-800 placeholder-olive-500 focus:border-olive-500 focus:ring-olive-500"
              />
            </div>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <span className="text-olive-800 text-sm hidden md:block font-medium">
                  Hello, {user.email}
                </span>
                <Button variant="ghost" size="sm" className="text-olive-700 hover:bg-olive-100 hover:text-olive-900" onClick={handleLogout}>
                  <LogOut className="h-5 w-5" />
                </Button>
              </>
            ) : (
              <Link to="/login">
                <Button variant="ghost" size="sm" className="text-olive-700 hover:bg-olive-100 hover:text-olive-900">
                  <User className="h-5 w-5" />
                </Button>
              </Link>
            )}
            <Button variant="ghost" size="sm" className="text-olive-700 hover:bg-olive-100 hover:text-olive-900 relative">
              <ShoppingCart className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 bg-olive-600 text-pearl-50 text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {getCartTotal()}
              </span>
            </Button>
            
            {/* Mobile Menu Button */}
            <Button 
              variant="ghost" 
              size="sm" 
              className="md:hidden text-olive-700 hover:bg-olive-100"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-olive-200 bg-pearl-50">
            <div className="flex flex-col space-y-4">
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-olive-500 h-4 w-4" />
                <Input 
                  placeholder="Search..." 
                  className="pl-10 bg-pearl-100 border-olive-200 text-olive-800 placeholder-olive-500"
                />
              </div>
              <Link to="/products" className="text-olive-700 hover:text-olive-900 transition-colors py-2 font-medium">
                Products
              </Link>
              <Link to="/properties" className="text-olive-700 hover:text-olive-900 transition-colors py-2 font-medium">
                Properties
              </Link>
              <Link to="/about" className="text-olive-700 hover:text-olive-900 transition-colors py-2 font-medium">
                About
              </Link>
              <Link to="/contact" className="text-olive-700 hover:text-olive-900 transition-colors py-2 font-medium">
                Contact
              </Link>
              {user ? (
                <Button onClick={handleLogout} className="text-left bg-olive-600 hover:bg-olive-700 text-pearl-50">
                  Logout
                </Button>
              ) : (
                <>
                  <Link to="/login" className="text-olive-700 hover:text-olive-900 transition-colors py-2 font-medium">
                    Login
                  </Link>
                  <Link to="/register" className="text-olive-700 hover:text-olive-900 transition-colors py-2 font-medium">
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
