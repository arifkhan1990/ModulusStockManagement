
import { z } from 'zod';

export const ticketValidators = {
  createTicket: z.object({
    body: z.object({
      subject: z.string().min(1, 'Subject is required'),
      description: z.string().min(1, 'Description is required'),
      priority: z.enum(['low', 'medium', 'high']).optional(),
      attachments: z.array(z.string()).optional(),
      category: z.string().optional(),
      relatedFeature: z.string().optional()
    })
  }),
  
  addMessage: z.object({
    body: z.object({
      message: z.string().min(1, 'Message is required'),
      attachments: z.array(z.string()).optional()
    })
  }),
  
  updateStatus: z.object({
    body: z.object({
      status: z.enum(['open', 'in_progress', 'resolved', 'closed'])
    })
  })
};
