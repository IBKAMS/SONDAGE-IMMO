const mongoose = require('mongoose');

const optionSchema = new mongoose.Schema({
  label: { type: String, required: true },
  value: { type: String, required: true }
});

const questionSchema = new mongoose.Schema({
  name: { type: String, required: true },
  label: { type: String, required: true },
  type: {
    type: String,
    enum: ['text', 'email', 'tel', 'date', 'select', 'radio', 'checkbox', 'range', 'textarea', 'ranking'],
    required: true
  },
  required: { type: Boolean, default: false },
  tooltip: { type: String, default: '' },
  placeholder: { type: String, default: '' },
  options: [optionSchema],
  min: { type: Number },
  max: { type: Number },
  step: { type: Number, default: 1 },
  minLabel: { type: String, default: '' },
  maxLabel: { type: String, default: '' },
  maxSelections: { type: Number, default: 3 },
  order: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true }
});

const stepSchema = new mongoose.Schema({
  stepNumber: { type: Number, required: true },
  title: { type: String, required: true },
  icon: { type: String, default: '' },
  description: { type: String, default: '' },
  questions: [questionSchema],
  isActive: { type: Boolean, default: true }
});

const questionnaireContentSchema = new mongoose.Schema({
  title: { type: String, default: 'Questionnaire' },
  subtitle: { type: String, default: '' },
  steps: [stepSchema]
}, {
  timestamps: true
});

module.exports = mongoose.model('QuestionnaireContent', questionnaireContentSchema);
