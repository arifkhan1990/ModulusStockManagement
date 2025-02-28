import mongoose, { Schema, Document } from "mongoose";

interface ISetting extends Document {
  key: string;
  value: any;
  companyId: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const SettingSchema = new Schema<ISetting>(
  {
    key: {
      type: String,
      required: true,
      trim: true,
      unique: true, // Unique index; removed index: true
    },
    value: {
      type: Schema.Types.Mixed,
      required: true,
    },
    companyId: {
      type: Schema.Types.ObjectId,
      ref: "Company",
      required: true,
      index: true, // Single index definition
    },
  },
  { timestamps: true },
);

// No duplicate indexes needed
// SettingSchema.index({ companyId: 1 }); // Removed to avoid duplication

export default mongoose.model<ISetting>("Setting", SettingSchema);
