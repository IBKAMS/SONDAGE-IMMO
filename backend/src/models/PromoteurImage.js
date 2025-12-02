const mongoose = require('mongoose');

const promoteurImageSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: ['residence-3k', 'residence-ciel-jardin', 'miensah-cite-lumiere'],
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

module.exports = mongoose.model('PromoteurImage', promoteurImageSchema);
