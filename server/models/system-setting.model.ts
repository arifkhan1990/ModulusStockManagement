import mongoose, { Schema, Document } from "mongoose";

interface ISystemSetting extends Document {
  key: string;
  value: any;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

const SystemSettingSchema = new Schema<ISystemSetting>(
  {
    key: {
      type: String,
      required: true,
      trim: true,
      unique: true, // Unique index is sufficient; removed index: true
    },
    value: {
      type: Schema.Types.Mixed,
      required: true,
    },
    description: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true },
);

// No explicit indexes needed since unique: true handles it
// SystemSettingSchema.index({ key: 1 }); // Ensure this is NOT present
const SystemSetting = mongoose.model<ISystemSetting>(
  "SystemSetting",
  SystemSettingSchema,
);

export default SystemSetting;
