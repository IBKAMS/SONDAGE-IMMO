const mongoose = require('mongoose');

const counterSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  seq: {
    type: Number,
    default: 0
  }
});

// Méthode statique pour obtenir le prochain numéro de séquence
counterSchema.statics.getNextSequence = async function(name) {
  const counter = await this.findOneAndUpdate(
    { name },
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );
  return counter.seq;
};

// Méthode pour réinitialiser un compteur (utile pour les tests)
counterSchema.statics.resetCounter = async function(name) {
  await this.findOneAndUpdate(
    { name },
    { seq: 0 },
    { upsert: true }
  );
};

module.exports = mongoose.model('Counter', counterSchema);
