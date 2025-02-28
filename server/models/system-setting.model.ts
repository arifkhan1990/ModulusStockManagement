// Define schema
const SystemSettingSchema = new Schema({
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
  description: {
    type: String,
    trim: true
  }
}, { timestamps: true });

// Indexes for faster lookups
// Note: Removed duplicate key index that was already defined in the schema