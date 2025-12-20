const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['student', 'teacher', 'admin'],
    default: 'student'
  },
  phone: {
    type: String,
    trim: true
  },
  profile_pic: {
    type: String
  },
  bio: {
    type: String
  },
  // Teacher-specific fields
  subject: {
    type: String
  },
  qualification: {
    type: String
  },
  experience_years: {
    type: Number
  },
  linkedin: {
    type: String
  },
  availability: {
    type: String
  },
  location: {
    type: String
  },
  created_at: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('User', userSchema);

