import mongoose from 'mongoose';

// Define Project Schema with validation and middleware
const ProjectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a project name'],
    trim: true,
    maxlength: [100, 'Name cannot be more than 100 characters'],
    index: true // Add index for faster queries
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Description cannot be more than 500 characters']
  },
  status: {
    type: String,
    enum: {
      values: ['active', 'on hold', 'completed', 'cancelled'],
      message: '{VALUE} is not a valid status'
    },
    default: 'active',
    index: true
  },
  deadline: {
    type: Date,
    required: [true, 'Please provide a deadline'],
    validate: {
      validator: function(value) {
        return value > Date.now();
      },
      message: 'Deadline must be in the future'
    }
  },
  assignedTo: {
    type: String,
    required: [true, 'Please assign the project to someone'],
    trim: true,
    index: true
  },
  budget: {
    type: Number,
    required: [true, 'Please provide a budget'],
    min: [0, 'Budget cannot be negative'],
    set: v => Math.round(v * 100) / 100 // Store as 2 decimal places
  },
  createdAt: {
    type: Date,
    default: Date.now,
    immutable: true // Cannot be modified after creation
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: false, // We're handling timestamps manually
  toJSON: { virtuals: true }, // Include virtuals when converting to JSON
  toObject: { virtuals: true }
});

// Add text index for search functionality
ProjectSchema.index({
  name: 'text',
  description: 'text'
});

// Update timestamp middleware
ProjectSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Update timestamp for findOneAndUpdate operations
ProjectSchema.pre('findOneAndUpdate', function(next) {
  this.set({ updatedAt: Date.now() });
  next();
});

// Virtual property for days remaining
ProjectSchema.virtual('daysRemaining').get(function() {
  return Math.ceil((this.deadline - Date.now()) / (1000 * 60 * 60 * 24));
});

// Query helper for active projects
ProjectSchema.query.active = function() {
  return this.where({ status: 'active' });
};

// Static method for getting overdue projects
ProjectSchema.statics.findOverdue = function() {
  return this.find({ deadline: { $lt: new Date() }, status: { $ne: 'completed' } });
};

// Instance method for marking complete
ProjectSchema.methods.markComplete = function() {
  this.status = 'completed';
  return this.save();
};

// Export the model
const Project = mongoose.models.Project || mongoose.model('Project', ProjectSchema);
export default Project;