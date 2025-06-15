
import { collection, addDoc, getDocs, deleteDoc } from 'firebase/firestore';
import { db } from '@/config/firebase';
import { Product, Property } from '@/types';

// Sample products data
const sampleProducts: Omit<Product, 'id' | 'createdAt'>[] = [
  {
    name: "Premium Organic Coffee Beans",
    description: "Hand-picked arabica beans from sustainable farms with rich, smooth flavor profile.",
    price: 24.99,
    originalPrice: 29.99,
    category: "Food & Beverages",
    images: ["https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=400&h=300&fit=crop"],
    rating: 4.8,
    reviews: 127,
    inStock: true,
    inventory: 45
  },
  {
    name: "Handcrafted Ceramic Vase",
    description: "Beautiful handmade ceramic vase perfect for home decoration and flower arrangements.",
    price: 89.99,
    category: "Home & Decor",
    images: ["https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop"],
    rating: 4.6,
    reviews: 89,
    inStock: true,
    inventory: 12
  },
  {
    name: "Eco-Friendly Bamboo Kitchenware Set",
    description: "Sustainable bamboo kitchen utensils set including spoons, spatulas, and cutting board.",
    price: 34.99,
    originalPrice: 44.99,
    category: "Kitchen & Dining",
    images: ["https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop"],
    rating: 4.7,
    reviews: 156,
    inStock: true,
    inventory: 28
  },
  {
    name: "Artisan Leather Wallet",
    description: "Handcrafted genuine leather wallet with multiple card slots and RFID protection.",
    price: 79.99,
    category: "Fashion & Accessories",
    images: ["https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=300&fit=crop"],
    rating: 4.9,
    reviews: 203,
    inStock: true,
    inventory: 67
  },
  {
    name: "Natural Skincare Gift Set",
    description: "Luxury skincare set with natural ingredients including cleanser, moisturizer, and serum.",
    price: 119.99,
    originalPrice: 149.99,
    category: "Beauty & Personal Care",
    images: ["https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&h=300&fit=crop"],
    rating: 4.5,
    reviews: 94,
    inStock: true,
    inventory: 33
  },
  {
    name: "Smart Fitness Tracker",
    description: "Advanced fitness tracker with heart rate monitoring, sleep tracking, and GPS features.",
    price: 199.99,
    category: "Electronics & Tech",
    images: ["https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=400&h=300&fit=crop"],
    rating: 4.4,
    reviews: 312,
    inStock: false,
    inventory: 0
  },
  {
    name: "Cozy Merino Wool Blanket",
    description: "Ultra-soft merino wool throw blanket perfect for cold evenings and home comfort.",
    price: 149.99,
    category: "Home & Decor",
    images: ["https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop"],
    rating: 4.8,
    reviews: 178,
    inStock: true,
    inventory: 19
  },
  {
    name: "Gourmet Chocolate Collection",
    description: "Artisan chocolate collection featuring dark, milk, and white chocolate varieties.",
    price: 59.99,
    category: "Food & Beverages",
    images: ["https://images.unsplash.com/photo-1511381939415-e44015466834?w=400&h=300&fit=crop"],
    rating: 4.7,
    reviews: 245,
    inStock: true,
    inventory: 54
  }
];

// Sample properties data
const sampleProperties: Omit<Property, 'id' | 'createdAt'>[] = [
  {
    name: "Luxury Mountain Lodge",
    description: "Breathtaking mountain views with modern amenities, perfect for family getaways and romantic retreats.",
    price: 189,
    location: "Aspen, Colorado",
    guests: 8,
    bedrooms: 4,
    images: ["https://images.unsplash.com/photo-1472396961693-142e6e269027?w=400&h=300&fit=crop"],
    rating: 4.9,
    reviews: 78,
    amenities: ["WiFi", "Hot Tub", "Fireplace", "Kitchen", "Parking", "Mountain View"],
    availability: [
      new Date('2024-07-01'),
      new Date('2024-07-15'),
      new Date('2024-08-01'),
      new Date('2024-08-15')
    ]
  },
  {
    name: "Cozy Safari Lodge",
    description: "Authentic safari experience with wildlife viewing opportunities and luxury accommodations.",
    price: 145,
    location: "Serengeti, Tanzania",
    guests: 6,
    bedrooms: 3,
    images: ["https://images.unsplash.com/photo-1466721591366-2d5fba72006d?w=400&h=300&fit=crop"],
    rating: 4.7,
    reviews: 124,
    amenities: ["WiFi", "Game Drives", "Restaurant", "Bar", "Pool", "Wildlife View"],
    availability: [
      new Date('2024-06-20'),
      new Date('2024-07-10'),
      new Date('2024-09-05'),
      new Date('2024-10-12')
    ]
  },
  {
    name: "Highland Retreat",
    description: "Secluded highland property with stunning landscapes and traditional Scottish charm.",
    price: 220,
    location: "Scottish Highlands",
    guests: 10,
    bedrooms: 5,
    images: ["https://images.unsplash.com/photo-1493962853295-0fd70327578a?w=400&h=300&fit=crop"],
    rating: 4.8,
    reviews: 56,
    amenities: ["WiFi", "Fireplace", "Kitchen", "Hiking Trails", "Garden", "Highland View"],
    availability: [
      new Date('2024-08-20'),
      new Date('2024-09-15'),
      new Date('2024-10-01'),
      new Date('2024-11-10')
    ]
  },
  {
    name: "Forest Cabin Escape",
    description: "Peaceful forest cabin surrounded by nature, ideal for digital detox and relaxation.",
    price: 95,
    location: "Pacific Northwest",
    guests: 4,
    bedrooms: 2,
    images: ["https://images.unsplash.com/photo-1439886183900-e79ec0057170?w=400&h=300&fit=crop"],
    rating: 4.6,
    reviews: 89,
    amenities: ["WiFi", "Fireplace", "Kitchen", "Hiking", "Forest View", "Hot Tub"],
    availability: [
      new Date('2024-06-15'),
      new Date('2024-07-01'),
      new Date('2024-08-10'),
      new Date('2024-09-20')
    ]
  },
  {
    name: "Beachfront Villa Paradise",
    description: "Luxurious beachfront villa with private beach access and panoramic ocean views.",
    price: 350,
    location: "Malibu, California",
    guests: 12,
    bedrooms: 6,
    images: ["https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400&h=300&fit=crop"],
    rating: 5.0,
    reviews: 167,
    amenities: ["WiFi", "Private Beach", "Pool", "Kitchen", "Ocean View", "Hot Tub"],
    availability: [
      new Date('2024-07-05'),
      new Date('2024-08-12'),
      new Date('2024-09-08'),
      new Date('2024-10-20')
    ]
  },
  {
    name: "Urban Loft Downtown",
    description: "Modern loft in the heart of the city with stylish decor and convenient location.",
    price: 125,
    location: "New York City, NY",
    guests: 4,
    bedrooms: 2,
    images: ["https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&h=300&fit=crop"],
    rating: 4.4,
    reviews: 203,
    amenities: ["WiFi", "Kitchen", "City View", "Gym Access", "Parking", "Rooftop"],
    availability: [
      new Date('2024-06-25'),
      new Date('2024-07-20'),
      new Date('2024-08-30'),
      new Date('2024-09-25')
    ]
  }
];

// Function to clear existing data
export const clearAllData = async () => {
  console.log('Clearing existing data...');
  
  // Clear products
  const productsSnapshot = await getDocs(collection(db, 'products'));
  for (const doc of productsSnapshot.docs) {
    await deleteDoc(doc.ref);
  }
  
  // Clear properties
  const propertiesSnapshot = await getDocs(collection(db, 'properties'));
  for (const doc of propertiesSnapshot.docs) {
    await deleteDoc(doc.ref);
  }
  
  console.log('Data cleared successfully');
};

// Function to seed products
export const seedProducts = async () => {
  console.log('Seeding products...');
  
  for (const product of sampleProducts) {
    await addDoc(collection(db, 'products'), {
      ...product,
      createdAt: new Date()
    });
  }
  
  console.log(`Seeded ${sampleProducts.length} products`);
};

// Function to seed properties
export const seedProperties = async () => {
  console.log('Seeding properties...');
  
  for (const property of sampleProperties) {
    await addDoc(collection(db, 'properties'), {
      ...property,
      createdAt: new Date()
    });
  }
  
  console.log(`Seeded ${sampleProperties.length} properties`);
};

// Main seeding function
export const seedDatabase = async () => {
  try {
    console.log('Starting database seeding...');
    
    await clearAllData();
    await seedProducts();
    await seedProperties();
    
    console.log('Database seeding completed successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
    throw error;
  }
};
