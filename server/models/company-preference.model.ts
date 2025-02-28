import mongoose from 'mongoose';

// Feature schema
const featureSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    trim: true
  },
  enabled: {
    type: Boolean,
    default: true
  },
  config: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  }
}, { _id: false });

// Preference schema
const preferenceSchema = new mongoose.Schema({
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true
  },
  features: [featureSchema],
  preferences: {
    theme: {
      type: String,
      enum: ['light', 'dark', 'system'],
      default: 'system'
    },
    dateFormat: {
      type: String,
      default: 'MM/DD/YYYY'
    },
    currency: {
      type: String,
      default: 'USD'
    },
    timezone: {
      type: String,
      default: 'UTC'
    },
    language: {
      type: String,
      default: 'en'
    },
    notifications: {
      email: {
        type: Boolean,
        default: true
      },
      push: {
        type: Boolean,
        default: true
      },
      sms: {
        type: Boolean,
        default: false
      }
    }
  }
}, {
  timestamps: true
});

// Create a compound index for faster lookups
preferenceSchema.index({ companyId: 1 });

const CompanyPreference = mongoose.model('CompanyPreference', preferenceSchema);

export default CompanyPreference;