
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Image as ImageIcon, 
  Eye, 
  EyeOff,
  GripVertical
} from 'lucide-react';
import { useHeroSlides } from '@/hooks/useHeroSlides';
import HeroSlideFormModal from '@/components/admin/HeroSlideFormModal';
import DeleteConfirmModal from '@/components/admin/DeleteConfirmModal';
import { HeroSlide } from '@/types/hero';
import { useToast } from '@/hooks/use-toast';

const HeroSlides = () => {
  const { slides, loading, createSlide, editSlide, removeSlide, toggleSlideStatus } = useHeroSlides();
  const { toast } = useToast();
  
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedSlide, setSelectedSlide] = useState<HeroSlide | null>(null);
  const [slideToDelete, setSlideToDelete] = useState<HeroSlide | null>(null);
  const [formLoading, setFormLoading] = useState(false);

  const handleAddSlide = () => {
    setSelectedSlide(null);
    setIsFormModalOpen(true);
  };

  const handleEditSlide = (slide: HeroSlide) => {
    setSelectedSlide(slide);
    setIsFormModalOpen(true);
  };

  const handleDeleteSlide = (slide: HeroSlide) => {
    setSlideToDelete(slide);
    setIsDeleteModalOpen(true);
  };

  const handleFormSubmit = async (data: any) => {
    setFormLoading(true);
    try {
      if (selectedSlide) {
        const result = editSlide(selectedSlide.id, data);
        if (result) {
          toast({
            title: "Success",
            description: "Hero slide updated successfully",
          });
        }
      } else {
        const result = createSlide(data);
        if (result) {
          toast({
            title: "Success",
            description: "Hero slide created successfully",
          });
        }
      }
      setIsFormModalOpen(false);
      setSelectedSlide(null);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save hero slide",
        variant: "destructive",
      });
    } finally {
      setFormLoading(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!slideToDelete) return;
    
    try {
      const success = removeSlide(slideToDelete.id);
      if (success) {
        toast({
          title: "Success",
          description: "Hero slide deleted successfully",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete hero slide",
        variant: "destructive",
      });
    } finally {
      setIsDeleteModalOpen(false);
      setSlideToDelete(null);
    }
  };

  const handleToggleStatus = (slide: HeroSlide) => {
    try {
      const result = toggleSlideStatus(slide.id);
      if (result) {
        toast({
          title: "Success",
          description: `Hero slide ${result.isActive ? 'activated' : 'deactivated'}`,
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update slide status",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading hero slides...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-olive-800">Hero Section Management</h1>
          <p className="text-olive-600 mt-2">
            Manage your homepage hero carousel slides
          </p>
        </div>
        <Button onClick={handleAddSlide} className="bg-olive-600 hover:bg-olive-700">
          <Plus className="mr-2 h-4 w-4" />
          Add New Slide
        </Button>
      </div>

      <div className="grid gap-6">
        {slides.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <ImageIcon className="h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No hero slides</h3>
              <p className="text-gray-500 mb-4">Get started by creating your first hero slide.</p>
              <Button onClick={handleAddSlide} className="bg-olive-600 hover:bg-olive-700">
                <Plus className="mr-2 h-4 w-4" />
                Add First Slide
              </Button>
            </CardContent>
          </Card>
        ) : (
          slides.map((slide, index) => (
            <Card key={slide.id} className="overflow-hidden">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <GripVertical className="h-5 w-5 text-gray-400" />
                    <CardTitle className="text-lg">{slide.title}</CardTitle>
                    <Badge variant={slide.isActive ? "default" : "secondary"}>
                      {slide.isActive ? "Active" : "Inactive"}
                    </Badge>
                    <Badge variant="outline" className="capitalize">
                      {slide.actionType}
                    </Badge>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center space-x-2">
                      {slide.isActive ? (
                        <Eye className="h-4 w-4 text-green-600" />
                      ) : (
                        <EyeOff className="h-4 w-4 text-gray-400" />
                      )}
                      <Switch
                        checked={slide.isActive}
                        onCheckedChange={() => handleToggleStatus(slide)}
                      />
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditSlide(slide)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteSlide(slide)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="md:col-span-1">
                    <img
                      src={slide.image}
                      alt={slide.title}
                      className="w-full h-32 object-cover rounded-md"
                      onError={(e) => {
                        e.currentTarget.src = '/placeholder.svg';
                      }}
                    />
                  </div>
                  <div className="md:col-span-2 space-y-2">
                    <div>
                      <h4 className="font-medium text-gray-900">{slide.subtitle}</h4>
                      <p className="text-sm text-gray-600 mt-1">{slide.description}</p>
                    </div>
                    <div className="flex space-x-4 text-sm">
                      <span className="bg-olive-100 text-olive-800 px-2 py-1 rounded">
                        {slide.primaryAction}
                      </span>
                      <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded">
                        {slide.secondaryAction}
                      </span>
                    </div>
                    <div className="text-xs text-gray-500">
                      Order: {slide.order} • Created: {slide.createdAt.toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      <HeroSlideFormModal
        isOpen={isFormModalOpen}
        onClose={() => {
          setIsFormModalOpen(false);
          setSelectedSlide(null);
        }}
        onSubmit={handleFormSubmit}
        slide={selectedSlide}
        loading={formLoading}
      />

      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSlideToDelete(null);
        }}
        onConfirm={handleConfirmDelete}
        title="Delete Hero Slide"
        description={`Are you sure you want to delete "${slideToDelete?.title}"? This action cannot be undone.`}
      />
    </div>
  );
};

export default HeroSlides;
