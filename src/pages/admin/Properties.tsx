
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Search, Plus, Edit, Trash2, Eye, Users, Bed } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { getProperties } from '@/services/firestore';

const AdminProperties = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const { data: properties = [], isLoading } = useQuery({
    queryKey: ['admin-properties'],
    queryFn: getProperties,
  });

  const filteredProperties = properties.filter(property =>
    property.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    property.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-olive-800">Property Management</h1>
        <Button className="bg-olive-600 hover:bg-olive-700">
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
                      <Button size="sm" variant="outline" className="border-olive-300">
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button size="sm" variant="destructive">
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
    </div>
  );
};

export default AdminProperties;
