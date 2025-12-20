const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  subject: {
    type: String,
    trim: true
  },
  description: {
    type: String
  },
  material_url: {
    type: String
  },
  teacher_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  instructor_name: {
    type: String,
    required: true
  },
  access_type: {
    type: String,
    enum: ['free', 'paid'],
    default: 'free'
  },
  price: {
    type: Number,
    default: 0
  },
  thumbnail: {
    type: String
  },
  level: {
    type: String
  },
  duration: {
    type: String
  },
  category_id: {
    type: String
  },
  status: {
    type: String,
    enum: ['draft', 'published', 'archived'],
    default: 'published'
  },
  is_active: {
    type: Boolean,
    default: true
  },
  // Additional fields for course details
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  total_ratings: {
    type: Number,
    default: 0
  },
  learningOutcomes: {
    type: [String],
    default: []
  },
  prerequisites: {
    type: [String],
    default: []
  },
  modules: [{
    title: {
      type: String,
      required: true
    },
    lessons: {
      type: Number,
      default: 0
    },
    duration: {
      type: String,
      default: "0h"
    },
    description: {
      type: String
    }
  }],
  language: {
    type: String,
    default: 'English'
  },
  created_at: {
    type: Date,
    default: Date.now
  },
  updated_at: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Course', courseSchema);

