
import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Star, Calendar, Users } from 'lucide-react';

const PropertyGrid = () => {
  const properties = [
    {
      id: 1,
      name: "Luxury Mountain Lodge",
      price: 189,
      rating: 4.9,
      reviews: 78,
      image: "https://images.unsplash.com/photo-1472396961693-142e6e269027?w=400&h=300&fit=crop",
      location: "Aspen, Colorado",
      guests: 8,
      bedrooms: 4
    },
    {
      id: 2,
      name: "Cozy Safari Lodge",
      price: 145,
      rating: 4.7,
      reviews: 124,
      image: "https://images.unsplash.com/photo-1466721591366-2d5fba72006d?w=400&h=300&fit=crop",
      location: "Serengeti, Tanzania",
      guests: 6,
      bedrooms: 3
    },
    {
      id: 3,
      name: "Highland Retreat",
      price: 220,
      rating: 4.8,
      reviews: 56,
      image: "https://images.unsplash.com/photo-1493962853295-0fd70327578a?w=400&h=300&fit=crop",
      location: "Scottish Highlands",
      guests: 10,
      bedrooms: 5
    },
    {
      id: 4,
      name: "Forest Cabin Escape",
      price: 95,
      rating: 4.6,
      reviews: 89,
      image: "https://images.unsplash.com/photo-1439886183900-e79ec0057170?w=400&h=300&fit=crop",
      location: "Pacific Northwest",
      guests: 4,
      bedrooms: 2
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {properties.map((property) => (
        <Card key={property.id} className="bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/20 transition-all duration-300 group">
          <CardHeader className="p-0">
            <div className="relative overflow-hidden rounded-t-lg">
              <img 
                src={property.image} 
                alt={property.name}
                className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute top-2 right-2 bg-black/50 text-white px-2 py-1 rounded text-sm">
                ${property.price}/night
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-4">
            <h3 className="text-white font-semibold mb-1 line-clamp-2">{property.name}</h3>
            <p className="text-gray-300 text-sm mb-2">{property.location}</p>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < Math.floor(property.rating)
                          ? 'text-yellow-400 fill-current'
                          : 'text-gray-400'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-gray-300 text-sm ml-1">({property.reviews})</span>
              </div>
            </div>
            <div className="flex items-center justify-between text-gray-300 text-sm mb-4">
              <div className="flex items-center">
                <Users className="h-4 w-4 mr-1" />
                {property.guests} guests
              </div>
              <div>{property.bedrooms} bedrooms</div>
            </div>
            <Button className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white border-0">
              <Calendar className="mr-2 h-4 w-4" />
              Book Now
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default PropertyGrid;
