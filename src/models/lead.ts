import mongoose from 'mongoose';

const addressSchema = new mongoose.Schema({
  street: String,
  city: String,
  state: String,
  country: String,
  postalCode: String,
});

const leadSchema = new mongoose.Schema({
  leadId: {
    type: String,
    required: true,
  },
  name: String,
  customerId: {
    type: String,
    required: true,
  },
  // Additional fields from CRM
  firstName: String,
  lastName: String,
  companyName: String,
  source: String,
  ownerId: String,
  contactId: String,
  primaryEmail: String,
  primaryPhone: String,
  jobTitle: String,
  primaryAddress: addressSchema,
  emails: [String],
  phones: [String],
  addresses: [addressSchema],
  lastActivityTime: Date,
  uri: String,
  createdById: String,
  updatedById: String,
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