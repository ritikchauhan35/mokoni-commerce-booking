
import { useState, useEffect } from 'react';
import { HeroSlide } from '@/types/hero';
import { 
  getHeroSlides, 
  getActiveHeroSlides, 
  addHeroSlide, 
  updateHeroSlide, 
  deleteHeroSlide, 
  reorderHeroSlides,
  toggleHeroSlideStatus 
} from '@/services/heroSlides';

export const useHeroSlides = () => {
  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadSlides = () => {
    try {
      setLoading(true);
      const heroSlides = getHeroSlides();
      setSlides(heroSlides);
      setError(null);
    } catch (err) {
      setError('Failed to load hero slides');
      console.error('Error loading hero slides:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSlides();
  }, []);

  const activeSlides = slides.filter(slide => slide.isActive);

  const createSlide = (slideData: Omit<HeroSlide, 'id' | 'createdAt' | 'updatedAt' | 'order'>) => {
    try {
      const newSlide = addHeroSlide(slideData);
      loadSlides();
      return newSlide;
    } catch (err) {
      setError('Failed to create hero slide');
      console.error('Error creating hero slide:', err);
      return null;
    }
  };

  const editSlide = (id: string, updates: Partial<HeroSlide>) => {
    try {
      const updatedSlide = updateHeroSlide(id, updates);
      if (updatedSlide) {
        loadSlides();
      }
      return updatedSlide;
    } catch (err) {
      setError('Failed to update hero slide');
      console.error('Error updating hero slide:', err);
      return null;
    }
  };

  const removeSlide = (id: string) => {
    try {
      const success = deleteHeroSlide(id);
      if (success) {
        loadSlides();
      }
      return success;
    } catch (err) {
      setError('Failed to delete hero slide');
      console.error('Error deleting hero slide:', err);
      return false;
    }
  };

  const reorderSlides = (slideIds: string[]) => {
    try {
      reorderHeroSlides(slideIds);
      loadSlides();
    } catch (err) {
      setError('Failed to reorder hero slides');
      console.error('Error reordering hero slides:', err);
    }
  };

  const toggleSlideStatus = (id: string) => {
    try {
      const updatedSlide = toggleHeroSlideStatus(id);
      if (updatedSlide) {
        loadSlides();
      }
      return updatedSlide;
    } catch (err) {
      setError('Failed to toggle hero slide status');
      console.error('Error toggling hero slide status:', err);
      return null;
    }
  };

  return {
    slides,
    activeSlides,
    loading,
    error,
    createSlide,
    editSlide,
    removeSlide,
    reorderSlides,
    toggleSlideStatus,
    refresh: loadSlides
  };
};
