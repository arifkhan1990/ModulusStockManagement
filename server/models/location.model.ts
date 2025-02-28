
import mongoose, { Schema, Document } from 'mongoose';

export interface ILocation extends Document {
  name: string;
  type: string; // warehouse, store, distribution center
  address: string;
  contactNumber?: string;
  contactEmail?: string;
  manager?: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
  capacity?: number;
  isActive: boolean;
  operatingHours?: {
    monday: string;
    tuesday: string;
    wednesday: string;
    thursday: string;
    friday: string;
    saturday: string;
    sunday: string;
  };
  businessSize: string; // small, medium, large
  createdAt: Date;
  updatedAt: Date;
}

const LocationSchema = new Schema<ILocation>({
  name: { type: String, required: true },
  type: { type: String, required: true },
  address: { type: String, required: true },
  contactNumber: { type: String },
  contactEmail: { type: String },
  manager: { type: String },
  coordinates: {
    latitude: { type: Number },
    longitude: { type: Number },
  },
  capacity: { type: Number },
  isActive: { type: Boolean, default: true },
  operatingHours: {
    monday: { type: String, default: '9:00-17:00' },
    tuesday: { type: String, default: '9:00-17:00' },
    wednesday: { type: String, default: '9:00-17:00' },
    thursday: { type: String, default: '9:00-17:00' },
    friday: { type: String, default: '9:00-17:00' },
    saturday: { type: String, default: '9:00-17:00' },
    sunday: { type: String, default: 'Closed' },
  },
  businessSize: { type: String, enum: ['small', 'medium', 'large'], default: 'small' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const Location = mongoose.model<ILocation>('Location', LocationSchema);

export default Location;
