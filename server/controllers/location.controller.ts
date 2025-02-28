
import { Request, Response } from 'express';
import { storage } from '../storage';
import { insertLocationSchema } from '@shared/schema';
import { ZodError } from 'zod';

export const getLocations = async (req: Request, res: Response) => {
  try {
    const locations = await storage.getLocations();
    res.json(locations);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch locations" });
  }
};

export const getLocation = async (req: Request, res: Response) => {
  try {
    const location = await storage.getLocation(req.params.id);
    if (!location) {
      return res.status(404).json({ message: "Location not found" });
    }
    res.json(location);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch location" });
  }
};

export const createLocation = async (req: Request, res: Response) => {
  try {
    const location = insertLocationSchema.parse(req.body);
    const result = await storage.createLocation(location);
    res.json(result);
  } catch (err) {
    if (err instanceof ZodError) {
      res.status(400).json({ message: "Invalid location data", errors: err.errors });
    } else {
      res.status(500).json({ message: "Failed to create location" });
    }
  }
};

export const updateLocation = async (req: Request, res: Response) => {
  try {
    const locationData = insertLocationSchema.partial().parse(req.body);
    const result = await storage.updateLocation(req.params.id, locationData);
    if (!result) {
      return res.status(404).json({ message: "Location not found" });
    }
    res.json(result);
  } catch (err) {
    if (err instanceof ZodError) {
      res.status(400).json({ message: "Invalid location data", errors: err.errors });
    } else {
      res.status(500).json({ message: "Failed to update location" });
    }
  }
};

export const deleteLocation = async (req: Request, res: Response) => {
  try {
    const result = await storage.deleteLocation(req.params.id);
    if (!result) {
      return res.status(404).json({ message: "Location not found" });
    }
    res.json({ message: "Location deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete location" });
  }
};
