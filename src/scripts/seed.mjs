import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { faker } from '@faker-js/faker';
import Project from '../models/Project.mjs';

// Load environment variables
dotenv.config({ path: '.env.local' });

// Sample data configuration
const TEAM_MEMBERS = ['Alice', 'Bob', 'Charlie', 'Diana', 'Eve', 'Frank'];
const STATUSES = ['active', 'on hold', 'completed', 'cancelled'];

async function seedDatabase() {
  try {
    console.log('🌱 Connecting to MongoDB Atlas...');
    
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('🧹 Clearing existing data...');
    await Project.deleteMany({});

    console.log('📝 Generating sample projects...');
    const projects = Array.from({ length: 20 }, () => ({
      name: `${faker.hacker.verb()} ${faker.commerce.productName()}`, // Updated faker methods
      description: faker.lorem.paragraph(),
      status: STATUSES[Math.floor(Math.random() * STATUSES.length)],
      deadline: faker.date.future({ years: 1 }),
      assignedTo: TEAM_MEMBERS[Math.floor(Math.random() * TEAM_MEMBERS.length)],
      budget: Math.floor(Math.random() * 90000) + 10000,
      createdAt: new Date()
    }));

    await Project.insertMany(projects);
    console.log(`✅ Successfully seeded ${projects.length} projects`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
}

seedDatabase();