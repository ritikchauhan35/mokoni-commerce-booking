
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, Plus, Edit, Trash2, Eye, Users, Bed } from 'lucide-react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getProperties, deleteProperty } from '@/services/firestore';
import { Property } from '@/types';
import { useToast } from '@/hooks/use-toast';
import PropertyFormModal from '@/components/admin/PropertyFormModal';
import DeleteConfirmModal from '@/components/admin/DeleteConfirmModal';

const AdminProperties = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create');
  const [deleteLoading, setDeleteLoading] = useState(false);

  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: properties = [], isLoading } = useQuery({
    queryKey: ['admin-properties'],
    queryFn: getProperties,
  });

  const filteredProperties = properties.filter(property =>
    property.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    property.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddProperty = () => {
    setFormMode('create');
    setSelectedProperty(null);
    setIsFormModalOpen(true);
  };

  const handleEditProperty = (property: Property) => {
    setFormMode('edit');
    setSelectedProperty(property);
    setIsFormModalOpen(true);
  };

  const handleDeleteProperty = (property: Property) => {
    setSelectedProperty(property);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedProperty) return;

    setDeleteLoading(true);
    try {
      await deleteProperty(selectedProperty.id);
      queryClient.invalidateQueries({ queryKey: ['admin-properties'] });
      toast({
        title: "Success",
        description: "Property deleted successfully",
      });
      setIsDeleteModalOpen(false);
      setSelectedProperty(null);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete property",
        variant: "destructive",
      });
    } finally {
      setDeleteLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-olive-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-olive-800">Property Management</h1>
        <Button onClick={handleAddProperty} className="bg-olive-600 hover:bg-olive-700">
          <Plus className="mr-2 h-4 w-4" />
          Add Property
        </Button>
      </div>

      <Card className="bg-pearl-50 border-olive-200">
        <CardHeader>
          <CardTitle className="text-olive-800">Properties ({properties.length})</CardTitle>
          <div className="flex items-center space-x-2">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-olive-400" />
              <Input
                placeholder="Search properties..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 border-olive-300 focus:border-olive-500"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-olive-700">Image</TableHead>
                <TableHead className="text-olive-700">Name</TableHead>
                <TableHead className="text-olive-700">Location</TableHead>
                <TableHead className="text-olive-700">Price/night</TableHead>
                <TableHead className="text-olive-700">Guests</TableHead>
                <TableHead className="text-olive-700">Bedrooms</TableHead>
                <TableHead className="text-olive-700">Rating</TableHead>
                <TableHead className="text-olive-700">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProperties.map((property) => (
                <TableRow key={property.id}>
                  <TableCell>
                    <img 
                      src={property.images[0] || "https://images.unsplash.com/photo-1472396961693-142e6e269027?w=400&h=300&fit=crop"} 
                      alt={property.name}
                      className="w-12 h-12 object-cover rounded"
                    />
                  </TableCell>
                  <TableCell className="font-medium text-olive-800">
                    {property.name}
                  </TableCell>
                  <TableCell className="text-olive-600">{property.location}</TableCell>
                  <TableCell className="text-olive-600">${property.price}</TableCell>
                  <TableCell className="text-olive-600">
                    <div className="flex items-center">
                      <Users className="h-3 w-3 mr-1" />
                      {property.guests}
                    </div>
                  </TableCell>
                  <TableCell className="text-olive-600">
                    <div className="flex items-center">
                      <Bed className="h-3 w-3 mr-1" />
                      {property.bedrooms}
                    </div>
                  </TableCell>
                  <TableCell className="text-olive-600">
                    ⭐ {property.rating} ({property.reviews})
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Button size="sm" variant="outline" className="border-olive-300">
                        <Eye className="h-3 w-3" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="border-olive-300"
                        onClick={() => handleEditProperty(property)}
                      >
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="destructive"
                        onClick={() => handleDeleteProperty(property)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <PropertyFormModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        property={selectedProperty}
        mode={formMode}
      />

      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        title="Delete Property"
        description={`Are you sure you want to delete "${selectedProperty?.name}"? This action cannot be undone.`}
        isLoading={deleteLoading}
      />
    </div>
  );
};

export default AdminProperties;
