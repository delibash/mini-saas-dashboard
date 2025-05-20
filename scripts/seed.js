require('dotenv').config();
const mongoose = require('mongoose');
const Project = require('../src/models/Project');
const dbConnect = require('../src/lib/dbConnect');
const { faker } = require('@faker-js/faker');

// Team members for assignment
const TEAM_MEMBERS = ['Alice', 'Bob', 'Charlie', 'Diana', 'Eve', 'Frank'];
const STATUSES = ['active', 'on hold', 'completed', 'cancelled'];

async function seedDatabase() {
  try {
    console.log('⏳ Connecting to database...');
    await dbConnect();
    
    // Clear existing data
    console.log('🧹 Clearing existing projects...');
    await Project.deleteMany({});
    
    // Generate fake projects
    console.log('🌱 Generating sample projects...');
    const projects = Array.from({ length: 20 }, () => ({
      name: `${faker.company.buzzVerb()} ${faker.company.bsNoun()}`,
      description: faker.lorem.paragraph(),
      status: STATUSES[Math.floor(Math.random() * STATUSES.length)],
      deadline: faker.date.future({ years: 1 }),
      assignedTo: TEAM_MEMBERS[Math.floor(Math.random() * TEAM_MEMBERS.length)],
      budget: Math.floor(Math.random() * 90000) + 10000 // $10,000-$100,000
    }));
    
    // Insert projects
    await Project.insertMany(projects);
    console.log(`✅ Successfully seeded ${projects.length} projects`);
    
    // Disconnect
    mongoose.disconnect();
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();