
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
import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import Location from '../models/location.model';
import { AppError } from '../utils/error';
import { successResponse } from '../utils/helpers';

// Create a new location
export const createLocation = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const companyId = req.company._id;
    
    // Check if a location with this name already exists
    const existingLocation = await Location.findOne({
      companyId,
      name: req.body.name
    });
    
    if (existingLocation) {
      return next(new AppError('Location with this name already exists', 409));
    }
    
    // Check if this is the first location and set as default if so
    const locationsCount = await Location.countDocuments({ companyId });
    const isDefault = locationsCount === 0 ? true : req.body.isDefault || false;
    
    // If setting as default, unset other defaults
    if (isDefault) {
      await Location.updateMany(
        { companyId, isDefault: true },
        { isDefault: false }
      );
    }
    
    // Create the location
    const location = await Location.create({
      ...req.body,
      companyId,
      isDefault
    });
    
    res.status(201).json(successResponse('Location created successfully', location));
  } catch (error) {
    next(error);
  }
};

// Get all locations for a company
export const getLocations = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const companyId = req.company._id;
    
    // Build query based on filters
    const queryObj: any = { companyId };
    
    // Filter by type if provided
    if (req.query.type) {
      queryObj.type = req.query.type;
    }
    
    // Filter by active status
    if (req.query.active === 'true') {
      queryObj.isActive = true;
    } else if (req.query.active === 'false') {
      queryObj.isActive = false;
    }
    
    // Get locations
    const locations = await Location.find(queryObj).sort({ isDefault: -1, name: 1 });
    
    res.status(200).json(successResponse('Locations retrieved successfully', locations));
  } catch (error) {
    next(error);
  }
};

// Get a single location
export const getLocation = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const companyId = req.company._id;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return next(new AppError('Invalid location ID', 400));
    }
    
    const location = await Location.findOne({ _id: id, companyId });
    
    if (!location) {
      return next(new AppError('Location not found', 404));
    }
    
    res.status(200).json(successResponse('Location retrieved successfully', location));
  } catch (error) {
    next(error);
  }
};

// Update a location
export const updateLocation = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const companyId = req.company._id;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return next(new AppError('Invalid location ID', 400));
    }
    
    // If name is changing, check for uniqueness
    if (req.body.name) {
      const existingLocation = await Location.findOne({
        companyId,
        name: req.body.name,
        _id: { $ne: id }
      });
      
      if (existingLocation) {
        return next(new AppError('Location with this name already exists', 409));
      }
    }
    
    // If setting as default, unset other defaults
    if (req.body.isDefault) {
      await Location.updateMany(
        { companyId, _id: { $ne: id }, isDefault: true },
        { isDefault: false }
      );
    }
    
    const location = await Location.findOneAndUpdate(
      { _id: id, companyId },
      { ...req.body, updatedAt: new Date() },
      { new: true, runValidators: true }
    );
    
    if (!location) {
      return next(new AppError('Location not found', 404));
    }
    
    res.status(200).json(successResponse('Location updated successfully', location));
  } catch (error) {
    next(error);
  }
};

// Delete a location
export const deleteLocation = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const companyId = req.company._id;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return next(new AppError('Invalid location ID', 400));
    }
    
    // Check if location exists
    const location = await Location.findOne({ _id: id, companyId });
    
    if (!location) {
      return next(new AppError('Location not found', 404));
    }
    
    // Don't allow deletion of default location
    if (location.isDefault) {
      return next(new AppError('Cannot delete default location. Set another location as default first.', 400));
    }
    
    // TODO: Check if location has inventory or orders before deletion
    
    // Delete the location
    await Location.deleteOne({ _id: id, companyId });
    
    res.status(200).json(successResponse('Location deleted successfully', null));
  } catch (error) {
    next(error);
  }
};
