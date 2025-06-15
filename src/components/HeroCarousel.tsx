
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, ShoppingCart, Calendar } from 'lucide-react';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

const heroSlides = [
  {
    id: 1,
    title: "Shop Premium Products",
    subtitle: "Discover amazing products with Mokoni",
    description: "Curated selection of high-quality products with secure checkout and fast delivery.",
    image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&h=600&fit=crop&crop=center",
    primaryAction: "Shop Now",
    secondaryAction: "View Catalog",
    actionType: "shop"
  },
  {
    id: 2,
    title: "Book Stunning Properties",
    subtitle: "Your perfect getaway awaits",
    description: "Book stunning properties with instant confirmation and flexible cancellation.",
    image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1200&h=600&fit=crop&crop=center",
    primaryAction: "Book Now",
    secondaryAction: "View Properties",
    actionType: "book"
  },
  {
    id: 3,
    title: "Experience Excellence",
    subtitle: "Where shopping meets hospitality",
    description: "Real reviews from verified customers to help you make the best choices.",
    image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1200&h=600&fit=crop&crop=center",
    primaryAction: "Explore",
    secondaryAction: "Learn More",
    actionType: "explore"
  }
];

const HeroCarousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const { ref, isVisible } = useScrollAnimation();

  useEffect(() => {
    if (!isPlaying) return;

    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [isPlaying]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const goToPrevious = () => {
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  };

  const goToNext = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  };

  const currentSlideData = heroSlides[currentSlide];

  return (
    <section 
      ref={ref}
      className="relative h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-pearl-50 to-olive-50"
      onMouseEnter={() => setIsPlaying(false)}
      onMouseLeave={() => setIsPlaying(true)}
    >
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <img
          src={currentSlideData.image}
          alt={currentSlideData.title}
          className="w-full h-full object-cover transition-all duration-1000 ease-in-out"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-olive-900/80 via-olive-800/60 to-transparent"></div>
      </div>

      {/* Content */}
      <div className={`relative z-10 max-w-7xl mx-auto px-4 text-center transition-all duration-1000 ${isVisible ? 'animate-fade-in' : 'opacity-0'}`}>
        <div className="text-pearl-100 mb-6">
          <p className="text-lg md:text-xl font-medium mb-2 animate-slide-in-left">
            {currentSlideData.subtitle}
          </p>
          <h1 className="text-4xl md:text-7xl font-bold mb-6 leading-tight animate-slide-up">
            {currentSlideData.title}
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto animate-slide-in-right">
            {currentSlideData.description}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center animate-scale-in">
          <Button 
            size="lg" 
            className="bg-olive-600 hover:bg-olive-700 text-pearl-50 border-0 px-8 py-4 text-lg font-semibold transition-all duration-300 hover:scale-105"
          >
            {currentSlideData.actionType === 'shop' && <ShoppingCart className="mr-2 h-6 w-6" />}
            {currentSlideData.actionType === 'book' && <Calendar className="mr-2 h-6 w-6" />}
            {currentSlideData.primaryAction}
          </Button>
          <Button 
            size="lg" 
            variant="outline" 
            className="border-2 border-pearl-100 text-pearl-100 hover:bg-pearl-100 hover:text-olive-800 px-8 py-4 text-lg font-semibold transition-all duration-300 hover:scale-105"
          >
            {currentSlideData.secondaryAction}
          </Button>
        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={goToPrevious}
        className="absolute left-6 top-1/2 transform -translate-y-1/2 z-20 bg-pearl-100/20 hover:bg-pearl-100/40 text-pearl-100 p-3 rounded-full transition-all duration-300 hover:scale-110"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>
      <button
        onClick={goToNext}
        className="absolute right-6 top-1/2 transform -translate-y-1/2 z-20 bg-pearl-100/20 hover:bg-pearl-100/40 text-pearl-100 p-3 rounded-full transition-all duration-300 hover:scale-110"
      >
        <ChevronRight className="h-6 w-6" />
      </button>

      {/* Slide Indicators */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 flex space-x-3">
        {heroSlides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              currentSlide === index 
                ? 'bg-olive-500 scale-125' 
                : 'bg-pearl-100/50 hover:bg-pearl-100/80'
            }`}
          />
        ))}
      </div>

      {/* Auto-play Progress Bar */}
      <div className="absolute bottom-0 left-0 w-full h-1 bg-pearl-100/20 z-20">
        <div 
          className="h-full bg-olive-500 transition-all duration-300 ease-linear"
          style={{ 
            width: isPlaying ? '100%' : '0%',
            transition: isPlaying ? 'width 5s linear' : 'none',
            animation: isPlaying ? 'none' : 'none'
          }}
        />
      </div>
    </section>
  );
};

export default HeroCarousel;
