import mongoose, { Schema, Document } from 'mongoose';

export interface ICategory extends Document {
  name: string;
  description?: string;
  parentId?: Schema.Types.ObjectId;
  level: number;
  path?: string;
  imageUrl?: string;
  isActive: boolean;
  businessSize: string; // small, medium, large
  businessType?: string; // retail, manufacturing, distribution, etc.
  attributes?: {
    name: string;
    type: string; // text, number, boolean, date
    required: boolean;
    options?: string[];
  }[];
  createdAt: Date;
  updatedAt: Date;
}

const CategorySchema = new Schema<ICategory>({
  name: { type: String, required: true },
  description: { type: String },
  parentId: { type: Schema.Types.ObjectId, ref: 'Category' },
  level: { type: Number, default: 0 },
  path: { type: String },
  imageUrl: { type: String },
  isActive: { type: Boolean, default: true },
  businessSize: { type: String, enum: ['small', 'medium', 'large'], default: 'small' },
  businessType: { type: String },
  attributes: [{
    name: { type: String },
    type: { type: String, enum: ['text', 'number', 'boolean', 'date'] },
    required: { type: Boolean, default: false },
    options: [{ type: String }]
  }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Update path on save
CategorySchema.pre('save', async function(next) {
  if (this.isModified('parentId') || this.isModified('name') || this.isNew) {
    if (!this.parentId) {
      this.path = this.name;
      this.level = 0;
    } else {
      const parent = await mongoose.model('Category').findById(this.parentId);
      if (parent) {
        this.path = `${parent.path} > ${this.name}`;
        this.level = parent.level + 1;
      }
    }
  }
  next();
});

// Indexes for faster lookups
// Note: slug field index is already defined in the schema
CategorySchema.index({ name: 1 });
CategorySchema.index({ parentId: 1 });
CategorySchema.index({ isActive: 1 });
CategorySchema.index({ companyId: 1 }); // For tenant isolation
CategorySchema.index({ companyId: 1, name: 1 }); // For searching by name within company

const Category = mongoose.model<ICategory>('Category', CategorySchema);

export default Category;