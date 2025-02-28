
import { z } from 'zod';

export const notificationValidators = {
  updatePreferences: z.object({
    body: z.object({
      preferences: z.record(z.boolean())
    })
  })
};
