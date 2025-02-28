// Define schema
const SettingSchema = new Schema({
  key: {
    type: String,
    required: true,
    trim: true,
    index: true,
    unique: true
  },
  value: {
    type: Schema.Types.Mixed,
    required: true
  },
  companyId: {
    type: Schema.Types.ObjectId,
    ref: 'Company',
    required: true,
    index: true
  }
}, { timestamps: true });

// Indexes for faster lookups
// Note: Removed duplicate key index that was already defined in the schema
SettingSchema.index({ companyId: 1 });

// ... rest of SettingSchema definition ...