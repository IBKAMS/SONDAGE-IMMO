const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: ['visite3d', 'promoteur', 'analyseEconomique', 'architecte'],
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

module.exports = mongoose.model('Video', videoSchema);
