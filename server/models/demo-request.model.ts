
import mongoose, { Schema, Document } from 'mongoose';

export interface IDemoRequest extends Document {
  fullName: string;
  email: string;
  companyName: string;
  companySize: string;
  message?: string;
  businessType?: string;
  expectedMonthlyVolume?: string;
  createdAt: Date;
}

const DemoRequestSchema = new Schema<IDemoRequest>({
  fullName: { type: String, required: true },
  email: { type: String, required: true },
  companyName: { type: String, required: true },
  companySize: { type: String, required: true },
  message: { type: String },
  businessType: { type: String },
  expectedMonthlyVolume: { type: String },
  createdAt: { type: Date, default: Date.now },
});

const DemoRequest = mongoose.model<IDemoRequest>('DemoRequest', DemoRequestSchema);

export default DemoRequest;
