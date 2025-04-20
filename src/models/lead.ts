import mongoose from 'mongoose';

const leadSchema = new mongoose.Schema({
  leadId: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  customerId: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

export const Lead = mongoose.models.Lead || mongoose.model('Lead', leadSchema); 