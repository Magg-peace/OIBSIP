import mongoose from 'mongoose';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import Inventory from './models/Inventory.js';
import User from './models/User.js';

dotenv.config();

const defaultIngredients = [
  // Bases
  { name: 'Thin Crust', type: 'base', quantity: 50, threshold: 10, price: 120 },
  { name: 'Thick Crust', type: 'base', quantity: 45, threshold: 10, price: 130 },
  { name: 'Gluten-Free', type: 'base', quantity: 20, threshold: 5, price: 160 },
  { name: 'Cheese Burst', type: 'base', quantity: 30, threshold: 8, price: 180 },
  { name: 'Pan Crust', type: 'base', quantity: 40, threshold: 10, price: 140 },

  // Sauces
  { name: 'Classic Tomato', type: 'sauce', quantity: 100, threshold: 20, price: 20 },
  { name: 'Spicy Marinara', type: 'sauce', quantity: 80, threshold: 15, price: 25 },
  { name: 'Creamy Garlic Alfredo', type: 'sauce', quantity: 60, threshold: 15, price: 35 },
  { name: 'Pesto', type: 'sauce', quantity: 50, threshold: 10, price: 40 },
  { name: 'Zesty BBQ', type: 'sauce', quantity: 70, threshold: 15, price: 30 },

  // Cheeses
  { name: 'Mozzarella', type: 'cheese', quantity: 90, threshold: 20, price: 40 },
  { name: 'Cheddar', type: 'cheese', quantity: 70, threshold: 15, price: 50 },
  { name: 'Parmesan', type: 'cheese', quantity: 50, threshold: 10, price: 55 },
  { name: 'Feta', type: 'cheese', quantity: 40, threshold: 8, price: 60 },
  { name: 'Vegan Cheese', type: 'cheese', quantity: 30, threshold: 8, price: 70 },

  // Vegetables
  { name: 'Bell Peppers', type: 'veg', quantity: 120, threshold: 25, price: 15 },
  { name: 'Onions', type: 'veg', quantity: 150, threshold: 30, price: 12 },
  { name: 'Mushrooms', type: 'veg', quantity: 80, threshold: 20, price: 25 },
  { name: 'Olives', type: 'veg', quantity: 110, threshold: 20, price: 20 },
  { name: 'Jalapenos', type: 'veg', quantity: 95, threshold: 15, price: 22 },
  { name: 'Tomatoes', type: 'veg', quantity: 130, threshold: 25, price: 15 },
  { name: 'Spinach', type: 'veg', quantity: 60, threshold: 15, price: 18 },
  { name: 'Sweet Corn', type: 'veg', quantity: 100, threshold: 20, price: 15 }
];

const seedDatabase = async () => {
  try {
    await connectDB();
    console.log('Clearing existing inventory items and users...');
    await Inventory.deleteMany();
    await User.deleteMany();

    console.log('Inserting default ingredients...');
    await Inventory.insertMany(defaultIngredients);

    console.log('Inserting demo users...');
    await User.create({
      name: 'Demo User',
      email: 'user@example.com',
      password: 'password123',
      role: 'user',
      isVerified: true
    });

    await User.create({
      name: 'Demo Admin',
      email: 'admin@example.com',
      password: 'password123',
      role: 'admin',
      isVerified: true
    });

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Database seeding failed:', error);
    process.exit(1);
  }
};

seedDatabase();
