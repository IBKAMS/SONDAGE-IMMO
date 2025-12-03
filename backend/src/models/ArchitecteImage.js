const mongoose = require('mongoose');

const architecteImageSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: ['projet-architecte-1', 'projet-architecte-2', 'projet-architecte-3'],
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
  cloudinaryId: {
    type: String
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

module.exports = mongoose.model('ArchitecteImage', architecteImageSchema);
