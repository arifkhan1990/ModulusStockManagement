
import { z } from 'zod';

export const backupValidators = {
  createBackup: z.object({
    body: z.object({
      name: z.string().optional(),
      description: z.string().optional(),
      dataTypes: z.array(z.string()).min(1, 'At least one data type must be selected')
    })
  }),
  
  restoreBackup: z.object({
    body: z.object({
      dataTypes: z.array(z.string()).min(1, 'At least one data type must be selected for restore')
    })
  })
};
