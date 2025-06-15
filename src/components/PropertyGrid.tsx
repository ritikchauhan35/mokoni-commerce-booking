
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Star, Calendar, Users, Eye } from 'lucide-react';
import { useProperties } from '@/hooks/useProperties';
import { Skeleton } from '@/components/ui/skeleton';

interface PropertyGridProps {
  limit?: number;
}

const PropertyGrid = ({ limit }: PropertyGridProps) => {
  const { data: properties, isLoading, error } = useProperties();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: limit || 6 }).map((_, i) => (
          <Card key={i} className="bg-pearl-100 border-olive-200 shadow-lg">
            <CardHeader className="p-0">
              <Skeleton className="w-full h-48 rounded-t-lg" />
            </CardHeader>
            <CardContent className="p-4">
              <Skeleton className="h-6 w-full mb-2" />
              <Skeleton className="h-4 w-3/4 mb-2" />
              <Skeleton className="h-6 w-1/2 mb-4" />
              <Skeleton className="h-10 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">Error loading properties. Please try again later.</p>
      </div>
    );
  }

  if (!properties || properties.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-olive-700">No properties available at the moment.</p>
      </div>
    );
  }

  // Apply limit if provided
  const displayedProperties = limit ? properties.slice(0, limit) : properties;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {displayedProperties.map((property) => (
        <Card key={property.id} className="bg-pearl-50 border-olive-200 hover:bg-pearl-100 transition-all duration-300 group shadow-lg hover:shadow-xl">
          <CardHeader className="p-0">
            <div className="relative overflow-hidden rounded-t-lg">
              <img 
                src={property.images[0] || "https://images.unsplash.com/photo-1472396961693-142e6e269027?w=400&h=300&fit=crop"} 
                alt={property.name}
                className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute top-2 right-2 bg-olive-800/80 text-pearl-50 px-2 py-1 rounded text-sm font-semibold">
                ${property.price}/night
              </div>
              <Link 
                to={`/property/${property.id}`}
                className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100"
              >
                <Button size="sm" className="bg-olive-600 hover:bg-olive-700">
                  <Eye className="mr-2 h-4 w-4" />
                  View Details
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent className="p-4">
            <h3 className="text-olive-800 font-semibold mb-1 line-clamp-2">{property.name}</h3>
            <p className="text-olive-600 text-sm mb-2">{property.location}</p>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < Math.floor(property.rating)
                          ? 'text-yellow-500 fill-current'
                          : 'text-gray-400'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-olive-600 text-sm ml-1">({property.reviews})</span>
              </div>
            </div>
            <div className="flex items-center justify-between text-olive-600 text-sm mb-4">
              <div className="flex items-center">
                <Users className="h-4 w-4 mr-1" />
                {property.guests} guests
              </div>
              <div>{property.bedrooms} bedrooms</div>
            </div>
            <Link to={`/property/${property.id}`}>
              <Button className="w-full bg-olive-600 hover:bg-olive-700 text-pearl-50 border-0">
                <Calendar className="mr-2 h-4 w-4" />
                Book Now
              </Button>
            </Link>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default PropertyGrid;
