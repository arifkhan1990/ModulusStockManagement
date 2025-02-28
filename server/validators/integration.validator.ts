
import { z } from 'zod';

export const integrationValidators = {
  createIntegration: z.object({
    body: z.object({
      provider: z.string().min(1, 'Provider is required'),
      name: z.string().optional(),
      description: z.string().optional(),
      credentials: z.record(z.string()).optional(),
      settings: z.record(z.any()).optional()
    })
  }),
  
  updateIntegration: z.object({
    body: z.object({
      name: z.string().optional(),
      description: z.string().optional(),
      isActive: z.boolean().optional(),
      credentials: z.record(z.string()).optional(),
      settings: z.record(z.any()).optional()
    })
  }),
  
  syncIntegration: z.object({
    body: z.object({
      dataTypes: z.array(z.string()).min(1, 'At least one data type must be selected for sync')
    })
  })
};
