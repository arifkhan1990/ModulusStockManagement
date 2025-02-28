
import { Request, Response, NextFunction } from 'express';
import { StockMovement, Inventory } from '../models';
import { AppError } from '../utils/error';

// Create a new stock movement
export const createStockMovement = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { productId, fromLocationId, toLocationId, quantity, type, reference, reason } = req.body;

    // Validate inputs
    if (!productId || !fromLocationId || !quantity || !type) {
      return next(new AppError('Missing required fields', 400));
    }

    // Check if quantity is valid
    if (quantity <= 0) {
      return next(new AppError('Quantity must be greater than 0', 400));
    }

    // Check inventory at source location
    const sourceInventory = await Inventory.findOne({ productId, locationId: fromLocationId });
    if (!sourceInventory || sourceInventory.quantity < quantity) {
      return next(new AppError('Insufficient inventory at source location', 400));
    }

    // Create stock movement record
    const stockMovement = await StockMovement.create({
      productId,
      fromLocationId,
      toLocationId,
      quantity,
      type,
      reference,
      reason,
      createdBy: req.user?._id,
      createdAt: new Date(),
      status: 'completed'
    });

    // Update inventory at source location
    sourceInventory.quantity -= quantity;
    await sourceInventory.save();

    // Update inventory at destination location if transfer
    if (toLocationId && type === 'transfer') {
      let destinationInventory = await Inventory.findOne({ productId, locationId: toLocationId });
      
      if (destinationInventory) {
        destinationInventory.quantity += quantity;
        await destinationInventory.save();
      } else {
        // Create new inventory entry at destination
        await Inventory.create({
          productId,
          locationId: toLocationId,
          quantity,
          lowStockThreshold: sourceInventory.lowStockThreshold || 5
        });
      }
    }

    res.status(201).json({
      success: true,
      data: stockMovement
    });
  } catch (error) {
    next(error);
  }
};

// Get all stock movements with filtering and pagination
export const getStockMovements = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      productId, 
      locationId, 
      type, 
      startDate, 
      endDate,
      status
    } = req.query;

    // Build query object
    const query: any = {};
    
    if (productId) query.productId = productId;
    if (locationId) {
      query.$or = [
        { fromLocationId: locationId },
        { toLocationId: locationId }
      ];
    }
    if (type) query.type = type;
    if (status) query.status = status;
    
    // Date filtering
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate as string);
      if (endDate) query.createdAt.$lte = new Date(endDate as string);
    }

    // Calculate pagination
    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    // Fetch stock movements with pagination
    const stockMovements = await StockMovement.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum)
      .populate('productId', 'name sku')
      .populate('fromLocationId', 'name')
      .populate('toLocationId', 'name')
      .populate('createdBy', 'name');

    // Get total count for pagination
    const total = await StockMovement.countDocuments(query);

    res.status(200).json({
      success: true,
      data: stockMovements,
      pagination: {
        total,
        page: pageNum,
        pageSize: limitNum,
        totalPages: Math.ceil(total / limitNum)
      }
    });
  } catch (error) {
    next(error);
  }
};

// Get a single stock movement by ID
export const getStockMovementById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    
    const stockMovement = await StockMovement.findById(id)
      .populate('productId', 'name sku')
      .populate('fromLocationId', 'name')
      .populate('toLocationId', 'name')
      .populate('createdBy', 'name');
    
    if (!stockMovement) {
      return next(new AppError('Stock movement not found', 404));
    }
    
    res.status(200).json({
      success: true,
      data: stockMovement
    });
  } catch (error) {
    next(error);
  }
};

// Update stock movement status (e.g., cancel a pending movement)
export const updateStockMovementStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    if (!status || !['pending', 'completed', 'cancelled'].includes(status)) {
      return next(new AppError('Invalid status', 400));
    }
    
    const stockMovement = await StockMovement.findById(id);
    
    if (!stockMovement) {
      return next(new AppError('Stock movement not found', 404));
    }
    
    // Only pending movements can be updated
    if (stockMovement.status !== 'pending') {
      return next(new AppError('Only pending movements can be updated', 400));
    }
    
    stockMovement.status = status;
    await stockMovement.save();
    
    res.status(200).json({
      success: true,
      data: stockMovement
    });
  } catch (error) {
    next(error);
  }
};
