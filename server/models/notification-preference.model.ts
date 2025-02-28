
import mongoose, { Schema, Document } from 'mongoose';

export interface INotificationPreference extends Document {
  companyId: Schema.Types.ObjectId;
  userId: Schema.Types.ObjectId;
  recipientType: string; // 'subscriber', 'customer', 'employee'
  eventType: string; // 'product_added', 'order_placed', 'payment_due', etc.
  channels: {
    email: boolean;
    push: boolean;
    sms: boolean;
    messenger: boolean;
    discord: boolean;
    whatsapp: boolean;
    telegram: boolean;
  };
  templates: {
    email: {
      subject: string;
      body: string;
    };
    push: {
      title: string;
      body: string;
    };
    sms: {
      body: string;
    };
    messenger: {
      body: string;
    };
    discord: {
      body: string;
    };
    whatsapp: {
      body: string;
    };
    telegram: {
      body: string;
    };
  };
  enabled: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const NotificationPreferenceSchema = new Schema<INotificationPreference>({
  companyId: { type: Schema.Types.ObjectId, ref: 'Company', required: true },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  recipientType: { 
    type: String, 
    required: true, 
    enum: ['subscriber', 'customer', 'employee'] 
  },
  eventType: { 
    type: String, 
    required: true,
    enum: [
      'product_added', 
      'order_placed', 
      'order_shipped',
      'order_delivered',
      'payment_received',
      'payment_due',
      'payment_overdue',
      'invoice_created',
      'invoice_shared',
      'report_generated',
      'report_shared',
      'low_stock',
      'support_ticket_created',
      'support_ticket_resolved',
      'custom'
    ]
  },
  channels: {
    email: { type: Boolean, default: true },
    push: { type: Boolean, default: false },
    sms: { type: Boolean, default: false },
    messenger: { type: Boolean, default: false },
    discord: { type: Boolean, default: false },
    whatsapp: { type: Boolean, default: false },
    telegram: { type: Boolean, default: false }
  },
  templates: {
    email: {
      subject: { type: String, default: '{{company}}: Notification about {{eventType}}' },
      body: { type: String, default: 'Hello {{recipient}},\n\nThis is a notification from {{company}} about {{eventType}}.\n\nDetails: {{details}}\n\nThank you,\n{{company}} Team' }
    },
    push: {
      title: { type: String, default: '{{company}}: {{eventType}}' },
      body: { type: String, default: '{{details}}' }
    },
    sms: {
      body: { type: String, default: '{{company}}: {{eventType}} - {{details}}' }
    },
    messenger: {
      body: { type: String, default: 'Hello from {{company}}!\n\n{{eventType}} - {{details}}' }
    },
    discord: {
      body: { type: String, default: '**{{company}}**: {{eventType}}\n\n{{details}}' }
    },
    whatsapp: {
      body: { type: String, default: '*{{company}}*: {{eventType}}\n\n{{details}}' }
    },
    telegram: {
      body: { type: String, default: '*{{company}}*: {{eventType}}\n\n{{details}}' }
    }
  },
  enabled: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Indexes for faster lookups
NotificationPreferenceSchema.index({ companyId: 1, userId: 1 });
NotificationPreferenceSchema.index({ companyId: 1, eventType: 1 });
NotificationPreferenceSchema.index({ companyId: 1, recipientType: 1 });

const NotificationPreference = mongoose.model<INotificationPreference>('NotificationPreference', NotificationPreferenceSchema);

export default NotificationPreference;
