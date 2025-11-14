const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: ['villa-duplex-4p', 'villa-duplex-5p', 'villa-triplex-6p'],
    unique: true
  },
  filename: {
    type: String,
    required: true
  },
  originalName: {
    type: String,
    required: true
  },
  path: {
    type: String,
    required: true
  },
  size: {
    type: Number,
    required: true
  },
  mimetype: {
    type: String,
    required: true
  },
  uploadedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Image', imageSchema);
