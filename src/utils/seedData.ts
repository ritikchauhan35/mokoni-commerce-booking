
import { collection, addDoc } from 'firebase/firestore';
import { db } from '@/config/firebase';
import { Product } from '@/types';

const sampleProducts: Omit<Product, 'id'>[] = [
  {
    name: "Premium Wireless Headphones",
    description: "High-quality wireless headphones with noise cancellation and premium sound quality.",
    price: 299.99,
    originalPrice: 399.99,
    category: "Electronics",
    images: ["https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=400&h=300&fit=crop"],
    rating: 4.8,
    reviews: 156,
    inStock: true,
    inventory: 25,
    createdAt: new Date()
  },
  {
    name: "Smart Home Assistant",
    description: "Voice-activated smart home assistant with premium audio and smart home controls.",
    price: 149.99,
    category: "Electronics",
    images: ["https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&h=300&fit=crop"],
    rating: 4.6,
    reviews: 89,
    inStock: true,
    inventory: 15,
    createdAt: new Date()
  },
  {
    name: "Professional Laptop Stand",
    description: "Ergonomic laptop stand made from premium aluminum with adjustable height.",
    price: 79.99,
    originalPrice: 99.99,
    category: "Accessories",
    images: ["https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=400&h=300&fit=crop"],
    rating: 4.9,
    reviews: 234,
    inStock: true,
    inventory: 50,
    createdAt: new Date()
  },
  {
    name: "Ergonomic Office Chair",
    description: "Premium ergonomic office chair with lumbar support and breathable mesh.",
    price: 399.99,
    category: "Furniture",
    images: ["https://images.unsplash.com/photo-1721322800607-8c38375eef04?w=400&h=300&fit=crop"],
    rating: 4.7,
    reviews: 67,
    inStock: true,
    inventory: 8,
    createdAt: new Date()
  },
  {
    name: "Bluetooth Speaker Pro",
    description: "Portable waterproof bluetooth speaker with 360-degree sound and long battery life.",
    price: 89.99,
    category: "Electronics",
    images: ["https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&h=300&fit=crop"],
    rating: 4.5,
    reviews: 312,
    inStock: true,
    inventory: 30,
    createdAt: new Date()
  },
  {
    name: "Mechanical Gaming Keyboard",
    description: "RGB backlit mechanical keyboard with premium switches and gaming features.",
    price: 159.99,
    originalPrice: 199.99,
    category: "Electronics",
    images: ["https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=400&h=300&fit=crop"],
    rating: 4.8,
    reviews: 428,
    inStock: false,
    inventory: 0,
    createdAt: new Date()
  }
];

export const seedProducts = async () => {
  try {
    console.log('Seeding products...');
    const productsRef = collection(db, 'products');
    
    for (const product of sampleProducts) {
      await addDoc(productsRef, product);
    }
    
    console.log('Products seeded successfully!');
  } catch (error) {
    console.error('Error seeding products:', error);
  }
};

// Call this function once to populate your database
// seedProducts();
