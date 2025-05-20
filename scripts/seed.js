require('dotenv').config();
const mongoose = require('mongoose');
const Project = require('../src/models/Project');
const dbConnect = require('../src/lib/dbConnect');
const { faker } = require('@faker-js/faker');

async function seedDatabase() {
  try {
    await dbConnect();
    
    // Clear existing data
    await Project.deleteMany({});
    console.log('Cleared existing projects');
    
    // Generate fake projects
    const statuses = ['active', 'on hold', 'completed', 'cancelled'];
    const teamMembers = ['Alice', 'Bob', 'Charlie', 'Diana', 'Eve', 'Frank'];
    
    const projects = Array.from({ length: 20 }, () => ({
      name: faker.company.catchPhrase(),
      description: faker.lorem.paragraph(),
      status: statuses[Math.floor(Math.random() * statuses.length)],
      deadline: faker.date.future(),
      assignedTo: teamMembers[Math.floor(Math.random() * teamMembers.length)],
      budget: Math.floor(Math.random() * 100000) + 5000
    }));
    
    await Project.insertMany(projects);
    console.log(`Successfully seeded ${projects.length} projects`);
    
    mongoose.disconnect();
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();