
import mongoose, { Schema, Document } from 'mongoose';

export interface ISupportTicket extends Document {
  companyId: Schema.Types.ObjectId;
  subject: string;
  description: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high';
  attachments?: string[];
  messages: {
    sender: Schema.Types.ObjectId;
    message: string;
    attachments?: string[];
    createdAt: Date;
    isAdminResponse: boolean;
  }[];
  assignedTo?: Schema.Types.ObjectId;
  createdBy: Schema.Types.ObjectId;
  updatedBy?: Schema.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
  closedAt?: Date;
  category?: string;
  relatedFeature?: string;
}

const SupportTicketSchema = new Schema<ISupportTicket>({
  companyId: { type: Schema.Types.ObjectId, ref: 'Company', required: true },
  subject: { type: String, required: true },
  description: { type: String, required: true },
  status: { 
    type: String, 
    required: true, 
    enum: ['open', 'in_progress', 'resolved', 'closed'],
    default: 'open'
  },
  priority: { 
    type: String, 
    required: true, 
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  attachments: [{ type: String }],
  messages: [{
    sender: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    message: { type: String, required: true },
    attachments: [{ type: String }],
    createdAt: { type: Date, default: Date.now },
    isAdminResponse: { type: Boolean, default: false }
  }],
  assignedTo: { type: Schema.Types.ObjectId, ref: 'User' },
  createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  updatedBy: { type: Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  closedAt: { type: Date },
  category: { type: String },
  relatedFeature: { type: String }
});

// Indexes for faster lookups
SupportTicketSchema.index({ companyId: 1, status: 1 });
SupportTicketSchema.index({ companyId: 1, priority: 1 });
SupportTicketSchema.index({ companyId: 1, createdAt: 1 });
SupportTicketSchema.index({ assignedTo: 1 });

const SupportTicket = mongoose.model<ISupportTicket>('SupportTicket', SupportTicketSchema);

export default SupportTicket;
