
import { HeroSlide } from '@/types/hero';

const HERO_SLIDES_STORAGE_KEY = 'mokoni_hero_slides';

// Default slides for first-time users
const defaultSlides: HeroSlide[] = [
  {
    id: '1',
    title: "Shop Premium Products",
    subtitle: "Discover amazing products with Mokoni",
    description: "Curated selection of high-quality products with secure checkout and fast delivery.",
    image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&h=600&fit=crop&crop=center",
    primaryAction: "Shop Now",
    secondaryAction: "View Catalog",
    actionType: "shop",
    isActive: true,
    order: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '2',
    title: "Book Stunning Properties",
    subtitle: "Your perfect getaway awaits",
    description: "Book stunning properties with instant confirmation and flexible cancellation.",
    image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1200&h=600&fit=crop&crop=center",
    primaryAction: "Book Now",
    secondaryAction: "View Properties",
    actionType: "book",
    isActive: true,
    order: 2,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '3',
    title: "Experience Excellence",
    subtitle: "Where shopping meets hospitality",
    description: "Real reviews from verified customers to help you make the best choices.",
    image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1200&h=600&fit=crop&crop=center",
    primaryAction: "Explore",
    secondaryAction: "Learn More",
    actionType: "explore",
    isActive: true,
    order: 3,
    createdAt: new Date(),
    updatedAt: new Date(),
  }
];

export const getHeroSlides = (): HeroSlide[] => {
  try {
    const stored = localStorage.getItem(HERO_SLIDES_STORAGE_KEY);
    if (stored) {
      const slides = JSON.parse(stored).map((slide: any) => ({
        ...slide,
        createdAt: new Date(slide.createdAt),
        updatedAt: new Date(slide.updatedAt)
      }));
      return slides.sort((a: HeroSlide, b: HeroSlide) => a.order - b.order);
    }
    
    // First time - save default slides
    saveHeroSlides(defaultSlides);
    return defaultSlides;
  } catch (error) {
    console.error('Error loading hero slides:', error);
    return defaultSlides;
  }
};

export const getActiveHeroSlides = (): HeroSlide[] => {
  return getHeroSlides().filter(slide => slide.isActive);
};

export const saveHeroSlides = (slides: HeroSlide[]): void => {
  try {
    localStorage.setItem(HERO_SLIDES_STORAGE_KEY, JSON.stringify(slides));
  } catch (error) {
    console.error('Error saving hero slides:', error);
  }
};

export const addHeroSlide = (slideData: Omit<HeroSlide, 'id' | 'createdAt' | 'updatedAt' | 'order'>): HeroSlide => {
  const slides = getHeroSlides();
  const maxOrder = Math.max(...slides.map(s => s.order), 0);
  
  const newSlide: HeroSlide = {
    ...slideData,
    id: Date.now().toString(),
    order: maxOrder + 1,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  
  const updatedSlides = [...slides, newSlide];
  saveHeroSlides(updatedSlides);
  return newSlide;
};

export const updateHeroSlide = (id: string, updates: Partial<HeroSlide>): HeroSlide | null => {
  const slides = getHeroSlides();
  const slideIndex = slides.findIndex(slide => slide.id === id);
  
  if (slideIndex === -1) return null;
  
  const updatedSlide = {
    ...slides[slideIndex],
    ...updates,
    updatedAt: new Date(),
  };
  
  slides[slideIndex] = updatedSlide;
  saveHeroSlides(slides);
  return updatedSlide;
};

export const deleteHeroSlide = (id: string): boolean => {
  const slides = getHeroSlides();
  const filteredSlides = slides.filter(slide => slide.id !== id);
  
  if (filteredSlides.length === slides.length) return false;
  
  saveHeroSlides(filteredSlides);
  return true;
};

export const reorderHeroSlides = (slideIds: string[]): void => {
  const slides = getHeroSlides();
  const reorderedSlides = slideIds.map((id, index) => {
    const slide = slides.find(s => s.id === id);
    if (!slide) throw new Error(`Slide with id ${id} not found`);
    return { ...slide, order: index + 1, updatedAt: new Date() };
  });
  
  saveHeroSlides(reorderedSlides);
};

export const toggleHeroSlideStatus = (id: string): HeroSlide | null => {
  const slides = getHeroSlides();
  const slide = slides.find(s => s.id === id);
  
  if (!slide) return null;
  
  return updateHeroSlide(id, { isActive: !slide.isActive });
};
