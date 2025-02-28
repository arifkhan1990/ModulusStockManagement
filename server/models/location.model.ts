import mongoose, { Schema, Document } from "mongoose";

export interface ILocation extends Document {
  companyId: Schema.Types.ObjectId;
  name: string;
  type: string; // store, warehouse, fulfillment center
  address?: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  contactInfo?: {
    phone?: string;
    email?: string;
    contactPerson?: string;
  };
  isDefault: boolean;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const LocationSchema = new Schema<ILocation>(
  {
    companyId: {
      type: Schema.Types.ObjectId,
      ref: "Company",
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      enum: ["store", "warehouse", "fulfillment", "other"],
      default: "store",
    },
    address: {
      street: { type: String },
      city: { type: String },
      state: { type: String },
      postalCode: { type: String },
      country: { type: String },
    },
    contactInfo: {
      phone: { type: String },
      email: { type: String },
      contactPerson: { type: String },
    },
    isDefault: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  },
);

// Ensure location names are unique per company
LocationSchema.index({ companyId: 1, name: 1 }, { unique: true });

// Other useful indexes
LocationSchema.index({ companyId: 1, isDefault: 1 });
LocationSchema.index({ companyId: 1, isActive: 1 });

const Location = mongoose.model<ILocation>("Location", LocationSchema);

export default Location;
