const mongoose = require('mongoose');

const planArchitecturalSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: ['villa-duplex-4p', 'villa-duplex-5p', 'villa-triplex-8p', 'plan-de-masse'],
    unique: true
  },
  titre: {
    type: String,
    required: true
  },
  filename: {
    type: String,
    required: true
  },
  originalName: {
    type: String,
    required: true
  },
  url: {
    type: String,
    required: true
  },
  cloudinaryId: {
    type: String
  },
  pdfBase64: {
    type: String  // Stockage du PDF en base64 pour contourner les restrictions Cloudinary
  },
  size: {
    type: Number,
    required: true
  },
  mimetype: {
    type: String,
    required: true,
    default: 'application/pdf'
  },
  uploadedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('PlanArchitectural', planArchitecturalSchema);
