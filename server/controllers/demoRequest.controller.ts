
import { Request, Response } from 'express';
import { storage } from '../storage';
import { insertDemoRequestSchema } from '@shared/schema';
import { ZodError } from 'zod';

export const createDemoRequest = async (req: Request, res: Response) => {
  try {
    const demoRequest = insertDemoRequestSchema.parse(req.body);
    const result = await storage.createDemoRequest(demoRequest);
    res.json(result);
  } catch (err) {
    if (err instanceof ZodError) {
      res.status(400).json({ message: "Invalid request data", errors: err.errors });
    } else {
      res.status(500).json({ message: "Internal server error" });
    }
  }
};
