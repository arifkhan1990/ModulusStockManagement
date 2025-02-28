
import { Request, Response } from 'express';
import { storage } from '../storage';
import { insertInventorySchema } from '@shared/schema';
import { ZodError } from 'zod';

export const getInventory = async (req: Request, res: Response) => {
  try {
    const locationId = req.params.locationId;
    const inventory = await storage.getInventoryByLocation(locationId);
    res.json(inventory);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch inventory" });
  }
};

export const createInventory = async (req: Request, res: Response) => {
  try {
    const inventoryData = insertInventorySchema.parse(req.body);
    const result = await storage.createInventory(inventoryData);
    res.json(result);
  } catch (err) {
    if (err instanceof ZodError) {
      res.status(400).json({ message: "Invalid inventory data", errors: err.errors });
    } else {
      res.status(500).json({ message: "Failed to create inventory" });
    }
  }
};
import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import Inventory from '../models/inventory.model';
import Product from '../models/product.model';
import Location from '../models/location.model';
import { AppError } from '../utils/error';
import { successResponse } from '../utils/helpers';

// Update inventory for a product at a location
export const updateInventory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { productId, locationId } = req.params;
    const { quantity, reservedQuantity } = req.body;
    const companyId = req.company._id;
    
    // Validate IDs
    if (!mongoose.Types.ObjectId.isValid(productId) || !mongoose.Types.ObjectId.isValid(locationId)) {
      return next(new AppError('Invalid product or location ID', 400));
    }
    
    // Check if product and location exist
    const product = await Product.findOne({ _id: productId, companyId });
    if (!product) {
      return next(new AppError('Product not found', 404));
    }
    
    const location = await Location.findOne({ _id: locationId, companyId });
    if (!location) {
      return next(new AppError('Location not found', 404));
    }
    
    // Find or create inventory record
    let inventory = await Inventory.findOne({
      companyId,
      productId,
      locationId
    });
    
    if (!inventory) {
      inventory = await Inventory.create({
        companyId,
        productId,
        locationId,
        quantity: quantity || 0,
        reservedQuantity: reservedQuantity || 0,
        availableQuantity: (quantity || 0) - (reservedQuantity || 0)
      });
    } else {
      // Update existing inventory
      const newQuantity = quantity !== undefined ? quantity : inventory.quantity;
      const newReservedQuantity = reservedQuantity !== undefined ? reservedQuantity : inventory.reservedQuantity;
      
      inventory = await Inventory.findByIdAndUpdate(
        inventory._id,
        {
          quantity: newQuantity,
          reservedQuantity: newReservedQuantity,
          availableQuantity: newQuantity - newReservedQuantity,
          updatedAt: new Date()
        },
        { new: true }
      );
    }
    
    // Update total product stock
    const totalInventory = await Inventory.aggregate([
      { $match: { productId: new mongoose.Types.ObjectId(productId), companyId: new mongoose.Types.ObjectId(companyId.toString()) } },
      { $group: { _id: null, total: { $sum: '$quantity' } } }
    ]);
    
    const totalStock = totalInventory.length > 0 ? totalInventory[0].total : 0;
    
    await Product.findByIdAndUpdate(productId, {
      stockQuantity: totalStock,
      updatedAt: new Date()
    });
    
    res.status(200).json(successResponse('Inventory updated successfully', inventory));
  } catch (error) {
    next(error);
  }
};

// Get inventory for all locations of a product
export const getProductInventory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { productId } = req.params;
    const companyId = req.company._id;
    
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return next(new AppError('Invalid product ID', 400));
    }
    
    // Check if product exists
    const product = await Product.findOne({ _id: productId, companyId });
    if (!product) {
      return next(new AppError('Product not found', 404));
    }
    
    // Get inventory for all locations
    const inventory = await Inventory.find({ productId, companyId })
      .populate('locationId', 'name type');
    
    res.status(200).json(successResponse('Inventory retrieved successfully', {
      product,
      inventory
    }));
  } catch (error) {
    next(error);
  }
};

// Get low stock inventory items
export const getLowStockInventory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const companyId = req.company._id;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const skip = (page - 1) * limit;
    
    // Join with products to check low stock threshold
    const lowStockItems = await Product.aggregate([
      { $match: { companyId: new mongoose.Types.ObjectId(companyId.toString()) } },
      {
        $lookup: {
          from: 'inventories',
          let: { productId: '$_id' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ['$productId', '$$productId'] },
                    { $eq: ['$companyId', new mongoose.Types.ObjectId(companyId.toString())] }
                  ]
                }
              }
            }
          ],
          as: 'inventoryItems'
        }
      },
      { $unwind: { path: '$inventoryItems', preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: 'locations',
          localField: 'inventoryItems.locationId',
          foreignField: '_id',
          as: 'location'
        }
      },
      { $unwind: { path: '$location', preserveNullAndEmptyArrays: true } },
      {
        $match: {
          $expr: {
            $lte: ['$inventoryItems.quantity', '$lowStockThreshold']
          }
        }
      },
      {
        $project: {
          productId: '$_id',
          productName: '$name',
          sku: '$sku',
          lowStockThreshold: 1,
          locationId: '$inventoryItems.locationId',
          locationName: '$location.name',
          quantity: '$inventoryItems.quantity',
          availableQuantity: '$inventoryItems.availableQuantity'
        }
      },
      { $sort: { quantity: 1 } },
      { $skip: skip },
      { $limit: limit }
    ]);
    
    // Get total count
    const total = await Product.aggregate([
      { $match: { companyId: new mongoose.Types.ObjectId(companyId.toString()) } },
      {
        $lookup: {
          from: 'inventories',
          let: { productId: '$_id' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ['$productId', '$$productId'] },
                    { $eq: ['$companyId', new mongoose.Types.ObjectId(companyId.toString())] }
                  ]
                }
              }
            }
          ],
          as: 'inventoryItems'
        }
      },
      { $unwind: { path: '$inventoryItems', preserveNullAndEmptyArrays: true } },
      {
        $match: {
          $expr: {
            $lte: ['$inventoryItems.quantity', '$lowStockThreshold']
          }
        }
      },
      { $count: 'total' }
    ]);
    
    const totalCount = total.length > 0 ? total[0].total : 0;
    
    res.status(200).json(successResponse('Low stock items retrieved successfully', {
      items: lowStockItems,
      pagination: {
        total: totalCount,
        page,
        limit,
        pages: Math.ceil(totalCount / limit)
      }
    }));
  } catch (error) {
    next(error);
  }
};

// Adjust inventory (stock movement)
export const adjustInventory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { productId, locationId } = req.params;
    const { adjustment, reason, notes } = req.body;
    const companyId = req.company._id;
    
    // Validate IDs
    if (!mongoose.Types.ObjectId.isValid(productId) || !mongoose.Types.ObjectId.isValid(locationId)) {
      return next(new AppError('Invalid product or location ID', 400));
    }
    
    // Validate adjustment
    if (!adjustment || typeof adjustment !== 'number') {
      return next(new AppError('Valid adjustment value is required', 400));
    }
    
    const session = await mongoose.startSession();
    session.startTransaction();
    
    try {
      // Get current inventory
      const inventory = await Inventory.findOne({
        companyId,
        productId,
        locationId
      }).session(session);
      
      if (!inventory) {
        throw new AppError('Inventory record not found', 404);
      }
      
      // Calculate new quantities
      const newQuantity = inventory.quantity + adjustment;
      if (newQuantity < 0) {
        throw new AppError('Adjustment would result in negative inventory', 400);
      }
      
      // Update inventory
      const updatedInventory = await Inventory.findByIdAndUpdate(
        inventory._id,
        {
          quantity: newQuantity,
          availableQuantity: newQuantity - inventory.reservedQuantity,
          updatedAt: new Date()
        },
        { new: true, session }
      );
      
      // Update product's total stock
      const totalInventory = await Inventory.aggregate([
        { $match: { productId: new mongoose.Types.ObjectId(productId), companyId: new mongoose.Types.ObjectId(companyId.toString()) } },
        { $group: { _id: null, total: { $sum: '$quantity' } } }
      ]);
      
      const totalStock = totalInventory.length > 0 ? totalInventory[0].total : 0;
      
      await Product.findByIdAndUpdate(
        productId,
        {
          stockQuantity: totalStock,
          updatedAt: new Date()
        },
        { session }
      );
      
      // TODO: Create stock movement record (if implementing stock movement history)
      
      await session.commitTransaction();
      session.endSession();
      
      res.status(200).json(successResponse('Inventory adjusted successfully', updatedInventory));
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      throw error;
    }
  } catch (error) {
    next(error);
  }
};

// Transfer inventory between locations
export const transferInventory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { productId } = req.params;
    const { sourceLocationId, targetLocationId, quantity, notes } = req.body;
    const companyId = req.company._id;
    
    // Validate data
    if (!mongoose.Types.ObjectId.isValid(productId) || 
        !mongoose.Types.ObjectId.isValid(sourceLocationId) || 
        !mongoose.Types.ObjectId.isValid(targetLocationId)) {
      return next(new AppError('Invalid product or location ID', 400));
    }
    
    if (!quantity || quantity <= 0) {
      return next(new AppError('Valid quantity is required', 400));
    }
    
    if (sourceLocationId === targetLocationId) {
      return next(new AppError('Source and target locations must be different', 400));
    }
    
    const session = await mongoose.startSession();
    session.startTransaction();
    
    try {
      // Get source inventory
      const sourceInventory = await Inventory.findOne({
        companyId,
        productId,
        locationId: sourceLocationId
      }).session(session);
      
      if (!sourceInventory) {
        throw new AppError('Source inventory record not found', 404);
      }
      
      if (sourceInventory.quantity < quantity) {
        throw new AppError('Insufficient inventory at source location', 400);
      }
      
      // Get or create target inventory
      let targetInventory = await Inventory.findOne({
        companyId,
        productId,
        locationId: targetLocationId
      }).session(session);
      
      if (!targetInventory) {
        targetInventory = await Inventory.create([{
          companyId,
          productId,
          locationId: targetLocationId,
          quantity: 0,
          reservedQuantity: 0,
          availableQuantity: 0
        }], { session });
        targetInventory = targetInventory[0];
      }
      
      // Update source inventory
      const updatedSourceInventory = await Inventory.findByIdAndUpdate(
        sourceInventory._id,
        {
          quantity: sourceInventory.quantity - quantity,
          availableQuantity: sourceInventory.availableQuantity - quantity,
          updatedAt: new Date()
        },
        { new: true, session }
      );
      
      // Update target inventory
      const updatedTargetInventory = await Inventory.findByIdAndUpdate(
        targetInventory._id,
        {
          quantity: targetInventory.quantity + quantity,
          availableQuantity: targetInventory.availableQuantity + quantity,
          updatedAt: new Date()
        },
        { new: true, session }
      );
      
      // TODO: Create inventory transfer record (if implementing transfer history)
      
      await session.commitTransaction();
      session.endSession();
      
      res.status(200).json(successResponse('Inventory transferred successfully', {
        source: updatedSourceInventory,
        target: updatedTargetInventory
      }));
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      throw error;
    }
  } catch (error) {
    next(error);
  }
};
