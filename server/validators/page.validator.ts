
import { z } from 'zod';

export const pageValidators = {
  createPage: z.object({
    body: z.object({
      type: z.enum(['about', 'terms', 'privacy', 'custom']),
      title: z.string().min(1, 'Title is required'),
      content: z.string().min(1, 'Content is required'),
      slug: z.string().min(1, 'Slug is required').regex(/^[a-z0-9-]+$/, 'Slug must contain only lowercase letters, numbers, and hyphens'),
      isPublished: z.boolean().optional(),
      customFields: z.record(z.any()).optional(),
      metaDescription: z.string().optional(),
      metaKeywords: z.array(z.string()).optional(),
      isDefault: z.boolean().optional()
    })
  }),
  
  updatePage: z.object({
    body: z.object({
      type: z.enum(['about', 'terms', 'privacy', 'custom']).optional(),
      title: z.string().min(1, 'Title is required').optional(),
      content: z.string().min(1, 'Content is required').optional(),
      slug: z.string().min(1, 'Slug is required').regex(/^[a-z0-9-]+$/, 'Slug must contain only lowercase letters, numbers, and hyphens').optional(),
      isPublished: z.boolean().optional(),
      customFields: z.record(z.any()).optional(),
      metaDescription: z.string().optional(),
      metaKeywords: z.array(z.string()).optional(),
      isDefault: z.boolean().optional()
    })
  })
};
