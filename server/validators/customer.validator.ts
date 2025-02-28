
import { z } from 'zod';
import mongoose from 'mongoose';

// Helper function to validate MongoDB ObjectId
const isValidObjectId = (id: string) => mongoose.Types.ObjectId.isValid(id);

// Address schema
const addressSchema = z.object({
  street: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  postalCode: z.string().optional(),
  country: z.string().optional(),
});

// Customer schema validation
export const customerSchema = z.object({
  companyId: z.string().refine(isValidObjectId, {
    message: 'Invalid company ID format'
  }).optional(),
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  email: z.string().email('Invalid email format').optional().nullable(),
  phone: z.string().optional().nullable(),
  company: z.string().optional().nullable(),
  taxId: z.string().optional().nullable(),
  billingAddress: addressSchema.optional().nullable(),
  shippingAddress: addressSchema.optional().nullable(),
  customerType: z.string().optional().nullable(),
  paymentTerms: z.string().optional().nullable(),
  creditLimit: z.number().nonnegative().optional().nullable(),
  discountRate: z.number().min(0).max(100).optional().nullable(),
  tags: z.array(z.string()).optional().nullable(),
  notes: z.string().optional().nullable(),
  salesChannelId: z.string().refine(isValidObjectId, {
    message: 'Invalid sales channel ID format'
  }).optional().nullable(),
  businessSize: z.enum(['small', 'medium', 'large']).default('small'),
  businessType: z.string().optional().nullable(),
  isActive: z.boolean().default(true),
});
