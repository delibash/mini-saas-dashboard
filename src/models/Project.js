import mongoose from 'mongoose';

const ProjectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a project name'],
    trim: true,
    maxlength: [100, 'Name cannot be more than 100 characters']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Description cannot be more than 500 characters']
  },
  status: {
    type: String,
    enum: ['active', 'on hold', 'completed', 'cancelled'],
    default: 'active'
  },
  deadline: {
    type: Date,
    required: [true, 'Please provide a deadline']
  },
  assignedTo: {
    type: String,
    required: [true, 'Please assign the project to someone'],
    trim: true
  },
  budget: {
    type: Number,
    required: [true, 'Please provide a budget'],
    min: [0, 'Budget cannot be negative']
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field before saving
ProjectSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

export default mongoose.models.Project || mongoose.model('Project', ProjectSchema);